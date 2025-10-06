import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import {
  getProduct,
  getProductDetails,
  calculateProfitability,
  searchProducts,
  getSuggestions
} from '../controllers/wildberriesController';

const router = Router();

// Middleware для CORS заголовков
const addCorsHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

/**
 * Получение данных о товаре
 * GET /api/wildberries/product/:id
 */
/**
 * @swagger
 * /wildberries/product/{id}:
 *   get:
 *     summary: Получение данных о товаре
 *     description: Возвращает базовую информацию о товаре с сайта Wildberries
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productId'
 *     responses:
 *       200:
 *         description: Успешное получение данных товара
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: Некорректный ID товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/product/:id', addCorsHeaders, getProduct);

/**
 * Получение детальной информации о товаре
 * GET /api/wildberries/get/:id
 */
/**
 * @swagger
 * /wildberries/get/{id}:
 *   get:
 *     summary: Получение детальной информации о товаре
 *     description: Возвращает полную информацию о товаре включая аналитику и метаданные
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productId'
 *     responses:
 *       200:
 *         description: Успешное получение детальной информации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/ProductData'
 *                     seller:
 *                       type: object
 *                       description: Информация о продавце
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         collectedAt:
 *                           type: string
 *                           format: date-time
 *                         executionTime:
 *                           type: number
 *                         hasErrors:
 *                           type: boolean
 *       400:
 *         description: Некорректный ID товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Не удалось собрать информацию
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/get/:id', addCorsHeaders, getProductDetails);

/**
 * Расчет доходности товара
 * GET /api/wildberries/calc/:id
 */
/**
 * @swagger
 * /wildberries/calc/{id}:
 *   get:
 *     summary: Расчет доходности товара
 *     description: Рассчитывает доходность товара с учетом затрат и желаемой маржи
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/productId'
 *       - $ref: '#/components/parameters/purchasePrice'
 *       - $ref: '#/components/parameters/logistics'
 *       - $ref: '#/components/parameters/otherCosts'
 *       - $ref: '#/components/parameters/desiredMargin'
 *     responses:
 *       200:
 *         description: Успешный расчет доходности
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProfitabilityCalculation'
 *       400:
 *         description: Некорректные параметры
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Не удалось получить данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/calc/:id', addCorsHeaders, calculateProfitability);

/**
 * Поиск товаров на Wildberries
 * GET /api/wildberries/search?query=текст
 */
/**
 * @swagger
 * /wildberries/search:
 *   get:
 *     summary: Поиск товаров
 *     description: Поиск товаров на Wildberries (заглушка для будущего функционала)
 *     tags: [Search]
 *     parameters:
 *       - $ref: '#/components/parameters/searchQuery'
 *       - name: limit
 *         in: query
 *         description: Максимальное количество результатов
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - name: offset
 *         in: query
 *         description: Смещение для пагинации
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: Успешный поиск
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       price:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       image:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     offset:
 *                       type: number
 *                     hasMore:
 *                       type: boolean
 *       400:
 *         description: Не указан поисковый запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', addCorsHeaders, searchProducts);

/**
 * Получение поисковых подсказок с Wildberries
 * GET /api/wildberries/suggest?query=текст
 */
/**
 * @swagger
 * /wildberries/suggest:
 *   get:
 *     summary: Получение поисковых подсказок
 *     description: Возвращает поисковые подсказки для автодополнения
 *     tags: [Search]
 *     parameters:
 *       - $ref: '#/components/parameters/searchQuery'
 *     responses:
 *       200:
 *         description: Успешное получение подсказок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["смартфон женский", "смартфон мужской", "смартфон 2025"]
 *       400:
 *         description: Не указан поисковый запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/suggest', addCorsHeaders, getSuggestions);

export default router;
