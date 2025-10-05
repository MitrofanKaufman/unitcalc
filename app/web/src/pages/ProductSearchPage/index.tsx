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
    loadMoreProducts,
    hasMoreProducts,
    isLoading,
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
      <main className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ошибка поиска</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              onClick={retrySearch}
            >
              🔄 Попробовать снова
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Заголовок страницы */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔍 Поиск товаров</h1>
          <p className="text-lg text-gray-600">
            Найдите товары на маркетплейсах и проанализируйте их характеристики
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Левая колонка - поиск и категории */}
          <div className="lg:col-span-1">
            {/* Поиск */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Поиск по названию товара</h2>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Введите название товара..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    disabled={isSearching}
                  />

                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSearching || !searchInput.trim()}
                  >
                    {isSearching ? '⏳' : '🔍'}
                  </button>
                </div>

                {/* Подсказки поиска */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {suggestions.slice(0, 8).map((suggestion: string, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center">
                          <span className="text-blue-500 mr-2">💡</span>
                          <span className="text-gray-700">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>

              {/* Прогресс поиска */}
              {isSearching && (
                <div className="mt-4">
                  <ProgressBar
                    current={progress.current}
                    total={progress.total}
                    message="Поиск товаров на Wildberries..."
                  />
                </div>
              )}
            </div>

            {/* Популярные категории */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Популярные категории</h2>
              <div className="space-y-3">
                {[
                  { icon: '👕', name: 'Одежда', color: 'bg-pink-100 text-pink-800' },
                  { icon: '👟', name: 'Обувь', color: 'bg-green-100 text-green-800' },
                  { icon: '📱', name: 'Электроника', color: 'bg-purple-100 text-purple-800' },
                  { icon: '🏠', name: 'Дом и сад', color: 'bg-yellow-100 text-yellow-800' },
                ].map((category, index) => (
                  <div
                    key={index}
                    className={`${category.color} p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка - результаты поиска */}
          <div className="lg:col-span-3">
            {!isSearching && query && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Заголовок результатов */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Найдено товаров: {products.length}
                    </h3>
                    <p className="text-gray-600 mt-1">По запросу "{query}"</p>
                  </div>
                  {products.length > 0 && (
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      onClick={clearSearch}
                    >
                      🗑️ Очистить
                    </button>
                  )}
                </div>

                {/* Результаты поиска */}
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {products.map((product: any) => (
                        <div key={product.id} className="transform hover:scale-105 transition-transform duration-200">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>

                    {/* Кнопка загрузки дополнительных результатов */}
                    {hasMoreProducts && (
                      <div className="text-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={loadMoreProducts}
                          disabled={isLoading}
                        >
                          {isLoading ? '⏳ Загрузка...' : '📦 Загрузить еще товары'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-gray-600">По запросу "{query}" ничего не найдено</p>
                    <p className="text-gray-500 mt-2">Попробуйте изменить поисковый запрос</p>
                  </div>
                )}
              </div>
            )}

            {/* Пустое состояние - когда нет активного поиска */}
            {!query && !isSearching && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-6">🛍️</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Начните поиск товаров
                </h3>
                <p className="text-gray-600 mb-6">
                  Введите название товара в поле поиска выше, чтобы найти интересующие вас продукты
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    'смартфон Samsung',
                    'наушники беспроводные',
                    'часы умные',
                    'планшет Samsung',
                  ].map((example, index) => (
                    <button
                      key={index}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors duration-200 border border-blue-200"
                      onClick={() => {
                        setSearchInput(example);
                        searchProducts(example);
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductSearchPage;
