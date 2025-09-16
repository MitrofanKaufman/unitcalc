// path: src/types/progress.js
// ──────────────────────────────────────────────────────────────
// Значения шагов прогресс-бара для SmoothWeightedProgressReporter
// ──────────────────────────────────────────────────────────────

/**
 * Стандартные веса для прогресс-бара.
 * @type {{ [key: string]: number }}
 */
export const defaultProgressWeights = {
  pageLoad:          10,
  captchaCheck:      3,
  title:             5,
  price:             3,
  ratingAndReviews:  6,
  questions:         8,
  image:             8,
  productParameters: 15,
  originalMark:      2,
  sellerId:          15,
  sellerInfo:        17,
  saveJson:          3,
  run:               5,
};

/**
 * Проверка корректности весов: сумма должна быть равна 100
 * @param {{ [key: string]: number }} weights
 * @throws {Error} Если сумма весов не равна 100
 */
export function validateWeights(weights) {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const delta = Math.abs(total - 100);
  if (delta > 1e-6) {
    throw new Error(`Сумма весов прогресса должна быть 100, получено: ${total.toFixed(6)}`);
  }
}

