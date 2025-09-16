// path: src/api/v1/functions/getTitle.ts

/**
 * Извлекает заголовок товара со страницы.
 * Ищет элемент <h1> и возвращает его текстовое содержимое.
 *
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будет записан заголовок
 * @param executionData - Опциональный объект для отслеживания прогресса выполнения
 */
export async function getTitle(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: { 
    title?: string | null;
    [key: string]: any;
  },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ждём появления заголовка
    await page.waitForSelector('h1', { 
      timeout: settings.scrapeTimeout,
      state: 'attached' // Убедимся, что элемент прикреплён к DOM
    });

    // 2) Извлекаем текст заголовка
    const title = await page.evaluate((): string | null => {
      const titleElement = document.querySelector('h1');
      return titleElement?.textContent?.trim() || null;
    });

    // 3) Проверяем, что заголовок найден
    if (!title) {
      throw new Error('Не удалось найти заголовок товара');
    }

    // 4) Сохраняем результат
    result.title = title;
    executionData?.markCompleted?.('title');
  } catch (err: any) {
    executionData?.addError?.({
      step: 'title',
      message: `${messages.getError('getTitleError')}: ${err.message}`
    });
  }
}
