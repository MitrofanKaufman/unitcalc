// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\services\api-gateway\src\controllers\wildberriesController.ts
/**
 * path/to/file.ts
 * Описание: Контроллер для работы с API Wildberries
 * Логика: Клиентская/Серверная (серверная логика API)
 * Зависимости: Express, модуль сбора данных
 * Примечания: Обрабатывает HTTP запросы для сбора и анализа данных товаров
 */

import { Request, Response } from 'express';
import { scrapeProductById, getProduct as fetchProduct, calculateProfitability as calcProfitability } from '../services/WildberriesService';

/**
 * Получение данных о товаре
 * GET /api/wildberries/product/:id
 */
export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || !/^\d+$/.test(id)) {
      res.status(400).json({
        success: false,
        message: 'Некорректный ID товара'
      });
      return;
    }

    // Здесь можно добавить проверку кэша или базы данных
    // Пока используем прямой скрейпинг

    const result = await scrapeProductById(id);

    if (result.success && result.product) {
      res.json({
        success: true,
        data: {
          product: result.product
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Товар не найден или не удалось собрать данные',
        errors: result.errors
      });
    }

  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
}

/**
 * Получение детальной информации о товаре
 * GET /api/wildberries/get/:id
 */
export async function getProductDetails(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || !/^\d+$/.test(id)) {
      res.status(400).json({
        success: false,
        message: 'Некорректный ID товара'
      });
      return;
    }

    // Расширенный сбор данных с дополнительными параметрами
    const result = await scrapeProductById(id);

    if (result.success && result.product) {
      res.json({
        success: true,
        data: {
          product: result.product,
          seller: result.seller,
          metadata: {
            collectedAt: new Date().toISOString(),
            executionTime: result.executionTime,
            hasErrors: result.errors && result.errors.length > 0
          }
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Не удалось собрать детальную информацию о товаре',
        errors: result.errors
      });
    }

  } catch (error) {
    console.error('Ошибка при получении детальной информации:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
}

/**
 * Расчет доходности товара
 * GET /api/wildberries/calc/:id
 */
export async function calculateProfitability(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { purchasePrice, logistics, otherCosts, desiredMargin = 30 } = req.query;

    if (!id || !/^\d+$/.test(id)) {
      res.status(400).json({
        success: false,
        message: 'Некорректный ID товара'
      });
      return;
    }

    // Получение данных о товаре
    const product = await fetchProduct(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Не удалось получить данные о товаре для расчета'
      });
      return;
    }

    // Расчет доходности
    const currentPrice = product.price;
    const costs = (Number(purchasePrice) || 0) + (Number(logistics) || 0) + (Number(otherCosts) || 0);
    const profit = currentPrice - costs;
    const margin = currentPrice > 0 ? (profit / currentPrice) * 100 : 0;

    // Рекомендуемая цена для достижения желаемой маржи
    const recommendedPrice = costs / (1 - Number(desiredMargin) / 100);

    res.json({
      success: true,
      data: {
        productId: id,
        currentPrice,
        costs,
        profit,
        currentMargin: margin.toFixed(2) + '%',
        desiredMargin: Number(desiredMargin) + '%',
        recommendedPrice: Math.round(recommendedPrice),
        breakEvenPoint: costs,
        isProfitable: profit > 0,
        recommendation: margin >= Number(desiredMargin) ? 'Выгодно' : 'Низкая маржа'
      }
    });

  } catch (error) {
    console.error('Ошибка при расчете доходности:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
}

/**
 * Поиск товаров
 * GET /api/wildberries/search
 */
export async function searchProducts(req: Request, res: Response): Promise<void> {
  try {
    const { query, limit = 20, offset = 0 } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Необходим параметр поискового запроса'
      });
      return;
    }

    // Заглушка для поиска товаров
    // В будущем здесь будет интеграция с API поиска Wildberries
    const mockProducts = [
      {
        id: '220156288',
        title: `${query} - результат поиска`,
        price: 359,
        rating: 4.9,
        image: 'https://example.com/image.jpg'
      }
    ];

    res.json({
      success: true,
      data: mockProducts,
      pagination: {
        total: 1,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: false
      }
    });

  } catch (error) {
    console.error('Ошибка при поиске товаров:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
}

/**
 * Получение подсказок для поиска
 * GET /api/wildberries/suggest
 */
export async function getSuggestions(req: Request, res: Response): Promise<void> {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Необходим параметр поискового запроса'
      });
      return;
    }

    // Заглушка для подсказок
    const suggestions = [
      `${query} ${query.endsWith('а') ? 'женская' : 'женский'}`,
      `${query} ${query.endsWith('а') ? 'мужская' : 'мужской'}`,
      `${query} 2025`,
      `${query} со скидкой`,
      `${query} купить`
    ];

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Ошибка при получении подсказок:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
}
