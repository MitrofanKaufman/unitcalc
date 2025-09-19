// path: src/config/cors.ts
/**
 * Конфигурация CORS (Cross-Origin Resource Sharing)
 * Определяет политики доступа к API с других доменов
 */

import { CorsOptions } from 'cors';
import config from './config';

// Разрешенные домены для CORS
const allowedOrigins = [
  // Локальная разработка
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  
  // Продакшн домены
  'https://your-production-domain.com',
  'https://www.your-production-domain.com',
  
  // Демо и стейджинг
  'https://staging.your-domain.com',
  'https://demo.your-domain.com',
];

// Функция для проверки источника запроса
const origin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  // Разрешаем запросы без заголовка origin (например, от мобильных приложений или Postman)
  if (!origin) {
    return callback(null, true);
  }
  
  // В режиме разработки разрешаем все источники
  if (config.nodeEnv === 'development') {
    return callback(null, true);
  }
  
  // Проверяем, есть ли домен в списке разрешенных
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  
  // Если домен не в списке разрешенных, возвращаем ошибку
  return callback(new Error('Доступ с вашего домена запрещен политикой CORS'));
};

// Настройки CORS
const corsOptions: CorsOptions = {
  // Функция для проверки источника запроса
  origin,
  
  // Разрешенные HTTP-методы
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Разрешенные заголовки
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Api-Key',
    'X-Request-ID',
    'X-Forwarded-For',
    'X-Forwarded-Proto',
    'X-Forwarded-Host',
    'X-Forwarded-Port',
  ],
  
  // Заголовки, которые могут быть доступны клиенту
  exposedHeaders: [
    'Content-Length',
    'Content-Type',
    'X-Total-Count',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ],
  
  // Поддержка учетных данных (например, cookies, авторизация)
  credentials: true,
  
  // Максимальное время кеширования результатов предварительного запроса (в секундах)
  maxAge: 600, // 10 минут
  
  // Обработка предварительных запросов OPTIONS
  preflightContinue: false,
  
  // Установка заголовка Access-Control-Allow-Origin
  // true - устанавливает значение заголовка Origin
  // false - устанавливает * (не поддерживает credentials)
  // функция - позволяет динамически устанавливать значение
  optionsSuccessStatus: 204, // Некоторые устаревшие браузеры (IE11, различные SmartTV) не поддерживают 204
  
  // Включить отладочную информацию
  // В продакшене должно быть false
  debug: config.nodeEnv === 'development',
};

// Функция для настройки CORS с дополнительными опциями
export const configureCors = (options: Partial<CorsOptions> = {}): CorsOptions => {
  return {
    ...corsOptions,
    ...options,
  };
};

export default corsOptions;
