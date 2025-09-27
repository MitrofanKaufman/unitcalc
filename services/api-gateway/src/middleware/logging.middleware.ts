// \services\api-gateway\src\middleware\logging.middleware.ts
// Middleware для логирования запросов
// Отслеживает все входящие HTTP запросы

import { Request, Response, NextFunction } from 'express'
import { log } from '@wb-calc/logging'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  // Логирование входящего запроса
  log('Входящий запрос: ' + req.method + ' ' + req.url)

  // Логирование ответа
  res.on('finish', () => {
    const duration = Date.now() - start
    log(`Ответ отправлен: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`)
  })

  next()
}
