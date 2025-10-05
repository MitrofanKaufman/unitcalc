/**
 * Сервис для генерации URL изображений товаров Wildberries
 *
 * Генерирует правильные URL для изображений товаров WB
 * на основе ID товара в соответствии с их системой именования файлов
 *
 * @param productId - ID товара Wildberries
 * @returns URL изображения товара в формате WebP
 *
 * @example
 * ```typescript
 * const imageUrl = generateImageUrl(12345678);
 * // "https://basket-01.wb.ru/vol1/part1/12/12345678/images/c516x688/1.webp"
 * ```
 */
export const generateImageUrl = (productId: number): string => {
  const idStr = productId.toString();

  // Wildberries использует специфическую структуру URL для изображений
  // Формат: https://basket-{prefix}.wb.ru/vol{vol}/part{part}/{id}/images/c516x688/1.webp
  // Где:
  // - prefix: первые 3 цифры ID (для распределения нагрузки)
  // - vol: первые 4 цифры ID (том)
  // - part: первые 6 цифр ID (раздел)

  const prefix = idStr.slice(0, 3); // первые 3 цифры
  const vol = idStr.slice(0, 4);    // первые 4 цифры
  const part = idStr.slice(0, 6);   // первые 6 цифр

  return `https://basket-${prefix}.wb.ru/vol${vol}/part${part}/${productId}/images/c516x688/1.webp`;
};
