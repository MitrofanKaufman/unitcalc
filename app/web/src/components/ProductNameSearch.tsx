import React, { useState, useEffect } from 'react';

// Типы для товаров
interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  rating: number;
  image: string;
}

// Компонент поиска товаров по названию
const ProductNameSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Моковые данные товаров для демонстрации
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Смартфон Samsung Galaxy S23',
      price: 89990,
      brand: 'Samsung',
      category: 'Электроника',
      rating: 4.5,
      image: '📱'
    },
    {
      id: 2,
      name: 'Ноутбук Apple MacBook Pro',
      price: 199990,
      brand: 'Apple',
      category: 'Электроника',
      rating: 4.8,
      image: '💻'
    },
    {
      id: 3,
      name: 'Наушники Sony WH-1000XM4',
      price: 29990,
      brand: 'Sony',
      category: 'Электроника',
      rating: 4.6,
      image: '🎧'
    },
    {
      id: 4,
      name: 'Кроссовки Nike Air Max',
      price: 12990,
      brand: 'Nike',
      category: 'Обувь',
      rating: 4.3,
      image: '👟'
    },
    {
      id: 5,
      name: 'Часы Apple Watch Series 9',
      price: 49990,
      brand: 'Apple',
      category: 'Электроника',
      rating: 4.7,
      image: '⌚'
    }
  ];

  const searchProducts = (query: string) => {
    setIsLoading(true);

    // Имитация поиска с задержкой
    setTimeout(() => {
      if (query.trim() === '') {
        setProducts([]);
      } else {
        const filtered = mockProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      }
      setIsLoading(false);
      setHasSearched(true);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery);
  };

  const handleProductClick = (product: Product) => {
    alert(`Выбран товар: ${product.name}\nЦена: ${product.price}₽\nРейтинг: ${product.rating}⭐`);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          marginBottom: '1rem',
          color: '#2c3e50',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🔍 Поиск товаров по названию
        </h2>
        <p style={{
          color: '#6c757d',
          fontSize: '1rem',
          marginBottom: '1.5rem'
        }}>
          Найдите товары для расчета доходности
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите название товара, бренд или категорию..."
            style={{
              flex: 1,
              padding: '0.8rem 1rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? '⏳' : '🔍'} {isLoading ? 'Поиск...' : 'Найти'}
          </button>
        </div>
      </form>

      {/* Результаты поиска */}
      <div>
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6c757d'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              animation: 'spin 1s linear infinite'
            }}>🔄</div>
            <p>Ищем товары...</p>
          </div>
        )}

        {!isLoading && hasSearched && products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>Товары не найдены</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Попробуйте изменить поисковый запрос
            </p>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <>
            <div style={{
              marginBottom: '1rem',
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              Найдено товаров: {products.length}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    {product.image}
                  </div>

                  <h3 style={{
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                    color: '#2c3e50',
                    lineHeight: '1.3'
                  }}>
                    {product.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#667eea'
                    }}>
                      {product.price.toLocaleString()}₽
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <span>⭐</span>
                      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: '#6c757d'
                  }}>
                    <span>{product.brand}</span>
                    <span>{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductNameSearch;
