import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import React from 'react';

import { Product } from './types';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onAnalytics?: (product: Product) => void;
  isDark?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onViewDetails,
  onAnalytics,
  isDark = false,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(product);
    } else if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnalytics) {
      onAnalytics(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
        isDark ? "bg-gray-800" : "bg-white"
      } ${className}`}
      onClick={handleClick}
    >
      <div className="relative aspect-square">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder-product.jpg";
          }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.rating !== null && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center">
            ★ {product.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 h-10 overflow-hidden">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div className="font-bold">
            {product.price.toLocaleString("ru-RU")} ₽
          </div>
          {onAnalytics && (
            <button
              onClick={handleAnalyticsClick}
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title="Аналитика товара"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
