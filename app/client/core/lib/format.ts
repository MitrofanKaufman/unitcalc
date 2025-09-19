/**
 * Форматирование числовых значений
 */

/**
 * Форматирует число в денежный формат с разделителями
 * @param amount - Сумма для форматирования
 * @param currency - Валюта (по умолчанию 'RUB')
 * @returns Отформатированная строка с валютой
 */
export const formatPrice = (
  amount: number, 
  currency: string = 'RUB'
): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currencyDisplay: 'symbol',
  })
  .format(amount)
  .replace(/^[^\d]+/, '') // Удаляем символ валюты, если он есть
  .trim() + ' ₽'; // Добавляем рубли
};

/**
 * Вычисляет процент скидки
 * @param originalPrice - Исходная цена
 * @param discountedPrice - Цена со скидкой
 * @returns Процент скидки (целое число)
 */
export const calculateDiscountPercentage = (
  originalPrice: number, 
  discountedPrice: number
): number => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Форматирует рейтинг в виде звезд (1-5)
 * @param rating - Рейтинг от 0 до 5
 * @param maxStars - Максимальное количество звезд (по умолчанию 5)
 * @returns Массив с элементами для отображения рейтинга
 */
export const formatRating = (
  rating: number, 
  maxStars: number = 5
): { value: number; isFilled: boolean; isHalf: boolean }[] => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return Array.from({ length: maxStars }, (_, index) => ({
    value: index + 1,
    isFilled: index < fullStars,
    isHalf: index === fullStars && hasHalfStar,
  }));
};

/**
 * Форматирует количество отзывов
 * @param count - Количество отзывов
 * @returns Отформатированная строка с количеством отзывов
 */
export const formatReviewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
