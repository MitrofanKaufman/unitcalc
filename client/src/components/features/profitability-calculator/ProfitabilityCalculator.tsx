import React, { useState } from 'react';
import { Container } from '@mui/material';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { Product, MARKETPLACES, PRODUCT_CATEGORIES } from '@/types';
import { CalculatorForm } from './components/CalculatorForm';

/**
 * Главная страница калькулятора доходности маркетплейсов
 * Использует стандартизированную структуру страниц
 */
export function ProfitabilityCalculator() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // Моковые данные товаров для демонстрации
  const mockProducts: Product[] = [
    {
      id: 'wb_1',
      name: 'Смартфон Samsung Galaxy A54 256GB',
      price: 35000,
      category: 'electronics',
      marketplace: 'wb',
      characteristics: {
        weight: 202,
        dimensions: { length: 158, width: 76, height: 8 },
        brand: 'Samsung',
        rating: 4.5,
        reviews: 1250
      }
    },
    {
      id: 'ozon_1',
      name: 'Ноутбук Lenovo IdeaPad 3 15.6"',
      price: 55000,
      category: 'electronics',
      marketplace: 'ozon',
      characteristics: {
        weight: 2500,
        dimensions: { length: 359, width: 236, height: 20 },
        brand: 'Lenovo',
        rating: 4.2,
        reviews: 890
      }
    }
  ];

  const handleSearch = (query: string, filters: Record<string, string | string[]>) => {
    console.log('Поиск:', query, 'Фильтры:', filters);
    // Здесь будет логика поиска товаров
  };

  return (
    <Container maxWidth="lg">
      {/* Стандартизированный заголовок страницы */}
      <PageHeader
        title="Marketplace Calculator"
        subtitle="Расчет доходности товаров для маркетплейсов России"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Калькулятор доходности' }
        ]}
        actions={[
          {
            label: 'Очистить кеш',
            onClick: () => {
              console.log('Очистка кеша');
            },
            variant: 'secondary'
          }
        ]}
      />

      {/* Стандартизированная поисковая панель */}
      <SearchBar
        placeholder="Поиск товаров по названию или бренду..."
        onSearch={handleSearch}
        filters={[
          {
            key: 'marketplace',
            label: 'Маркетплейс',
            options: MARKETPLACES.map(m => ({ value: m.id, label: `${m.icon} ${m.name}` }))
          },
          {
            key: 'category',
            label: 'Категория',
            options: PRODUCT_CATEGORIES.map(c => ({ value: c.id, label: c.name }))
          }
        ]}
        showAdvanced={true}
      />

      {/* Демонстрационные товары для тестирования */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Демонстрационные товары для тестирования:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {mockProducts.map(product => (
            <div
              key={product.id}
              style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#fafafa'
              }}
              onClick={() => {
                setSelectedProduct(product);
                setShowCalculator(true);
              }}
            >
              <h4 style={{ margin: '0 0 8px 0' }}>{product.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Цена: {product.price.toLocaleString()} ₽</span>
                <span>{MARKETPLACES.find(m => m.id === product.marketplace)?.name}</span>
              </div>
              {product.characteristics?.brand && (
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Бренд: {product.characteristics.brand}
                </div>
              )}
              <div style={{ marginTop: '8px' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Рассчитать доходность
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Форма калькулятора для выбранного товара */}
      {selectedProduct && showCalculator && (
        <CalculatorForm
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setShowCalculator(false);
          }}
        />
      )}
    </Container>
  );
}

export default ProfitabilityCalculator;
