import { useState, useEffect, useCallback } from 'react';
import { Product, AsyncState } from '@/types';
import { ProductStorageService } from '@/services/productStorageService';

/**
 * Кастомный хук для работы с локальным хранилищем товаров
 * Реализует алгоритм: локально → сервер → скраппинг
 *
 * @param productId - ID товара для получения
 * @returns Состояние загрузки товара и функции управления
 */
export function useProduct(productId?: string) {
  const [state, setState] = useState<AsyncState<Product>>({
    data: null,
    loading: false,
    error: null
  });

  const [searchState, setSearchState] = useState<AsyncState<Product[]>>({
    data: [],
    loading: false,
    error: null
  });

  // Получение товара по ID
  const fetchProduct = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const product = await ProductStorageService.getProduct(id);

      if (product) {
        setState({
          data: product,
          loading: false,
          error: null
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: 'Товар не найден'
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки товара'
      });
    }
  }, []);

  // Поиск товаров
  const searchProducts = useCallback(async (
    query: string,
    marketplace?: string,
    category?: string
  ) => {
    setSearchState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const products = await ProductStorageService.searchProducts(query, marketplace, category);

      setSearchState({
        data: products,
        loading: false,
        error: null
      });

      return products;
    } catch (error) {
      setSearchState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка поиска товаров'
      });
      return [];
    }
  }, []);

  // Загрузка товара при изменении productId
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  // Очистка кеша при монтировании компонента
  useEffect(() => {
    ProductStorageService.cleanupCache();
  }, []);

  return {
    // Состояние товара
    product: state.data,
    productLoading: state.loading,
    productError: state.error,
    refetchProduct: () => productId && fetchProduct(productId),

    // Состояние поиска
    searchResults: searchState.data,
    searchLoading: searchState.loading,
    searchError: searchState.error,
    searchProducts,

    // Утилиты
    cacheStats: ProductStorageService.getCacheStats(),
    cleanupCache: ProductStorageService.cleanupCache
  };
}

/**
 * Хук для управления состоянием кеша товаров
 */
export function useProductCache() {
  const [cacheStats, setCacheStats] = useState(() =>
    ProductStorageService.getCacheStats()
  );

  const refreshStats = useCallback(() => {
    setCacheStats(ProductStorageService.getCacheStats());
  }, []);

  const cleanupCache = useCallback(() => {
    ProductStorageService.cleanupCache();
    refreshStats();
  }, [refreshStats]);

  return {
    cacheStats,
    refreshStats,
    cleanupCache
  };
}
