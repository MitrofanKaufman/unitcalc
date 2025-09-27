// \services\api-gateway\src\middleware\notFound.middleware.ts
// Обработка 404 ошибок
// Middleware для обработки несуществующих маршрутов

import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    message: `Маршрут ${req.method} ${req.path} не существует`,
    availableRoutes: {
      units: '/api/units/*',
      currency: '/api/currency/*',
      calculations: '/api/calculations/*',
      scraping: '/api/scraping/*'
    }
  })
}
