// path: src/api/v1/functions/getPriceRange.ts

/**
 * Извлекает диапазон цен (минимальную и максимальную цену) из блока истории цен.
 * 
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будут записаны минимальная и максимальная цены
 * @param executionData - Объект для отслеживания прогресса выполнения
 */
export async function getPriceRange(
  page: any,
  settings: {
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: {
    priceMin?: number | null;
    priceMax?: number | null;
    [key: string]: any;
  },
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  // 1) Устанавливаем значения по умолчанию
  result.priceMin = null;
  result.priceMax = null;

  try {
    // 2) Ожидаем появления хотя бы одного из элементов (минимальная или максимальная цена)
    await page.waitForSelector(
      '.price-history__min, .price-history__max', 
      { 
        timeout: settings.scrapeTimeout,
        state: 'attached'
      }
    );

    // 3) Извлекаем минимальную и максимальную цены
    const [min, max] = await Promise.all([
      // Пытаемся получить минимальную цену
      page.$eval('.price-history__min', (el: HTMLElement) => {
        const text = el.textContent || '';
        const value = parseInt(text.replace(/\D/g, ''), 10);
        return isNaN(value) ? null : value;
      }).catch(() => null), // Игнорируем ошибки, если элемент не найден
      
      // Пытаемся получить максимальную цену
      page.$eval('.price-history__max', (el: HTMLElement) => {
        const text = el.textContent || '';
        const value = parseInt(text.replace(/\D/g, ''), 10);
        return isNaN(value) ? null : value;
      }).catch(() => null) // Игнорируем ошибки, если элемент не найден
    ]);

    // 4) Сохраняем результаты
    result.priceMin = min;
    result.priceMax = max;
    
    // 5) Отмечаем выполнение шага
    executionData.markCompleted('priceRange');
  } catch (err: any) {
    // 6) Обрабатываем ошибки
    if (err.name === 'TimeoutError') {
      // Если элементы не найдены, оставляем значения по умолчанию (null)
      console.debug('Элементы с ценами не найдены на странице');
    } else {
      // Другие ошибки логируем
      executionData.addError({
        step: 'priceRange',
        message: `${messages.getError('getPriceRangeError')}: ${err.message || 'Неизвестная ошибка'}`
      });
    }
    
    // 7) В любом случае помечаем шаг как выполненный
    executionData.markCompleted('priceRange');
  }
}
