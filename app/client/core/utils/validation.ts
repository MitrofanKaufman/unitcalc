// path: src/middleware/validation.ts
/**
 * Модуль валидации входящих запросов
 * Содержит схемы валидации и middleware для проверки данных
 */

import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Схемы валидации для товаров
 */
export const productValidation = {
  /**
   * Валидация параметра ID товара
   */
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Некорректный формат ID товара')
  ],
  
  /**
   * Валидация параметров поиска товаров
   */
  search: [
    query('query')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Поисковый запрос должен содержать от 1 до 100 символов'),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Лимит должен быть числом от 1 до 100'),
      
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Смещение должно быть положительным числом')
  ],
  
  /**
   * Валидация данных для создания/обновления товара
   */
  createOrUpdate: [
    body('name')
      .isString()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Название товара должно содержать от 2 до 100 символов'),
      
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Цена должна быть положительным числом'),
      
    body('category')
      .optional()
      .isString()
      .withMessage('Категория должна быть строкой'),
      
    body('description')
      .optional()
      .isString()
      .isLength({ max: 1000 })
      .withMessage('Описание не должно превышать 1000 символов')
  ]
};

/**
 * Middleware для обработки ошибок валидации
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        param: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

export default {
  productValidation,
  validateRequest
};
