// path: src/middleware/errorHandler.ts
/**
 * Middleware для обработки ошибок в Express-приложении
 * Предоставляет централизованную обработку ошибок и форматирование ответов
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Класс пользовательской ошибки приложения
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    // Сохраняем стек вызовов, но не загрязняем его самой ошибкой
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware для обработки 404 ошибок (не найден маршрут)
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Не найден ресурс: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Middleware для обработки всех ошибок
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Устанавливаем значения по умолчанию, если они не заданы
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Логируем ошибку
  if (process.env.NODE_ENV === 'development') {
    logger.error(`[${new Date().toISOString()}] ${err.statusCode} - ${err.message}`);
    logger.error(err.stack);
  } else if (process.env.NODE_ENV === 'production') {
    // В продакшене не логируем стек-трейс для пользовательских ошибок
    if (err.isOperational) {
      logger.error(`[${new Date().toISOString()}] ${err.statusCode} - ${err.message}`);
    } else {
      // Для непредвиденных ошибок логируем полную информацию
      logger.error('НЕПРЕДВИДЕННАЯ ОШИБКА:', err);
    }
  }
  
  // В продакшене не показываем детали ошибки клиенту
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    err.message = 'Произошла ошибка на сервере';
  }
  
  // Отправляем ответ клиенту
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Обертка для асинхронных контроллеров, которая автоматически обрабатывает ошибки
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Обработчик необработанных отклоненных промисов
 */
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  logger.error('НЕОБРАБОТАННОЕ ОТКЛОНЕНИЕ ПРОМИСА:');
  logger.error('Причина:', reason);
  
  // Закрываем сервер и завершаем процесс
  // В продакшене можно использовать инструменты для перезапуска процесса
  process.exit(1);
});

/**
 * Обработчик необработанных исключений
 */
process.on('uncaughtException', (err: Error) => {
  logger.error('НЕОБРАБОТАННОЕ ИСКЛЮЧЕНИЕ:', err);
  
  // Закрываем сервер и завершаем процесс
  // В продакшене можно использовать инструменты для перезапуска процесса
  process.exit(1);
});
