// path: src/db/types.ts
/**
 * Типы, связанные с работой базы данных
 */

import { DataSource } from 'typeorm';

/**
 * Интерфейс для модуля работы с базой данных
 */
export interface DatabaseModule {
  /**
   * Инициализирует подключение к базе данных
   */
  initialize(): Promise<void>;
  
  /**
   * Закрывает соединение с базой данных
   */
  close(): Promise<void>;
  
  /**
   * Проверяет доступность базы данных
   */
  isAvailable(): boolean;
  
  /**
   * Получает экземпляр DataSource
   */
  getDataSource(): DataSource | null;
}

/**
 * Ошибка подключения к базе данных
 */
export class DatabaseConnectionError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseConnectionError';
    
    // Поддержка цепочки прототипов в ES5
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

/**
 * Ошибка выполнения запроса к базе данных
 */
export class DatabaseQueryError extends Error {
  constructor(message: string, public readonly query?: string, public readonly parameters?: any[], public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseQueryError';
    
    // Поддержка цепочки прототипов в ES5
    Object.setPrototypeOf(this, DatabaseQueryError.prototype);
  }
}

/**
 * Ошибка миграции базы данных
 */
export class DatabaseMigrationError extends Error {
  constructor(message: string, public readonly migrationName?: string, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseMigrationError';
    
    // Поддержка цепочки прототипов в ES5
    Object.setPrototypeOf(this, DatabaseMigrationError.prototype);
  }
}

/**
 * Ошибка валидации данных в базе данных
 */
export class DatabaseValidationError extends Error {
  constructor(message: string, public readonly field?: string, public readonly value?: any, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseValidationError';
    
    // Поддержка цепочки прототипов в ES5
    Object.setPrototypeOf(this, DatabaseValidationError.prototype);
  }
}

/**
 * Результат выполнения запроса к базе данных
 */
export interface DatabaseResult<T = any> {
  /**
   * Успешно ли выполнен запрос
   */
  success: boolean;
  
  /**
   * Данные, возвращенные запросом
   */
  data?: T;
  
  /**
   * Информация о запросе (количество затронутых строк и т.д.)
   */
  info?: any;
  
  /**
   * Ошибка, если запрос не удался
   */
  error?: Error;
  
  /**
   * Время выполнения запроса в миллисекундах
   */
  duration?: number;
}

/**
 * Параметры для выполнения запроса к базе данных
 */
export interface QueryOptions {
  /**
   * Параметры запроса
   */
  parameters?: any[];
  
  /**
   * Максимальное время выполнения запроса в миллисекундах
   */
  timeout?: number;
  
  /**
   * Использовать ли кэширование
   */
  useCache?: boolean;
  
  /**
   * Время жизни кэша в миллисекундах
   */
  cacheTtl?: number;
}

/**
 * Настройки подключения к базе данных
 */
export interface DatabaseConnectionOptions {
  /**
   * Хост базы данных
   */
  host: string;
  
  /**
   * Порт базы данных
   */
  port: number;
  
  /**
   * Имя пользователя
   */
  username: string;
  
  /**
   * Пароль
   */
  password: string;
  
  /**
   * Имя базы данных
   */
  database: string;
  
  /**
   * Использовать ли SSL
   */
  ssl?: boolean;
  
  /**
   * Дополнительные настройки
   */
  [key: string]: any;
}
