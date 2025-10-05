// \services\api-gateway\src\middleware\rateLimit.middleware.ts
// Middleware для ограничения частоты запросов
// Предотвращает злоупотребления API через ограничение количества запросов

import rateLimit from 'express-rate-limit'

// Расширение типа Request для поддержки rateLimit
declare global {
  namespace Express {
    interface Request {
      rateLimit?: {
        resetTime?: number
      }
    }
  }
}

// Конфигурация rate limiting
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP за окно времени
  message: {
    error: 'Слишком много запросов с этого IP адреса, попробуйте позже',
    retryAfter: '15 минут'
  },
  standardHeaders: true, // Возвращать rate limit info в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
  handler: (req, res) => {
    res.status(429).json({
      error: 'Слишком много запросов',
      message: 'Превышен лимит запросов. Попробуйте через 15 минут.',
      retryAfter: Math.ceil((req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 / 60 : 15))
    })
  },
  // Пропускать rate limiting для health check
  skip: (req) => req.path === '/health'
})
