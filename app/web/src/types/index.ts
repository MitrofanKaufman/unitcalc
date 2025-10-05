// Базовые типы для всего приложения

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Типы для маркетплейсов
export interface Marketplace {
  id: string;
  name: string;
  icon: string;
  color: string;
  commission: {
    base: number;
    categoryMultiplier?: Record<string, number>;
  };
  isActive: boolean;
}

// Типы для товаров
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  marketplace: string;
  characteristics?: {
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    brand?: string;
    rating?: number;
    reviews?: number;
    inStock?: boolean;
  };
  cached?: boolean;
  lastUpdated?: string;
}

// Типы для категорий товаров
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

// Типы для расчетов доходности
export interface ProfitabilityCalculation {
  id: string;
  productId: string;
  purchasePrice: number;
  sellingPrice: number;
  logisticsCost: number;
  otherCosts: number;
  marketplaceId: string;
  categoryId: string;
  result: CalculationResult;
  createdAt: string;
  userId?: string;
}

export interface CalculationResult {
  revenue: number;           // Выручка = Цена продажи - Комиссия - Логистика - Другие затраты
  commission: number;        // Комиссия маркетплейса
  logistics: number;         // Стоимость логистики
  otherCosts: number;        // Другие затраты
  profit: number;           // Чистая прибыль
  profitability: number;    // Рентабельность в процентах
  roi: number;             // ROI (окупаемость инвестиций)
}

// Типы для пользователей
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  isActive: boolean;
  lastLoginAt?: string;
}

// Типы для настроек приложения
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'ru' | 'en';
  currency: 'RUB' | 'USD' | 'EUR';
  notifications: {
    email: boolean;
    push: boolean;
    calculationComplete: boolean;
    newProducts: boolean;
  };
}

// Типы для пагинации
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Типы для API ответов
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Типы для фильтров поиска
export interface SearchFilters {
  query?: string;
  marketplace?: string[];
  category?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  inStock?: boolean;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

// Типы для форм
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'multiselect' | 'date' | 'boolean';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => string | null;
  };
}

export interface FormConfig {
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
}

// Константы приложения
export const MARKETPLACES: Marketplace[] = [
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
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'electronics', name: 'Электроника', isActive: true },
  { id: 'clothing', name: 'Одежда', isActive: true },
  { id: 'home', name: 'Товары для дома', isActive: true },
  { id: 'books', name: 'Книги', isActive: true },
  { id: 'toys', name: 'Игрушки', isActive: true },
  { id: 'fashion', name: 'Мода', isActive: true },
  { id: 'food', name: 'Еда', isActive: true },
];

// Утилитарные типы
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Статусы операций
export type OperationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface OperationResult {
  success: boolean;
  message?: string;
  data?: unknown;
}
