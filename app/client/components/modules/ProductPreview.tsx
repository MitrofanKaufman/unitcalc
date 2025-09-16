// path: src/components/modules/ProductPreview.tsx
import React from "react";

interface ProductPreviewProps {
  results: {
    product: {
      id: string;
      name: string;
      price: number;
      rating?: number;
    };
    seller: {
      id: string;
      name: string;
      rating?: number;
    };
  };
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ results }) => {
  const { product, seller } = results;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mt-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">🛒 Товар</h2>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Название:</strong> {product.name}</p>
        <p><strong>Цена:</strong> {product.price} ₽</p>
        {product.rating && <p><strong>Рейтинг:</strong> {product.rating} ⭐</p>}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">🏪 Продавец</h2>
        <p><strong>ID:</strong> {seller.id}</p>
        <p><strong>Имя:</strong> {seller.name}</p>
        {seller.rating && <p><strong>Рейтинг:</strong> {seller.rating} ⭐</p>}
      </div>
    </div>
  );
};

export default ProductPreview;
