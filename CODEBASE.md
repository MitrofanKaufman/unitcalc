# 📚 Интерактивная документация кодовой базы WB Calculator

Это интерактивная документация всех функций и классов в проекте WB Calculator после рефакторинга.

## 🌳 Структура проекта

<details>
<summary><strong>📁 app/</strong></summary>

<details>
<summary><strong>📁 web/</strong></summary>

<details>
<summary><strong>📁 src/</strong></summary>

<details>
<summary><strong>📁 components/</strong></summary>

<details>
<summary><strong>📄 HomePage.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`HomePage`](#HomePage) - Главная страница приложения

**Функции:**
- `HomePage()` - React компонент главной страницы

</details>

<details>
<summary><strong>📄 ProductSearchPage.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`ProductSearchPage`](#ProductSearchPage) - Страница поиска товаров

**Функции:**
- `ProductSearchPage()` - React компонент страницы поиска
- `handleSearch()` - обработчик отправки формы поиска
- `handleInputChange()` - обработчик изменения поля ввода
- `handleSuggestionClick()` - обработчик клика по подсказке

**Хуки:**
- `useWildberriesSearch()` - кастомный хук для поиска товаров WB

</details>

<details>
<summary><strong>📄 AnalyticsPage.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`AnalyticsPage`](#AnalyticsPage) - Страница аналитики

**Функции:**
- `AnalyticsPage()` - React компонент страницы аналитики

</details>

<details>
<summary><strong>📄 ProductCard.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`ProductCard`](#ProductCard) - Карточка товара

**Функции:**
- `ProductCard()` - React компонент карточки товара
- `formatPrice()` - форматирование цены в рублях
- `renderStars()` - отображение звезд рейтинга

**Интерфейсы:**
- `ProductCardProps` - проперти компонента карточки товара

</details>

<details>
<summary><strong>📄 ProgressBar.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`ProgressBar`](#ProgressBar) - Индикатор прогресса

**Функции:**
- `ProgressBar()` - React компонент индикатора прогресса

**Интерфейсы:**
- `ProgressBarProps` - проперти компонента индикатора прогресса

</details>

<details>
<summary><strong>📁 layout/</strong></summary>

<details>
<summary><strong>📄 MainLayout.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`MainLayout`](#MainLayout) - Основной лейаут приложения

**Функции:**
- `MainLayout()` - React компонент основного лейаута
- `handleLogout()` - обработчик выхода из системы
- `toggleTheme()` - переключение темы приложения

**Хуки:**
- `useNavigate()` - навигация между страницами
- `useMemo()` - мемоизация темы

</details>

<details>
<summary><strong>📄 ResponsiveHeader.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`ResponsiveHeader`](#ResponsiveHeader) - Адаптивный заголовок

**Функции:**
- `ResponsiveHeader()` - React компонент заголовка
- `handleDrawerToggle()` - переключение бокового меню
- `handleMenuItemClick()` - обработчик клика по элементу меню
- `renderMenuItems()` - рендер элементов меню

**Интерфейсы:**
- `UserData` - данные пользователя
- `MenuItemBase` - базовый интерфейс элемента меню
- `MenuItemWithChildren` - элемент меню с дочерними элементами
- `ResponsiveHeaderProps` - проперти заголовка

</details>

</details>

<details>
<summary><strong>📁 common/</strong></summary>

<details>
<summary><strong>📄 DebugPanel.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`DebugProvider`](#DebugProvider) - Провайдер отладки

**Функции:**
- `DebugProvider()` - React провайдер контекста отладки

**Контексты:**
- `DebugContext` - контекст для отладочной информации

**Интерфейсы:**
- `DebugProviderProps` - проперти провайдера отладки

</details>

<details>
<summary><strong>📄 NotificationProvider.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`NotificationProvider`](#NotificationProvider) - Провайдер уведомлений

**Функции:**
- `NotificationProvider()` - React провайдер контекста уведомлений
- `showNotification()` - функция показа уведомления

**Контексты:**
- `NotificationContext` - контекст для уведомлений

**Интерфейсы:**
- `NotificationProviderProps` - проперти провайдера уведомлений

</details>

</details>

</details>

<details>
<summary><strong>📁 hooks/</strong></summary>

<details>
<summary><strong>📄 useWildberriesSearch.ts</strong></summary>

**Экспортируемые хуки:**
- [`useWildberriesSearch`](#useWildberriesSearch) - Хук для поиска товаров WB

**Функции:**
- `useWildberriesSearch()` - кастомный хук для управления поиском
- `searchProducts()` - функция поиска товаров
- `fetchSuggestions()` - функция получения подсказок
- `clearSearch()` - функция очистки поиска
- `retrySearch()` - функция повторного поиска

**Типы:**
- `Product` - интерфейс товара
- `SearchState` - интерфейс состояния поиска

</details>

</details>

<details>
<summary><strong>📁 services/</strong></summary>

<details>
<summary><strong>📄 wildberries.ts</strong></summary>

**Экспортируемые классы:**
- [`WildberriesService`](#WildberriesService) - Сервис интеграции с WB API

**Функции:**
- `fetchSuggestions()` - получение подсказок поиска
- `fetchProducts()` - получение списка товаров с прогрессом
- `getImageUrl()` - генерация URL изображения товара
- `getProductById()` - получение товара по ID

**Статические методы:**
- `WildberriesService.fetchSuggestions()` - статический метод получения подсказок
- `WildberriesService.fetchProducts()` - статический метод получения товаров
- `WildberriesService.getImageUrl()` - статический метод генерации URL изображения
- `WildberriesService.getProductById()` - статический метод получения товара по ID

</details>

</details>

<details>
<summary><strong>📄 App.tsx</strong></summary>

**Экспортируемые компоненты:**
- [`App`](#App) - Главный компонент приложения

**Функции:**
- `App()` - React компонент главного приложения

</details>

</details>

</details>

</details>

## 🔧 Детальное описание функций и классов

### Компоненты страниц

#### <a id="HomePage">📄 HomePage</a>
```typescript
/**
 * Главная страница приложения WB Calculator
 * Отображает приветственное сообщение и кнопки навигации
 */
export const HomePage: React.FC = () => {
  return (
    <main className="home-page">
      <div className="home-content">
        <h1 className="home-title">🎉 Добро пожаловать в WB Calculator</h1>
        <p className="home-subtitle">Профессиональный инструмент для расчета доходности товаров на маркетплейсах</p>
        <div className="home-buttons">
          <Link to="/search" className="action-button search">🔍 Начать поиск товаров</Link>
          <Link to="/analytics" className="action-button analytics">📊 Аналитика</Link>
        </div>
      </div>
    </main>
  );
}
```

#### <a id="ProductSearchPage">📄 ProductSearchPage</a>
```typescript
/**
 * Страница поиска товаров Wildberries с автодополнением и подсказками
 */
const ProductSearchPage: React.FC = () => {
  // Управление состоянием поиска и подсказками
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Автодополнение при вводе текста
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput.trim() && searchInput.length >= 2) {
        fetchSuggestions(searchInput.trim());
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchInput, fetchSuggestions]);

  return (
    <main className="search-page">
      {/* Форма поиска с подсказками */}
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
          <button type="submit" className="search-button">
            {isSearching ? '⏳ Поиск...' : '🔍 Искать'}
   

## 📁 Дополнительные файлы проекта

<details>
<summary><strong>📄 package.json</strong></summary>

**Скрипты сборки и разработки:**
- `dev` - запуск сервера разработки
- `build` - сборка для продакшена
- `preview` - предварительный просмотр сборки
- `lint` - проверка кода линтером

**Зависимости:**
- `react` - основной фреймворк
- `react-dom` - рендеринг в DOM
- `react-router-dom` - маршрутизация
- `@mui/material` - Material-UI компоненты
- `@emotion/react` - стили для MUI
- `typescript` - типизация

</details>

<details>
<summary><strong>📄 vite.config.ts</strong></summary>

**Конфигурация Vite bundler:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

</details>

<details>
<summary><strong>📄 tsconfig.json</strong></summary>

**Конфигурация TypeScript:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

</details>

<details>
<summary><strong>📄 index.html</strong></summary>

**Главная HTML страница:**
```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WB Calculator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

</details>

<details>
<summary><strong>📄 main.tsx</strong></summary>

**Точка входа React приложения:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

</details>

## 🎯 Использование компонентов

### Примеры использования в коде

#### Использование хука useWildberriesSearch
```typescript
import { useWildberriesSearch } from '../hooks/useWildberriesSearch';

function SearchComponent() {
  const {
    products,
    suggestions,
    isSearching,
    searchProducts,
    fetchSuggestions,
  } = useWildberriesSearch();

  const handleSearch = (query: string) => {
    searchProducts(query);
  };

  return (
    <div>
      <input onChange={(e) => fetchSuggestions(e.target.value)} />
      {suggestions.map(suggestion => (
        <div key={suggestion} onClick={() => handleSearch(suggestion)}>
          {suggestion}
        </div>
      ))}
    </div>
  );
}
```

#### Использование компонента ProductCard
```typescript
import { ProductCard } from './components/ProductCard';

function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Использование сервиса WildberriesService
```typescript
import { WildberriesService } from '../services/wildberries';

// Поиск товаров с прогрессом
const products = await WildberriesService.fetchProducts(
  'смартфон Samsung',
  (current, total) => console.log(`${current}/${total}`)
);

// Получение подсказок поиска
const suggestions = await WildberriesService.fetchSuggestions('смартфон');

// Получение детальной информации о товаре
const product = await WildberriesService.getProductById(123456);
```

## 🚀 Быстрый старт разработки

### Установка зависимостей
```bash
cd app/web
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

### Проверка типов TypeScript
```bash
npm run type-check
```

### Проверка кода линтером
```bash
npm run lint
```

## 📚 Дополнительная информация

### Структура URL приложения
- `http://localhost:5216/` - Главная страница
- `http://localhost:5216/search` - Поиск товаров WB
- `http://localhost:5216/analytics` - Аналитика
- `http://localhost:5216/components` - Демонстрация компонентов

### Горячие клавиши разработки
- `Ctrl+C` - остановка сервера разработки
- `Ctrl+R` - перезагрузка страницы в браузере
- `F12` - инструменты разработчика

### Рекомендации по разработке
1. Всегда документируйте новые функции и классы
2. Используйте TypeScript для типобезопасности
3. Следуйте принципам чистого кода
4. Тестируйте изменения перед коммитом

---

*Документация автоматически обновляется при каждом изменении проекта*
