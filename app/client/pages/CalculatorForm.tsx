// External dependencies
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// UI Components
import ProductCard from '@/components/ProductCard';
import { Progress } from '@/components/ui/progress';
import { Button as NeuButton } from '@/components/ui/neu-button';
import { NeuInput as Input } from '@/components/ui/neu-input';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Hooks
import { useProductSearch } from '@/hooks/useProductSearch';

// Utils
import { Debouncer } from '@/core/utils/debounce';
import { ThemeManager } from '@/core/utils/themeManager';

// Types
import { ProductInfo as Product } from '@/core/types/product';

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
    updateQuery,
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
    performSearch,
    loadMore
  } = useProductSearch();

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    updateQuery(value);

    if (value.length > 2) {
      suggDebouncer.current.debounce(() => {
        performSearch(); // ✅ вызываем performSearch без аргумента
      }, 300);
    } else {
      setShowSuggestions(false);
    }
  }, [updateQuery, fetchSuggestions, setShowSuggestions, performSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || !suggestions.length) return;
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <NeuButton variant="ghost" onClick={() => navigate(-1)} className="neu-button flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Назад</span>
            </NeuButton>
            {loading && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
                <div className="neu-card p-4">
                  <h3 className="text-sm font-medium mb-2">{progress.status}</h3>
                  <Progress value={progress.progress} />
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
                className="neu-input w-full px-4 py-3 text-lg"
            />

            <AnimatePresence mode="wait">
              {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                      id="suggestions-list"
                      role="listbox"
                      className="suggestions-container motion-div suggestions-list absolute z-50 mt-1 w-full bg-background rounded-xl shadow-lg border border-border max-h-60 overflow-y-auto py-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                  >
                    {suggestions.map((suggestionText, idx) => (
                        <motion.div
                            key={`suggestion-${suggestionText}-${idx}`}
                            id={`suggestion-${idx}`}
                            role="option"
                            tabIndex={0}
                            aria-selected={idx === highlightedIndex}
                            className="suggestion-item motion-div px-4 py-2 cursor-pointer text-sm flex items-center rounded-lg mx-2 my-1"
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={{ x: 4 }}
                        >
                          <Search className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{suggestionText}</span>
                        </motion.div>
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
                              className="neu-card h-full"
                          />
                        </div>
                    ))}
                  </div>
              )}
            </>
          </div>
        </div>
      </div>
  );
};

export default CalculatorForm;
