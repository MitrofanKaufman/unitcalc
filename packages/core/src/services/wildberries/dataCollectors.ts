// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\dataCollectors.ts
/**
 * path/to/file.ts
 * Описание: Функции для сбора конкретных данных с сайта Wildberries
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Playwright для браузерной автоматизации
 * Примечания: Содержит функции для извлечения различных типов данных товара
 */

import { Page } from 'playwright';
import type { ProductData } from './types';

/**
 * Получение заголовка товара
 */
export async function getTitle(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    const titleSelector = 'h1[itemprop="name"], .product-title, [data-testid="product-title"]';
    await page.waitForSelector(titleSelector, { timeout: settings.scrapeTimeout });

    const titleElement = await page.$(titleSelector);
    if (titleElement) {
      result.title = await titleElement.textContent();
      result.title = result.title?.trim();
    }
  } catch (error) {
    execution.err('title', error);
  }
}

/**
 * Получение цены товара
 */
export async function getPrice(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    const priceSelectors = [
      '.price-block__final-price',
      '[data-testid="price"]',
      '.product-price',
      '.price'
    ];

    for (const selector of priceSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const priceElement = await page.$(selector);
        if (priceElement) {
          const priceText = await priceElement.textContent();
          if (priceText) {
            // Извлечение числа из текста (убираем пробелы, символ рубля и т.д.)
            const priceMatch = priceText.match(/(\d[\d\s]*)/);
            if (priceMatch) {
              result.price = parseInt(priceMatch[1].replace(/\s/g, ''), 10);
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    execution.err('price', error);
  }
}

/**
 * Получение рейтинга и отзывов
 */
export async function getRatingAndReviews(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    // Поиск рейтинга
    const ratingSelectors = [
      '.product-rating',
      '[data-testid="rating"]',
      '.rating',
      '.product-review-rating'
    ];

    for (const selector of ratingSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const ratingElement = await page.$(selector);
        if (ratingElement) {
          const ratingText = await ratingElement.textContent();
          if (ratingText) {
            const ratingMatch = ratingText.match(/(\d[,.]\d|\d)/);
            if (ratingMatch) {
              result.rating = parseFloat(ratingMatch[1].replace(',', '.'));
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }

    // Поиск количества отзывов
    const reviewSelectors = [
      '.product-review-count',
      '[data-testid="reviews-count"]',
      '.reviews-count',
      '.product-feedback-count'
    ];

    for (const selector of reviewSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const reviewElement = await page.$(selector);
        if (reviewElement) {
          const reviewText = await reviewElement.textContent();
          if (reviewText) {
            const reviewMatch = reviewText.match(/(\d+)/);
            if (reviewMatch) {
              result.reviews = parseInt(reviewMatch[1], 10);
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    execution.err('ratingAndReviews', error);
  }
}

/**
 * Получение количества вопросов
 */
export async function getQuestions(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    const questionSelectors = [
      '.product-questions-count',
      '[data-testid="questions-count"]',
      '.questions-count',
      '.product-questions'
    ];

    for (const selector of questionSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const questionElement = await page.$(selector);
        if (questionElement) {
          const questionText = await questionElement.textContent();
          if (questionText) {
            const questionMatch = questionText.match(/(\d+)/);
            if (questionMatch) {
              result.questions = parseInt(questionMatch[1], 10);
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    execution.err('questions', error);
  }
}

/**
 * Получение изображения товара
 */
export async function getImg(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    const imgSelectors = [
      '.product-image img',
      '[data-testid="product-image"] img',
      '.product-gallery img',
      '.product-photos img'
    ];

    for (const selector of imgSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const imgElement = await page.$(selector);
        if (imgElement) {
          const src = await imgElement.getAttribute('src');
          if (src) {
            result.image = src.startsWith('http') ? src : `https://www.wildberries.ru${src}`;
            break;
          }
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    execution.err('image', error);
  }
}

/**
 * Получение характеристик товара
 */
export async function getProductParameters(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    const paramSelectors = [
      '.product-parameters',
      '[data-testid="product-parameters"]',
      '.product-characteristics',
      '.product-specs'
    ];

    for (const selector of paramSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const paramElement = await page.$(selector);
        if (paramElement) {
          // Получение всех характеристик в виде пар ключ-значение
          const parameters: Record<string, string> = {};

          // Поиск элементов с характеристиками
          const paramItems = await paramElement.$$('.parameter-item, .characteristic, .spec-item');
          for (const item of paramItems) {
            const nameElement = await item.$('.parameter-name, .characteristic-name, .spec-name');
            const valueElement = await item.$('.parameter-value, .characteristic-value, .spec-value');

            if (nameElement && valueElement) {
              const name = await nameElement.textContent();
              const value = await valueElement.textContent();
              if (name && value) {
                parameters[name.trim()] = value.trim();
              }
            }
          }

          if (Object.keys(parameters).length > 0) {
            result.parameters = parameters;
            break;
          }
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    execution.err('productParameters', error);
  }
}

/**
 * Получение информации об оригинальности товара
 */
export async function getOriginalMark(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<void> {
  try {
    // Поиск индикатора оригинального товара
    const originalSelectors = [
      '.original-mark',
      '[data-testid="original-mark"]',
      '.brand-original',
      '.original-product'
    ];

    for (const selector of originalSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const originalElement = await page.$(selector);
        if (originalElement) {
          result.originalMark = await originalElement.isVisible();
          break;
        }
      } catch {
        continue;
      }
    }

    // По умолчанию считаем товар неоригинальным, если индикатор не найден
    if (result.originalMark === undefined) {
      result.originalMark = false;
    }
  } catch (error) {
    execution.err('originalMark', error);
  }
}

/**
 * Получение ID продавца
 */
export async function getSellerId(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<string | null> {
  try {
    const sellerSelectors = [
      '.seller-id',
      '[data-testid="seller-id"]',
      '.product-seller',
      '.seller-info'
    ];

    for (const selector of sellerSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const sellerElement = await page.$(selector);
        if (sellerElement) {
          const sellerText = await sellerElement.textContent();
          if (sellerText) {
            const sellerMatch = sellerText.match(/(\d+)/);
            if (sellerMatch) {
              result.sellerId = sellerMatch[1];
              return sellerMatch[1];
            }
          }
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    execution.err('sellerId', error);
    return null;
  }
}

/**
 * Проверка наличия капчи на странице
 */
export async function checkCaptcha(
  page: Page,
  settings: any,
  messages: any,
  result: Partial<ProductData>,
  execution: any
): Promise<boolean> {
  try {
    const captchaSelectors = [
      '.captcha',
      '.captcha-container',
      '.recaptcha',
      '.hcaptcha'
    ];

    for (const selector of captchaSelectors) {
      try {
        const captchaElement = await page.$(selector);
        if (captchaElement && await captchaElement.isVisible()) {
          return true;
        }
      } catch {
        continue;
      }
    }

    return false;
  } catch (error) {
    execution.err('captchaCheck', error);
    return false;
  }
}
