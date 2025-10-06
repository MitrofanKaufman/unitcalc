// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\services\api-gateway\src\services\WildberriesService.ts
/**
 * path/to/file.ts
 * Описание: Локальный сервис для работы с Wildberries (адаптированный для api-gateway)
 * Логика: Клиентская/Серверная (серверная логика API)
 * Зависимости: Playwright для браузерной автоматизации
 * Примечания: Адаптированная версия модуля сбора данных для использования в api-gateway
 */

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import type { Request, Response } from 'express';

// Интерфейсы для данных товара
interface ProductData {
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

interface CollectionResult {
  success: boolean;
  product?: ProductData;
  seller?: any;
  errors?: string[];
  executionTime?: number;
}

interface CollectionProgress {
  currentStep: string;
  totalSteps: number;
  percentage: number;
  message: string;
  errors: string[];
  data?: Partial<ProductData>;
}

// Класс для отслеживания выполнения шагов
class ExecutionData {
  steps: Map<string, any> = new Map();
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

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

// Основной класс скрейпера (упрощенная версия)
export class WildberriesScraper {
  private id: string;
  private url: string;

  constructor(id: string) {
    if (!/^\d+$/.test(String(id))) {
      throw new Error('Некорректный ID товара');
    }

    this.id = String(id);
    this.url = `https://www.wildberries.ru/catalog/${this.id}/detail.aspx`;
  }

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
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        viewport: { width: 1280, height: 720 }
      });

      page = await context.newPage();

      // Загрузка страницы
      await page.goto(this.url, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: 30000 });
      await page.waitForTimeout(1000);

      // Сбор базовых данных
      const productData = await this.extractProductData(page);

      return {
        success: true,
        product: {
          id: this.id,
          title: productData.title || '',
          price: productData.price || 0,
          rating: productData.rating || 0,
          reviews: productData.reviews || 0,
          questions: productData.questions || 0,
          image: productData.image || '',
          description: '',
          parameters: {},
          originalMark: productData.originalMark || false,
          sellerId: productData.sellerId || '',
          collectedAt: new Date().toISOString(),
          sourceUrl: this.url
        },
        executionTime: Date.now()
      };

    } catch (error) {
      console.error('Ошибка при скрейпинге:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Неизвестная ошибка']
      };
    } finally {
      // Закрытие ресурсов
      try {
        if (page) await page.close();
        if (context) await context.close();
        if (browser) await browser.close();
      } catch (error) {
        console.error('Ошибка при закрытии браузера:', error);
      }
    }
  }

  private async extractProductData(page: Page): Promise<Partial<ProductData>> {
    const data: Partial<ProductData> = {};

    try {
      // Название
      const titleElement = await page.$('h1[itemprop="name"], .product-title');
      if (titleElement) {
        data.title = await titleElement.textContent() || '';
      }

      // Цена
      const priceElement = await page.$('.price-block__final-price, [data-testid="price"]');
      if (priceElement) {
        const priceText = await priceElement.textContent() || '';
        const priceMatch = priceText.match(/(\d[\d\s]*)/);
        if (priceMatch) {
          data.price = parseInt(priceMatch[1].replace(/\s/g, ''), 10);
        }
      }

      // Рейтинг
      const ratingElement = await page.$('.product-rating, [data-testid="rating"]');
      if (ratingElement) {
        const ratingText = await ratingElement.textContent() || '';
        const ratingMatch = ratingText.match(/(\d[,.]\d|\d)/);
        if (ratingMatch) {
          data.rating = parseFloat(ratingMatch[1].replace(',', '.'));
        }
      }

      // Отзывы
      const reviewsElement = await page.$('.product-review-count, [data-testid="reviews-count"]');
      if (reviewsElement) {
        const reviewsText = await reviewsElement.textContent() || '';
        const reviewsMatch = reviewsText.match(/(\d+)/);
        if (reviewsMatch) {
          data.reviews = parseInt(reviewsMatch[1], 10);
        }
      }

      // Изображение
      const imgElement = await page.$('.product-image img, [data-testid="product-image"] img');
      if (imgElement) {
        const src = await imgElement.getAttribute('src');
        if (src) {
          data.image = src.startsWith('http') ? src : `https://www.wildberries.ru${src}`;
        }
      }

      // Оригинальность
      data.originalMark = await page.$('.original-mark, [data-testid="original-mark"]') !== null;

    } catch (error) {
      console.error('Ошибка при извлечении данных:', error);
    }

    return data;
  }
}

/**
 * Функция для сбора данных о товаре
 */
export async function scrapeProductById(productId: string): Promise<CollectionResult> {
  const scraper = new WildberriesScraper(productId);
  return await scraper.scrape();
}

// Заглушки для других функций
export async function getProduct(id: string): Promise<ProductData | null> {
  const result = await scrapeProductById(id);
  return result.success ? result.product || null : null;
}

export async function calculateProfitability(
  id: string,
  purchasePrice: number,
  logistics: number = 0,
  otherCosts: number = 0,
  desiredMargin: number = 30
): Promise<any> {
  const product = await getProduct(id);
  if (!product) return null;

  const costs = purchasePrice + logistics + otherCosts;
  const profit = product.price - costs;
  const margin = product.price > 0 ? (profit / product.price) * 100 : 0;
  const recommendedPrice = costs / (1 - desiredMargin / 100);

  return {
    productId: id,
    currentPrice: product.price,
    costs,
    profit,
    currentMargin: margin.toFixed(2) + '%',
    desiredMargin: desiredMargin + '%',
    recommendedPrice: Math.round(recommendedPrice),
    breakEvenPoint: costs,
    isProfitable: profit > 0,
    recommendation: margin >= desiredMargin ? 'Выгодно' : 'Низкая маржа'
  };
}
