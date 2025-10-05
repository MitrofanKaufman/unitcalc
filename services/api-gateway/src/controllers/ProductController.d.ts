import { Request, Response } from 'express';
/**
 * Контроллер для работы с товарами
 * Обрабатывает HTTP запросы и делегирует логику сервисам
 */
export declare class ProductController {
    private productService;
    private calculationService;
    constructor();
    /**
     * Поиск товаров
     * GET /api/products/search
     */
    searchProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получение товара по ID
     * GET /api/products/:id
     */
    getProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Создание товара
     * POST /api/products
     */
    createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Обновление товара
     * PUT /api/products/:id
     */
    updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Расчет доходности товара
     * POST /api/products/:id/calculate
     */
    calculateProfitability(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получение списка маркетплейсов
     * GET /api/marketplaces
     */
    getMarketplaces(req: Request, res: Response): Promise<void>;
    /**
     * Получение списка категорий
     * GET /api/categories
     */
    getCategories(req: Request, res: Response): Promise<void>;
    /**
     * Валидация данных товара
     */
    private validateProductData;
}
