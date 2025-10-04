"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductRoutes = createProductRoutes;
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
/**
 * Маршруты для работы с товарами
 * Определяет API endpoints и связывает их с контроллерами
 */
function createProductRoutes() {
    const router = (0, express_1.Router)();
    const productController = new ProductController_1.ProductController();
    /**
     * Поиск товаров
     * GET /api/products/search?query=смартфон&marketplace=wb&category=electronics&limit=20&offset=0
     */
    router.get('/search', productController.searchProducts.bind(productController));
    /**
     * Получение товара по ID
     * GET /api/products/:id
     */
    router.get('/:id', productController.getProduct.bind(productController));
    /**
     * Создание товара
     * POST /api/products
     */
    router.post('/', productController.createProduct.bind(productController));
    /**
     * Обновление товара
     * PUT /api/products/:id
     */
    router.put('/:id', productController.updateProduct.bind(productController));
    /**
     * Расчет доходности товара
     * POST /api/products/:id/calculate
     */
    router.post('/:id/calculate', productController.calculateProfitability.bind(productController));
    /**
     * Получение списка маркетплейсов
     * GET /api/marketplaces
     */
    router.get('/marketplaces', productController.getMarketplaces.bind(productController));
    /**
     * Получение списка категорий
     * GET /api/categories
     */
    router.get('/categories', productController.getCategories.bind(productController));
    return router;
}
//# sourceMappingURL=productRoutes.js.map