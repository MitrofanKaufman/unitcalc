// \services\api-gateway\src\middleware\error.middleware.ts
// Централизованная обработка ошибок
// Обеспечивает консистентный формат ответов об ошибках

import { Request, Response, NextFunction } from 'express'
import { error as logError } from '@wb-calc/logging'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logError('API Error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  } as any)

  // Определение типа ошибки
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Ошибка валидации',
      message: err.message
    })
    return
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      error: 'Неверный формат данных',
      message: 'Проверьте корректность ID или параметров'
    })
    return
  }

  // Общая ошибка сервера
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: 'Произошла непредвиденная ошибка'
  })
}
