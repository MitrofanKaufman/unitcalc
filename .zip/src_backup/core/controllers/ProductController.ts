// path: src/controllers/ProductController.ts
/**
 * Контроллер для работы с товарами
 * Обрабатывает HTTP-запросы, связанные с товарами
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import ProductService from '../../pages/product/ProductService';
import ApiResponse from '../../../../app/client/utils/apiResponse';
import { ERROR_CODES } from '../../config/constants';
import ApiError from '../../../../app/client/utils/ApiError';
import { IProduct } from '@db/models/Product';

// Асинхронная версия fs.unlink
const unlinkAsync = promisify(fs.unlink);

// Интерфейс для запроса поиска товаров
interface ISearchQuery {
  query: string;
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
}

/**
 * Контроллер для работы с товарами
 */
class ProductController {
  /**
   * Поиск товаров в Wildberries
   */
  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация входных данных
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(
          res,
          'Ошибка валидации',
          { errors: errors.array() }
        );
      }
      
      const {
        query,
        page = 1,
        limit = 20,
        sort,
        category,
        minPrice,
        maxPrice,
        rating,
        inStock
      } = req.query as unknown as ISearchQuery;
      
      // Вызываем сервис для поиска товаров
      const result = await ProductService.searchProducts({
        query,
        page: Number(page),
        limit: Number(limit),
        sort,
        category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        rating: rating ? Number(rating) : undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
      });
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        result.data,
        'Товары успешно найдены',
        200,
        {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: Math.ceil(result.total / result.limit),
          },
        }
      );
      
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Получение информации о товаре по ID
   */
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return ApiResponse.validationError(
          res,
          'ID товара обязателен',
          { field: 'id' }
        );
      }
      
      // Вызываем сервис для получения информации о товаре
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        return ApiResponse.notFound(
          res,
          'Товар не найден',
          { id }
        );
      }
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        product,
        'Информация о товаре успешно получена'
      );
      
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Расчет рентабельности товара
   */
  async calculateProfitability(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация входных данных
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(
          res,
          'Ошибка валидации',
          { errors: errors.array() }
        );
      }
      
      const {
        price,
        costPrice,
        logisticsCost = 100,
        storageDays = 30,
        commissionPercent = 15,
        vatPercent = 20
      } = req.body;
      
      // Вызываем сервис для расчета рентабельности
      const result = ProductService.calculateProfitability(
        parseFloat(price),
        costPrice !== undefined ? parseFloat(costPrice) : undefined,
        parseFloat(logisticsCost),
        parseInt(storageDays, 10),
        parseFloat(commissionPercent),
        parseFloat(vatPercent)
      );
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        result,
        'Расчет рентабельности выполнен успешно'
      );
      
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Создание товара
   */
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация входных данных
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Удаляем загруженные файлы, если есть
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          await Promise.all(
            req.files.map((file: Express.Multer.File) => 
              unlinkAsync(file.path).catch(console.error)
            )
          );
        }
        
        return ApiResponse.validationError(
          res,
          'Ошибка валидации',
          { errors: errors.array() }
        );
      }
      
      const productData: Partial<IProduct> = req.body;
      const userId = (req as any).user?.id || 'system';
      
      // Обработка загруженных файлов
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        productData.images = (req.files as Express.Multer.File[]).map(file => ({
          url: `/uploads/products/${file.filename}`,
          isMain: false,
        }));
        
        if (productData.images.length > 0) {
          productData.images[0].isMain = true;
        }
      }
      
      // Вызываем сервис для создания товара
      const product = await ProductService.createProduct(productData, userId);
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        product,
        'Товар успешно создан',
        201
      );
      
    } catch (error) {
      // Удаляем загруженные файлы в случае ошибки
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        await Promise.all(
          (req.files as Express.Multer.File[]).map(file => 
            unlinkAsync(file.path).catch(console.error)
          )
        );
      }
      
      next(error);
    }
  }
  
  /**
   * Обновление товара
   */
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация входных данных
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Удаляем загруженные файлы, если есть
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          await Promise.all(
            (req.files as Express.Multer.File[]).map(file => 
              unlinkAsync(file.path).catch(console.error)
            )
          );
        }
        
        return ApiResponse.validationError(
          res,
          'Ошибка валидации',
          { errors: errors.array() }
        );
      }
      
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id || 'system';
      
      if (!id) {
        return ApiResponse.validationError(
          res,
          'ID товара обязателен',
          { field: 'id' }
        );
      }
      
      // Обработка загруженных файлов
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        updateData.images = (req.files as Express.Multer.File[]).map(file => ({
          url: `/uploads/products/${file.filename}`,
          isMain: false,
        }));
      }
      
      // Вызываем сервис для обновления товара
      const updatedProduct = await ProductService.updateProduct(
        id,
        updateData,
        userId
      );
      
      if (!updatedProduct) {
        return ApiResponse.notFound(
          res,
          'Товар не найден',
          { id }
        );
      }
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        updatedProduct,
        'Товар успешно обновлен'
      );
      
    } catch (error) {
      // Удаляем загруженные файлы в случае ошибки
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        await Promise.all(
          (req.files as Express.Multer.File[]).map(file => 
            unlinkAsync(file.path).catch(console.error)
          )
        );
      }
      
      next(error);
    }
  }
  
  /**
   * Удаление товара
   */
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 'system';
      
      if (!id) {
        return ApiResponse.validationError(
          res,
          'ID товара обязателен',
          { field: 'id' }
        );
      }
      
      // Вызываем сервис для удаления товара
      const result = await ProductService.deleteProduct(id, userId);
      
      if (!result) {
        return ApiResponse.notFound(
          res,
          'Товар не найден',
          { id }
        );
      }
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        null,
        'Товар успешно удален',
        204
      );
      
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Загрузка изображения товара
   */
  async uploadProductImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return ApiResponse.validationError(
          res,
          'Файл не загружен',
          { field: 'image' }
        );
      }
      
      const { productId } = req.params;
      const userId = (req as any).user?.id || 'system';
      
      if (!productId) {
        // Удаляем загруженный файл, если нет ID товара
        await unlinkAsync(req.file.path).catch(console.error);
        
        return ApiResponse.validationError(
          res,
          'ID товара обязателен',
          { field: 'productId' }
        );
      }
      
      // Вызываем сервис для загрузки изображения
      const imagePath = await ProductService.uploadProductImage(
        req.file,
        productId,
        userId
      );
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        { imagePath },
        'Изображение успешно загружено',
        201
      );
      
    } catch (error) {
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        await unlinkAsync(req.file.path).catch(console.error);
      }
      
      next(error);
    }
  }
  
  /**
   * Импорт товаров из файла
   */
  async importProducts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return ApiResponse.validationError(
          res,
          'Файл не загружен',
          { field: 'file' }
        );
      }
      
      const userId = (req as any).user?.id || 'system';
      
      // Вызываем сервис для импорта товаров
      const result = await ProductService.importProducts(req.file, userId);
      
      // Удаляем загруженный файл после обработки
      await unlinkAsync(req.file.path).catch(console.error);
      
      // Возвращаем результат
      return ApiResponse.success(
        res,
        result,
        `Импорт завершен. Успешно: ${result.success}, Ошибок: ${result.failed}`
      );
      
    } catch (error) {
      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        await unlinkAsync(req.file.path).catch(console.error);
      }
      
      next(error);
    }
  }
  
  /**
   * Экспорт товаров в файл
   */
  async exportProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'system';
      
      // Вызываем сервис для экспорта товаров
      const csvContent = await ProductService.exportProducts(req.query, userId);
      
      // Устанавливаем заголовки для скачивания файла
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=products-export.csv');
      
      // Отправляем файл
      return res.send(csvContent);
      
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
