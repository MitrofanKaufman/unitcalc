// Константы приложения Marketplace Calculator

// Название приложения
export const APP_NAME = 'Marketplace Calculator';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Расчет доходности товаров для маркетплейсов России';

// Маркетплейсы
export const MARKETPLACES = [
  {
    id: 'wb',
    name: 'Wildberries',
    icon: '🛍️',
    color: '#7B68EE',
    commission: {
      base: 15,
      categoryMultiplier: {
        'electronics': 0.05,
        'clothing': 0.15,
        'home': 0.10,
      }
    },
    isActive: true
  },
  {
    id: 'ozon',
    name: 'Ozon',
    icon: '📦',
    color: '#0058FF',
    commission: {
      base: 12,
      categoryMultiplier: {
        'electronics': 0.08,
        'books': 0.12,
        'toys': 0.15,
      }
    },
    isActive: true
  },
  {
    id: 'yandex',
    name: 'Yandex Market',
    icon: '🛒',
    color: '#FF3333',
    commission: {
      base: 8,
      categoryMultiplier: {
        'electronics': 0.05,
        'fashion': 0.12,
        'food': 0.08,
      }
    },
    isActive: true
  }
] as const;

// Категории товаров
export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: 'Электроника', isActive: true },
  { id: 'clothing', name: 'Одежда', isActive: true },
  { id: 'home', name: 'Товары для дома', isActive: true },
  { id: 'books', name: 'Книги', isActive: true },
  { id: 'toys', name: 'Игрушки', isActive: true },
  { id: 'fashion', name: 'Мода', isActive: true },
  { id: 'food', name: 'Еда', isActive: true },
] as const;

// Статусы товаров
export const PRODUCT_STATUSES = [
  { id: 'active', name: 'Активен', color: 'success' },
  { id: 'inactive', name: 'Неактивен', color: 'default' },
  { id: 'draft', name: 'Черновик', color: 'warning' },
  { id: 'archived', name: 'Архивирован', color: 'error' }
] as const;

// Пагинация по умолчанию
export const DEFAULT_PAGINATION = {
  page: 0,
  pageSize: 25,
  pageSizeOptions: [10, 25, 50, 100]
} as const;

// Таймауты API запросов (мс)
export const API_TIMEOUTS = {
  default: 10000,
  long: 30000,
  scraping: 60000
} as const;

// Кеширование
export const CACHE_DURATIONS = {
  products: 24 * 60 * 60 * 1000, // 24 часа
  search: 30 * 60 * 1000, // 30 минут
  calculations: 60 * 60 * 1000 // 1 час
} as const;

// Валидация форм
export const VALIDATION_RULES = {
  productName: {
    minLength: 3,
    maxLength: 200
  },
  price: {
    min: 0.01,
    max: 1000000
  },
  percentage: {
    min: 0,
    max: 100
  }
} as const;

// Цветовая палитра
export const COLORS = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0'
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2'
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c'
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00'
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f'
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2'
  }
} as const;

// Размеры компонентов
export const SIZES = {
  headerHeight: 64,
  sidebarWidth: 240,
  contentMaxWidth: 1200,
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12
  }
} as const;

// Локальное хранилище
export const STORAGE_KEYS = {
  products: 'marketplace_products',
  calculations: 'marketplace_calculations',
  settings: 'marketplace_settings',
  cache: 'marketplace_cache'
} as const;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  VALIDATION_ERROR: 'Проверьте правильность введенных данных.',
  PERMISSION_DENIED: 'Недостаточно прав для выполнения операции.',
  NOT_FOUND: 'Запрашиваемый ресурс не найден.',
  SERVER_ERROR: 'Внутренняя ошибка сервера.',
  TIMEOUT: 'Превышено время ожидания запроса.'
} as const;

// Сообщения об успехе
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Товар успешно добавлен.',
  PRODUCT_UPDATED: 'Товар успешно обновлен.',
  PRODUCT_DELETED: 'Товар успешно удален.',
  CALCULATION_SAVED: 'Расчет сохранен.',
  SETTINGS_SAVED: 'Настройки сохранены.',
  CACHE_CLEARED: 'Кеш очищен.'
} as const;

// Регулярные выражения
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
  PRODUCT_NAME: /^[a-zA-Zа-яА-Я0-9\s\-_()]{3,200}$/,
  URL: /^https?:\/\/.+/
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CALCULATIONS: '/api/calculations',
  MARKETPLACES: '/api/marketplaces',
  CATEGORIES: '/api/categories',
  SEARCH: '/api/search',
  CACHE: '/api/cache'
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ADVANCED_ANALYTICS: false,
  AI_ASSISTANT: false,
  BULK_OPERATIONS: false,
  EXPORT_PDF: false,
  EXPORT_EXCEL: true
} as const;
