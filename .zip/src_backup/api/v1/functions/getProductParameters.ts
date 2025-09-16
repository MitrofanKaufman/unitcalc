// path: src/api/v1/functions/getProductParameters.ts

interface ProductParameters {
  [key: string]: string | undefined;
}

export async function getProductParameters(
  page: any,
  settings: { scrapeTimeout: number; [key: string]: any },
  messages: { getError: (key: string) => string },
  result: {
    description?: string;
    productParameters?: ProductParameters;
    [key: string]: any;
  },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Открываем попап с параметрами товара
    await page.waitForSelector('button.j-details-btn-desktop', { 
      timeout: settings.scrapeTimeout 
    });
    await page.click('button.j-details-btn-desktop');
    await page.waitForSelector('.popup-product-details.shown', { 
      timeout: settings.scrapeTimeout 
    });

    // 2) Собираем параметры товара из таблицы
    const params = await page.$$eval(
      '.popup-product-details.shown .product-params__table tbody tr',
      (rows: Element[]): ProductParameters => {
        const obj: ProductParameters = {};
        rows.forEach(row => {
          const key = row.querySelector('.product-params__cell-decor span')?.textContent?.trim();
          const val = row.querySelector('td span')?.textContent?.trim();
          if (key) obj[key] = val;
        });
        return obj;
      }
    );

    // 3) Пытаемся получить описание товара
    let description: string | null = null;
    try {
      description = await page.evaluate((): string | null => {
        const selector = 'body > div.popup.popup-product-details.shown > div > div.product-details > section > p';
        return document.querySelector(selector)?.textContent?.trim() || null;
      });
    } catch (err) {
      // Игнорируем ошибки при получении описания
      console.debug('Не удалось получить описание товара:', err);
    }

    // 4) Сохраняем результаты
    if (description) {
      result.description = description;
    }
    result.productParameters = params;
    executionData?.markCompleted?.('parameters');
  } catch (err: any) {
    executionData?.addError?.({
      step: 'parameters',
      message: `${messages.getError('getProductParametersError')} ${err.message}`
    });
  } finally {
    // 5) Закрываем попап, если он открыт
    try {
      const closeBtn = await page.$('.popup-product-details.shown .popup__close');
      if (closeBtn) {
        await closeBtn.click().catch((e: Error) => {
          console.debug('Ошибка при закрытии попапа:', e.message);
        });
      }
    } catch (err) {
      // Игнорируем ошибки при закрытии попапа
      console.debug('Не удалось закрыть попап с параметрами:', err);
    }
  }
}
