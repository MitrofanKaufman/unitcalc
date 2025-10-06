// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\index.ts
/**
 * path/to/file.ts
 * Описание: Главный файл экспорта модуля сбора данных Wildberries
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Все модули сбора данных
 * Примечания: Предоставляет единый интерфейс для использования функционала сбора данных
 */

// Экспорт типов
export type {
  ProductData,
  CollectionProgress,
  CollectionResult,
  CollectionOptions,
  CollectionStatus,
  CollectionTask,
  SellerData,
  FeedbackData,
  PriceHistory,
  ExecutionStep,
  ScraperSettings
} from './types';

// Экспорт классов и функций
export { ProductScraper, scrapeProductById } from './productScraper';
export { SmoothWeightedProgressReporter, ProgressReporter } from './progressReporter';
export { default as Settings } from './settings';

// Экспорт функций сбора данных
export {
  getTitle,
  getPrice,
  getRatingAndReviews,
  getQuestions,
  getImg,
  getProductParameters,
  getOriginalMark,
  getSellerId,
  checkCaptcha
} from './dataCollectors';

// Экспорт утилит для работы с файлами
export {
  saveJson,
  loadJson,
  ensureDirectories,
  cleanupOldFiles
} from './fileUtils';

// Экспорт констант и настроек по умолчанию
export const DEFAULT_SCRAPER_SETTINGS = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  scrapeTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  maxPages: 5,
  includeFeedbacks: true,
  withAnalytics: false
};

export const DEFAULT_WEIGHTS = {
  pageLoad: 10,
  captchaCheck: 5,
  title: 10,
  price: 15,
  ratingAndReviews: 15,
  questions: 10,
  image: 10,
  productParameters: 15,
  originalMark: 5,
  sellerId: 5
};

// Функция для быстрого запуска скрейпинга с настройками по умолчанию
export async function quickScrape(
  productId: string,
  progressCallback?: (progress: any) => void,
  userId?: string
) {
  return scrapeProductById(productId, progressCallback, userId, {
    withAnalytics: false,
    includeFeedbacks: false,
    maxPages: 1
  });
}
