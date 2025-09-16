// path: src/services/productService.ts
/**
 * Сервис для работы с продуктами.
 * Обеспечивает загрузку, кеширование и поиск продуктов.
 * Использует многоуровневое кеширование и обработку ошибок.
 * 
 * Основные улучшения по сравнению с предыдущей версией:
 * 1. Детальное логирование операций
 * 2. Улучшенная обработка ошибок с кодами
 * 3. Кэширование с TTL
 * 4. Валидация входных данных
 */

import { ProductInfo } from "@/types/product";

// Конфигурация
// Базовые настройки API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Настройки кеширования
const ENABLE_CACHE = true;
const PRODUCT_CACHE_PREFIX = 'wb_product_';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 часов
const MAX_CACHE_ITEMS = 200;

// Настройки запросов
const REQUEST_TIMEOUT = 15000; // 15 секунд таймаут запроса
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_RETRIES) || 3; // Максимальное количество попыток повтора запроса
const RETRY_DELAY = Number(import.meta.env.VITE_RETRY_DELAY) || 1000; // Задержка между попытками в мс

// Классы ошибок
class ProductError extends Error {
  constructor(
    message: string, 
    public code: string, 
    public details?: any
  ) {
    super(message);
    this.name = 'ProductError';
  }
}

class NetworkError extends ProductError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

class ValidationError extends ProductError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

// Утилита для логирования с поддержкой различных уровней
const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  warn: (message: string, error?: Error) => {
    console.warn(`[WARN] ${message}`, error || '');
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error || '');
  }
};

// Утилита для задержки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface CachedProduct {
  data: ProductInfo;
  timestamp: number;
  metadata: {
    source: 'api' | 'cache';
    cachedAt: string;
    ttl: number;
  };
}

interface ProductServiceResponse {
  data: ProductInfo | null;
  source: 'cache' | 'api' | null;
  cachedAt?: string;
  error?: string;
  code?: string;
  details?: any;
}

interface FetchOptions extends RequestInit {
  retries?: number;
  timeout?: number;
}

/**
 * Очищает устаревшие и избыточные записи кеша
 * @returns Объект с информацией о выполненной очистке
 */
const cleanupCache = (): { removed: number; total: number; } => {
  const stats = { removed: 0, total: 0 };
  
  try {
    const now = Date.now();
    const cacheKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(PRODUCT_CACHE_PREFIX));
    
    stats.total = cacheKeys.length;
    
    // Очищаем устаревшие записи
    cacheKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const { timestamp }: { timestamp: number } = JSON.parse(item);
          if (now - timestamp > CACHE_TTL) {
            localStorage.removeItem(key);
            stats.removed++;
          }
        }
      } catch (e) {
        // Если не удалось распарсить запись, удаляем её
        localStorage.removeItem(key);
        stats.removed++;
      }
    });

    // Получаем актуальные ключи после удаления устаревших
    const remainingKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(PRODUCT_CACHE_PREFIX));
    
    // Если кеш все еще слишком большой, удаляем самые старые записи
    if (remainingKeys.length > MAX_CACHE_ITEMS) {
      const itemsToRemove = remainingKeys.length - MAX_CACHE_ITEMS;
      logger.info(`Кеш превысил лимит в ${MAX_CACHE_ITEMS} записей, удаляем ${itemsToRemove} старых записей`);
      
      const items = remainingKeys
        .map(key => {
          try {
            const item = localStorage.getItem(key);
            return item ? { key, ...JSON.parse(item) } : null;
          } catch (e) {
            return { key, timestamp: 0 };
          }
        })
        .filter((item): item is { key: string; timestamp: number } => item !== null)
        .sort((a, b) => a.timestamp - b.timestamp);
      
      // Удаляем самые старые записи
      items.slice(0, itemsToRemove).forEach(({ key }) => {
        localStorage.removeItem(key);
        stats.removed++;
      });
    }
    
    logger.info(`Очистка кеша завершена. Удалено записей: ${stats.removed}, осталось: ${stats.total - stats.removed}`);
    
  } catch (error) {
    logger.error('Критическая ошибка при очистке кеша', error as Error);
  }
  
  return stats;
};

/**
 * Получает продукт из кеша браузера с проверкой срока действия
 */
const getFromCache = (productId: string): ProductInfo | null => {
  if (!ENABLE_CACHE) {
    logger.debug('Кеширование отключено, пропускаем проверку кеша');
    return null;
  }

  logger.debug('Проверка кеша для товара', { productId });
  
  try {
    const cacheKey = `${PRODUCT_CACHE_PREFIX}${productId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      logger.debug('Товар не найден в кеше', { productId });
      return null;
    }

    const { data, timestamp, metadata }: CachedProduct = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const isExpired = age > CACHE_TTL;
    
    if (isExpired) {
      logger.debug('Найден устаревший кеш', { 
        productId, 
        age: `${Math.round(age / 1000 / 60)} минут`, 
        ttl: `${CACHE_TTL / 1000 / 60} минут` 
      });
      
      // Удаляем устаревший кеш
      localStorage.removeItem(cacheKey);
      return null;
    }

    logger.debug('Товар загружен из кеша', { 
      productId, 
      age: `${Math.round(age / 1000 / 60)} минут`,
      source: metadata?.source || 'unknown'
    });
    
    return data;
  } catch (error) {
    logger.error('Ошибка при чтении из кеша', error as Error);
    return null;
  }
};

/**
 * Сохраняет продукт в кеш браузера с метаданными
 */
const saveToCache = (productId: string, data: ProductInfo, source: 'api' | 'cache' = 'api'): void => {
  if (!ENABLE_CACHE) {
    logger.debug('Кеширование отключено, пропускаем сохранение в кеш', { productId });
    return;
  }

  logger.debug('Сохранение в кеш', { productId, source });
  
  try {
    const now = Date.now();
    const cacheData: CachedProduct = {
      data,
      timestamp: now,
      metadata: {
        source,
        cachedAt: new Date(now).toISOString(),
        ttl: CACHE_TTL
      }
    };
    
    const cacheKey = `${PRODUCT_CACHE_PREFIX}${productId}`;
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      logger.debug('Товар успешно сохранен в кеш', { 
        productId, 
        ttl: `${CACHE_TTL / 1000 / 60} минут` 
      });
    } catch (error) {
      // Если localStorage переполнен, пробуем очистить устаревшие записи
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        logger.warn('Переполнение localStorage, запуск очистки кеша');
        cleanupCache();
        
        // Повторная попытка после очистки
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          logger.debug('Товар сохранен после очистки кеша', { productId });
        } catch (retryError) {
          logger.error('Не удалось сохранить в кеш после очистки', error as Error);
        }
      } else {
        throw error;
      }
    }
    
    // Периодически чистим кеш (10% вероятность при каждом сохранении)
    if (Math.random() < 0.1) {
      logger.debug('Плановый запуск очистки кеша');
      cleanupCache();
    }
  } catch (error) {
    logger.error('Ошибка при сохранении в кеш', error as Error);
  }
};

/**
 * Выполняет запрос с таймаутом и повторными попытками
 */
const fetchWithRetry = async (
    url: string,
    options: FetchOptions = {},
    retries = MAX_RETRIES,
    timeout = REQUEST_TIMEOUT
): Promise<Response> => {
  const startTime = Date.now();
  let lastError: Error | null = null;

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  logger.info(`Начало запроса к ${normalizedUrl}`, {
    maxRetries: retries,
    timeout,
    options
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      logger.info(`Попытка запроса ${attempt}/${retries}`, {
        url: normalizedUrl,
        attempt,
        totalRetries: retries
      });

      const response = await fetch(normalizedUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      clearTimeout(timeoutId);

      // ✅ Успешный ответ
      if (response.ok) {
        const responseTime = Date.now() - startTime;
        logger.info(`Запрос выполнен успешно`, {
          url: normalizedUrl,
          status: response.status,
          time: `${responseTime}мс`,
          attempt
        });
        return response;
      }

      // ❗ Обработка тела ошибки
      let errorData: any;
      try {
        const cloned = await response.clone().json();
        errorData = {
          ...cloned,
          status: response.status,
          url: normalizedUrl
        };
      } catch {
        const text = await response.text().catch(() => '');
        errorData = {
          raw: text,
          status: response.status,
          url: normalizedUrl
        };
      }

      // ❗ Создание ошибки
      const error = new NetworkError(
          response.status >= 500
              ? `Сервер временно недоступен (${response.status} ${response.statusText})`
              : `Ошибка клиента: ${response.status} ${response.statusText}`,
          {
            status: response.status,
            url: normalizedUrl,
            isClientError: response.status < 500,
            attempt,
            error: errorData
          }
      );

      // 👇 Специально вытащим `error`, если он строка
      if (typeof errorData?.error === 'string') {
        error.details.error = errorData.error;
      }

      logger.error(
          response.status >= 500 ? 'Ошибка сервера' : 'Ошибка клиента',
          error
      );

      throw error;

    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;

      if (error instanceof Error) {
        const isNetworkError = error.name === 'TypeError' && error.message.includes('fetch');
        const isTimeout = error.name === 'AbortError';

        if (isNetworkError) {
          logger.error('Ошибка сети при выполнении запроса', {
            url: normalizedUrl,
            error: error.message,
            attempt,
            maxRetries: retries
          });
        } else if (isTimeout) {
          logger.error(`Таймаут запроса (${timeout}мс)`, {
            url: normalizedUrl,
            attempt,
            maxRetries: retries
          });
        } else {
          logger.error('Ошибка при выполнении запроса', error);
        }
      }

      const isClientError = error instanceof NetworkError && error.details?.isClientError;

      if (isClientError || attempt >= retries) {
        break;
      }

      const delayMs = RETRY_DELAY * Math.pow(2, attempt - 1);
      logger.warn(`Повторная попытка ${attempt + 1}/${retries} через ${delayMs}мс`, {
        url: normalizedUrl,
        attempt,
        error: (error as Error).message
      });

      await delay(delayMs);
    }
  }

  throw lastError || new NetworkError('Неизвестная ошибка при выполнении запроса');
};


/**
 * Получает информацию о продукте с кэшированием и повторными попытками
 */
/**
 * Задержка выполнения на указанное время
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProduct = async (productId: string, retryCount = 0): Promise<ProductServiceResponse> => {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  // Проверяем, не превышено ли максимальное количество попыток
  if (retryCount > 0) {
    const delayMs = RETRY_DELAY * Math.pow(2, retryCount - 1);
    logger.info(`[${requestId}] Повторная попытка ${retryCount}/${MAX_RETRIES} для товара ${productId} через ${delayMs}мс`);
    await wait(delayMs);
  } else {
    logger.info(`[${requestId}] Начало получения данных о товаре`, { 
      productId,
      apiBaseUrl: API_BASE_URL
    });
  }
  
  // Валидация ID
  if (!productId || !/^\d+$/.test(productId)) {
    const error = new ValidationError('Неверный формат ID товара', { 
      productId,
      validFormat: 'Только цифры',
      example: '12345678'
    });
    
    logger.warn(`[${requestId}] Ошибка валидации`, error);
    return { 
      data: null, 
      source: null, 
      error: 'Неверный формат ID товара. Используйте только цифры.',
      code: error.code,
      details: error.details
    };
  }

  // 1. Пытаемся получить из кеша
  logger.debug(`[${requestId}] Проверка кеша...`);
  const cachedData = getFromCache(productId);
  
  if (cachedData) {
    const cacheTime = Date.now() - startTime;
    logger.info(`[${requestId}] Данные успешно загружены из кеша`, { 
      productId, 
      time: `${cacheTime}мс`,
      cacheAge: `${Math.round((Date.now() - new Date(cachedData.timestamp).getTime()) / 1000)}сек`
    });
    
    return { 
      data: cachedData, 
      source: 'cache',
      cachedAt: new Date().toISOString()
    };
  }
  
  logger.debug(`[${requestId}] Данные не найдены в кеше, запрос к серверу...`);

  // 2. Загружаем с сервера с повторными попытками
  try {
    const apiUrl = `${API_BASE_URL}/product/${productId}`;
    logger.info(`[${requestId}] Отправка запроса к API`, { 
      url: apiUrl,
      attempt: retryCount + 1,
      maxRetries: MAX_RETRIES
    });
    
    const response = await fetchWithRetry(
      apiUrl,
      { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId
        },
      },
      MAX_RETRIES - retryCount // Оставшееся количество попыток
    );

    // Если запрос не удался, выбросится исключение
    const result = await response.json();
    
    if (!result?.product) {
      throw new NetworkError('Неверный формат ответа сервера', {
        status: response.status,
        response: result,
        url: apiUrl
      });
    }

      // 3. Сохраняем в кеш асинхронно, не дожидаясь завершения
      Promise.resolve().then(() => {
        try {
          saveToCache(productId, result.product, 'api');
        } catch (cacheError) {
          logger.error(`[${requestId}] Ошибка при сохранении в кеш`, cacheError as Error);
        }
      });
      
      const totalTime = Date.now() - startTime;
      logger.info(`[${requestId}] Данные успешно загружены с сервера`, { 
        productId, 
        time: `${totalTime}ms`,
        status: response.status
      });
      
      return { 
        data: result.product, 
        source: 'api',
        cachedAt: new Date().toISOString()
      };
      
    } catch (error) {
      // Если это сетевая ошибка и у нас есть попытки, пробуем снова
        // Обработка ошибок сети и сервера
      if (error instanceof NetworkError) {
        // Для ошибки 503 (Service Unavailable) с сообщением о выключенном парсере
        if (error.details?.status === 503 && error.details?.error === 'Parser disabled') {
          logger.warn(`[${requestId}] Парсер товаров отключен на сервере`, {
            productId,
            status: error.details.status
          });
          
          return { 
            data: null, 
            source: null, 
            error: 'Функция парсинга товаров временно отключена. Пожалуйста, попробуйте позже.',
            code: 'PARSER_DISABLED',
            details: error.details,
            isRetryable: false
          };
        }
        
        // Для других ошибок 503 (Service Unavailable) пробуем повторить запрос
        if (error.details?.status === 503 && retryCount < MAX_RETRIES) {
          const nextRetry = retryCount + 1;
          const delayMs = RETRY_DELAY * Math.pow(2, nextRetry - 1);
          
          logger.warn(`[${requestId}] Сервер временно недоступен (503). Попытка ${nextRetry}/${MAX_RETRIES} через ${delayMs}мс`, {
            productId,
            attempt: nextRetry,
            maxRetries: MAX_RETRIES
          });
          
          return getProduct(productId, nextRetry);
        }
        
        // Для других сетевых ошибок
        logger.error(`[${requestId}] Сетевая ошибка при получении товара`, {
          productId,
          status: error.details?.status,
          message: error.message,
          attempt: retryCount + 1,
          maxRetries: MAX_RETRIES
        });
        
        return { 
          data: null, 
          source: null, 
          error: error.details?.status === 503 
            ? 'Сервер временно перегружен. Пожалуйста, попробуйте позже.'
            : 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к интернету и попробуйте снова.',
          code: error.code,
          details: error.details,
          isRetryable: error.details?.status !== 404 && error.details?.status !== 400
        };
      }
      
      // Обработка других типов ошибок
      const errorTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      logger.error(`[${requestId}] Критическая ошибка при получении товара`, {
        productId,
        error: errorMessage,
        time: `${errorTime}мс`,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return { 
        data: null, 
        source: null, 
        error: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.',
        ...(error instanceof ProductError ? {
          code: error.code,
          details: error.details
        } : {})
      };
    }
  }

/**
 * Инициирует сбор данных о продукте с расширенной аналитикой
 * @param productId - ID товара для анализа
 * @param onProgress - Колбек для отслеживания прогресса (шаг, сообщение, процент)
 * @returns Объект с результатом операции и аналитикой
 */
export type ProgressCallback = (step: string, message: string, percent: number) => void;

export const analyzeProduct = async (
  productId: string, 
  onProgress?: ProgressCallback
): Promise<{
  success: boolean;
  data?: {
    product: ProductInfo;
    analysis: {
      isProfitable: boolean;
      profitMargin?: number;
      roi?: number;
      priceHistory?: Array<{ date: string; price: number }>;
    };
  };
  error?: string;
  code?: string;
  details?: any;
}> => {
  const startTime = Date.now();
  const requestId = `analyze_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  try {
    logger.info(`[${requestId}] Начало анализа товара`, { productId });
    
    // 1. Обновляем прогресс - начало загрузки данных
    onProgress?.('loading', 'Загрузка данных о товаре...', 10);
    
    // 2. Получаем данные о товаре с кэшированием
    const { data: product, source, error, code, details } = await getProduct(productId);
    
    if (error || !product) {
      onProgress?.('error', 'Ошибка загрузки данных', 0);
      throw new ProductError(
        error || 'Не удалось получить данные о товаре',
        code || 'PRODUCT_FETCH_ERROR',
        details
      );
    }
    
    logger.debug(`[${requestId}] Данные о товаре получены`, { 
      source,
      productId,
      name: product.name,
      price: product.price
    });
    
    // 3. Обновляем прогресс - данные загружены, начинаем анализ
    onProgress?.('analyzing', 'Анализ данных товара...', 30);
    
    // 4. Выполняем анализ товара
    const analysis = await analyzeProductData(product, requestId, onProgress);
    
    // 5. Обновляем прогресс - анализ завершен
    onProgress?.('completed', 'Анализ завершен', 100);
    
    const totalTime = Date.now() - startTime;
    logger.info(`[${requestId}] Анализ товара завершен успешно`, { 
      productId,
      time: `${totalTime}ms`,
      isProfitable: analysis.isProfitable
    });
    
    return { 
      success: true, 
      data: { product, analysis } 
    };
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    const errorDetails = error instanceof ProductError 
      ? { code: error.code, details: error.details }
      : { error: (error as Error).message };
    
    logger.error(`[${requestId}] Ошибка при анализе товара`, {
      ...errorDetails,
      productId,
      time: `${errorTime}ms`
    });
    
    return { 
      success: false, 
      error: (error as Error).message,
      ...(error instanceof ProductError ? {
        code: error.code,
        details: error.details
      } : {})
    };
  }
};

/**
 * Анализирует данные товара и возвращает результаты анализа
 */
async function analyzeProductData(
  product: ProductInfo,
  requestId: string,
  onProgress?: ProgressCallback
): Promise<{
  isProfitable: boolean;
  profitMargin?: number;
  roi?: number;
  priceHistory?: Array<{ date: string; price: number }>;
}> {
  try {
    onProgress?.('analyzing', 'Анализ ценовой политики...', 40);
    
    // Анализ ценовой политики
    const price = product.price || 0;
    const costPrice = price * 0.6; // Примерная себестоимость (60% от цены)
    const profit = price - costPrice;
    const profitMargin = (profit / price) * 100;
    
    // Искусственная задержка для демонстрации прогресса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress?.('analyzing', 'Анализ конкурентов...', 60);
    
    // Здесь мог бы быть анализ конкурентов
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress?.('analyzing', 'Получение истории цен...', 80);
    
    // Получение истории цен
    const priceHistory = await fetchPriceHistory(product.id, requestId);
    
    onProgress?.('analyzing', 'Финальные расчеты...', 90);
    
    // Финальные расчеты
    const isProfitable = profitMargin > 10; // Считаем рентабельным, если маржа > 10%
    
    // Искусственная задержка для демонстрации прогресса
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      isProfitable,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      roi: costPrice > 0 ? (profit / costPrice) * 100 : undefined,
      priceHistory
    };
    
  } catch (error) {
    logger.error(`[${requestId}] Ошибка при анализе данных товара`, error as Error);
    onProgress?.('error', 'Ошибка при анализе данных', 0);
    return { isProfitable: false };
  }
}

/**
 * Получает историю цен для товара
 */
async function fetchPriceHistory(
  productId: string, 
  requestId: string
): Promise<Array<{ date: string; price: number }>> {
  try {
    // В реальном приложении здесь был бы запрос к API
    // Для примера возвращаем моковые данные
    return [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), price: 9500 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), price: 10000 },
      { date: new Date().toISOString(), price: 10500 },
    ];
  } catch (error) {
    logger.warn(`[${requestId}] Не удалось получить историю цен`, { productId, error });
    return [];
  }
}

// Инициализация при загрузке модуля
if (typeof window !== 'undefined') {
  cleanupCache();
}
