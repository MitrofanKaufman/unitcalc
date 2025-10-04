import React from 'react';
import { WbSearch } from '../components/features/wb-search/WbSearch';

const ProductSearchPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          color: '#333',
          textAlign: 'center'
        }}>
          🔍 Поиск товаров Wildberries
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          color: '#666',
          textAlign: 'center'
        }}>
          Найдите товары для расчета доходности на маркетплейсах
        </p>

        <WbSearch />
      </div>
    </div>
  );
};

export default ProductSearchPage;
