// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\productScraper.ts
/**
 * path/to/file.ts
 * Описание: Основной класс для скрейпинга товаров с сайта Wildberries
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Playwright, типы и функции сбора данных
 * Примечания: Координирует процесс сбора всех данных о товаре
 */

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import Settings from './settings';
import { SmoothWeightedProgressReporter, ProgressCallback } from './progressReporter';
import * as collectors from './dataCollectors';
import { saveJson } from './fileUtils';
import Logger from '../../../utils/logger';
import type {
  ProductData,
  CollectionResult,
  CollectionOptions,
  ExecutionStep,
  ScraperSettings
} from './types';

interface ScrapingWeights {
  [key: string]: number;
}

/**
 * Класс для отслеживания выполнения шагов скрейпинга
 */
class ExecutionData {
  steps: Map<string, ExecutionStep> = new Map();
  errors: Array<{ step: string; message: string }> = [];

  markCompleted(step: string): void {
    const existing = this.steps.get(step);
    if (existing) {
      existing.completed = true;
      existing.endTime = Date.now();
      this.steps.set(step, existing);
    } else {
      this.steps.set(step, {
        name: step,
        completed: true,
        startTime: Date.now(),
        endTime: Date.now()
      });
    }
  }

  addError(obj: { step: string; message: string }): void {
    this.errors.push(obj);
  }

  mark(step: string): void {
    this.markCompleted(step);
  }

  err(step: string, e: Error): void {
    this.addError({ step, message: e.message });
  }

  getCompletedSteps(): string[] {
    return Array.from(this.steps.entries())
      .filter(([, step]) => step.completed)
      .map(([name]) => name);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

/**
 * Основной класс скрейпера товаров
 */
export class ProductScraper {
  private id: string;
  private userId?: string;
  private url: string;
  private settings: Settings;
  private reporter: SmoothWeightedProgressReporter;
  private logger: any;
  private execution: ExecutionData;
  private result: Partial<ProductData> = {};

  constructor(
    id: string,
    reporter: SmoothWeightedProgressReporter,
    userId?: string,
    options?: CollectionOptions
  ) {
    if (!/^\d+$/.test(String(id))) {
      throw new Error('Некорректный ID товара');
    }

    this.id = String(id);
    this.userId = userId;
    this.url = `https://www.wildberries.ru/catalog/${this.id}/detail.aspx`;
    this.settings = new Settings();
    this.reporter = reporter;
    this.execution = new ExecutionData();

    // Создаем логгер для отслеживания процесса
    this.logger = Logger?.createLogger ? Logger.createLogger(`ProductScraper:${this.id}`) : {
      log: console.log,
      error: console.error,
      warn: console.warn
    };
  }

  /**
   * Выполнение одного шага скрейпинга
   */
  private async executeStep(
    key: string,
    text: string,
    stepFn: () => Promise<void>
  ): Promise<void> {
    this.reporter.start(key, text);
    this.logger.log(text, key);

    try {
      await stepFn();
      this.execution.mark(key);
      this.logger.log('OK', key);
    } catch (e) {
      this.execution.err(key, e as Error);
      this.logger.error(e, key);
    } finally {
      this.reporter.finish(key);
    }
  }

  /**
   * Основной метод запуска скрейпинга
   */
  async scrape(): Promise<CollectionResult> {
    let browser: Browser | null = null;
    let context: BrowserContext | null = null;
    let page: Page | null = null;

    try {
      // Запуск браузера
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      context = await browser.newContext({
        userAgent: this.settings.userAgent,
        viewport: { width: 1280, height: 720 }
      });

      page = await context.newPage();

      this.reporter.start('run', `Товар ${this.id}`);

      // Шаг 1: Загрузка страницы
      await this.executeStep('pageLoad', 'Перехожу на страницу товара…', async () => {
        await page!.goto(this.url, { waitUntil: 'domcontentloaded' });
        await page!.waitForSelector('body', { timeout: this.settings.scrapeTimeout });
        await page!.waitForTimeout(1000);
      });

      // Шаг 2: Проверка капчи
      await this.executeStep('captchaCheck', 'Проверяю наличие капчи…', async () => {
        let hasCaptcha = false;
        for (let attempt = 0; attempt < 30; attempt++) {
          hasCaptcha = await collectors.checkCaptcha(page!, this.settings, this.settings.messages, this.result, this.execution);
          if (!hasCaptcha) break;
          await page!.waitForTimeout(1000);
        }
        if (hasCaptcha) {
          throw new Error('Капча не исчезла в течение 30 секунд');
        }
      });

      // Шаг 3: Сбор данных
      await this.executeStep('title', 'Изучаю товар…', async () => {
        await collectors.getTitle(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('price', 'Прицениваюсь к товару…', async () => {
        await collectors.getPrice(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('ratingAndReviews', 'Читаю отзывы товара…', async () => {
        await collectors.getRatingAndReviews(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('questions', 'Определяю заинтересованность покупателей…', async () => {
        await collectors.getQuestions(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('image', 'Сохраняю изображение товара…', async () => {
        await collectors.getImg(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('productParameters', 'Собираю характеристики товара…', async () => {
        await collectors.getProductParameters(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('originalMark', 'Проверяю оригинальность товара…', async () => {
        await collectors.getOriginalMark(page!, this.settings, this.settings.messages, this.result, this.execution);
      });

      await this.executeStep('sellerId', 'Определяю продавца…', async () => {
        const sellerId = await collectors.getSellerId(page!, this.settings, this.settings.messages, this.result, this.execution);
        this.result.sellerId = sellerId || undefined;
      });

      // Подготовка финального результата
      const finalResult: ProductData = {
        id: this.id,
        title: this.result.title || '',
        price: this.result.price || 0,
        rating: this.result.rating || 0,
        reviews: this.result.reviews || 0,
        questions: this.result.questions || 0,
        image: this.result.image || '',
        description: '', // Будет заполнено отдельно
        parameters: this.result.parameters || {},
        originalMark: this.result.originalMark || false,
        sellerId: this.result.sellerId || '',
        collectedAt: new Date().toISOString(),
        sourceUrl: this.url
      };

      this.reporter.finish('run');

      return {
        success: !this.execution.hasErrors(),
        product: finalResult,
        seller: this.result.sellerId ? { id: this.result.sellerId } : undefined,
        errors: this.execution.errors.map(err => err.message),
        executionTime: this.reporter.getElapsed()
      };

    } catch (error) {
      this.logger.error('Ошибка при скрейпинге:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Неизвестная ошибка'],
        executionTime: this.reporter.getElapsed()
      };
    } finally {
      // Закрытие ресурсов
      try {
        if (page) await page.close();
        if (context) await context.close();
        if (browser) await browser.close();
      } catch (error) {
        this.logger.error('Ошибка при закрытии браузера:', error);
      }
    }
  }
}

/**
 * Основная функция для запуска скрейпинга товара
 */
export async function scrapeProductById(
  productId: string,
  progressCallback?: ProgressCallback,
  userId?: string,
  options?: CollectionOptions
): Promise<CollectionResult> {
  // Создание репортёра прогресса
  const reporter = new SmoothWeightedProgressReporter(progressCallback);

  // Установка весов для разных этапов (может быть настроено)
  const defaultWeights: ScrapingWeights = {
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

  reporter.setWeights(defaultWeights);

  // Создание и запуск скрейпера
  const scraper = new ProductScraper(productId, reporter, userId, options);
  const result = await scraper.scrape();

  // Сохранение результатов (если требуется)
  if (result.success && result.product) {
    try {
      await saveJson(`product_${productId}.json`, { product: result.product });
    } catch (error) {
      console.warn('Не удалось сохранить результат:', error);
    }
  }

  return result;
}

export default scrapeProductById;
