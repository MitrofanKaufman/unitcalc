// path: src/config/database.ts
/**
 * Конфигурация базы данных
 * Настройки подключения к MySQL для разных окружений
 * Поддерживает опциональное подключение к БД через переменную окружения DISABLE_DATABASE
 * Совместимо с ES модулями и CommonJS
 */

import dotenv from 'dotenv';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

// Загружаем переменные окружения из корня проекта
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Определяем тип окружения
type Environment = 'development' | 'test' | 'production';

// Получаем текущее окружение
const env = (process.env.NODE_ENV || 'development') as Environment;

// Проверяем, отключена ли база данных
const isDatabaseDisabled = process.env.DISABLE_DATABASE === 'true';

// Проверяем обязательные переменные окружения
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME'
];

// Функция для проверки конфигурации БД
export function validateDatabaseConfig(exitOnError: boolean = true): boolean {
  // Если БД отключена, пропускаем проверку
  if (isDatabaseDisabled) {
    console.log('ℹ️  Проверка конфигурации БД пропущена: DISABLE_DATABASE=true');
    return true;
  }
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMsg = `❌ Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`;
    
    if (exitOnError) {
      console.error(errorMsg);
      console.error('Пожалуйста, создайте файл .env на основе .env.example');
      process.exit(1);
    }
    
    // Если не выходим с ошибкой, возвращаем false
    return false;
  }
  
  return true;
}

// Проверяем конфигурацию при загрузке модуля
// В режиме тестов не завершаем процесс при ошибке конфигурации
if (process.env.NODE_ENV !== 'test') {
  validateDatabaseConfig(process.env.NODE_ENV === 'production');
}

// Базовые настройки для всех окружений
const baseConfig: DataSourceOptions = {
  type: 'mysql',
  charset: 'utf8mb4',
  timezone: '+00:00',
  synchronize: false, // Всегда отключаем автоматическую синхронизацию
  migrationsRun: false,
  dropSchema: false,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  logging: ['error', 'warn'],
  cli: {
    entitiesDir: 'src/db/entities',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/db/subscribers',
  },
  // Настройки пула соединений
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  },
};

// Функция для создания конфигурации подключения
function createConnectionConfig(env: Environment): DataSourceOptions {
  // Если БД отключена, возвращаем минимальную конфигурацию
  if (isDatabaseDisabled) {
    console.log('ℹ️  Использование базы данных отключено (DISABLE_DATABASE=true)');
    
    return {
      ...baseConfig,
      type: 'sqlite',
      database: ':memory:',
      synchronize: false,
      logging: false,
      entities: [],
      migrations: [],
      subscribers: [],
    };
  }
  
  // Возвращаем полную конфигурацию для указанного окружения
  return {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || `wb_calculator_${env}`,
    entities: [
      path.join(process.cwd(), 'src/db/entities/**/*.entity{.ts,.js}')
    ],
    migrations: [
      path.join(process.cwd(), 'src/db/migrations/*{.ts,.js}')
    ],
    subscribers: [
      path.join(process.cwd(), 'src/db/subscribers/**/*.subscriber{.ts,.js}')
    ],
  };
}

// Общие настройки для всех окружений
const commonConfig = createConnectionConfig(env);

// Настройки для разных окружений
const environmentConfigs: Record<Environment, Partial<DataSourceOptions>> = {
  // Разработка
  development: {
    ...commonConfig,
    logging: ['query', 'error', 'warn'],
    debug: true,
  },
  
  // Тестирование
  test: {
    ...commonConfig,
    logging: false,
    synchronize: true, // Для тестов включаем синхронизацию
    dropSchema: true, // Удаляем схему перед каждым запуском тестов
  },
  
  // Продакшн
  production: {
    ...commonConfig,
    logging: ['error', 'warn'],
    // В продакшне используем SSL для подключения, если указано
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false,
    } : undefined,
  },
};

// Получаем конфигурацию для текущего окружения
let config = {
  ...commonConfig,
  ...(environmentConfigs[env] || {}),
};

// Если БД отключена, переопределяем конфигурацию
if (isDatabaseDisabled) {
  config = {
    ...config,
    type: 'sqlite',
    database: ':memory:',
    synchronize: false,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
  } as DataSourceOptions;
}

export default config;
