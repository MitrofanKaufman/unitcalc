import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

// Типы для пропсов компонента
type DocumentationPageProps = {
  // Добавьте здесь пропсы компонента, если они понадобятся
};

// Стилизованные компоненты для улучшения доступности
const StyledMain = styled('main')({
  '& .MuiDrawer-root': {
    '& .MuiDrawer-paper': {
      position: 'relative',
      width: 300,
      height: '100vh',
      overflowY: 'auto',
      '&:focus-visible': {
        outline: '2px solid #1976d2',
      },
    },
  },
  '& .documentation-page': {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .documentation-container': {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  '& .documentation-layout': {
    display: 'flex',
    flex: 1,
  },
  '& .documentation-nav': {
    width: 300,
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #e0e0e0',
    '& a': {
      color: '#1976d2',
      textDecoration: 'none',
      '&:hover, &:focus': {
        textDecoration: 'underline',
        outline: 'none',
      },
      '&:focus-visible': {
        outline: '2px solid #1976d2',
        borderRadius: '4px',
      },
    },
    '& ul': {
      listStyle: 'none',
      padding: 0,
      '& li': {
        margin: '0.5rem 0',
      },
    },
  },
  '& .documentation-content': {
    flex: 1,
    padding: '1rem',
    maxWidth: 'calc(100% - 300px)',
    '& .markdown-content': {
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        marginTop: '1.5em',
        marginBottom: '0.5em',
      },
      '& a': {
        color: '#1976d2',
        textDecoration: 'none',
        '&:hover, &:focus': {
          textDecoration: 'underline',
          outline: 'none',
        },
      },
    },
  },
});

/**
 * Компонент страницы документации для отображения сгенерированной TypeDoc документации
 * 
 * @returns JSX элемент страницы документации
 */
const DocumentationPage: React.FC<DocumentationPageProps> = () => {
  const [currentPath, setCurrentPath] = useState('README.md');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent(currentPath);
  }, [currentPath]);

  /**
   * Загружает содержимое markdown файла из папки docs
   * @param filePath Путь к файлу относительно папки docs
   */
  const loadContent = async (filePath: string) => {
    setLoading(true);
    setError(null);

    try {
      // Загружаем реальное содержимое файлов из папки docs
      const realContent = await loadRealContent(filePath);
      setContent(realContent);
    } catch (error) {
      setError(`Ошибка загрузки файла: ${filePath}`);
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Загружает реальное содержимое файлов из папки docs
   * @param filePath Путь к файлу
   * @returns Содержимое файла
   */
  const loadRealContent = async (filePath: string): Promise<string> => {
    // Маппинг путей к реальным файлам в папке docs
    const fileMap: Record<string, string> = {
      'README.md': await fetch('/docs/README.md').then(r => r.text()).catch(() => getFallbackContent('README.md')),

      'components/README.md': await fetch('/docs/components/README.md').then(r => r.text()).catch(() => getFallbackContent('components/README.md')),
      'components/HomePage/README.md': await fetch('/docs/components/HomePage/README.md').then(r => r.text()).catch(() => getFallbackContent('components/HomePage/README.md')),
      'components/ProductSearchPage/README.md': await fetch('/docs/components/ProductSearchPage/README.md').then(r => r.text()).catch(() => getFallbackContent('components/ProductSearchPage/README.md')),
      'components/AnalyticsPage/README.md': await fetch('/docs/components/AnalyticsPage/README.md').then(r => r.text()).catch(() => getFallbackContent('components/AnalyticsPage/README.md')),
      'components/ProductCard/README.md': await fetch('/docs/components/ProductCard/README.md').then(r => r.text()).catch(() => getFallbackContent('components/ProductCard/README.md')),
      'components/ProgressBar/README.md': await fetch('/docs/components/ProgressBar/README.md').then(r => r.text()).catch(() => getFallbackContent('components/ProgressBar/README.md')),
      'components/layout/MainLayout/README.md': await fetch('/docs/components/layout/MainLayout/README.md').then(r => r.text()).catch(() => getFallbackContent('components/layout/MainLayout/README.md')),
      'components/layout/ResponsiveHeader/README.md': await fetch('/docs/components/layout/ResponsiveHeader/README.md').then(r => r.text()).catch(() => getFallbackContent('components/layout/ResponsiveHeader/README.md')),
      'components/common/DebugPanel/README.md': await fetch('/docs/components/common/DebugPanel/README.md').then(r => r.text()).catch(() => getFallbackContent('components/common/DebugPanel/README.md')),
      'components/common/NotificationProvider/README.md': await fetch('/docs/components/common/NotificationProvider/README.md').then(r => r.text()).catch(() => getFallbackContent('components/common/NotificationProvider/README.md')),

      'hooks/README.md': await fetch('/docs/hooks/README.md').then(r => r.text()).catch(() => getFallbackContent('hooks/README.md')),
      'hooks/useWildberriesSearch/README.md': await fetch('/docs/hooks/useWildberriesSearch/README.md').then(r => r.text()).catch(() => getFallbackContent('hooks/useWildberriesSearch/README.md')),

      'services/README.md': await fetch('/docs/services/README.md').then(r => r.text()).catch(() => getFallbackContent('services/README.md')),
      'services/wildberries/README.md': await fetch('/docs/services/wildberries/README.md').then(r => r.text()).catch(() => getFallbackContent('services/wildberries/README.md')),
    };

    return fileMap[filePath] || `# Файл не найден: ${filePath}\n\nФайл ${filePath} не найден в документации.`;
  };

  /**
   * Возвращает fallback содержимое для файлов, которые не удалось загрузить
   * @param filePath Путь к файлу
   * @returns Fallback содержимое
   */
  const getFallbackContent = (filePath: string): string => {
    const fallbackMap: Record<string, string> = {
      'README.md': `# WB Calculator Documentation v0.0.0

## Модули

- [Компоненты](components/README.md)
- [Хуки](hooks/README.md)
- [Сервисы](services/README.md)

## Основные компоненты

### HomePage
Главная страница приложения с приветствием и навигацией.

### ProductSearchPage
Страница поиска товаров с интеграцией WB API и автодополнением.

### ProductCard
Компонент карточки товара для отображения в результатах поиска.

## Хуки

### useWildberriesSearch
Кастомный хук для управления поиском товаров Wildberries.

## Сервисы

### WildberriesService
Сервис для интеграции с API Wildberries.`,

      'components/README.md': `# Компоненты

## Доступные компоненты

- [HomePage](HomePage/README.md) - Главная страница
- [ProductSearchPage](ProductSearchPage/README.md) - Поиск товаров
- [ProductCard](ProductCard/README.md) - Карточка товара
- [ProgressBar](ProgressBar/README.md) - Индикатор прогресса`,

      'hooks/README.md': `# Хуки

## Доступные хуки

- [useWildberriesSearch](useWildberriesSearch/README.md) - Управление поиском WB`,

      'services/README.md': `# Сервисы

## Доступные сервисы

- [WildberriesService](wildberries/README.md) - Интеграция с WB API`,
    };

    return fallbackMap[filePath] || `# Файл не найден: ${filePath}\n\nФайл ${filePath} не найден в документации.`;
  };

  /**
   * Обрабатывает клик по ссылке в навигации
   * @param path Путь к файлу документации
   */
  const handleNavigation = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <StyledMain>
      <div className="documentation-page" role="main">
      <div className="documentation-container">
        <div className="documentation-header">
          <h1 className="page-title">📚 Документация WB Calculator</h1>
          <p className="page-subtitle">Автоматически сгенерированная документация проекта</p>
        </div>

        <div className="documentation-layout">
          <nav className="documentation-nav">
            <h3>🧩 Компоненты</h3>
            <ul>
              <li><a href="#" onClick={() => handleNavigation('components/README.md')}>📋 Обзор компонентов</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/HomePage/README.md')}>🏠 HomePage</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/ProductSearchPage/README.md')}>🔍 ProductSearchPage</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/AnalyticsPage/README.md')}>📊 AnalyticsPage</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/ProductCard/README.md')}>🖼️ ProductCard</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/ProgressBar/README.md')}>⏳ ProgressBar</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/layout/MainLayout/README.md')}>🏗️ MainLayout</a></li>
              <li><a href="#" onClick={() => handleNavigation('components/layout/ResponsiveHeader/README.md')}>📱 ResponsiveHeader</a></li>
            </ul>

            <h3>🪝 Хуки</h3>
            <ul>
              <li><a href="#" onClick={() => handleNavigation('hooks/README.md')}>📋 Обзор хуков</a></li>
              <li><a href="#" onClick={() => handleNavigation('hooks/useWildberriesSearch/README.md')}>🔍 useWildberriesSearch</a></li>
            </ul>

            <h3>🔧 Сервисы</h3>
            <ul>
              <li><a href="#" onClick={() => handleNavigation('services/README.md')}>📋 Обзор сервисов</a></li>
              <li><a href="#" onClick={() => handleNavigation('services/wildberries/README.md')}>Wildberries API</a></li>
            </ul>
          </nav>
          
          <div className="documentation-content">
            {loading ? (
              <div className="loading">Загрузка документации...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
        </div>
      </div>
      </div>
    </StyledMain>
  );
};

export default DocumentationPage;
