import { Request, Response } from 'express';
import { logger } from '../../../utils/logger'; // Path to logger from product.controller.ts

// Типы данных
interface IProduct {
  id: string;
  name: string;
  price: number;
  // Другие поля продукта
}

// Пример временного хранилища (в реальном приложении используйте БД)
let products: IProduct[] = [];

// Вспомогательная функция для обработки ошибок
const catchError = (fn: Function) => async (req: Request, res: Response, next: Function) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    logger.error('Product Controller Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Инициализировать тестовые данные
 */
const initializeSampleData = () => {
  if (products.length === 0) {
    products = [
      { id: '1', name: 'Ноутбук', price: 50000 },
      { id: '2', name: 'Смартфон', price: 30000 },
      { id: '3', name: 'Наушники', price: 5000 },
      { id: '4', name: 'Клавиатура', price: 2000 },
      { id: '5', name: 'Мышь', price: 1000 },
    ];
  }
};

// Инициализируем тестовые данные при загрузке модуля
initializeSampleData();

/**
 * Получить все товары
 */
export const getProducts = catchError(async (req: Request, res: Response): Promise<void> => {
  // В реальном приложении здесь будет запрос к БД
  // const products = await productService.findAll(req.query);
  
  // Пример пагинации
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const result = products.slice(startIndex, endIndex);
  
  // Метаданные для пагинации
  const meta = {
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit)
  };
  
  res.status(200).json({
    success: true,
    data: result,
    meta
  });
});

/**
 * Получить товар по ID
 */
export const getProductById = catchError(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  // В реальном приложении: const product = await productService.findById(id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * Поиск товаров
 */
export const searchProducts = catchError(async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Не указан поисковый запрос'
    });
    return;
  }
  
  // В реальном приложении: const results = await productService.search(query);
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  
  res.status(200).json({
    success: true,
    data: results
  });
});

/**
 * Анализ товара
 */
export const analyzeProduct = catchError(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  // В реальном приложении: const analysis = await productService.analyze(id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
    return;
  }
  
  // Пример анализа
  const analysis = {
    productId: product.id,
    name: product.name,
    price: product.price,
    // Дополнительные данные анализа
    analysisDate: new Date().toISOString(),
    recommendations: []
  };
  
  res.status(200).json({
    success: true,
    data: analysis
  });
});

/**
 * Создать новый товар
 */
export const createProduct = catchError(async (req: Request, res: Response): Promise<void> => {
  const { name, price } = req.body;
  
  if (!name || price === undefined) {
    res.status(400).json({
      success: false,
      message: 'Имя и цена обязательны'
    });
    return;
  }
  
  const newProduct: IProduct = {
    id: Date.now().toString(),
    name,
    price: Number(price)
  };
  
  products.push(newProduct);
  
  logger.info(`Создан новый товар: ${newProduct.id}`);
  
  res.status(201).json({
    success: true,
    data: newProduct
  });
});

/**
 * Обновить товар
 */
export const updateProduct = catchError(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, price } = req.body;
  
  // Находим индекс товара
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
    return;
  }
  
  // Обновляем товар
  const updatedProduct = {
    ...products[productIndex],
    ...(name && { name }),
    ...(price !== undefined && { price: Number(price) })
  };
  
  products[productIndex] = updatedProduct;
  
  logger.info(`Обновлен товар: ${id}`);
  
  res.status(200).json({
    success: true,
    data: updatedProduct
  });
});

/**
 * Удалить товар
 */
export const deleteProduct = catchError(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
    return;
  }
  
  // Удаляем товар
  products.splice(productIndex, 1);
  
  logger.info(`Удален товар: ${id}`);
  
  res.status(200).json({
    success: true,
    message: 'Товар успешно удален'
  });
});
