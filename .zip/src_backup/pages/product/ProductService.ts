// path: src/services/ProductService.ts
/**
 * Сервис для работы с товарами
 * Обеспечивает бизнес-логику для операций с товарами
 */

import { IProduct, IProductDocument } from '@db/models/Product';
import { IUser } from '@db/models/User';
import { WB_API, ERROR_CODES } from '../../config/constants';
import ApiError from '../../../../app/client/utils/ApiError';
import axios, { AxiosInstance } from 'axios';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

// Асинхронный pipeline для работы с потоками
const streamPipeline = promisify(pipeline);

// Интерфейс для ответа API Wildberries
interface IWBProduct {
  nmId: number;
  name: string;
  brand: string;
  brandId: number;
  siteBrandId: number;
  supplierId: number;
  sale: number;
  price: number;
  salePrice: number;
  rating: number;
  feedbacks: number;
  colors: string[];
  quantity: number;
  category: string;
  rootCategory: string;
  previewImage: string;
  images: string[];
  description: string;
  characteristics: Array<{ name: string; value: string }>;
  sizes: Array<{
    name: string;
    origName: string;
    rank: number;
    optionId: number;
    stocks: Array<{
      qty: number;
      time1: number;
      time2: number;
      wh: number;
    }>;
  }>;
}

// Интерфейс для поискового запроса
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

// Интерфейс для пагинации
interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Интерфейс для расчета рентабельности
interface IProfitabilityCalculation {
  price: number; // Цена продажи
  costPrice?: number; // Себестоимость
  commission: number; // Комиссия WB (%)
  logisticsCost: number; // Стоимость логистики
  storageCost: number; // Стоимость хранения
  vat: number; // НДС (%)
  profit: number; // Прибыль
  profitMargin: number; // Рентабельность (%)
  breakEvenPoint: number; // Точка безубыточности
}

/**
 * Сервис для работы с товарами
 */
class ProductService {
  private wbApi: AxiosInstance;
  
  constructor() {
    // Инициализация HTTP-клиента для работы с API Wildberries
    this.wbApi = axios.create({
      baseURL: WB_API.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Добавляем перехватчик для обработки ошибок API
    this.wbApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Ошибка от API
          const { status, data } = error.response;
          throw new ApiError(
            `Ошибка API Wildberries: ${data.message || 'Неизвестная ошибка'}`,
            status,
            ERROR_CODES.WB_API_ERROR,
            data
          );
        } else if (error.request) {
          // Ошибка запроса (нет ответа от сервера)
          throw new ApiError(
            'Не удалось подключиться к API Wildberries',
            503,
            ERROR_CODES.WB_API_ERROR
          );
        } else {
          // Ошибка при настройке запроса
          throw new ApiError(
            `Ошибка при выполнении запроса: ${error.message}`,
            500,
            ERROR_CODES.INTERNAL_ERROR
          );
        }
      }
    );
  }
  
  /**
   * Поиск товаров в Wildberries
   */
  async searchProducts(query: ISearchQuery): Promise<IPaginationResult<IWBProduct>> {
    try {
      const {
        query: searchQuery,
        page = 1,
        limit = 20,
        sort = 'popular',
        category,
        minPrice,
        maxPrice,
        rating,
        inStock
      } = query;
      
      // Формируем параметры запроса
      const params: Record<string, any> = {
        query: searchQuery,
        page,
        limit,
        sort,
      };
      
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;
      if (inStock !== undefined) params.inStock = inStock;
      
      // В реальном приложении здесь будет вызов API Wildberries
      // const response = await this.wbApi.get('/api/v2/search', { params });
      // return response.data;
      
      // Заглушка для тестирования
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при поиске товаров',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Получение информации о товаре по ID
   */
  async getProductById(productId: string | number): Promise<IWBProduct> {
    try {
      if (!productId) {
        throw new ApiError(
          'ID товара обязателен',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // В реальном приложении здесь будет вызов API Wildberries
      // const response = await this.wbApi.get(`/api/v2/goods/${productId}`);
      // return response.data;
      
      // Заглушка для тестирования
      return {
        nmId: Number(productId),
        name: 'Тестовый товар',
        brand: 'Test Brand',
        brandId: 1,
        siteBrandId: 1,
        supplierId: 1,
        sale: 0,
        price: 1000,
        salePrice: 1000,
        rating: 4.5,
        feedbacks: 42,
        colors: ['Красный', 'Синий'],
        quantity: 100,
        category: 'Тестовая категория',
        rootCategory: 'Тестовая корневая категория',
        previewImage: 'https://example.com/image.jpg',
        images: ['https://example.com/image.jpg'],
        description: 'Тестовое описание товара',
        characteristics: [
          { name: 'Вес', value: '1 кг' },
          { name: 'Размеры', value: '10x10x10 см' },
        ],
        sizes: [
          {
            name: 'Универсальный',
            origName: 'Универсальный',
            rank: 1,
            optionId: 1,
            stocks: [
              { qty: 50, time1: 1, time2: 2, wh: 1 },
            ],
          },
        ],
      };
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при получении информации о товаре',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Расчет рентабельности товара
   */
  calculateProfitability(
    price: number,
    costPrice?: number,
    logisticsCost: number = 100,
    storageDays: number = 30,
    commissionPercent: number = 15,
    vatPercent: number = 20
  ): IProfitabilityCalculation {
    try {
      // Валидация входных данных
      if (price <= 0) {
        throw new ApiError(
          'Цена должна быть больше 0',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      if (costPrice !== undefined && costPrice < 0) {
        throw new ApiError(
          'Себестоимость не может быть отрицательной',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      if (logisticsCost < 0) {
        throw new ApiError(
          'Стоимость логистики не может быть отрицательной',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      if (storageDays < 0) {
        throw new ApiError(
          'Срок хранения не может быть отрицательным',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // Рассчитываем комиссию WB
      const commission = (price * commissionPercent) / 100;
      
      // Рассчитываем стоимость хранения (упрощенно)
      const storageCostPerDay = 5; // Условная стоимость хранения за день
      const storageCost = storageDays * storageCostPerDay;
      
      // Рассчитываем НДС (если продавец на ОСН)
      const vat = (price * vatPercent) / 100;
      
      // Рассчитываем прибыль
      const totalCosts = (costPrice || 0) + commission + logisticsCost + storageCost + vat;
      const profit = price - totalCosts;
      
      // Рассчитываем рентабельность (%)
      const profitMargin = costPrice ? (profit / costPrice) * 100 : 0;
      
      // Рассчитываем точку безубыточности (минимальная цена для покрытия издержек)
      const breakEvenPoint = (costPrice || 0) + commission + logisticsCost + storageCost + vat;
      
      return {
        price,
        costPrice,
        commission,
        logisticsCost,
        storageCost,
        vat,
        profit,
        profitMargin,
        breakEvenPoint,
      };
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при расчете рентабельности',
        500,
        ERROR_CODES.CALCULATION_ERROR,
        error
      );
    }
  }
  
  /**
   * Создание товара
   */
  async createProduct(productData: Partial<IProduct>, userId: string): Promise<IProductDocument> {
    try {
      // Валидация входных данных
      if (!productData.name) {
        throw new ApiError(
          'Название товара обязательно',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      if (!productData.price || productData.price <= 0) {
        throw new ApiError(
          'Цена должна быть больше 0',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // В реальном приложении здесь будет сохранение в базу данных
      // const product = new Product({
      //   ...productData,
      //   createdBy: userId,
      //   updatedBy: userId,
      // });
      // 
      // await product.save();
      // return product;
      
      // Заглушка для тестирования
      return {
        _id: uuidv4(),
        name: productData.name || 'Новый товар',
        description: productData.description || '',
        price: productData.price || 0,
        costPrice: productData.costPrice,
        category: productData.category,
        images: productData.images || [],
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IProductDocument;
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при создании товара',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Обновление товара
   */
  async updateProduct(
    productId: string,
    updateData: Partial<IProduct>,
    userId: string
  ): Promise<IProductDocument | null> {
    try {
      // Валидация входных данных
      if (!productId) {
        throw new ApiError(
          'ID товара обязателен',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      if (updateData.price !== undefined && updateData.price <= 0) {
        throw new ApiError(
          'Цена должна быть больше 0',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // В реальном приложении здесь будет обновление в базе данных
      // const product = await Product.findByIdAndUpdate(
      //   productId,
      //   {
      //     ...updateData,
      //     updatedBy: userId,
      //     updatedAt: new Date(),
      //   },
      //   { new: true, runValidators: true }
      // );
      // 
      // if (!product) {
      //   throw new ApiError(
      //     'Товар не найден',
      //     404,
      //     ERROR_CODES.NOT_FOUND
      //   );
      // }
      // 
      // return product;
      
      // Заглушка для тестирования
      return {
        _id: productId,
        name: updateData.name || 'Обновленный товар',
        description: updateData.description || '',
        price: updateData.price || 0,
        costPrice: updateData.costPrice,
        category: updateData.category,
        images: updateData.images || [],
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IProductDocument;
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при обновлении товара',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Удаление товара
   */
  async deleteProduct(productId: string, userId: string): Promise<boolean> {
    try {
      // Валидация входных данных
      if (!productId) {
        throw new ApiError(
          'ID товара обязателен',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // В реальном приложении здесь будет удаление из базы данных
      // const product = await Product.findByIdAndUpdate(
      //   productId,
      //   {
      //     deleted: true,
      //     deletedAt: new Date(),
      //     deletedBy: userId,
      //   },
      //   { new: true }
      // );
      // 
      // return !!product;
      
      // Заглушка для тестирования
      return true;
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при удалении товара',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Загрузка изображения товара
   */
  async uploadProductImage(
    file: Express.Multer.File,
    productId: string,
    userId: string
  ): Promise<string> {
    try {
      // Валидация входных данных
      if (!file) {
        throw new ApiError(
          'Файл не загружен',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      if (!productId) {
        throw new ApiError(
          'ID товара обязателен',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // Создаем директорию для загрузки, если её нет
      const uploadDir = path.join(process.cwd(), 'uploads', 'products', productId);
      await fs.promises.mkdir(uploadDir, { recursive: true });
      
      // Генерируем уникальное имя файла
      const fileExt = path.extname(file.originalname).toLowerCase();
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Сохраняем файл на диск
      await fs.promises.writeFile(filePath, file.buffer);
      
      // В реальном приложении здесь будет обновление записи товара в базе данных
      // с добавлением пути к изображению
      
      // Возвращаем относительный путь к файлу
      return `/uploads/products/${productId}/${fileName}`;
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при загрузке изображения',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Импорт товаров из CSV/Excel
   */
  async importProducts(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ success: number; failed: number; errors: any[] }> {
    try {
      // Валидация входных данных
      if (!file) {
        throw new ApiError(
          'Файл не загружен',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // В реальном приложении здесь будет парсинг файла и импорт товаров
      // Это упрощенная реализация
      
      // Пример обработки CSV (в реальном приложении используйте библиотеку для парсинга CSV/Excel)
      const fileContent = file.buffer.toString('utf-8');
      const lines = fileContent.split('\n').filter(Boolean);
      
      if (lines.length <= 1) {
        throw new ApiError(
          'Файл пуст или имеет неверный формат',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }
      
      // Пропускаем заголовок
      const header = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1);
      
      const results = {
        success: 0,
        failed: 0,
        errors: [] as Array<{ row: number; error: string }>,
      };
      
      // Обрабатываем каждую строку
      for (let i = 0; i < rows.length; i++) {
        try {
          const values = rows[i].split(',').map(v => v.trim());
          const productData: Record<string, any> = {};
          
          // Сопоставляем заголовки со значениями
          header.forEach((key, index) => {
            if (values[index] !== undefined) {
              productData[key] = values[index];
            }
          });
          
          // Валидация и преобразование данных
          if (!productData.name) {
            throw new Error('Отсутствует название товара');
          }
          
          if (!productData.price) {
            throw new Error('Отсутствует цена товара');
          }
          
          const price = parseFloat(productData.price);
          if (isNaN(price) || price <= 0) {
            throw new Error('Некорректная цена товара');
          }
          
          // В реальном приложении здесь будет создание товара в базе данных
          // await this.createProduct({
          //   name: productData.name,
          //   description: productData.description,
          //   price,
          //   costPrice: productData.costPrice ? parseFloat(productData.costPrice) : undefined,
          //   category: productData.category,
          // }, userId);
          
          results.success++;
          
        } catch (error) {
          results.failed++;
          results.errors.push({
            row: i + 2, // +2, т.к. пропустили заголовок и нумерация с 1
            error: error instanceof Error ? error.message : 'Неизвестная ошибка',
          });
        }
      }
      
      return results;
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при импорте товаров',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
  
  /**
   * Экспорт товаров в CSV
   */
  async exportProducts(
    query: Record<string, any> = {},
    userId: string
  ): Promise<string> {
    try {
      // В реальном приложении здесь будет получение товаров из базы данных
      // с учетом переданных фильтров
      // const products = await Product.find({
      //   createdBy: userId,
      //   ...query,
      //   deleted: { $ne: true },
      // }).lean();
      
      // Заглушка для тестирования
      const products = [
        { name: 'Товар 1', price: 1000, category: 'Категория 1' },
        { name: 'Товар 2', price: 2000, category: 'Категория 2' },
      ];
      
      if (products.length === 0) {
        throw new ApiError(
          'Нет товаров для экспорта',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }
      
      // Формируем CSV
      const headers = Object.keys(products[0]);
      let csvContent = headers.join(',') + '\n';
      
      for (const product of products) {
        const row = headers.map(header => {
          const value = product[header as keyof typeof product];
          // Экранируем кавычки и запятые
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        
        csvContent += row.join(',') + '\n';
      }
      
      return csvContent;
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        'Ошибка при экспорте товаров',
        500,
        ERROR_CODES.INTERNAL_ERROR,
        error
      );
    }
  }
}

export default new ProductService();
