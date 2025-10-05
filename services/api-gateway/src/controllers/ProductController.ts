import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CalculationService } from '../services/CalculationService';
import {
  ApiResponse,
  CreateProductDto,
  UpdateProductDto,
  CalculateProfitabilityDto,
  SearchProductsDto,
  ERROR_CODES
} from '../types';

/**
 * Контроллер для работы с товарами
 * Обрабатывает HTTP запросы и делегирует логику сервисам
 */
export class ProductController {
  private productService: ProductService;
  private calculationService: CalculationService;

  constructor() {
    this.productService = new ProductService();
    this.calculationService = new CalculationService();
  }

  /**
   * Поиск товаров
   * GET /api/products/search
   */
  async searchProducts(req: Request, res: Response) {
    try {
      const { query, marketplace, category, limit = 20, offset = 0 } = req.query;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Параметр query обязателен',
          errors: ['Query parameter is required'],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      const searchDto: SearchProductsDto = {
        query,
        marketplace: typeof marketplace === 'string' ? marketplace : undefined,
        category: typeof category === 'string' ? category : undefined,
        limit: Number(limit),
        offset: Number(offset)
      };

      const result = await this.productService.searchProducts(searchDto);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof result>);
    } catch (error) {
      console.error('Ошибка поиска товаров:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Получение товара по ID
   * GET /api/products/:id
   */
  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID товара обязателен',
          errors: ['Product ID is required'],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      const product = await this.productService.getProduct(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Товар не найден',
          errors: [ERROR_CODES.NOT_FOUND],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      res.json({
        success: true,
        data: product,
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof product>);
    } catch (error) {
      console.error('Ошибка получения товара:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Создание товара
   * POST /api/products
   */
  async createProduct(req: Request, res: Response) {
    try {
      const productData: CreateProductDto = req.body;

      // Валидация данных
      const validationErrors = this.validateProductData(productData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ошибка валидации данных',
          errors: validationErrors,
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      const product = await this.productService.createProduct(productData);

      res.status(201).json({
        success: true,
        data: product,
        message: 'Товар успешно создан',
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof product>);
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Обновление товара
   * PUT /api/products/:id
   */
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productData: UpdateProductDto = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID товара обязателен',
          errors: ['Product ID is required'],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      // Валидация данных
      const validationErrors = this.validateProductData(productData, false);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ошибка валидации данных',
          errors: validationErrors,
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      const product = await this.productService.updateProduct(id, productData);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Товар не найден',
          errors: [ERROR_CODES.NOT_FOUND],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      res.json({
        success: true,
        data: product,
        message: 'Товар успешно обновлен',
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof product>);
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Расчет доходности товара
   * POST /api/products/:id/calculate
   */
  async calculateProfitability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const calculationData: CalculateProfitabilityDto = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID товара обязателен',
          errors: ['Product ID is required'],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      // Проверка существования товара
      const product = await this.productService.getProduct(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Товар не найден',
          errors: [ERROR_CODES.NOT_FOUND],
          timestamp: new Date().toISOString()
        } as ApiResponse<null>);
      }

      const calculation = await this.calculationService.calculateProfitability({
        ...calculationData,
        productId: id,
        marketplaceId: calculationData.marketplaceId || product.marketplaceId,
        categoryId: calculationData.categoryId || product.category
      });

      res.json({
        success: true,
        data: calculation,
        message: 'Расчет доходности выполнен успешно',
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof calculation>);
    } catch (error) {
      console.error('Ошибка расчета доходности:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Получение списка маркетплейсов
   * GET /api/marketplaces
   */
  async getMarketplaces(req: Request, res: Response) {
    try {
      const marketplaces = await this.productService.getMarketplaces();

      res.json({
        success: true,
        data: marketplaces,
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof marketplaces>);
    } catch (error) {
      console.error('Ошибка получения маркетплейсов:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Получение списка категорий
   * GET /api/categories
   */
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.productService.getCategories();

      res.json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString()
      } as ApiResponse<typeof categories>);
    } catch (error) {
      console.error('Ошибка получения категорий:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errors: [ERROR_CODES.INTERNAL_ERROR],
        timestamp: new Date().toISOString()
      } as ApiResponse<null>);
    }
  }

  /**
   * Валидация данных товара
   */
  private validateProductData(data: CreateProductDto | UpdateProductDto, isCreate = true): string[] {
    const errors: string[] = [];

    if (isCreate || data.name !== undefined) {
      if (!data.name || data.name.length < 3 || data.name.length > 200) {
        errors.push('Название товара должно содержать от 3 до 200 символов');
      }
    }

    if (isCreate || data.price !== undefined) {
      if (data.price === undefined || data.price <= 0 || data.price > 1000000) {
        errors.push('Цена должна быть больше 0 и не превышать 1 000 000');
      }
    }

    if (isCreate || data.marketplaceId !== undefined) {
      if (!data.marketplaceId) {
        errors.push('ID маркетплейса обязателен');
      }
    }

    if (isCreate || data.category !== undefined) {
      if (!data.category) {
        errors.push('Категория товара обязательна');
      }
    }

    return errors;
  }
}
