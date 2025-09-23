/**
 * Хук для поиска товаров через API
 * Предоставляет функциональность поиска, автодополнения и управления состоянием
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// Типы для поиска товаров
export interface ProductSearchResult {
  id: string;
  title: string;
  price: number;
  image?: string;
  rating: number;
  reviewCount: number;
  brand?: string;
}

export interface SearchState {
  query: string;
  results: ProductSearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

// Интерфейс для параметров поиска
export interface ProductSearchOptions {
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
  sortBy?: 'relevance' | 'price' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

/**
 * API функция для поиска товаров
 */
async function searchProducts(
  query: string,
  options: ProductSearchOptions = {}
): Promise<ProductSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      limit: (options.limit || 10).toString(),
      ...Object.fromEntries(
        Object.entries(options).filter(([_, value]) => value !== undefined)
      )
    });

    const response = await fetch(`/api/v1/products/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Хук для поиска товаров
 */
export function useProductSearch(initialQuery = '') {
  const [searchState, setSearchState] = useState<SearchState>({
    query: initialQuery,
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  // Используем React Query для кеширования результатов поиска
  const {
    data: searchResults = [],
    isLoading: isQueryLoading,
    error: queryError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ['productSearch', searchState.query],
    queryFn: () => searchProducts(searchState.query),
    enabled: false, // Не выполнять запрос автоматически
    staleTime: 5 * 60 * 1000, // 5 минут
    cacheTime: 10 * 60 * 1000, // 10 минут
  });

  /**
   * Обновление поискового запроса
   */
  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query: query.trim(),
      error: null,
    }));
  }, []);

  /**
   * Выполнение поиска
   */
  const performSearch = useCallback(async (options?: ProductSearchOptions) => {
    if (!searchState.query.trim()) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        error: null,
        hasSearched: false,
      }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const results = await searchProducts(searchState.query, options);

      setSearchState(prev => ({
        ...prev,
        results,
        isLoading: false,
        hasSearched: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при поиске товаров';

      setSearchState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: errorMessage,
        hasSearched: true,
      }));
    }
  }, [searchState.query]);

  /**
   * Очистка результатов поиска
   */
  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false,
    });
  }, []);

  /**
   * Выбор товара из результатов
   */
  const selectProduct = useCallback((product: ProductSearchResult) => {
    setSearchState(prev => ({
      ...prev,
      query: product.title,
      results: [product],
      hasSearched: true,
    }));
  }, []);

  // Мемоизированные значения для оптимизации
  const hasResults = useMemo(() => searchState.results.length > 0, [searchState.results]);
  const hasError = useMemo(() => searchState.error !== null, [searchState.error]);
  const isLoading = useMemo(() => searchState.isLoading || isQueryLoading, [searchState.isLoading, isQueryLoading]);

  return {
    // Состояние
    query: searchState.query,
    results: searchState.results,
    isLoading,
    error: searchState.error || (queryError?.message ? 'Ошибка поиска' : null),
    hasSearched: searchState.hasSearched,
    hasResults,

    // Действия
    updateQuery,
    performSearch,
    clearSearch,
    selectProduct,
    refetchSearch,
  };
}
