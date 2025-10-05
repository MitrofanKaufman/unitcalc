import React, { useState, useEffect } from 'react';
import { useWildberriesSearch } from '@/hooks/useWildberriesSearch';
import { ProductCard } from '@/components/ProductCard';
import { ProgressBar } from '@/components/ProgressBar';

const ProductSearchPage: React.FC = () => {
  const {
    products,
    suggestions,
    isSearching,
    progress,
    error,
    query,
    searchProducts,
    fetchSuggestions,
    clearSearch,
    retrySearch,
  } = useWildberriesSearch();

  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Автоматическое получение подсказок при вводе текста
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput.trim() && searchInput.length >= 2) {
        fetchSuggestions(searchInput.trim());
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300); // Задержка 300мс для избежания слишком частых запросов

    return () => clearTimeout(debounceTimer);
  }, [searchInput, fetchSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchProducts(searchInput.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    searchProducts(suggestion);
    setShowSuggestions(false);
  };

  if (error) {
    return (
      <main className="search-page">
        <div className="search-container">
          <div className="error-state">
            <h2 className="error-title">❌ Ошибка поиска</h2>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={retrySearch}>
              🔄 Попробовать снова
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="search-page">
      <div className="search-container">
        <h1 className="page-title">🔍 Поиск товаров</h1>
        <p className="page-subtitle">
          Найдите товары на маркетплейсах и проанализируйте их характеристики
        </p>

        <div className="search-content">
          <div className="search-section">
            <h2 className="section-title">Поиск по названию товара</h2>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Введите название товара..."
                  className="search-input"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  className="search-button"
                  disabled={isSearching || !searchInput.trim()}
                >
                  {isSearching ? '⏳ Поиск...' : '🔍 Искать'}
                </button>
              </div>

              {/* Подсказки поиска */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.slice(0, 8).map((suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-icon">💡</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {isSearching && (
              <div className="search-progress">
                <ProgressBar
                  current={progress.current}
                  total={progress.total}
                  message="Поиск товаров на Wildberries..."
                />
              </div>
            )}
          </div>

          {!isSearching && query && (
            <div className="search-results">
              <div className="results-header">
                <h3 className="results-title">
                  Найдено товаров: {products.length}
                </h3>
                {products.length > 0 && (
                  <button className="clear-button" onClick={clearSearch}>
                    🗑️ Очистить
                  </button>
                )}
              </div>

              {products.length > 0 ? (
                <div className="products-grid">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>По запросу "{query}" ничего не найдено</p>
                  <p>Попробуйте изменить поисковый запрос</p>
                </div>
              )}
            </div>
          )}

          <div className="search-section">
            <h2 className="section-title">Популярные категории</h2>
            <div className="categories-grid">
              <div className="category-card">
                <span className="category-icon">👕</span>
                <span className="category-name">Одежда</span>
              </div>
              <div className="category-card">
                <span className="category-icon">👟</span>
                <span className="category-name">Обувь</span>
              </div>
              <div className="category-card">
                <span className="category-icon">📱</span>
                <span className="category-name">Электроника</span>
              </div>
              <div className="category-card">
                <span className="category-icon">🏠</span>
                <span className="category-name">Дом и сад</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductSearchPage;
