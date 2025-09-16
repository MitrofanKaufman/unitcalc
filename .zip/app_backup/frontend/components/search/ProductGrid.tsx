import { motion } from 'framer-motion';
import React from 'react';

import { ProductCard } from '../../../../../app/client/components/search/ProductCard';
import { Product } from '../../../../../app/client/components/search/types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
  isDark: boolean;
  loadMore: () => void;
  hasMore: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  onProductClick,
  isDark,
  loadMore,
  hasMore,
}) => {
  // Add scroll event listener for infinite scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        !loading &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore]);

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Начните поиск, чтобы увидеть товары</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard
              product={product}
              onClick={onProductClick}
              isDark={isDark}
            />
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center p-4 text-gray-500">
          Показаны все товары
        </div>
      )}
    </div>
  );
};
