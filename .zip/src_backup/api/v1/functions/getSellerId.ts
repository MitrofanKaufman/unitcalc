// path: src/api/v1/functions/getSellerId.ts

/**
 * Извлекает sellerId с карточки товара Wildberries.
 * Ищет ссылку, содержащую "/seller/" и извлекает числовой идентификатор продавца.
 *
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будет записан sellerId
 * @param executionData - Опциональный объект для отслеживания прогресса выполнения
 * @returns {Promise<string|null>} - Найденный sellerId или null в случае ошибки
 */
export async function getSellerId(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: { 
    sellerId?: string;
    [key: string]: any;
  },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<string | null> {
  try {
    // 1) Ждём появления ссылки на продавца
    await page.waitForSelector('a[href*="/seller/"]', { 
      timeout: settings.scrapeTimeout,
      state: 'attached'
    });

    // 2) Ищем ссылку с sellerId
    const href = await page.evaluate((): string | null => {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
      const sellerLink = links.find(a => /\/seller\/\d+/.test(a.getAttribute('href') || ''));
      return sellerLink ? sellerLink.getAttribute('href') : null;
    });n
    // 3) Извлекаем sellerId из URL
    const match = href?.match(/\/seller\/(\d+)/);
    if (!match || !match[1]) {
      throw new Error('Не удалось извлечь ID продавца из ссылки');
    }

    const sellerId = match[1];
    
    // 4) Сохраняем результат
    result.sellerId = sellerId;
    executionData?.markCompleted?.('sellerId');
    
    return sellerId;
  } catch (err: any) {
    const errorMessage = err.message || 'Неизвестная ошибка';
    executionData?.addError?.({
      step: 'seller',
      message: `${messages.getError('sellerNotFound')}: ${errorMessage}`
    });
    return null;
  }
}
