// Конфигурация сервера
import path from 'path';

import dotenv from 'dotenv';

// Загрузка переменных окружения из .env файла
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
  ),
});

// Интерфейс конфигурации приложения
interface Config {
  // Основные настройки
  env: string;
  port: number;
  host: string;
  baseUrl: string;

  // Настройки базы данных
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
  };

  // Настройки аутентификации
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
  };

  // Настройки CORS
  cors: {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
  };

  // Настройки логирования
  logging: {
    level: string;
    dir: string;
    maxSize: string;
    maxFiles: string;
  };

  // Настройки кэширования
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

// Получение конфигурации из переменных окружения
const config: Config = {
  // Основные настройки
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,

  // Настройки базы данных
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'wbc_calculator',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  },

  // Настройки аутентификации
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  // Настройки CORS
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Настройки логирования
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
  },

  // Настройки кэширования
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
};

// Валидация конфигурации
const validateConfig = (): void => {
  if (!config.auth.jwtSecret || config.auth.jwtSecret === 'your-secret-key') {
    console.warn('Внимание: \n'
      + 'JWT SECRET не установлен или использует значение по умолчанию. \n'
      + 'Это небезопасно для производственной среды!\n');
  }

  if (config.env === 'production' && config.db.synchronize) {
    console.warn('Внимание: \n'
      + 'Синхронизация баз данных включена в рабочей среде. \n'
      + 'Рекомендуется выключить эту настройку!');
  }
};

// Выполняем валидацию при загрузке модуля
validateConfig();

export default config;
