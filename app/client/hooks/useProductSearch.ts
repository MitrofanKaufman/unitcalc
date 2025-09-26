/**
 * Хук для поиска товаров через прямую интеграцию с Wildberries API
 * Простая и быстрая реализация без локального API
 */

import { useState, useCallback, useMemo } from 'react';

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
  suggestions: string[]; // Отдельный массив для подсказок
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  showSuggestions: boolean;
  hasMore: boolean;
  progress: {
    status: string;
    progress: number;
  };
}

/**
 * Обработка ошибок загрузки изображений с fallback логикой
 */
export function handleImageError(product: ProductSearchResult): ProductSearchResult {
  return {
    ...product,
    image: undefined, // Убираем изображение при ошибке загрузки
  };
}

/**
 * Проверка на наличие конфликтов с браузерными расширениями
 */
function detectBrowserExtensionConflicts(): boolean {
  // Проверяем, есть ли признаки вмешательства расширений
  const hasMessageChannelErrors = window.console &&
    (console as any)._originalError &&
    (console as any)._originalError.some((error: any) =>
      error.includes('message channel closed')
    );

  // Проверяем, не заблокирован ли доступ к fetch
  let fetchBlocked = false;
  try {
    // Простая проверка доступности fetch
    if (typeof fetch === 'undefined') {
      fetchBlocked = true;
    }
  } catch {
    fetchBlocked = true;
  }

  return hasMessageChannelErrors || fetchBlocked;
}

/**
 * Безопасная обертка для fetch с обработкой конфликтов расширений
 */
async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Проверяем на наличие конфликтов расширений
      if (detectBrowserExtensionConflicts()) {
        console.warn('Обнаружены конфликты с браузерными расширениями, делаем дополнительную паузу...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown fetch error');

      // Если это ошибка расширения, делаем более длинную паузу
      if (lastError.message.includes('message channel') ||
          lastError.message.includes('extension') ||
          lastError.name === 'AbortError') {

        if (attempt < maxRetries) {
          console.warn(`Попытка ${attempt} не удалась из-за конфликта расширений, ждем...`);
          await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
          continue;
        }
      }

      // Для других ошибок прерываем попытки
      break;
    }
  }

  throw lastError || new Error('Не удалось выполнить запрос');
}

/**
 * Прямой запрос к Wildberries API для подсказок с улучшенной обработкой ошибок
 */
async function fetchWBSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const url = `https://suggests.wb.ru/suggests/api/v7/hint?ab_testing=false&query=${encodeURIComponent(query)}&gender=common&locale=kz&lang=ru&appType=1`;

      // Используем безопасную обертку для fetch
      const response = await safeFetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`WB Suggestions API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data.suggests)
        ? data.suggests.map((s: any) => s.name)
        : [];
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Если это последняя попытка или ошибка сети, не повторяем
      if (attempt === maxRetries || lastError.name === 'AbortError' || lastError.message.includes('fetch')) {
        break;
      }

      // Ждем перед следующей попыткой
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }
  }

  console.error('Error fetching WB suggestions after all retries:', lastError);
  return []; // Возвращаем пустой массив вместо ошибки для подсказок
}

/**
 * Прямой запрос к Wildberries API для товаров с улучшенной обработкой ошибок
 */
async function fetchWBProducts(query: string): Promise<ProductSearchResult[]> {
  if (!query.trim()) return [];

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const base = "https://search.wb.ru/exactmatch/sng/common/v14/search";
      const params = new URLSearchParams({
        appType: "1",
        curr: "rub",
        dest: "233",
        hide_dtype: "13;14",
        lang: "ru",
        page: "1",
        query,
        q1: query,
        resultset: "catalog",
        sort: "popular",
        spp: "30",
        suppressSpellcheck: "false",
      });

      // Используем безопасную обертку для fetch
      const response = await safeFetch(`${base}?${params.toString()}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        }
      });

      if (!response.ok) {
        throw new Error(`WB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawProducts = Array.isArray(data.data?.products)
        ? data.data.products
        : Array.isArray(data.products)
          ? data.products
          : [];

      return rawProducts.map((p: any) => ({
        id: p.id,
        title: p.name,
        price: p.sizes?.[0]?.price?.product || 0,
        image: p.pics > 0 ? `https://basket-${p.id.toString().slice(0, 3)}.wb.ru/vol${p.id.toString().slice(0, 4)}/part${p.id.toString().slice(0, 6)}/${p.id}/images/c516x688/1.webp` : undefined,
        rating: p.reviewRating || 0,
        reviewCount: p.feedbacks || 0,
        brand: p.brand || 'Неизвестно',
      }));
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Если это последняя попытка или ошибка сети, не повторяем
      if (attempt === maxRetries || lastError.name === 'AbortError' || lastError.message.includes('fetch')) {
        break;
      }

      // Ждем перед следующей попыткой (экспоненциальная задержка)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  console.error('Error fetching WB products after all retries:', lastError);
  throw lastError || new Error('Не удалось получить данные о товарах');
}

/**
 * Хук для поиска товаров через прямую интеграцию с Wildberries
 */
export function useProductSearch(initialQuery = '') {
  const [searchState, setSearchState] = useState<SearchState>({
    query: initialQuery,
    results: [],
    suggestions: [], // Отдельный массив для подсказок
    isLoading: false,
    error: null,
    hasSearched: false,
    showSuggestions: false,
    hasMore: false,
    progress: {
      status: '',
      progress: 0,
    },
  });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
   * Установка видимости подсказок
   */
  const setShowSuggestions = useCallback((show: boolean) => {
    setSearchState(prev => ({
      ...prev,
      showSuggestions: show,
    }));
  }, []);

  /**
   * Получение подсказок от Wildberries
   */
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState(prev => ({
        ...prev,
        suggestions: [],
        results: [],
        error: null,
        hasSearched: false,
        showSuggestions: false
      }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      showSuggestions: true
    }));

    try {
      const suggestions = await fetchWBSuggestions(query);

      setSearchState(prev => ({
        ...prev,
        suggestions: suggestions, // Заполняем отдельный массив suggestions
        results: [], // Очищаем results, так как это подсказки, а не товары
        isLoading: false,
        hasSearched: true,
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        suggestions: [],
        results: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка поиска',
        hasSearched: true,
        showSuggestions: false,
      }));
    }
  }, []);

  /**
   * Выполнение поиска товаров
   */
  const performSearch = useCallback(async () => {
    if (!searchState.query.trim()) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        suggestions: [],
        error: null,
        hasSearched: false,
        showSuggestions: false,
      }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      showSuggestions: false, // Скрываем подсказки при поиске товаров
    }));

    try {
      const products = await fetchWBProducts(searchState.query);

      setSearchState(prev => ({
        ...prev,
        results: products,
        suggestions: [], // Очищаем подсказки при показе товаров
        isLoading: false,
        hasSearched: true,
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        suggestions: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка поиска товаров',
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
      suggestions: [],
      isLoading: false,
      error: null,
      hasSearched: false,
      showSuggestions: false,
      hasMore: false,
      progress: {
        status: '',
        progress: 0,
      },
    });
    setHighlightedIndex(-1);
  }, []);

  /**
   * Выбор подсказки из результатов
   */
  const handleSuggestionSelect = useCallback((suggestionText: string) => {
    setSearchState(prev => ({
      ...prev,
      query: suggestionText,
      suggestions: [], // Очищаем подсказки после выбора
      results: [],
      hasSearched: true,
      showSuggestions: false,
    }));
    setHighlightedIndex(-1);
  }, []);

  /**
   * Выбор товара из результатов
   */
  const selectProduct = useCallback((product: ProductSearchResult) => {
    setSearchState(prev => ({
      ...prev,
      query: product.title,
      results: [product],
      suggestions: [], // Очищаем подсказки при выборе товара
      hasSearched: true,
      showSuggestions: false,
    }));
    setHighlightedIndex(-1);
  }, []);

  /**
   * Загрузка дополнительных товаров (пагинация)
   */
  const loadMore = useCallback(async () => {
    if (!searchState.query.trim() || searchState.isLoading) return;

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      progress: {
        status: 'Загрузка дополнительных товаров...',
        progress: 50,
      },
    }));

    try {
      const products = await fetchWBProducts(searchState.query);

      setSearchState(prev => ({
        ...prev,
        results: [...prev.results, ...products],
        isLoading: false,
        hasMore: products.length >= 30, // Предполагаем, что если вернулось 30 товаров, есть еще
        progress: {
          status: '',
          progress: 0,
        },
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки товаров',
        progress: {
          status: '',
          progress: 0,
        },
      }));
    }
  }, [searchState.query, searchState.isLoading]);

  /**
   * Обработчик клавиш для навигации по подсказкам
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!searchState.showSuggestions || !searchState.results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < searchState.results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && searchState.results[highlightedIndex]) {
          selectProduct(searchState.results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [searchState.showSuggestions, searchState.results, highlightedIndex, selectProduct, setShowSuggestions]);

  // Мемоизированные значения для оптимизации
  const hasResults = useMemo(() => searchState.results.length > 0, [searchState.results]);
  const hasError = useMemo(() => searchState.error !== null, [searchState.error]);
  const isLoading = useMemo(() => searchState.isLoading, [searchState.isLoading]);

  return {
    // Состояние
    query: searchState.query,
    products: searchState.results,
    suggestions: searchState.suggestions, // Теперь это отдельный массив строк
    isLoading,
    error: searchState.error,
    hasSearched: searchState.hasSearched,
    hasResults,
    showSuggestions: searchState.showSuggestions,
    highlightedIndex,
    hasMore: searchState.hasMore,
    progress: searchState.progress,

    // Действия
    updateQuery,
    setShowSuggestions,
    setHighlightedIndex,
    fetchSuggestions,
    performSearch,
    clearSearch,
    selectProduct,
    handleSuggestionSelect,
    loadMore,
    handleKeyDown,
  };
}
