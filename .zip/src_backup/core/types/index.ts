/**
 * Реэкспорт всех типов приложения
 */

export * from './progress';

// Добавьте здесь другие реэкспорты типов по мере необходимости

// Примеры типов, которые могут быть добавлены:
// export * from './api';
// export * from './models';
// export * from './state';

// Экспортируем общие типы
export type { Nullable } from './utils';

/**
 * Универсальный тип для объектов с произвольными строковыми ключами
 */
export type StringKeyObject<T = any> = {
  [key: string]: T;
};

/**
 * Тип для функции, которая может быть асинхронной
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Тип для функции, которая может вернуть значение или null/undefined
 */
export type Maybe<T> = T | null | undefined;