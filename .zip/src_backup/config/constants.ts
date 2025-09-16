// path: src/config/constants.ts
/**
 * Константы приложения
 * Содержит все статические значения, используемые в приложении
 */

// Роли пользователей
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
  MODERATOR: 'moderator',
} as const;

// Коды ответов HTTP
export const HTTP_STATUS_CODES = {
  // Успешные ответы
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // Ошибки клиента
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  
  // Ошибки сервера
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Коды ошибок приложения
export const ERROR_CODES = {
  // Общие ошибки
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Ошибки аутентификации
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Ошибки валидации
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
  
  // Ошибки API Wildberries
  WB_API_ERROR: 'WB_API_ERROR',
  WB_API_LIMIT_EXCEEDED: 'WB_API_LIMIT_EXCEEDED',
  
  // Ошибки расчетов
  CALCULATION_ERROR: 'CALCULATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
} as const;

// Лимиты и ограничения
export const LIMITS = {
  // Лимиты запросов
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 минут
  MAX_REQUESTS_PER_WINDOW: 100, // Максимальное количество запросов за окно
  
  // Лимиты данных
  MAX_JSON_REQUEST_SIZE: '10mb',
  MAX_URL_ENCODED_REQUEST_SIZE: '10mb',
  MAX_UPLOAD_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Ограничения паролей
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  
  // Ограничения имен пользователей
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

// Настройки сессий и токенов
export const AUTH = {
  // JWT токены
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '30d', // 30 дней
  JWT_ISSUER: 'wb-calculator-api',
  
  // Куки
  COOKIE_NAME: 'wb_calculator_token',
  COOKIE_HTTP_ONLY: true,
  COOKIE_SECURE: process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: 'lax', // или 'strict' в продакшене
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 дней в миллисекундах
  
  // Сброс пароля
  PASSWORD_RESET_TOKEN_EXPIRES_IN: 24 * 60 * 60 * 1000, // 24 часа
} as const;

// Настройки API Wildberries
export const WB_API = {
  BASE_URL: 'https://suppliers-api.wildberries.ru',
  VERSION: 'v2',
  
  // Эндпоинты
  ENDPOINTS: {
    // Аутентификация
    AUTH: '/api/v2/passport',
    
    // Товары
    PRODUCTS: '/api/v2/stocks',
    PRODUCT_INFO: '/api/v2/goods/get-card-by-imt-id',
    
    // Заказы
    ORDERS: '/api/v2/orders',
    
    // Аналитика
    ANALYTICS: '/api/v1/analytics',
    
    // Цены
    PRICES: '/public/api/v1/prices',
    
    // Склады
    WAREHOUSES: '/api/v2/warehouses',
    
    // Доставка
    DELIVERY: '/api/v2/delivery',
  },
  
  // Коды статусов заказов
  ORDER_STATUSES: {
    NEW: 0, // Новый заказ
    ACCEPTED: 1, // Принят в работу
    ASSEMBLY: 3, // Сборка заказа
    READY_FOR_PICKUP: 11, // Готов к выдаче
    SENT: 12, // Отправлен
    DELIVERED: 13, // Доставлен
    CANCELLED: 15, // Отменен
  },
  
  // Коды статусов доставки
  DELIVERY_STATUSES: {
    NEW: 0, // Новый
    IN_PROGRESS: 1, // В работе
    DELIVERED: 2, // Доставлен
    CANCELLED: 3, // Отменен
  },
} as const;

// Настройки кэширования
export const CACHE = {
  // Время жизни кэша по умолчанию (в секундах)
  TTL: 60 * 60, // 1 час
  
  // Ключи кэша
  KEYS: {
    WB_PRODUCT_INFO: 'wb:product:info:',
    WB_SELLER_INFO: 'wb:seller:info:',
    WB_CATEGORIES: 'wb:categories',
    WB_BRANDS: 'wb:brands',
  },
  
  // Префиксы для инвалидации кэша
  TAGS: {
    PRODUCT: 'product:',
    SELLER: 'seller:',
    CATEGORY: 'category:',
  },
} as const;

// Настройки для расчетов рентабельности
export const CALCULATION = {
  // Стандартная комиссия Wildberries (%)
  DEFAULT_COMMISSION: 15,
  
  // Минимальная комиссия (%)
  MIN_COMMISSION: 5,
  
  // Максимальная комиссия (%)
  MAX_COMMISSION: 30,
  
  // НДС (%)
  VAT: 20,
  
  // Минимальная рентабельность (%)
  MIN_PROFIT_MARGIN: 10,
  
  // Стандартная наценка (%)
  DEFAULT_MARKUP: 30,
  
  // Стоимость логистики (руб.)
  LOGISTICS_COST: 50,
  
  // Стоимость хранения за единицу товара в день (руб.)
  STORAGE_COST_PER_DAY: 1,
  
  // Максимальное время хранения на складе (дни)
  MAX_STORAGE_DAYS: 60,
} as const;

// Экспортируем все константы по умолчанию
export default {
  USER_ROLES,
  HTTP_STATUS_CODES,
  ERROR_CODES,
  LIMITS,
  AUTH,
  WB_API,
  CACHE,
  CALCULATION,
};
