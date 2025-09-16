// path: src/config/rateLimit.ts
/**
 * Конфигурация ограничения количества запросов (Rate Limiting)
 * Защищает API от злоупотреблений и DDoS-атак
 */

import { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utils/apiResponse';
import config from './config';

// Интерфейс для конфигурации лимитов запросов
interface IRateLimitConfig {
  windowMs: number; // Окно времени в миллисекундах
  max: number; // Максимальное количество запросов за окно
  message: string; // Сообщение об ошибке
  statusCode?: number; // Код состояния HTTP при превышении лимита
  standardHeaders?: boolean; // Возвращать заголовки RateLimit-*
  legacyHeaders?: boolean; // Включить заголовки X-RateLimit-*
  skipFailedRequests?: boolean; // Не учитывать неудачные запросы
  skipSuccessfulRequests?: boolean; // Не учитывать успешные запросы
  keyGenerator?: (req: Request) => string; // Функция для генерации ключа
  handler?: (req: Request, res: Response, next: NextFunction, options: any) => void; // Обработчик при превышении лимита
}

// Базовая конфигурация для разных типов эндпоинтов
const rateLimitConfigs = {
  // Общий лимит для API
  api: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // 100 запросов с одного IP за 15 минут
    message: 'Слишком много запросов с вашего IP, попробуйте позже',
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Более строгий лимит для аутентификации
  auth: {
    windowMs: 60 * 60 * 1000, // 1 час
    max: 10, // 10 попыток входа с одного IP за час
    message: 'Слишком много попыток входа, попробуйте позже',
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Лимит для публичных API
  publicApi: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 300, // 300 запросов с одного IP за 15 минут
    message: 'Слишком много запросов, попробуйте позже',
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Строгий лимит для критических эндпоинтов
  strict: {
    windowMs: 60 * 60 * 1000, // 1 час
    max: 5, // 5 запросов с одного IP за час
    message: 'Превышено максимальное количество запросов, попробуйте позже',
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
  },
} as const;

/**
 * Пользовательский обработчик для превышения лимита запросов
 */
const rateLimitHandler = (req: Request, res: Response, next: NextFunction, options: any) => {
  // Логируем событие превышения лимита
  if (config.nodeEnv === 'development') {
    console.warn(`[Rate Limit] Превышен лимит запросов для ${req.ip} на ${req.path}`);
  }
  
  // Отправляем стандартизированный ответ об ошибке
  const response = new ApiResponse(
    false,
    options.message || 'Слишком много запросов, попробуйте позже',
    null,
    {
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(options.windowMs / 1000), // Время ожидания в секундах
    },
    options.statusCode || 429
  );
  
  res.status(response.statusCode).json(response);
};

/**
 * Получить конфигурацию ограничения запросов
 * @param type Тип лимита (api, auth, publicApi, strict)
 * @returns Конфигурация для express-rate-limit
 */
const getRateLimitConfig = (type: keyof typeof rateLimitConfigs = 'api'): IRateLimitConfig => {
  const config = rateLimitConfigs[type];
  
  return {
    ...config,
    handler: rateLimitHandler,
    // Используем X-Forwarded-For, если приложение за прокси
    keyGenerator: (req: Request) => {
      return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
    },
  };
};

/**
 * Мидлвара для ограничения количества запросов
 * @param type Тип лимита (api, auth, publicApi, strict)
 * @returns Middleware функция для Express
 */
const rateLimiter = (type: keyof typeof rateLimitConfigs = 'api'): RateLimitRequestHandler => {
  // В тестовом окружении не применяем ограничения
  if (process.env.NODE_ENV === 'test') {
    return (req: Request, res: Response, next: NextFunction) => next();
  }
  
  const { rateLimit } = require('express-rate-limit');
  return rateLimit(getRateLimitConfig(type));
};

export { rateLimiter, getRateLimitConfig };
