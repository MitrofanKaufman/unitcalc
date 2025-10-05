import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <main className="analytics-page">
      <div className="analytics-container">
        <h1 className="page-title">📊 Аналитика</h1>
        <p className="page-subtitle">
          Анализ доходности и продаж товаров
        </p>
        <div className="analytics-content">
          <div className="analytics-placeholder">
            <p>Страница аналитики будет загружена здесь...</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnalyticsPage;
