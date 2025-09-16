// path: src/api/v1/functions/getOriginalMark.ts

// ──────────────────────────────────────────────────────────────
// Проверка «оригинальности» товара на странице Wildberries
// ──────────────────────────────────────────────────────────────

/**
 * Определяет, присутствует ли на целевой странице товара иконка
 * `.product-page__original-icon.original-mark__icon`.
 * 
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга (не используются в этой функции)
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будет записан флаг оригинальности
 * @param executionData - Объект для отслеживания прогресса выполнения
 * 
 * @returns {Promise<void>} Записывает `true` в `result.originalMark`, если иконка найдена,
 *                          иначе оставляет `false`
 */
export async function getOriginalMark(
  page: any,
  settings: {
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: {
    originalMark?: boolean;
    [key: string]: any;
  },
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  // 1) Устанавливаем значение по умолчанию
  result.originalMark = false;
  
  // 2) CSS-селектор иконки «Оригинальный товар»
  const ORIGINAL_MARK_SELECTOR = '.product-page__original-icon.original-mark__icon';
  
  try {
    // 3) Пытаемся найти иконку с таймаутом 3 секунды
    const handle = await page.waitForSelector(ORIGINAL_MARK_SELECTOR, { 
      timeout: 3000,
      state: 'attached'
    });
    
    // 4) Если элемент найден, устанавливаем флаг в true
    if (handle) {
      result.originalMark = true;
    }
    
    // 5) Помечаем шаг как выполненный
    executionData.markCompleted('originalMark');
  } catch (err: any) {
    // 6) Обрабатываем ошибки (таймаут или отсутствие элемента)
    if (err.name === 'TimeoutError') {
      // Таймаут не является критической ошибкой, логируем отладочную информацию
      console.debug('Таймаут при поиске иконки оригинального товара');
    } else {
      // Другие ошибки логируем, но не прерываем выполнение
      console.debug('Ошибка при проверке оригинальности товара:', err.message);
    }
    
    // 7) В любом случае помечаем шаг как выполненный
    executionData.markCompleted('originalMark');
  }
}
