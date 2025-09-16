// path: src/api/v1/product/product.routes.ts
/**
 * Роуты для работы с товарами
 * Определяет API-эндпоинты для получения и обновления информации о товарах
 */

import { Router } from 'express';
import { getProductById, searchProducts, getProducts } from './product.controller';
import { productValidation } from '../../../middleware/validation';
import validateRequest from '../../../middleware/validation';

const router = Router();

// Определение маршрутов
router.get('/:id', 
  productValidation.getById, 
  validateRequest, 
  getProductById
);

router.get('/search', 
  productValidation.search, 
  validateRequest, 
  searchProducts
);

router.get('/', getProducts);

export default router;
