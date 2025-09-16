// path: src/api/v1/functions/index.ts
// ──────────────────────────────────────────────────────────────
// Barrel-export: агрегирует все getXXX-функции в одной точке
// ──────────────────────────────────────────────────────────────

// ───── product helpers ─────
export { getTitle }             from './getTitle';
export { getPrice }             from './getPrice';
export { getRatingAndReviews }  from './getRatingAndReviews';
export { getQuestions }         from './getQuestions';
export { getImg }               from './getImg';
export { getProductParameters } from './getProductParameters';
export { getOriginalMark }      from './getOriginalMark';
export { getSellerId }          from './getSellerId';
export { getCategories }        from './getCategories';
export { getPriceHistory }      from './getPriceHistory';
export { getPriceRange }        from './getPriceRange';

// ───── seller helpers ─────
export { getSellerBasic }   from './getSellerBasic';
export { getSellerStats }   from './getSellerStats';
export { getSellerSales }   from './getSellerSales';
export { getSellerDetails } from './getSellerDetails';
