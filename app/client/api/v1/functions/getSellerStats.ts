// path: src/api/v1/functions/getSellerStats.ts

/**
 * Извлекает статистику продавца (рейтинг и количество отзывов) со страницы Wildberries.
 * 
 * @param page - Экземпляр страницы Playwright
 * @param settings - Настройки скраппинга, включая таймаут
 * @param messages - Объект с локализованными сообщениями об ошибках
 * @param result - Объект результата, куда будут записаны данные о рейтинге и отзывах
 * @param executionData - Объект для отслеживания прогресса выполнения
 */
export async function getSellerStats(
  page: any,
  settings: { 
    scrapeTimeout: number;
    [key: string]: any;
  },
  messages: { getError: (key: string) => string },
  result: {
    rating?: number;
    reviews?: number;
    [key: string]: any;
  },
  executionData: {
    markCompleted: (step: string) => void;
    addError: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    // 1) Ожидаем появления хотя бы одного из элементов (рейтинг или отзывы)
    await page.waitForSelector(
      '.address-rate-mini, .seller-details__review', 
      { 
        timeout: settings.scrapeTimeout,
        state: 'attached'
      }
    );

    // 2) Извлекаем данные о рейтинге и количестве отзывов
    const stats = await page.evaluate((): { rating: number; reviews: number } => {
      // Функция для безопасного извлечения числового значения рейтинга
      const getRating = (): number => {
        const ratingEl = document.querySelector<HTMLElement>('.address-rate-mini');
        if (!ratingEl?.textContent) return 0;
        
        const ratingText = ratingEl.textContent.replace(',', '.');
        const rating = parseFloat(ratingText);
        return isNaN(rating) ? 0 : rating;
      };

      // Функция для безопасного извлечения количества отзывов
      const getReviews = (): number => {
        const reviewsEl = document.querySelector<HTMLElement>('.seller-details__review');
        if (!reviewsEl?.textContent) return 0;
        
        const reviewsText = reviewsEl.textContent.replace(/\D/g, '');
        const reviews = parseInt(reviewsText, 10);
        return isNaN(reviews) ? 0 : reviews;
      };

      return {
        rating: getRating(),
        reviews: getReviews()
      };
    });

    // 3) Сохраняем результаты
    result.rating = stats.rating;
    result.reviews = stats.reviews;
    
    // 4) Отмечаем выполнение шага
    executionData.markCompleted('sellerStats');
  } catch (err: any) {
    executionData.addError({ 
      step: 'sellerStats', 
      message: `${messages.getError('getSellerStatsError')}: ${err.message || 'Неизвестная ошибка'}`
    });
  }
}