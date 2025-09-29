import { useState, useEffect, useCallback } from 'react';
import { Product, AsyncState, SearchProductsDto } from '@/types';
import { apiClient } from '@/services/apiClient';

/**
 * Кастомный хук для работы с товарами через API
 * Реализует взаимодействие с сервером через API клиент
 *
 * @param productId - ID товара для получения (опционально)
 * @returns Состояние загрузки товара и функции управления
 */
export function useProduct(productId?: string) {
  const [productState, setProductState] = useState<AsyncState<Product>>({
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
    setProductState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const product = await apiClient.getProduct(id);

      setProductState({
        data: product,
        loading: false,
        error: null
      });
    } catch (error) {
      setProductState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки товара'
      });
    }
  }, []);

  // Поиск товаров
  const searchProducts = useCallback(
    async (query: string, marketplace?: string, category?: string) => {
      setSearchState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const searchDto: SearchProductsDto = {
          query,
          marketplace,
          category,
          limit: 20,
          offset: 0
        };

        const products = await apiClient.searchProducts(searchDto);

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
    },
    []
  );

  // Загрузка товара при изменении productId
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  // Health check при монтировании
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiClient.healthCheck();
        console.log('✅ API сервер доступен');
      } catch (error) {
        console.warn('⚠️ API сервер недоступен, используется моковый режим');
      }
    };

    checkHealth();
  }, []);

  return {
    // Состояние товара
    product: productState.data,
    productLoading: productState.loading,
    productError: productState.error,
    refetchProduct: () => productId && fetchProduct(productId),

    // Состояние поиска
    searchResults: searchState.data,
    searchLoading: searchState.loading,
    searchError: searchState.error,
    searchProducts
  };
}

/**
 * Хук для получения справочников (маркетплейсы, категории)
 */
export function useReferences() {
  const [marketplaces, setMarketplaces] = useState<AsyncState<any[]>>({
    data: null,
    loading: false,
    error: null
  });

  const [categories, setCategories] = useState<AsyncState<any[]>>({
    data: null,
    loading: false,
    error: null
  });

  // Загрузка маркетплейсов
  const fetchMarketplaces = useCallback(async () => {
    setMarketplaces(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiClient.getMarketplaces();
      setMarketplaces({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      setMarketplaces({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки маркетплейсов'
      });
    }
  }, []);

  // Загрузка категорий
  const fetchCategories = useCallback(async () => {
    setCategories(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiClient.getCategories();
      setCategories({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      setCategories({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки категорий'
      });
    }
  }, []);

  // Загрузка всех справочников при монтировании
  useEffect(() => {
    fetchMarketplaces();
    fetchCategories();
  }, [fetchMarketplaces, fetchCategories]);

  return {
    marketplaces: marketplaces.data || [],
    categories: categories.data || [],
    referencesLoading: marketplaces.loading || categories.loading,
    referencesError: marketplaces.error || categories.error,
    refetchReferences: () => {
      fetchMarketplaces();
      fetchCategories();
    }
  };
}
