// path: src/api/v1/product/product.routes.ts
/**
 * Роуты для работы с товарами
 * Определяет API-эндпоинты для получения и обновления информации о товарах
 */

import { Router } from 'express';
import { 
  getProductById, 
  searchProducts, 
  getProducts, 
  analyzeProduct 
} from './product.controller';
import { productValidation, validateRequest } from '../../../middleware/validation';

const router = Router();

// Определение маршрутов
// Обратите внимание: префикс /api/v1/products или /api/v1/product добавляется в RouteManager

/**
 * @route GET /:id
 * @desc Получить товар по ID
 * @access Public
 */
router.get('/:id', 
  productValidation.getById, 
  validateRequest, 
  getProductById
);

/**
 * @route GET /search
 * @desc Поиск товаров
 * @access Public
 */
router.get('/search', 
  productValidation.search, 
  validateRequest, 
  searchProducts
);

/**
 * @route GET /
 * @desc Получить список всех товаров (с пагинацией)
 * @access Public
 */
router.get('/', getProducts);

/**
 * @route GET /:id/analyze
 * @desc Анализ товара по ID
 * @access Public
 */
router.get(
  '/:id/analyze',
  productValidation.getById,
  validateRequest,
  analyzeProduct
);

export default router;
