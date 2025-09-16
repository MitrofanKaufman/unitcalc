// path: src/api/v1/functions/getRatingAndReviews.ts

interface RatingAndReviewsResult {
  rating: number | null;
  reviews: number | null;
}

export async function getRatingAndReviews(
  page: any, 
  settings: { scrapeTimeout: number }, 
  messages: { getError: (key: string) => string }, 
  result: { rating?: number | null; reviews?: number | null },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    await page.waitForSelector(
      '.product-review__rating, .product-review__count-review', 
      { timeout: settings.scrapeTimeout }
    );

    const data = await page.evaluate((): RatingAndReviewsResult => {
      const ratingEl = document.querySelector('.product-review__rating');
      const reviewsEl = document.querySelector('.product-review__count-review');

      const rating = ratingEl ? parseFloat(ratingEl.textContent?.replace(',', '.') || '0') || null : null;
      const reviews = reviewsEl ? parseInt(reviewsEl.textContent?.replace(/\D/g, '') || '0', 10) || null : null;

      return { rating, reviews };
    });

    if (data.rating === null && data.reviews === null) {
      throw new Error('Rating and reviews not found');
    }

    result.rating = data.rating;
    result.reviews = data.reviews;
    executionData?.markCompleted?.('ratingAndReviews');
  } catch (err: any) {
    executionData?.addError?.({
      step: 'ratingAndReviews',
      message: `${messages.getError('getRatingAndReviewsError')} ${err.message}`
    });
  }
}
