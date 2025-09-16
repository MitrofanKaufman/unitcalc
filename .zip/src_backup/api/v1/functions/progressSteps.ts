// path: src/api/v1/functions/progressSteps.js
// Централизованный порядок шагов для ProgressReporter
// Используется и карточкой товара, и продавцом.

export const stepSequence = [
  // ── Product ────────────────────────────────────────────────
  'title',
  'originalMark',
  'price',
  'productParameters',
  'ratingAndReviews',
  'questions',
  'image',

  // ── Seller (обёрнут во внутренний скрапер) ─────────────────
  'seller',          // мета-шаг «начался скрапер продавца»
  'seller.open',
  'seller.basic',
  'seller.stats',
  'seller.sales',
  'seller.details'
];
