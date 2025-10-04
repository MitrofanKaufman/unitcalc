import React, { useState } from 'react';
import { DebugProvider } from './lib/debug/DebugContext';
import { NotificationProvider } from './lib/notifications/NotificationSystem';
import { useNotificationActions } from './lib/notifications/useNotificationActions';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ComponentsPage from './components/ComponentsPage';
import ProductNameSearch from './components/ProductNameSearch';
import DebugPanel from './components/DebugPanel';
import './styles.css';

// Material-UI стиль шапки с современным дизайном
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Поиск товаров:', searchQuery);
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <h1 className="header-title">
              🧮 WB Calculator
            </h1>
            <p className="header-subtitle">Профессиональный инструмент для маркетплейсов</p>
          </div>

          <nav className="header-nav">
            <Link to="/" className="nav-link">
              🏠 Главная
            </Link>
            <Link to="/search" className="nav-link">
              🔍 Поиск товаров
            </Link>
            <Link to="/components" className="nav-link">
              🧩 Компоненты
            </Link>
          </nav>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Поиск товаров по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>
          </form>

          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <div className="hamburger">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </button>
        </div>
      </header>

      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

// Компонент responsive overlay меню
const OverlayMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationActions();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Поиск товаров из меню:', searchQuery);
      // Здесь можно добавить навигацию к странице поиска или выполнить поиск
    }
  };

  const handleNotificationClick = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        showSuccess('Тест успеха!', 'Это тестовое уведомление успеха');
        break;
      case 'error':
        showError('Тест ошибки!', 'Это тестовое уведомление ошибки');
        break;
      case 'warning':
        showWarning('Тест предупреждения!', 'Это тестовое уведомление предупреждения');
        break;
      case 'info':
        showInfo('Тест информации!', 'Это тестовое уведомление информации');
        break;
    }
    onClose();
  };

  return (
    <>
      {/* Оверлей меню */}
      <div className={`overlay ${isOpen ? 'active' : ''}`}>
        <div className="wrap">
          {/* Форма поиска в меню */}
          <div className="menu-search">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Поиск товаров по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  🔍
                </button>
              </div>
            </form>
          </div>

          <ul className="wrap-nav">
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('success'); }}>
                Главная
              </a>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('success'); }}>О проекте</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Команда</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Контакты</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Помощь</a></li>
              </ul>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('warning'); }}>
                Инструменты
              </a>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Калькулятор WB</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Анализ конкурентов</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Прогнозирование</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Оптимизация цен</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Отчеты</a></li>
              </ul>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('error'); }}>
                Настройки
              </a>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Профиль</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>API ключи</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>Экспорт данных</a></li>
              </ul>
            </li>
          </ul>

          <div className="social">
            <a href="https://github.com/MitrofanKaufman/wb-calc" target="_blank" rel="noopener noreferrer">
              <div className="social-icon">
                <i>📊</i>
              </div>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>
              <div className="social-icon">
                <i>📋</i>
              </div>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick('info'); }}>
              <div className="social-icon">
                <i>⚙️</i>
              </div>
            </a>
            <p>
              WB Calculator v1.0<br />
              Создано с ❤️ для продавцов маркетплейсов
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Оверлей для закрытия меню кликом вне области */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </>
  );
};

// Компонент подвала
const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div>
            <h3>🧮 WB Calculator</h3>
            <p>
              Профессиональный калькулятор доходности для продавцов Wildberries и других маркетплейсов.
            </p>
          </div>
          <div>
            <h3>📊 Функции</h3>
            <ul>
              <li>• Расчет доходности товаров</li>
              <li>• Анализ конкурентов</li>
              <li>• Прогнозирование прибыли</li>
              <li>• Оптимизация цен</li>
            </ul>
          </div>
          <div>
            <h3>🔗 Ссылки</h3>
            <div>
              <a href="#">Документация</a>
              <a href="#">Поддержка</a>
              <a href="#">О проекте</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2024 WB Calculator. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

// Главная страница
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
        <p className="home-description">
          Текущее время: {new Date().toLocaleString('ru-RU')}
        </p>

        <div className="home-buttons">
          <Link
            to="/search"
            className="action-button search"
          >
            🔍 Начать поиск товаров
          </Link>

          <button
            className="action-button analytics"
            onClick={() => {
              alert('📊 Аналитика маркетплейсов - скоро будет доступна!');
            }}
          >
            📊 Аналитика
          </button>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <h3>🎯 Точность</h3>
            <p>Алгоритмы расчета основаны на реальных данных маркетплейсов</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Скорость</h3>
            <p>Мгновенный расчет доходности для тысяч товаров</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Безопасность</h3>
            <p>Все данные обрабатываются локально, без передачи третьим лицам</p>
          </div>
        </div>
      </div>
    </main>
  );
};

// Страница поиска товаров
const ProductSearchPage: React.FC = () => {
  return (
    <main className="search-page">
      <div className="search-container">
        <ProductNameSearch />
      </div>
    </main>
  );
};

// Основной компонент приложения
function AppContent() {
  return (
    <div className="app-container">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<ProductSearchPage />} />
        <Route path="/components" element={<ComponentsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <DebugProvider enabled={true}>
      <NotificationProvider>
        <Router>
          <AppContent />
          <DebugPanel position="bottom-right" />
        </Router>
      </NotificationProvider>
    </DebugProvider>
  );
}

export default App;
