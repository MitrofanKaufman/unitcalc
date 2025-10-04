import { useCallback, useEffect, useRef, useState } from 'react';
import { WildberriesService } from '@/services/wildberries';
import type { Product } from '@/types/dto';

const ITEMS_PER_PAGE = 10;

interface UseProductSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: string[];
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  progress: { progress: number; status: string };
  showSuggestions: boolean;
  highlightedIndex: number;
  searchInputRef: React.RefObject<HTMLInputElement>;
  fetchSuggestions: (query: string) => Promise<void>;
  fetchProducts: (query: string) => Promise<void>;
  handleSuggestionSelect: (suggestion: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loadMore: () => void;
  setShowSuggestions: (show: boolean) => void;
}

export const useProductSearch = (): UseProductSearchReturn => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [hasMore, setHasMore] = useState(false);
    const [progress, setProgress] = useState({
        progress: 0,
        status: 'Готово'
    });
    const searchInputRef = useRef<HTMLInputElement>(null!);
    
    const products = allProducts.slice(0, page * ITEMS_PER_PAGE);

    useEffect(() => {
        setHasMore(allProducts.length > products.length);
    }, [allProducts.length, products.length]);

    const updateProgress = useCallback((newProgress: number, status: string) => {
        setProgress({
            progress: Math.min(100, Math.max(0, newProgress)),
            status
        });
    }, []);

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
            updateProgress(10, 'Начинаем поиск товаров...');
            
            const result = await WildberriesService.fetchProducts(searchQuery, (currentStep: number, totalSteps: number) => {
                const progress = Math.round((currentStep / totalSteps) * 80) + 10;
                const statusMessages: Record<number, string> = {
                    1: 'Подготовка запроса...',
                    3: 'Получение данных с Wildberries...',
                    5: 'Обработка ответа...',
                    7: 'Формирование списка товаров...',
                };
                updateProgress(progress, statusMessages[currentStep] || `Загрузка товаров (${currentStep}/${totalSteps})`);
            });

            updateProgress(95, 'Обработка результатов...');
            
            if (!Array.isArray(result)) {
                throw new Error('Некорректный формат данных');
            }
            
            setAllProducts(result);
            setPage(1);
            updateProgress(100, `Найдено ${result.length} товаров`);
            
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
    }, [updateProgress]);

    const loadMore = useCallback((): void => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    const handleSuggestionSelect = useCallback((suggestion: string): void => {
        setQuery(suggestion);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        fetchProducts(suggestion);
    }, [fetchProducts]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
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
        products: allProducts.slice(0, page * ITEMS_PER_PAGE) as Product[],
        loading,
        error,
        hasMore: allProducts.length > page * ITEMS_PER_PAGE,
        progress,
        showSuggestions,
        highlightedIndex,
        searchInputRef,
        fetchSuggestions,
        fetchProducts,
        handleSuggestionSelect,
        handleKeyDown,
        loadMore,
        setShowSuggestions,
    };
}
