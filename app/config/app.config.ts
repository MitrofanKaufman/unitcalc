import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем типы окружений
type Environment = 'development' | 'production' | 'test';

// Базовый интерфейс конфигурации
export interface AppConfig {
  env: Environment;
  port: number;
  host: string;
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
  api: {
    prefix: string;
    version: string;
  };
  logs: {
    level: string;
    dir: string;
  };
  cors: {
    origin: string | string[];
    methods: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  security: {
    jwtSecret: string;
    passwordSaltRounds: number;
    passwordResetTokenExpiresIn: number;
  };
  paths: {
    root: string;
    src: string;
    public: string;
    uploads: string;
    logs: string;
  };
}

// Настройки по умолчанию для всех окружений
const defaults = {
  api: {
    prefix: '/api',
    version: 'v1',
  },
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    dir: 'logs',
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // лимит запросов с одного IP
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    passwordSaltRounds: 10,
    passwordResetTokenExpiresIn: 24 * 60 * 60 * 1000, // 24 часа
  },
  paths: {
    root: path.resolve(__dirname, '../../../'),
    src: path.resolve(__dirname, '../'),
    public: path.resolve(__dirname, '../../../public'),
    uploads: path.resolve(__dirname, '../../../public/uploads'),
    logs: path.resolve(__dirname, '../../../logs'),
  },
};

// Настройки для разных окружений
const environmentConfigs: Record<Environment, Partial<AppConfig>> = {
  development: {
    env: 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    isDev: true,
    isProd: false,
    isTest: false,
    logs: {
      ...defaults.logs,
      level: 'debug',
    },
  },
  production: {
    env: 'production',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    isDev: false,
    isProd: true,
    isTest: false,
    logs: {
      ...defaults.logs,
      level: 'info',
    },
    security: {
      ...defaults.security,
      jwtSecret: process.env.JWT_SECRET || 'production-secret-key',
    },
  },
  test: {
    env: 'test',
    port: 3001,
    host: '0.0.0.0',
    isDev: false,
    isProd: false,
    isTest: true,
    logs: {
      ...defaults.logs,
      level: 'error',
    },
  },
};

// Определяем текущее окружение
const env: Environment = (process.env.NODE_ENV as Environment) || 'development';

// Собираем финальную конфигурацию
const config: AppConfig = {
  ...defaults,
  ...environmentConfigs[env],
  paths: {
    ...defaults.paths,
    ...(environmentConfigs[env].paths || {}),
  },
  api: {
    ...defaults.api,
    ...(environmentConfigs[env].api || {}),
  },
  logs: {
    ...defaults.logs,
    ...(environmentConfigs[env].logs || {}),
  },
  cors: {
    ...defaults.cors,
    ...(environmentConfigs[env].cors || {}),
  },
  rateLimit: {
    ...defaults.rateLimit,
    ...(environmentConfigs[env].rateLimit || {}),
  },
  security: {
    ...defaults.security,
    ...(environmentConfigs[env].security || {}),
  },
} as AppConfig;

// Проверяем обязательные переменные окружения в продакшене
if (config.isProd) {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`
    );
  }
}

export default config;
