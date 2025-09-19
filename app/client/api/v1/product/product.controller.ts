import { Request, Response } from 'express';
import { BaseController, IApiResponse } from '../../../core/base/BaseController';
import { logger } from '../../../utils/logger';

// Типы данных
interface IProduct {
  id: string;
  name: string;
  price: number;
  // Другие поля продукта
}

export class ProductController extends BaseController {
  // Пример временного хранилища (в реальном приложении используйте БД)
  private products: IProduct[] = [];

  /**
   * Получить все товары
   */
  public getAllProducts = this.catchError(async (req: Request, res: Response): Promise<Response> => {
    // В реальном приложении здесь будет запрос к БД
    // const products = await this.productService.findAll(req.query);
    
    // Пример пагинации
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const result = this.products.slice(startIndex, endIndex);
    
    // Метаданные для пагинации
    const meta = {
      page,
      limit,
      total: this.products.length,
      totalPages: Math.ceil(this.products.length / limit)
    };
    
    return this.success(res, result, meta);
  });

  /**
   * Получить товар по ID
   */
  public getProductById = this.catchError(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    // В реальном приложении: const product = await this.productService.findById(id);
    const product = this.products.find(p => p.id === id);
    
    if (!product) {
      return this.error(res, 'Product not found', 'NOT_FOUND', 404);
    }
    
    return this.success(res, product);
  });

  /**
   * Создать новый товар
   */
  public createProduct = this.catchError(async (req: Request, res: Response): Promise<Response> => {
    const { name, price } = req.body;
    
    // Валидация
    if (!name || !price) {
      return this.error(res, 'Name and price are required', 'VALIDATION_ERROR', 400);
    }
    
    // В реальном приложении: const newProduct = await this.productService.create({ name, price });
    const newProduct: IProduct = {
      id: Date.now().toString(),
      name,
      price: Number(price)
    };
    
    this.products.push(newProduct);
    
    logger.info(`Product created: ${newProduct.id}`);
    
    return this.success(res, newProduct, undefined, 201);
  });

  /**
   * Обновить товар
   */
  public updateProduct = this.catchError(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, price } = req.body;
    
    // Находим индекс товара
    const productIndex = this.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return this.error(res, 'Product not found', 'NOT_FOUND', 404);
    }
    
    // Обновляем данные
    if (name) this.products[productIndex].name = name;
    if (price) this.products[productIndex].price = Number(price);
    
    logger.info(`Product updated: ${id}`);
    
    return this.success(res, this.products[productIndex]);
  });

  /**
   * Удалить товар
   */
  public deleteProduct = this.catchError(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    const productIndex = this.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return this.error(res, 'Product not found', 'NOT_FOUND', 404);
    }
    
    // Удаляем товар
    this.products.splice(productIndex, 1);
    
    logger.info(`Product deleted: ${id}`);
    
    return this.success(res, { success: true });
  });
}
