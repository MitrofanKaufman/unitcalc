// path: src/db/models/index.ts
/**
 * Экспорт всех моделей базы данных
 * Централизованный экспорт для удобства импорта в других частях приложения
 */

// Импортируем модели и типы
import * as UserTypes from './User';
import * as ProductTypes from './Product';

// Реэкспортируем все типы
export * from './User';
export * from './Product';

// Экспортируем модели по умолчанию
export default {
  User: {} as UserTypes.User,
  Product: {} as ProductTypes.Product
};
