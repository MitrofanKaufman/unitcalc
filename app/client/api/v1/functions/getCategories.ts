// path: src/api/v1/functions/getCategories.ts

/**
 * Интерфейс для данных о категории товара
 */
interface CategoryData {
  category: string | null;
  xsubject: string | null;
  [key: string]: any;
}

/**
 * Получает категории товара и xsubject по id.
 * 
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будут записаны данные о категориях
 * @param executionData - Объект для отслеживания прогресса выполнения
 */
export async function getCategories(
  page: any,
  settings: {
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: CategoryData,
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ожидаем появления элемента категории на странице
    await page.waitForSelector('.product-page__link-category', { 
      timeout: settings.scrapeTimeout,
      state: 'attached'
    });

    // 2) Извлекаем данные о категории
    const categoryData = await extractCategoryData(page);
    
    // 3) Проверяем наличие обязательных данных
    validateCategoryData(categoryData);

    // 4) Сохраняем результаты
    Object.assign(result, categoryData);
    
    // 5) Отмечаем выполнение шагов
    markExecutionCompleted(executionData);
  } catch (err: any) {
    // 6) Обрабатываем ошибки
    handleError(err, executionData, messages);
  }
}

/**
 * Извлекает данные категории и xsubject из страницы.
 * 
 * @param page - Экземпляр страницы Playwright
 * @returns Объект с данными о категории и xsubject
 */
async function extractCategoryData(page: any): Promise<CategoryData> {
  return await page.evaluate((): CategoryData => {
    const categoryElement = document.querySelector<HTMLElement>('.product-page__link-category');
    
    // Извлекаем текст категории
    const category = categoryElement?.textContent?.trim() || null;
    
    // Извлекаем xsubject из атрибута data-link
    const dataLink = categoryElement?.getAttribute('data-link') || '';
    const xsubjectMatch = dataLink.match(/text\{toLower: \((.*?)\)\}/);
    const xsubject = xsubjectMatch?.[1]?.trim() || null;
    
    return { category, xsubject };
  });
}

/**
 * Проверяет наличие обязательных данных о категории.
 * 
 * @param data - Объект с данными о категории
 * @throws {Error} Если отсутствуют обязательные данные
 */
function validateCategoryData(data: CategoryData): void {
  const requiredFields: (keyof CategoryData)[] = ['category', 'xsubject'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Обязательное поле '${field}' не найдено`);
    }
  }
}

/**
 * Отмечает успешное выполнение шагов.
 * 
 * @param executionData - Объект для отслеживания прогресса выполнения
 */
function markExecutionCompleted(
  executionData: {
    markCompleted: (step: string) => void;
  }
): void {
  const steps = ['category', 'xsubject'] as const;
  steps.forEach(step => executionData.markCompleted(step));
}

/**
 * Обрабатывает ошибки при получении категорий.
 * 
 * @param error - Объект ошибки
 * @param executionData - Объект для отслеживания прогресса выполнения
 * @param messages - Объект с локализованными сообщениями об ошибках
 */
function handleError(
  error: Error,
  executionData: {
    addError: (error: { step: string; message: string }) => void;
    markCompleted: (step: string) => void;
  },
  messages: { getError: (key: string) => string }
): void {
  const errorMessage = `${messages.getError('getCategoriesError')}: ${error.message || 'Неизвестная ошибка'}`;
  
  // Логируем ошибку
  console.debug('Ошибка при получении категорий:', errorMessage);
  
  // Добавляем ошибку в лог выполнения
  executionData.addError({ 
    step: 'categories', 
    message: errorMessage 
  });
  
  // Отмечаем шаги как выполненные (даже при ошибке)
  markExecutionCompleted(executionData);
}
