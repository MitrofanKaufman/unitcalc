// path: src/api/v1/product/product.controller.ts
/**
 * Контроллер для работы с товарами
 * Обрабатывает запросы, связанные с получением и обновлением информации о товарах
 */

import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { getRepository } from 'typeorm';
import { Product } from '@db/entities/Product';
import ApiError from '@utils/ApiError';
import { productService } from '../../../services/ProductService';
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
export const getProductById = async (
  req: Request<{ id: string }>, 
  res: Response<TProductResponse>, 
  next: NextFunction
) => {
  try {
    const { id: productId } = matchedData(req, { locations: ['params'] });
    const { fields } = matchedData(req, { locations: ['query'] });
    
    // Получаем репозиторий для работы с продуктами
    const productRepository = getRepository(Product);
    
    // Создаем query builder
    const queryBuilder = productRepository.createQueryBuilder('product');
    
    // Выбираем только указанные поля, если они заданы
    if (fields) {
      const fieldList = fields.split(',').map(f => f.trim());
      queryBuilder.select(fieldList.map(field => `product.${field}`));
    }
    
    // Добавляем условие поиска по ID
    queryBuilder.where('product.id = :id', { id: productId });
    
    // Выполняем запрос
    const product = await queryBuilder.getOne();
    
    if (!product) {
      throw new ApiError('Товар не найден', 404, 'PRODUCT_NOT_FOUND');
    }
    
    res.json({
      success: true,
      data: product as unknown as IProduct
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Поиск товаров по запросу с пагинацией и фильтрацией
 */
export const searchProducts = async (
  req: Request<{}, {}, {}, IGetProductsQuery>,
  res: Response<TProductsResponse>,
  next: NextFunction
) => {
  try {
    const { q, page = '1', limit = '10', sortBy, sortOrder = 'asc', ...filters } = req.query;
    
    // Параметры пагинации
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Получаем репозиторий для работы с продуктами
    const productRepository = getRepository(Product);
    
    // Создаем query builder
    const queryBuilder = productRepository.createQueryBuilder('product');
    
    // Применяем поиск по тексту, если задан
    if (q) {
      queryBuilder.where(
        'LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search OR LOWER(JSON_EXTRACT(product.metadata, \'$.brand\')) LIKE :search OR LOWER(JSON_EXTRACT(product.metadata, \'$.category\')) LIKE :search',
        { search: `%${q.toLowerCase()}%` }
      );
    }
    
    // Применяем фильтры
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          queryBuilder.andWhere(`product.${key} IN (:...${key}Values)`, { [`${key}Values`]: value });
        } else {
          queryBuilder.andWhere(`product.${key} = :${key}`, { [key]: value });
        }
      }
    });
    
    // Получаем общее количество записей
    const total = await queryBuilder.getCount();
    
    // Применяем сортировку
    if (sortBy) {
      const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(`product.${sortBy}`, orderDirection);
    } else {
      // Сортировка по умолчанию
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }
    
    // Применяем пагинацию
    queryBuilder.skip(skip).take(limitNum);
    
    // Выполняем запрос
    const items = await queryBuilder.getMany();
    
    // Формируем ответ
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      data: {
        items: items as unknown as IProduct[],
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Получить список товаров с пагинацией
 */
export const getProducts = async (
  req: Request<{}, {}, {}, IGetProductsQuery>,
  res: Response<TProductsResponse>,
  next: NextFunction
) => {
  try {
    const { page = '1', limit = '10', sortBy, sortOrder = 'asc', ...filters } = req.query;
    
    // Параметры пагинации
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Получаем репозиторий для работы с продуктами
    const productRepository = getRepository(Product);
    
    // Создаем query builder
    const queryBuilder = productRepository.createQueryBuilder('product');
    
    // Применяем фильтры
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          queryBuilder.andWhere(`product.${key} IN (:...${key}Values)`, { [`${key}Values`]: value });
        } else {
          queryBuilder.andWhere(`product.${key} = :${key}`, { [key]: value });
        }
      }
    });
    
    // Получаем общее количество записей
    const total = await queryBuilder.getCount();
    
    // Применяем сортировку
    if (sortBy) {
      const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(`product.${sortBy}`, orderDirection);
    } else {
      // Сортировка по умолчанию
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }
    
    // Применяем пагинацию
    queryBuilder.skip(skip).take(limitNum);
    
    // Выполняем запрос
    const items = await queryBuilder.getMany();
    
    // Формируем ответ
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      data: {
        items: items as unknown as IProduct[],
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Анализ товара по ID
 */
export const analyzeProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: productId } = matchedData(req, { locations: ['params'] });
    
    if (!productId) {
      throw new ApiError('ID товара обязателен', 400, 'VALIDATION_ERROR');
    }
    
    // Вызываем метод analyzeProduct из сервиса
    const result = await productService.analyzeProduct(productId);
    
    if (!result.success) {
      throw new ApiError(
        result.error || 'Ошибка при анализе товара',
        500,
        result.code || 'ANALYSIS_ERROR',
        result.details
      );
    }
    
    res.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    next(error);
  }
};
