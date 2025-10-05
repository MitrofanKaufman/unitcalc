import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { TextField, Button } from '@mui/material';
import { Search, X, Loader2, Check, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './WbSearch.module.css';
import FeaturesLayout from '../FeaturesLayout';

// Mock data generation for development (commented out for now)
/*
const generateMockProducts = (count: number) => {
  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Sony', 'Lenovo', 'Asus', 'HP'];
  const adjectives = ['Новый', 'Стильный', 'Мощный', 'Компактный', 'Профессиональный', 'Игровой'];
  const nouns = ['смартфон', 'ноутбук', 'планшет', 'наушники', 'часы', 'монитор'];
  
  return Array.from({ length: count }, (_, i) => {
    const hasSale = Math.random() > 0.5;
    const price = Math.floor(Math.random() * 100000) + 5000;
    const salePrice = hasSale ? Math.floor(price * (0.7 + Math.random() * 0.2)) : undefined;
    const rating = Number((3 + Math.random() * 2).toFixed(1));
    const feedbacks = Math.floor(Math.random() * 1000);
    const inStock = Math.random() > 0.2;
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${brand} ${nouns[Math.floor(Math.random() * nouns.length)]} ${Math.floor(Math.random() * 10) + 1}`;
    
    return {
      id: 1000000 + i,
      name,
      brand,
      price,
      salePrice,
      rating,
      feedbacks,
      inStock,
      image: `https://picsum.photos/seed/${Date.now() + i}/400/400`,
      url: `https://www.wildberries.ru/catalog/${1000000 + i}/detail.aspx`
    };
  });
};
*/


interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
  rating: number;
  feedbacks: number;
  inStock: boolean;
  image?: string;
  url?: string;
}

interface SearchSuggestion {
  name: string;
  id: number;
  brand?: string;
}

export function WbSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  }, []);

  /**
   * Handles click outside of search input and dropdown by closing the dropdown.
   * This is done by adding a global event listener for 'mousedown' events and removing it when the component is unmounted.
   */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Handle search input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        // Mock suggestions for development
        const mockSuggestions: SearchSuggestion[] = [
          { id: 1, name: query, brand: 'товар' },
          { id: 2, name: `${query} бренд`, brand: 'бренд' },
          { id: 3, name: `${query} каталог`, brand: 'каталог' },
        ];
        setSuggestions(mockSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle search submission
  const searchProducts = async (searchTerm: string = query) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    setShowSuggestions(false);

    try {
      // TODO: Replace with actual API call to your backend
      // const response = await fetch(`/api/wb/search?query=${encodeURIComponent(searchTerm)}`);
      // const data = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data for demonstration
      const mockData: Product[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `${searchTerm} ${i + 1}${i % 3 === 0 ? ' (Акция!)' : ''}`,
        brand: `Бренд ${String.fromCharCode(65 + (i % 5))}`,
        price: Math.floor(Math.random() * 10000) + 1000,
        salePrice: i % 3 === 0 ? Math.floor(Math.random() * 8000) + 500 : undefined,
        rating: +(Math.random() * 5).toFixed(1),
        feedbacks: Math.floor(Math.random() * 5000),
        inStock: Math.random() > 0.2,
        image: `https://picsum.photos/200/200?random=${i}`,
        url: `https://www.wildberries.ru/catalog/${i}/detail.aspx`
      }));

      setResults(mockData);
    } catch (err) {
      console.error('Ошибка при поиске товаров:', err);
      setError('Произошла ошибка при поиске товаров');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setSelectedSuggestion(suggestion.id);
    searchProducts(suggestion.name);
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion !== null) {
        const selected = suggestions[selectedSuggestion];
        setQuery(selected.name);
        searchProducts(selected.name);
      } else {
        searchProducts();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev =>
        prev === null || prev === suggestions.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev =>
        prev === null || prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSelectedSuggestion(null);
    inputRef.current?.focus();
  };

  // Filter and sort results based on query
  const displayResults = useMemo(() => {
    return results.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
    );
  }, [results, query]);

  // Handle sort selection - implemented but not used in current UI
  // Uncomment and use this function when implementing sorting UI
  /*
  const handleSort = (sortBy: 'price-asc' | 'price-desc' | 'rating') => {
    setResults(prevResults => {
      const sorted = [...prevResults];
      switch (sortBy) {
        case 'price-asc':
          sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case 'price-desc':
          sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case 'rating':
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
      return sorted;
    });
  };
  */

  return (
    <FeaturesLayout title="Поиск товаров" subtitle="Найдите товары на Wildberries">
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <Search className="h-6 w-6 mr-2 text-white" />
                <span className="text-xl font-bold">Поиск товаров на Wildberries</span>
              </div>
              <div className="text-sm text-blue-100">
                {displayResults.length > 0 && `Найдено: ${displayResults.length} товаров`}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="relative" ref={dropdownRef}>
                <div className="relative flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="relative">
                      <TextField
                        inputRef={inputRef}
                        type="text"
                        placeholder="Например: платье, смартфон, наушники..."
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full pl-12 pr-12 h-14 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-200 rounded-xl shadow-sm"
                        aria-label="Поиск товаров на Wildberries"
                        aria-expanded={showSuggestions && suggestions.length > 0}
                        aria-haspopup="listbox"
                        aria-controls="search-suggestions"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      {query && (
                        <Button
                          type="button"
                          variant="text"
                          size="small"
                          className="h-10 w-10 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          onClick={clearSearch}
                          title="Очистить поиск"
                          aria-label="Очистить поиск"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      )}
                    </div>

                    {/* Search suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        id="search-suggestions"
                        role="listbox"
                        aria-label="Предложения поиска"
                        className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto ${styles.suggestionsScrollbar}`}
                      >
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={`${suggestion.id}-${index}`}
                              role="option"
                              className={cn(
                                'px-4 py-2.5 cursor-pointer flex items-center justify-between',
                                'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                                selectedSuggestion === index && 'bg-blue-50 dark:bg-gray-700',
                                'transition-colors duration-150'
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(suggestion);
                              }}
                              onMouseEnter={() => setSelectedSuggestion(index)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSuggestionClick(suggestion);
                                }
                              }}
                              tabIndex={0}
                            >
                              <div className="flex items-center min-w-0">
                                {suggestion.brand?.includes('каталог') ? (
                                  <Search className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                                ) : suggestion.brand?.includes('бренд') ? (
                                  <span className="h-4 w-4 text-gray-400 mr-3 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {suggestion.name}
                                  </div>
                                  {suggestion.brand && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      {suggestion.brand}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {suggestion.brand?.includes('каталог') && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 whitespace-nowrap">
                                  Найти в каталоге
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => searchProducts()}
                    className="h-14 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg rounded-xl"
                    disabled={isSearching || !query.trim()}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Поиск...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Найти
                      </>
                    )}
                  </Button>
                </div>

              {/* Search suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-80 overflow-auto ${styles.suggestionsScrollbar}`}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className={cn(
                        'px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center',
                        selectedSuggestion === index && 'bg-blue-50 dark:bg-gray-700'
                      )}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedSuggestion(index)}
                    >
                      <Search className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="truncate">{suggestion.name}</span>
                      {selectedSuggestion === index && (
                        <Check className="ml-auto h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">Ищем товары по запросу: <span className="font-medium">«{query}»</span></p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Найдено товаров: <span className="text-blue-600">{results.length}</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500">Сортировка:</span>
                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                      По популярности
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((product) => (
                    <a
                      key={product.id}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="border rounded-xl p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-48 w-full object-cover object-center group-hover:opacity-90"
                            />
                          ) : (
                            <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                              Нет изображения
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <h4 className={`font-medium text-gray-900 dark:text-white group-hover:text-blue-600 ${styles.lineClamp2} mb-1`}>
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

                          <div className="flex items-center mb-2">
                            <div className="flex items-center bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                              <span className="text-amber-600 dark:text-amber-400 font-medium">
                                {product.rating}
                              </span>
                              <svg className="w-4 h-4 text-amber-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs text-gray-500 ml-1">({product.feedbacks})</span>
                            </div>

                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.inStock ? 'В наличии' : 'Под заказ'}
                            </span>
                          </div>

                          <div className="mt-auto">
                            {product.salePrice ? (
                              <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {product.salePrice.toLocaleString()} ₽
                                </span>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {product.price.toLocaleString()} ₽
                                </span>
                                <span className="ml-2 text-sm font-medium text-red-600">
                                  -{Math.round((1 - product.salePrice / product.price) * 100)}%
                                </span>
                              </div>
                            ) : (
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {product.price.toLocaleString()} ₽
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outlined" className="px-8">
                    Показать еще
                  </Button>
                </div>
              </div>
            ) : query && !isSearching ? (
              <div className="text-center py-12">
                <p className="text-gray-500">По запросу <span className="font-medium">«{query}»</span> ничего не найдено</p>
                <p className="text-sm text-gray-400 mt-2">Попробуйте изменить запрос</p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Введите запрос для поиска товаров</p>
                <p className="text-sm mt-2">Например: платье, кроссовки, смартфон</p>
              </div>
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    </FeaturesLayout>
  );
}

export default WbSearch;
