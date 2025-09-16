import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';

import { NeuButton as Button } from '@components/theme/ui-neu/neu-button';
import { ProgressBar } from '@components/theme/ui/progress-bar';
import { NeuInput as Input } from '@components/theme/ui-neu/neu-input';
import { ThemeToggle } from '@components/theme/ui-neu/theme-toggle';
import { ProductCard } from '@/pages/search/ProductCard';

import { ThemeManager } from '../../../app/client/utils/themeManager';
import { Debouncer } from '../../../app/client/utils/debounce';

import { useProductSearch } from '@core/hooks/useProductSearch';
import { ProductInfo as Product } from '@core/types/product';


const MAX_ITEMS_PER_ROW = 2;

const CalculatorForm: React.FC = () => {
  const navigate = useNavigate();
  const themeRef = useRef(new ThemeManager(
      typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches
  ));
  const [isDark, setIsDark] = useState(themeRef.current.isDarkMode);
  const suggDebouncer = useRef(new Debouncer());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    suggestions,
    products,
    loading,
    error,
    hasMore,
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    progress,
    handleSuggestionSelect,
    handleKeyDown: handleSuggestionKeyDown,
    fetchSuggestions,
    fetchProducts,
    loadMore
  } = useProductSearch();

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setQuery(value);

    if (value.length > 2) {
      suggDebouncer.current.debounce(() => {
        fetchSuggestions(value); // ✅ передаём аргумент
      }, 300);
    } else {
      setShowSuggestions(false);
    }
  }, [setQuery, fetchSuggestions, setShowSuggestions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    handleSuggestionKeyDown?.(e);
  }, [suggestions, handleSuggestionKeyDown]);

  const handleCardClick = useCallback((product: Product) => {
    const enrichedState = {
      product,
      timestamp: Date.now(),
      source: 'search',
      viewedFrom: window.location.pathname,
    };

    navigate(`/get/${product.id}`, { state: enrichedState });
  }, [navigate]);

  const toggleTheme = () => {
    const newDark = themeRef.current.toggle();
    setIsDark(newDark);
  };

  const observer = useRef<IntersectionObserver>();
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const gridColsClass = `grid-cols-1 ${MAX_ITEMS_PER_ROW > 1 ? 'md:grid-cols-2' : ''}`;

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Назад</span>
            </Button>
            {loading && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
                  <h3 className="text-sm font-medium mb-2">{progress.status}</h3>
                  <ProgressBar progress={progress.progress} />
                </div>
              </div>
            )}
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>

          </div>

          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
                ref={searchInputRef}
                value={searchInput}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Поиск товаров WB"
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="suggestions-list"
                aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
                className="w-full px-4 py-3 text-lg"
                autoFocus
            />

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                      id="suggestions-list"
                      role="listbox"
                      className="absolute z-50 mt-1 w-full rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto py-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                  >
                    {suggestions.map((s, idx) => (
                        <div
                            key={idx}
                            id={`suggestion-${idx}`}
                            role="option"
                            aria-selected={idx === highlightedIndex}
                            className={`px-4 py-2 cursor-pointer text-sm flex items-center ${
                                idx === highlightedIndex ? "bg-blue-100 dark:bg-blue-900/50" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => handleSuggestionSelect(s)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                        >
                          <Search className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{s}</span>
                        </div>
                    ))}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6">
            <>
              {products.length > 0 && (
                  <div className={`grid gap-6 ${gridColsClass}`}>
                    {products.map((product, idx) => (
                        <div
                            key={product.id}
                            ref={idx === products.length - 1 ? lastItemRef : undefined}
                        >
                          <ProductCard
                              product={product}
                              isDark={isDark}
                              onViewDetails={() => handleCardClick(product)}
                              onAnalytics={() => handleCardClick(product)}
                              className="h-full"
                          />
                        </div>
                    ))}
                  </div>
              )}

              {loading && products.length === 0 && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"/>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Загрузка товаров...</span>
                  </div>
              )}

              {error && (
                  <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p>{error}</p>
                  </div>
              )}

              {!loading && !error && products.length === 0 && (
                  <div className="text-center text-gray-500 p-4">
                    <p>По вашему запросу ничего не найдено</p>
                  </div>
              )}

              {loading && products.length > 0 && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"/>
                  </div>
              )}
            </>
          </div>
        </div>
      </div>
  );
};

export default CalculatorForm;
