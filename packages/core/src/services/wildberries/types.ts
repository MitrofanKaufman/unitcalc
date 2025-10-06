// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\types.ts
/**
 * path/to/file.ts
 * Описание: Определения типов и интерфейсов для сбора данных с Wildberries
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Базовые типы TypeScript, Playwright
 * Примечания: Содержит интерфейсы для товаров, процессов сбора и результатов
 */

export interface ProductData {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  questions: number;
  image: string;
  description: string;
  parameters: Record<string, string>;
  originalMark: boolean;
  sellerId: string;
  collectedAt?: string;
  sourceUrl?: string;
}

export interface CollectionProgress {
  currentStep: string;
  totalSteps: number;
  percentage: number;
  message: string;
  errors: string[];
  data?: Partial<ProductData>;
}

export interface CollectionResult {
  success: boolean;
  product?: ProductData;
  seller?: any;
  errors?: string[];
  executionTime?: number;
}

export interface CollectionOptions {
  withAnalytics?: boolean;
  includeFeedbacks?: boolean;
  maxPages?: number;
  timeout?: number;
  retries?: number;
}

export interface ExecutionStep {
  name: string;
  completed: boolean;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface ScraperSettings {
  userAgent: string;
  scrapeTimeout: number;
  retryAttempts: number;
  retryDelay: number;
  messages: {
    [key: string]: string;
  };
}

export interface SellerData {
  id: string;
  name: string;
  rating: number;
  productsCount: number;
  registrationDate: string;
  location: string;
}

export interface FeedbackData {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  pros?: string[];
  cons?: string[];
}

export interface PriceHistory {
  date: string;
  price: number;
  discount?: number;
}

export type CollectionStatus = 'idle' | 'collecting' | 'completed' | 'error' | 'cancelled';

export interface CollectionTask {
  id: string;
  productId: string;
  userId?: string;
  status: CollectionStatus;
  progress: CollectionProgress;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  result?: CollectionResult;
}
