// path: src/api/v1/functions/getPriceHistory.ts

/**
 * Представляет точку данных истории цен
 */
interface PriceHistoryPoint {
  date: string | null;
  price: number;
}

/**
 * Извлекает историю изменения цены из графика на странице товара Wildberries.
 * 
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param executionData - Объект для отслеживания прогресса выполнения
 * @param result - Объект результата, куда будет записана история цен
 */
export async function getPriceHistory(
  page: any,
  settings: {
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  },
  result: {
    priceHistory?: PriceHistoryPoint[];
    [key: string]: any;
  }
): Promise<void> {
  try {
    // 1) Ожидаем появления графика истории цен
    await page.waitForSelector('.price-history__chart', { 
      timeout: settings.scrapeTimeout,
      state: 'attached'
    });

    // 2) Извлекаем данные о ценах
    const priceHistory = await page.evaluate((): PriceHistoryPoint[] => {
      // Получаем все точки на графике
      const points = Array.from(document.querySelectorAll<HTMLElement>('.price-history__chart .point'));
      
      // Преобразуем точки в массив объектов с данными
      return points.map((pt): PriceHistoryPoint => {
        const date = pt.getAttribute('data-date');
        const priceStr = pt.getAttribute('data-price') || '0';
        const price = parseInt(priceStr, 10);
        
        return {
          date,
          price: isNaN(price) ? 0 : price
        };
      });
    });

    // 3) Сохраняем результат
    result.priceHistory = priceHistory;
    
    // 4) Отмечаем выполнение шага
    executionData.markCompleted('priceHistory');
  } catch (err: any) {
    // 5) Обрабатываем ошибки
    if (err.name === 'TimeoutError') {
      // Если график не загрузился, оставляем пустой массив
      result.priceHistory = [];
      console.debug('График истории цен не найден на странице');
    } else {
      // Другие ошибки логируем
      executionData.addError({
        step: 'priceHistory',
        message: `${messages.getError('getPriceHistoryError')}: ${err.message || 'Неизвестная ошибка'}`
      });
    }
    
    // 6) В любом случае помечаем шаг как выполненный
    executionData.markCompleted('priceHistory');
  }
}
