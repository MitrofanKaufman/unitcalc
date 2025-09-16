// path: src/api/v1/product/product.routes.ts
/**
 * Роуты для работы с товарами
 * Определяет API-эндпоинты для получения и обновления информации о товарах
 */

import { Router } from 'express';
import { getProductById, searchProducts, getProducts, analyzeProduct } from './product.controller';
import { productValidation, validateRequest } from '../../../middleware/validation';

const router = Router();

// Определение маршрутов
// Обратите внимание: префикс /api/v1/products или /api/v1/product добавляется в RouteManager

// Получить товар по ID
// Полный путь: /api/v1/products/:id или /api/v1/product/:id
router.get('/:id', 
  productValidation.getById, 
  validateRequest, 
  getProductById
);

// Поиск товаров
// Полный путь: /api/v1/products/search или /api/v1/product/search
router.get('/search', 
  productValidation.search, 
  validateRequest, 
  searchProducts
);

// Получить список товаров
// Полный путь: /api/v1/products или /api/v1/product
router.get('/', getProducts);

// Анализ товара по ID
// Полный путь: /api/v1/products/:id/analyze или /api/v1/product/:id/analyze
router.get(
  '/:id/analyze',
  productValidation.getById,
  validateRequest,
  analyzeProduct
);

export default router;
