import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Главная страница приложения WB Calculator
 * Отображает приветственное сообщение и кнопки навигации к основным разделам
 *
 * @returns JSX элемент главной страницы с приветствием и навигацией
 *
 * @example
 * ```tsx
 * <HomePage />
 * ```
 */
const HomePage: React.FC = () => {
  return (
    <main className="home-page">
      <div className="home-content">
        <h1 className="home-title">
          🎉 Добро пожаловать в WB Calculator
        </h1>
        <p className="home-subtitle">
          Профессиональный инструмент для расчета доходности товаров на маркетплейсах
        </p>
        <div className="home-buttons">
          <Link to="/search" className="action-button search">
            🔍 Начать поиск товаров
          </Link>
          <Link to="/analytics" className="action-button analytics">
            📊 Аналитика
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
