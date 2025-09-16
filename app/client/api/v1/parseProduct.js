import { scrapeProductById } from './product.js';

/**
 * Обёртка, вызывающая парсинг товара по ID.
 * @param {string} productId
 * @param {function|undefined} onStatus - callback для статуса
 * @param {string|null} userId
 * @returns {Promise<object>} - результат парсинга
 */
export default function parseProduct(productId, onStatus = () => {}, userId = null) {
  return scrapeProductById(productId, onStatus, userId);
}
