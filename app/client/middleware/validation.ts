// path: src/middleware/validation.ts
/**
 * Middleware для валидации входящих запросов
 * Использует express-validator для проверки данных
 */

import { validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Валидация для продуктов
const productValidation = {
  // Валидация для получения товара по ID
  getById: [
    // Проверяем, что id - это число
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ 
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Неверный формат ID. Ожидается число.'
          }
        });
      }
      next();
    }
  ],
  
  // Валидация для поиска товаров
  search: [
    // Проверяем наличие поискового запроса
    (req: Request, res: Response, next: NextFunction) => {
      const { query } = req.query;
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        return res.status(400).json({ 
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: 'Поисковый запрос должен содержать не менее 2 символов.'
          }
        });
      }
      next();
    }
  ],
  
  // Дополнительные валидации можно добавить здесь
};

// Middleware для обработки ошибок валидации
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Ошибка валидации запроса', { 
      path: req.path, 
      method: req.method,
      errors: errors.array() 
    });
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Ошибка валидации входящих данных',
        details: errors.array().map(err => ({
          param: err.param,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }
  next();
};

export { productValidation, validateRequest };
