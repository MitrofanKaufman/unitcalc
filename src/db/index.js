/**
 * Экспорт всех функций для работы с базой данных
 */

export * from './service';

export { default as db } from './service';

// Дополнительные утилиты для работы с БД
export * from './utils';

// Хелперы для работы с конкретными коллекциями
export * from './collections';

// Экспортируем типы
export * from './types';

// Инициализация БД (если требуется)
// import { initDatabase } from './init';
// initDatabase().catch(console.error);
