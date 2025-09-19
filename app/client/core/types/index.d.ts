// Основные типы данных приложения

type Nullable<T> = T | null | undefined;

type Dictionary<T> = {
  [key: string]: T;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Типы для работы с API
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
  timestamp: string;
  errors?: Record<string, string[]>;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
    statusText?: string;
  };
}

// Типы для работы с логами
type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
  namespace?: string;
}

// Типы для работы с товарами
interface Product {
  id: string;
  name: string;
  article: string;
  barcode: string;
  brand: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  weight: number;
  volume: number;
  images: string[];
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Типы для работы с расчетами
interface Calculation {
  id: string;
  productId: string;
  productName: string;
  price: number;
  costPrice: number;
  commission: number;
  logisticsCost: number;
  otherCosts: number;
  tax: number;
  profit: number;
  profitMargin: number;
  roi: number;
  createdAt: string;
  updatedAt: string;
}

// Типы для работы с настройками
interface AppSettings {
  commissionRate: number;
  taxRate: number;
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  updatedAt: string;
}

// Типы для работы с историей
interface HistoryEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  timestamp: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
}

export type {
  Nullable,
  Dictionary,
  DeepPartial,
  ApiResponse,
  ApiError,
  LogLevel,
  LogEntry,
  Product,
  Calculation,
  AppSettings,
  HistoryEntry,
};
