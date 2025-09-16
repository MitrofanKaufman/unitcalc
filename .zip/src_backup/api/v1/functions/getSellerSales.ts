// path: src/api/v1/functions/getSellerSales.ts

/**
 * Извлекает общее количество продаж продавца (параметр «товар продан») со страницы Wildberries.
 * 
 * @param page - Страница Playwright для взаимодействия с DOM
 * @param settings - Конфигурация скрапера, включая таймауты ожидания
 * @param messages - Локализованные тексты сообщений и ошибок
 * @param result - Объект, куда будет записано количество продаж
 * @param executionData - Объект для отслеживания статусов выполнения и ошибок
 */
export async function getSellerSales(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: { 
    sales?: number | null;
    [key: string]: any;
  },
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Наводим курсор на элемент рейтинга, чтобы отобразился список параметров
    try {
      await page.hover('.address-rate-mini', { timeout: settings.scrapeTimeout });
      // Даём время для загрузки выпадающего списка
      await page.waitForTimeout(500);
    } catch (err) {
      // Пропускаем ошибку, если не удалось навести курсор, возможно, данные уже загружены
      console.debug('Не удалось навести курсор на рейтинг:', err.message);
    }

    // 2) Парсим элементы списка, чтобы найти параметр «товар продан»
    const sales = await page.evaluate((): number | null => {
      // Список возможных селекторов для элементов с информацией о продавце
      const selectors = [
        '.seller-params__item',
        '.seller-details__parameter-item',
        '.seller-info__parameter-item'
      ];

      // Получаем все элементы, соответствующие любому из селекторов
      const items = selectors
        .map(sel => Array.from(document.querySelectorAll(sel)))
        .flat();

      // Ищем элемент, содержащий информацию о количестве продаж
      for (const item of items) {
        const keyEl = item.querySelector<HTMLElement>(
          '.seller-params__name, .seller-details__parameter-name, .seller-info__parameter-name'
        );
        const valEl = item.querySelector<HTMLElement>(
          '.seller-params__value, .seller-details__parameter-value, .seller-info__parameter-value'
        );
        
        // Пропускаем, если не нашли один из элементов
        if (!keyEl || !valEl) continue;

        const key = keyEl.textContent?.trim() || '';
        const raw = valEl.textContent?.trim() || '';

        // Проверяем, что это нужный нам параметр
        if (/товар продан/i.test(key)) {
          const num = parseInt(raw.replace(/\D/g, ''), 10);
          return isNaN(num) ? null : num;
        }
      }
      
      return null;
    });

    // 3) Сохраняем результат
    result.sales = sales;
    executionData.markCompleted('sellerSales');
  } catch (err: any) {
    executionData.addError({ 
      step: 'sellerSales', 
      message: `${messages.getError('getSellerSalesError')}: ${err.message || 'Неизвестная ошибка'}`
    });
  }
}
