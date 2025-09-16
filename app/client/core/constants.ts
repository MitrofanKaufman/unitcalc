/**
 * Основные константы приложения
 */

/**
 * Базовые URL для API Wildberries
 */
export const WB_API = {
  // Основной API URL
  BASE_URL: 'https://wbx-content-v2.wb.ru',
  
  // URL для поиска товаров
  SEARCH_URL: 'https://search.wb.ru',
  
  // URL для получения информации о карточке товара
  CARD_URL: 'https://card.wb.ru',
  
  // URL для получения информации о продавце
  SELLER_URL: 'https://seller.wildberries.ru',
  
  // URL для получения информации о ценах
  PRICE_URL: 'https://prices.recommendation.wildberries.ru',
  
  // URL для получения информации о скидках
  DISCOUNT_URL: 'https://discounts-prices-api.wildberries.ru',
};

/**
 * URL для получения информации о продавце по ID
 * @param sellerId - ID продавца
 * @returns URL для получения информации о продавце
 */
export function getSellerUrl(sellerId: string | number): string {
  return `${WB_API.SELLER_URL}/sellers/supplier/${sellerId}`;
}

/**
 * URL для получения информации о товаре по артикулу
 * @param nmId - Артикул товара
 * @returns URL для получения информации о товаре
 */
export function getProductUrl(nmId: string | number): string {
  return `${WB_API.CARD_URL}/cards/detail?nm=${nmId}`;
}

/**
 * URL для поиска товаров по запросу
 * @param query - Поисковый запрос
 * @returns URL для поиска товаров
 */
export function getSearchUrl(query: string): string {
  const encodedQuery = encodeURIComponent(query);
  return `${WB_API.SEARCH_URL}/suggests/suggest-query?query=${encodedQuery}&lang=ru&locale=ru`;
}

/**
 * Заголовки по умолчанию для запросов к API
 */
export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
};

/**
 * Временные интервалы и таймауты
 */
export const TIMEOUTS = {
  // Таймаут запроса по умолчанию (мс)
  REQUEST: 30000,
  
  // Задержка между запросами (мс)
  DELAY: 1000,
  
  // Максимальное количество повторных попыток
  MAX_RETRIES: 3,
};

/**
 * Коды ошибок
 */
export const ERROR_CODES = {
  // Ошибка сети
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // Таймаут запроса
  TIMEOUT: 'TIMEOUT',
  
  // Неверный формат ответа
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  
  // Ошибка API
  API_ERROR: 'API_ERROR',
  
  // Неизвестная ошибка
  UNKNOWN: 'UNKNOWN',
};

/**
 * Настройки кэширования
 */
export const CACHE = {
  // Время жизни кэша по умолчанию (мс)
  TTL: 3600000, // 1 час
  
  // Префикс для ключей кэша
  PREFIX: 'wb_calc_',
};

// Экспортируем объект по умолчанию для обратной совместимости
export default {
  WB_API,
  getSellerUrl,
  getProductUrl,
  getSearchUrl,
  DEFAULT_HEADERS,
  TIMEOUTS,
  ERROR_CODES,
  CACHE,
};
