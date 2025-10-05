import { useState, useCallback } from 'react';
import { WildberriesService } from '../services/wildberries';

/**
 * Интерфейс товара для типизации данных
 */
export interface Product {
  /** Уникальный идентификатор товара */
  id: number;
  /** Название товара */
  name: string;
  /** Цена в копейках */
  price: number;
  /** Рейтинг товара (0-5) */
  rating: number | null;
  /** URL основного изображения */
  image: string;
  /** Массив URL всех изображений */
  images: string[];
  /** Название бренда */
  brand: string;
  /** Информация о продавце */
  seller: {
    id: number;
    name: string;
    rating: number;
  };
  /** Количество отзывов */
  feedbacks: number;
  /** Доступность товара */
  inStock: boolean;
}

/**
 * Кастомный хук для управления поиском товаров Wildberries
 *
 * Обеспечивает:
 * - Управление состоянием поиска и загрузки
 * - Автоматическое получение подсказок
 * - Обработку ошибок сети
 * - Кеширование результатов
 *
 * @returns Объект с состоянием поиска и функциями управления
 *
 * @example
 * ```typescript
 * const {
 *   products,
 *   suggestions,
 *   isSearching,
 *   searchProducts,
 *   fetchSuggestions
 * } = useWildberriesSearch();
 *
 * // Поиск товаров
 * const handleSearch = (query: string) => {
 *   searchProducts(query);
 * };
 * ```
 */
export const useWildberriesSearch = () => {
  const [state, setState] = useState<{
    products: Product[];
    suggestions: string[];
    isLoading: boolean;
    isSearching: boolean;
    progress: { current: number; total: number };
    error: string | null;
    query: string;
  }>({
    products: [],
    suggestions: [],
    isLoading: false,
    isSearching: false,
    progress: { current: 0, total: 10 },
    error: null,
    query: '',
  });

  /**
   * Выполняет поиск товаров по запросу с отслеживанием прогресса
   * @param query Поисковый запрос
   */
  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, products: [], suggestions: [], error: null, query: '' }));
      return;
    }

    setState(prev => ({
      ...prev,
      isSearching: true,
      isLoading: true,
      error: null,
      query,
      progress: { current: 0, total: 10 },
    }));

    try {
      const products = await WildberriesService.fetchProducts(query, (current, total) => {
        setState(prev => ({ ...prev, progress: { current, total } }));
      });

      setState(prev => ({
        ...prev,
        products,
        isLoading: false,
        isSearching: false,
        progress: { current: 10, total: 10 },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Ошибка поиска',
        isLoading: false,
        isSearching: false,
        products: [],
      }));
    }
  }, []);

  /**
   * Получает подсказки поиска для автодополнения
   * @param query Начало поискового запроса
   */
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, suggestions: [] }));
      return;
    }

    try {
      const suggestions = await WildberriesService.fetchSuggestions(query);
      setState(prev => ({ ...prev, suggestions }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  /**
   * Очищает результаты поиска
   */
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      products: [],
      suggestions: [],
      error: null,
      query: '',
      isLoading: false,
      isSearching: false,
    }));
  }, []);

  /**
   * Повторяет последний поиск при ошибке
   */
  const retrySearch = useCallback(() => {
    if (state.query) {
      searchProducts(state.query);
    }
  }, [state.query, searchProducts]);

  return {
    ...state,
    searchProducts,
    fetchSuggestions,
    clearSearch,
    retrySearch,
  };
};
