// Типы для серверной части Marketplace Calculator

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Типы для маркетплейсов
export interface MarketplaceEntity extends BaseEntity {
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
export interface ProductEntity extends BaseEntity {
  name: string;
  price: number;
  category: string;
  marketplaceId: string;
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
  scrapedAt?: string;
  sourceUrl?: string;
}

// Типы для категорий товаров
export interface ProductCategoryEntity extends BaseEntity {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

// Типы для расчетов доходности
export interface ProfitabilityCalculationEntity extends BaseEntity {
  productId: string;
  purchasePrice: number;
  sellingPrice: number;
  logisticsCost: number;
  otherCosts: number;
  marketplaceId: string;
  categoryId: string;
  result: CalculationResultEntity;
  userId?: string;
}

export interface CalculationResultEntity {
  revenue: number;
  commission: number;
  logistics: number;
  otherCosts: number;
  profit: number;
  profitability: number;
  roi: number;
  calculatedAt: string;
}

// Типы для пользователей
export interface UserEntity extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  isActive: boolean;
  lastLoginAt?: string;
  settings?: UserSettingsEntity;
}

export interface UserSettingsEntity {
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

// Типы для API запросов и ответов
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Типы для фильтров поиска
export interface ProductSearchFilters {
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

// DTO для создания товаров
export interface CreateProductDto {
  name: string;
  price: number;
  category: string;
  marketplaceId: string;
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
  sourceUrl?: string;
}

// DTO для обновления товаров
export interface UpdateProductDto extends Partial<CreateProductDto> {}

// DTO для расчета доходности
export interface CalculateProfitabilityDto {
  productId: string;
  purchasePrice: number;
  sellingPrice: number;
  logisticsCost: number;
  otherCosts: number;
  marketplaceId?: string;
  categoryId?: string;
}

// DTO для поиска товаров
export interface SearchProductsDto {
  query: string;
  marketplace?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

// Константы маркетплейсов (для сервера)
export const MARKETPLACE_COMMISSIONS = {
  wb: {
    base: 15,
    categoryMultiplier: {
      'electronics': 0.05,
      'clothing': 0.15,
      'home': 0.10,
    }
  },
  ozon: {
    base: 12,
    categoryMultiplier: {
      'electronics': 0.08,
      'books': 0.12,
      'toys': 0.15,
    }
  },
  yandex: {
    base: 8,
    categoryMultiplier: {
      'electronics': 0.05,
      'fashion': 0.12,
      'food': 0.08,
    }
  }
} as const;

// Константы категорий товаров
export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: 'Электроника' },
  { id: 'clothing', name: 'Одежда' },
  { id: 'home', name: 'Товары для дома' },
  { id: 'books', name: 'Книги' },
  { id: 'toys', name: 'Игрушки' },
  { id: 'fashion', name: 'Мода' },
  { id: 'food', name: 'Еда' },
] as const;

// Валидационные правила
export const VALIDATION_RULES = {
  productName: {
    minLength: 3,
    maxLength: 200,
    pattern: /^[a-zA-Zа-яА-Я0-9\s\-_()]{3,200}$/
  },
  price: {
    min: 0.01,
    max: 1000000
  },
  percentage: {
    min: 0,
    max: 100
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// Коды ошибок API
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;

// Статусы операций
export type OperationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface OperationResult {
  success: boolean;
  status: OperationStatus;
  message?: string;
  data?: unknown;
  errors?: string[];
}
