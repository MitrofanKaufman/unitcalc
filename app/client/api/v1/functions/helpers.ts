// path: src/api/v1/functions/helpers.ts

// ──────────────────────────────────────────────────────────────
// Вспомогательные утилиты + alias ProgressReporter
// ──────────────────────────────────────────────────────────────

import puppeteer, { Browser, Page } from 'puppeteer';
import { SmoothWeightedProgressReporter } from './SmoothWeightedProgressReporter';

// Расширяем интерфейс Page для совместимости с Playwright API
interface ExtendedPage extends Page {
  browser: () => Browser;
}

// Опции для инициализации ProgressReporter
interface ProgressReporterOptions {
  totalSteps?: number;
  weights?: Record<string, number>;
  [key: string]: any;
}

/**
 * Alias для обратной совместимости.
 * В старом коде используется:
 *     import { ProgressReporter } from './helpers';
 * Здесь мы мапим это имя на новый «плавный» репортёр.
 */
export class ProgressReporter extends SmoothWeightedProgressReporter {
  /**
   * Создает экземпляр ProgressReporter
   * @param options - Опции для инициализации
   */
  constructor(options: ProgressReporterOptions = {}) {
    super(options);
  }
}

/*──────────────────────────────────────────────────────────────*/
/*                     Popup-helper                             */
/*──────────────────────────────────────────────────────────────*/

/**
 * Закрывает всплывающее окно, если оно появилось
 * 
 * @param page - Экземпляр страницы Playwright
 * @param timeout - Таймаут ожидания попапа (в миллисекундах)
 * @param selector - Селектор кнопки закрытия попапа
 * @returns Promise, который разрешается после попытки закрытия попапа
 */
export async function closePopup(
  page: any,
  timeout: number,
  selector: string = 'a.j-close.popup__close.close'
): Promise<void> {
  try {
    await page.waitForSelector(selector, { timeout, visible: true });
    await page.click(selector);
    await page.waitForTimeout(500); // Даем время на анимацию закрытия
  } catch (e) {
    // Игнорируем ошибки, если попап не найден
  }
}

/*──────────────────────────────────────────────────────────────*/
/*        Быстрый хелпер получения Puppeteer-страницы           */
/*──────────────────────────────────────────────────────────────*/

/**
 * Создает и настраивает новый экземпляр страницы Puppeteer
 * 
 * @returns Promise с экземпляром страницы Puppeteer
 */
export async function getPage(): Promise<ExtendedPage> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
    ],
  });

  const page = (await browser.newPage()) as ExtendedPage;
  
  // Добавляем метод browser() для совместимости с Playwright API
  page.browser = () => browser;
  
  // Настраиваем заголовки для имитации реального браузера
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );
  
  // Включаем JavaScript
  await page.setJavaScriptEnabled(true);
  
  // Устанавливаем размер окна
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  
  return page;
}
