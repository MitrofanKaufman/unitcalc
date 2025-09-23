import { useState, useEffect, useCallback, useRef } from 'react';
import { WildberriesService } from '../services/wildberries';
import { ProductInfo as Product } from '@/types/product';

const ITEMS_PER_PAGE = 10;

type ProgressData = {
  progress: number;
  status: string;
};

export const useProductSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasMore, setHasMore] = useState(false);
  const [progress, setProgress] = useState<ProgressData>({ 
    progress: 0, 
    status: 'Готово' 
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const products = allProducts.slice(0, page * ITEMS_PER_PAGE);
  
  useEffect(() => {
    setHasMore(allProducts.length > products.length);
  }, [allProducts.length, products.length]);

  const fetchSuggestions = useCallback(async (searchQuery: string = '') => {
    if (typeof searchQuery !== 'string' || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const results = await WildberriesService.fetchSuggestions(searchQuery);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error('Ошибка при получении подсказок:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const updateProgress = useCallback((newProgress: number, status: string) => {
    setProgress({
      progress: Math.min(100, Math.max(0, newProgress)),
      status
    });
  }, []);

  const fetchProducts = useCallback(async (searchQuery: string = '') => {
    if (typeof searchQuery !== 'string' || !searchQuery.trim()) {
      setAllProducts([]);
      updateProgress(0, 'Готово');
      return;
    }

    setLoading(true);
    setError(null);
    updateProgress(0, 'Подготовка к поиску...');

    try {
      // Начало загрузки
      updateProgress(10, 'Начинаем поиск товаров...');
      
      // Запрос данных с прогрессом
      const result = await WildberriesService.fetchProducts(
        searchQuery, 
        (currentStep: number, totalSteps: number) => {
          const progress = Math.round((currentStep / totalSteps) * 80) + 10; // 10-90%
          const statusMessages: Record<number, string> = {
            1: 'Подготовка запроса...',
            3: 'Получение данных с Wildberries...',
            5: 'Обработка ответа...',
            7: 'Формирование списка товаров...',
          };
          
          updateProgress(
            progress, 
            statusMessages[currentStep] || `Загрузка товаров (${currentStep}/${totalSteps})`
          );
        }
      );
      
      // Финализация загрузки
      updateProgress(95, 'Обработка результатов...');
      
      if (!Array.isArray(result)) {
        throw new Error('Некорректный формат данных');
      }
      
      setAllProducts(result);
      setPage(1);
      updateProgress(100, `Найдено ${result.length} товаров`);
      
      // Автоматически скрываем прогресс через 2 секунды
      setTimeout(() => {
        updateProgress(0, 'Готово');
      }, 2000);
      
    } catch (err) {
      console.error('Ошибка при получении товаров:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(`Не удалось загрузить товары: ${errorMessage}`);
      setAllProducts([]);
      updateProgress(0, 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    fetchProducts(suggestion);
  }, [fetchProducts]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  }, [suggestions, highlightedIndex, handleSuggestionSelect]);

  return {
    query,
    setQuery,
    suggestions,
    products,
    loading,
    error,
    hasMore,
    page,
    setPage,
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    progress,
    fetchSuggestions,
    fetchProducts,
    searchInputRef,
    handleSuggestionSelect,
    handleKeyDown,
    loadMore,
  };
};
