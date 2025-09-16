// src/core/services/generateImageUrl.ts

/**
 * Логика:
 * Формирует URL к изображению товара Wildberries на основе его ID.
 * Используется стандартное разрешение c516x688 и картинка №1.
 */

export function generateImageUrl(productId: number): string {
  if (typeof productId !== 'number' || isNaN(productId)) {
    throw new Error('Некорректный productId. Ожидается число.');
  }

  const idStr = productId.toString().padStart(9, '0');
  const host = `https://alm-basket-cdn-02.geobasket.ru`;
  const path = `/vol${idStr.slice(0, 4)}/part${idStr.slice(0, 6)}/${idStr}/images/c516x688/1.webp`;

  return `${host}${path}`;
}
