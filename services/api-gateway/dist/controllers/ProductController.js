"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
const CalculationService_1 = require("../services/CalculationService");
const types_1 = require("../types");
/**
 * Контроллер для работы с товарами
 * Обрабатывает HTTP запросы и делегирует логику сервисам
 */
class ProductController {
    constructor() {
        this.productService = new ProductService_1.ProductService();
        this.calculationService = new CalculationService_1.CalculationService();
    }
    /**
     * Поиск товаров
     * GET /api/products/search
     */
    async searchProducts(req, res) {
        try {
            const { query, marketplace, category, limit = 20, offset = 0 } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Параметр query обязателен',
                    errors: ['Query parameter is required'],
                    timestamp: new Date().toISOString()
                });
            }
            const searchDto = {
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
            });
        }
        catch (error) {
            console.error('Ошибка поиска товаров:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Получение товара по ID
     * GET /api/products/:id
     */
    async getProduct(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID товара обязателен',
                    errors: ['Product ID is required'],
                    timestamp: new Date().toISOString()
                });
            }
            const product = await this.productService.getProduct(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Товар не найден',
                    errors: [types_1.ERROR_CODES.NOT_FOUND],
                    timestamp: new Date().toISOString()
                });
            }
            res.json({
                success: true,
                data: product,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Ошибка получения товара:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Создание товара
     * POST /api/products
     */
    async createProduct(req, res) {
        try {
            const productData = req.body;
            // Валидация данных
            const validationErrors = this.validateProductData(productData);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ошибка валидации данных',
                    errors: validationErrors,
                    timestamp: new Date().toISOString()
                });
            }
            const product = await this.productService.createProduct(productData);
            res.status(201).json({
                success: true,
                data: product,
                message: 'Товар успешно создан',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Ошибка создания товара:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Обновление товара
     * PUT /api/products/:id
     */
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID товара обязателен',
                    errors: ['Product ID is required'],
                    timestamp: new Date().toISOString()
                });
            }
            // Валидация данных
            const validationErrors = this.validateProductData(productData, false);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ошибка валидации данных',
                    errors: validationErrors,
                    timestamp: new Date().toISOString()
                });
            }
            const product = await this.productService.updateProduct(id, productData);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Товар не найден',
                    errors: [types_1.ERROR_CODES.NOT_FOUND],
                    timestamp: new Date().toISOString()
                });
            }
            res.json({
                success: true,
                data: product,
                message: 'Товар успешно обновлен',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Ошибка обновления товара:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Расчет доходности товара
     * POST /api/products/:id/calculate
     */
    async calculateProfitability(req, res) {
        try {
            const { id } = req.params;
            const calculationData = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID товара обязателен',
                    errors: ['Product ID is required'],
                    timestamp: new Date().toISOString()
                });
            }
            // Проверка существования товара
            const product = await this.productService.getProduct(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Товар не найден',
                    errors: [types_1.ERROR_CODES.NOT_FOUND],
                    timestamp: new Date().toISOString()
                });
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
            });
        }
        catch (error) {
            console.error('Ошибка расчета доходности:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Получение списка маркетплейсов
     * GET /api/marketplaces
     */
    async getMarketplaces(req, res) {
        try {
            const marketplaces = await this.productService.getMarketplaces();
            res.json({
                success: true,
                data: marketplaces,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Ошибка получения маркетплейсов:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Получение списка категорий
     * GET /api/categories
     */
    async getCategories(req, res) {
        try {
            const categories = await this.productService.getCategories();
            res.json({
                success: true,
                data: categories,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Ошибка получения категорий:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера',
                errors: [types_1.ERROR_CODES.INTERNAL_ERROR],
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Валидация данных товара
     */
    validateProductData(data, isCreate = true) {
        const errors = [];
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
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map