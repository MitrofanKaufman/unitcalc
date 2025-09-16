// path: src/api/v1/functions/getSellerBasic.ts

/**
 * Извлекает основную информацию о продавце (название и логотип).
 * Ожидает появления элементов с классами .seller-details__title и .seller-details__logo img.
 *
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будет записана информация о продавце
 * @param executionData - Объект для отслеживания прогресса выполнения
 */
export async function getSellerBasic(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: {
    name?: string;
    logo?: string;
    [key: string]: any;
  },
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ждём появления хотя бы одного из элементов (название или логотип)
    await page.waitForSelector(
      '.seller-details__title, .seller-details__logo img', 
      { 
        timeout: settings.scrapeTimeout,
        state: 'attached'
      }
    );

    // 2) Извлекаем данные о продавце
    const sellerData = await page.evaluate((): { name: string; logo: string } => {
      const nameEl = document.querySelector<HTMLElement>('.seller-details__title');
      const logoEl = document.querySelector<HTMLImageElement>('.seller-details__logo img');

      return {
        name: nameEl?.textContent?.trim() || "Неизвестный продавец",
        logo: logoEl?.src || "https://via.placeholder.com/100?text=No+Logo"
      };
    });

    // 3) Сохраняем результаты
    result.name = sellerData.name;
    result.logo = sellerData.logo;
    
    // 4) Отмечаем выполнение шага
    executionData.markCompleted('sellerBasic');
  } catch (err: any) {
    executionData.addError({ 
      step: 'sellerBasic', 
      message: `${messages.getError('getSellerBasicError')}: ${err.message || 'Неизвестная ошибка'}` 
    });
  }
}