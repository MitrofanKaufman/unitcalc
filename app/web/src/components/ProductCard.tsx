import React from 'react';
import { Product } from '../hooks/useWildberriesSearch';

/**
 * Проперти компонента карточки товара
 */
export interface ProductCardProps {
  /** Объект товара с полной информацией */
  product: Product;
}

/**
 * Компонент карточки товара для отображения в результатах поиска
 *
 * Отображает информацию о товаре включая изображение, название, бренд,
 * цену, рейтинг и доступность. Предоставляет кнопки действий для расчета
 * доходности и добавления в избранное.
 *
 * @param props - проперти компонента карточки товара
 * @param props.product - объект товара с полной информацией
 * @returns JSX элемент карточки товара
 *
 * @example
 * ```tsx
 * const product = {
 *   id: 123,
 *   name: 'Смартфон Samsung Galaxy',
 *   price: 25000,
 *   rating: 4.5,
 *   image: 'https://example.com/image.jpg',
 *   images: ['https://example.com/image1.jpg'],
 *   brand: 'Samsung',
 *   seller: { id: 1, name: 'Магазин', rating: 4.8 },
 *   feedbacks: 150,
 *   inStock: true
 * };
 *
 * <ProductCard product={product} />
 * ```
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  /**
   * Форматирует цену в рублях с правильным форматированием
   * @param price - цена в копейках
   * @returns Отформатированная строка цены в рублях
   * @example
   * ```tsx
   * formatPrice(25000) // "25 000 ₽"
   * ```
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  /**
   * Отображает звездочки рейтинга товара
   * @param rating - рейтинг товара (0-5)
   * @returns JSX элемент с звездочками рейтинга или null если рейтинга нет
   */
  const renderStars = (rating: number | null) => {
    if (!rating) return null;

    return (
      <div className="product-rating">
        <span className="rating-text">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.inStock ? (
          <div className="stock-badge in-stock">✓ В наличии</div>
        ) : (
          <div className="stock-badge out-of-stock">✗ Нет в наличии</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-brand">{product.brand}</span>
          {renderStars(product.rating)}
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price">{formatPrice(product.price)}</span>
          </div>

          <div className="product-actions">
            <button className="action-btn primary">
              💰 Рассчитать доходность
            </button>
            <button className="action-btn secondary">
              ➕ В избранное
            </button>
          </div>
        </div>

        {product.feedbacks > 0 && (
          <div className="product-feedbacks">
            💬 {product.feedbacks} отзывов
          </div>
        )}
      </div>
    </div>
  );
};
