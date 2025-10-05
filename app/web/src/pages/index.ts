/**
 * Реэкспорт всех страниц приложения
 * 
 * Этот файл предоставляет единую точку входа для импорта страниц,
 * что позволяет использовать короткие алиасы вроде:
 * 
 * @example
 * import { HomePage, ProductSearchPage } from '@/pages';
 */

// Экспорты страниц
export { default as HomePage } from './HomePage';
export { default as ProductSearchPage } from './ProductSearchPage';
export { default as AnalyticsPage } from './AnalyticsPage';
export { default as ComponentsPage } from './ComponentsPage';
export { default as DocumentationPage } from './DocumentationPage';

// Экспорты типов
export * from './types';
