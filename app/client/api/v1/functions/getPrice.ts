// path: src/api/v1/functions/getPrice.ts

/**
 * Извлекает цену товара со страницы.
 * Ищет элемент с классом .price-block__final-price и извлекает числовое значение цены.
 *
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будет записана цена
 * @param executionData - Опциональный объект для отслеживания прогресса выполнения
 */
export async function getPrice(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: { 
    price?: number | null;
    [key: string]: any;
  },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ждём появления элемента с ценой
    await page.waitForSelector('.price-block__final-price', { 
      timeout: settings.scrapeTimeout 
    });

    // 2) Извлекаем цену из элемента
    const price = await page.evaluate((): number | null => {
      const priceElement = document.querySelector('.price-block__final-price');
      if (!priceElement) return null;
      
      const rawText = priceElement.textContent?.trim() || '';
      if (!rawText) return null;
      
      // Извлекаем числовое значение из текста (удаляем все нецифровые символы)
      const numericValue = parseInt(rawText.replace(/\D/g, ''), 10);
      return isNaN(numericValue) ? null : numericValue;
    });

    // 3) Проверяем, что цена валидна
    if (price === null) {
      throw new Error('Не удалось извлечь цену: элемент не найден или содержит некорректное значение');
    }

    // 4) Сохраняем результат
    result.price = price;
    executionData?.markCompleted?.('price');
  } catch (err: any) {
    executionData?.addError?.({
      step: 'price',
      message: `${messages.getError('getPriceError')}: ${err.message}`
    });
  }
}