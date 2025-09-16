// path: src/api/v1/functions/getImg.ts

if (import.meta.url === `file://${process.argv[1]}`) {
  throw new Error('Этот модуль предназначен только для импорта и не может быть запущен напрямую');
}

/**
 * Извлекает URL основного изображения продукта:
 * 1) ждёт первый слайд в слайдере и получает src;
 * 2) проверяет, что URL содержит ID товара (result.id);
 * 3) если нет — считает ссылку невалидной.
 *
 * @param page - Экземпляр Playwright-страницы
 * @param settings - Настройки скраппинга (таймауты и т.п.)
 * @param messages - Класс для локализованных сообщений об ошибках
 * @param result - Объект результата, куда запишем поле `image`
 * @param executionData - Объект для сбора статусов шагов и ошибок
 */
export async function getImg(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: { 
    id: string | number;
    image?: string | null;
    [key: string]: any;
  },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ждём первый слайд в слайдере продукта
    await page.waitForSelector('.swiper-wrapper .swiper-slide img', {
      timeout: settings.scrapeTimeout
    });

    // 2) Получаем src изображения
    const imgSrc = await page.$eval<string | null>(
      '.swiper-wrapper .swiper-slide img',
      (img: HTMLImageElement) => img.getAttribute('src')
    );

    // 3) Проверяем, что в URL содержится ID товара
    const productId = String(result.id);
    if (!imgSrc || !imgSrc.includes(productId)) {
      throw new Error(`URL изображения не содержит ID товара (${productId})`);
    }

    // 4) Записываем валидный URL
    result.image = imgSrc;
    executionData?.markCompleted?.('image');
  } catch (err: any) {
    executionData?.addError?.({
      step: 'image',
      message: `${messages.getError('getImgError')} ${err.message}`
    });
  }
}
