// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\ui\src\components\DataCollection\ProductDataDisplay.tsx
/**
 * path/to/file.ts
 * Описание: Компонент для отображения собранных данных о товаре
 * Логика: Клиентская (React компонент)
 * Зависимости: React, типы данных товара
 * Примечания: Показывает подробную информацию о товаре в удобном формате
 */

import React from 'react';

interface ProductData {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  questions: number;
  image: string;
  description: string;
  parameters: Record<string, string>;
  originalMark: boolean;
  sellerId: string;
  collectedAt?: string;
  sourceUrl?: string;
}

interface ProductDataDisplayProps {
  product: ProductData;
  showActions?: boolean;
  onCollect?: () => void;
  className?: string;
}

export const ProductDataDisplay: React.FC<ProductDataDisplayProps> = ({
  product,
  showActions = true,
  onCollect,
  className = ''
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Заголовок с изображением */}
      <div className="relative">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          {product.originalMark && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Оригинал
            </span>
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex-1 mr-4">
            {product.title}
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>

        {/* Рейтинг и статистика */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviews} отзывов)
            </span>
          </div>

          {product.questions > 0 && (
            <div className="text-sm text-gray-600">
              {product.questions} вопросов
            </div>
          )}
        </div>

        {/* Характеристики */}
        {Object.keys(product.parameters).length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Характеристики:
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(product.parameters).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
              {Object.keys(product.parameters).length > 5 && (
                <div className="text-xs text-gray-500 text-center">
                  И еще {Object.keys(product.parameters).length - 5} характеристик...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Метаданные */}
        <div className="border-t pt-4 mb-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div>ID товара: {product.id}</div>
            <div>Продавец: {product.sellerId}</div>
            {product.collectedAt && (
              <div>Собрано: {formatDate(product.collectedAt)}</div>
            )}
          </div>
        </div>

        {/* Действия */}
        {showActions && onCollect && (
          <div className="flex space-x-3">
            <button
              onClick={onCollect}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Собрать данные заново
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200">
              Экспорт данных
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDataDisplay;
