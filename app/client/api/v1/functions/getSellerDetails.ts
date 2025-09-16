// path: src/api/v1/functions/getSellerDetails.ts

interface SellerDetails {
  sales?: number;
  buyoutRate?: number;
  timeOnWB?: string;
  [key: string]: any;
}

/**
 * Извлекает детальную информацию о продавце с карточки товара Wildberries.
 * Собирает данные о количестве продаж, проценте выкупа и времени на площадке.
 *
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будут записаны данные о продавце
 * @param executionData - Объект для отслеживания прогресса выполнения
 */
export async function getSellerDetails(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: SellerDetails,
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ожидаем появления элементов с информацией о продавце
    await page.waitForSelector('.seller-details__parameter-item', { 
      timeout: settings.scrapeTimeout,
      state: 'attached'
    });

    // 2) Извлекаем данные о продавце
    const details = await page.evaluate((): SellerDetails => {
      // Вспомогательные функции для очистки и преобразования значений
      const cleanInt = (str: string): number => {
        const num = parseInt(str.replace(/\D/g, ''), 10);
        return isNaN(num) ? 0 : num;
      };

      const cleanFloat = (str: string): number => {
        const num = parseFloat(str.replace(/[^0-9,]/g, '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
      };

      const output: SellerDetails = {};
      
      // Обрабатываем каждый параметр продавца
      document.querySelectorAll('.seller-details__parameter-item').forEach(item => {
        const nameEl = item.querySelector('.seller-details__parameter-name');
        const valueEl = item.querySelector('.seller-details__parameter-value');
        
        if (!nameEl || !valueEl) return;
        
        const name = nameEl.textContent?.trim().toLowerCase() || '';
        const value = valueEl.textContent?.trim() || '';
        
        if (!name || !value) return;

        // Распределяем значения по соответствующим полям
        if (name.includes('товаров продано')) {
          output.sales = cleanInt(value);
        } else if (name.includes('заказов выкуплено')) {
          output.buyoutRate = cleanFloat(value);
        } else if (name.includes('на wildberries')) {
          output.timeOnWB = value;
        }
      });
      
      return output;
    });

    // 3) Сохраняем результаты
    Object.assign(result, details);
    executionData.markCompleted('sellerDetails');
  } catch (err: any) {
    executionData.addError({ 
      step: 'sellerDetails', 
      message: `${messages.getError('getSellerInfoError')}: ${err.message || 'Неизвестная ошибка'}`
    });
  }
}
