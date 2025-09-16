// path: src/api/v1/product/product.controller.ts
/**
 * Контроллер для работы с товарами
 * Обрабатывает запросы, связанные с получением и обновлением информации о товарах
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import Product from '../../../db/models/Product';
import ApiError from '../../../utils/ApiError';
import { matchedData } from 'express-validator';
import { 
  IProduct, 
  TProductResponse, 
  TProductsResponse, 
  IGetProductsQuery, 
  IPaginatedResult,
  IProductFilter
} from './product.types';

/**
 * Получить информацию о товаре по ID
 */
/**
 * Получить товар по ID
 */
export const getProductById = async (
  req: Request<{ id: string }>, 
  res: Response<TProductResponse>, 
  next: NextFunction
) => {
  try {
    // Получаем провалидированные данные
    const { id: productId } = matchedData(req, { locations: ['params'] });
    const { fields } = matchedData(req, { locations: ['query'] });
    
    // Определяем, какие поля нужно вернуть
    const selectFields = fields ? fields.split(',').map((f: string) => f.trim()) : [];
    
    // Строим запрос с учетом выбранных полей
    let query = Product.findById(productId);
    
    if (selectFields.length > 0) {
      const projection: Record<string, number> = {};
      selectFields.forEach(field => {
        projection[field] = 1;
      });
      query = query.select(projection);
    }
    
    // Выполняем запрос
    const product = await query.lean();
    
    if (!product) {
      throw new ApiError('Товар не найден', 404, 'PRODUCT_NOT_FOUND');
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Поиск товаров по запросу
 */
/**
 * Поиск товаров
 */
export const searchProducts = async (
  req: Request<{}, {}, {}, IGetProductsQuery & { query: string }>, 
  res: Response<TProductsResponse>, 
  next: NextFunction
) => {
  try {
    // Получаем провалидированные данные
    const { query, limit = 10, offset = 0 } = matchedData(req, { locations: ['query'] });
    
    // Строим поисковый запрос
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { article: query },
        { description: { $regex: query, $options: 'i' } },
        { 'barcode': query }
      ]
    };
    
    // Выполняем поиск с пагинацией
    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean(),
      Product.countDocuments(searchQuery)
    ]);
    
    // Формируем ответ
    res.json({
      success: true,
      data: products,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + products.length < total
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Получить список товаров с пагинацией
 */
/**
 * Получить список товаров с пагинацией
 */
export const getProducts = async (
  req: Request<{}, {}, {}, IGetProductsQuery>, 
  res: Response<TProductsResponse>, 
  next: NextFunction
) => {
  try {
    // Получаем провалидированные параметры запроса
    const { limit = 20, offset = 0, sort = '-createdAt' } = matchedData(req, { locations: ['query'] });
    
    // Парсим параметр сортировки
    const sortOptions: Record<string, 1 | -1> = {};
    const sortFields = (sort || '-createdAt').split(',');
    
    sortFields.forEach(field => {
      if (!field) return;
      const sortOrder = field.startsWith('-') ? -1 : 1;
      const fieldName = field.replace(/^[+-]/, '');
      if (fieldName) {
        sortOptions[fieldName] = sortOrder;
      }
    });
    
    // Строим фильтр
    const filter: IProductFilter = { isActive: true };
    
    // Добавляем поиск по имени, если передан
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { article: { $regex: search, $options: 'i' } },
        { barcode: search }
      ];
    }
    
    // Выполняем запрос с пагинацией и сортировкой
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .limit(limit)
        .skip(offset)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    // Формируем ответ
    res.json({
      success: true,
      data: products,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + products.length < total
      }
    });
    
  } catch (error) {
    next(error);
  }
};
