/**
 * Вспомогательные типы для TypeScript
 */

/**
 * Делает все свойства типа T опциональными
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Делает все свойства типа T обязательными
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Делает все свойства типа T доступными только для чтения
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Выбирает из типа T только те ключи, значения которых имеют тип U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Делает указанные ключи K из типа T опциональными
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Делает указанные ключи K из типа T обязательными
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Делает указанные ключи K из типа T доступными только для чтения
 */
export type ReadonlyBy<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;

/**
 * Тип для значения, которое может быть null или undefined
 */
export type Nullable<T> = T | null | undefined;

/**
 * Тип для примитивных значений
 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Тип для функции-конструктора
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Тип для функции, которая ничего не возвращает
 */
export type VoidFunction = () => void;

/**
 * Тип для функции, которая принимает аргументы типа T и возвращает R
 */
export type FunctionWithArgs<T = any, R = void> = (...args: T[]) => R;

/**
 * Тип для объекта, который может быть функцией или объектом с методом 'default'
 */
export type Module<T = any> = T | { default: T };
