"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const types_1 = require("../types");
/**
 * Сервис для работы с товарами
 * Содержит бизнес-логику обработки товаров
 */
class ProductService {
    constructor() {
        this.products = new Map();
        this.marketplaces = new Map();
        this.categories = new Map();
        this.initializeDefaultData();
    }
    /**
     * Инициализация данных по умолчанию
     */
    initializeDefaultData() {
        // Инициализация маркетплейсов
        const defaultMarketplaces = [
            {
                id: 'wb',
                name: 'Wildberries',
                icon: '🛍️',
                color: '#7B68EE',
                commission: types_1.MARKETPLACE_COMMISSIONS.wb,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'ozon',
                name: 'Ozon',
                icon: '📦',
                color: '#0058FF',
                commission: types_1.MARKETPLACE_COMMISSIONS.ozon,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'yandex',
                name: 'Yandex Market',
                icon: '🛒',
                color: '#FF3333',
                commission: types_1.MARKETPLACE_COMMISSIONS.yandex,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        defaultMarketplaces.forEach(marketplace => {
            this.marketplaces.set(marketplace.id, marketplace);
        });
        // Инициализация категорий
        types_1.PRODUCT_CATEGORIES.forEach(category => {
            const categoryEntity = {
                id: category.id,
                name: category.name,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.categories.set(category.id, categoryEntity);
        });
        // Инициализация тестовых товаров
        this.initializeTestProducts();
    }
    /**
     * Инициализация тестовых товаров для демонстрации
     */
    initializeTestProducts() {
        const testProducts = [
            {
                id: 'wb_1',
                name: 'Смартфон Samsung Galaxy A54 256GB',
                price: 35000,
                category: 'electronics',
                marketplaceId: 'wb',
                characteristics: {
                    weight: 202,
                    dimensions: { length: 158, width: 76, height: 8 },
                    brand: 'Samsung',
                    rating: 4.5,
                    reviews: 1250
                },
                scrapedAt: new Date().toISOString(),
                sourceUrl: 'https://www.wildberries.ru/catalog/123456789',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'ozon_1',
                name: 'Ноутбук Lenovo IdeaPad 3 15.6"',
                price: 55000,
                category: 'electronics',
                marketplaceId: 'ozon',
                characteristics: {
                    weight: 2500,
                    dimensions: { length: 359, width: 236, height: 20 },
                    brand: 'Lenovo',
                    rating: 4.2,
                    reviews: 890
                },
                scrapedAt: new Date().toISOString(),
                sourceUrl: 'https://www.ozon.ru/product/987654321',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        testProducts.forEach(product => {
            this.products.set(product.id, product);
        });
    }
    /**
     * Поиск товаров
     */
    async searchProducts(dto) {
        const { query, marketplace, category, limit = 20, offset = 0 } = dto;
        let results = Array.from(this.products.values());
        // Фильтрация по поисковому запросу
        if (query) {
            results = results.filter(product => {
                var _a, _b;
                return product.name.toLowerCase().includes(query.toLowerCase()) ||
                    ((_b = (_a = product.characteristics) === null || _a === void 0 ? void 0 : _a.brand) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(query.toLowerCase()));
            });
        }
        // Фильтрация по маркетплейсу
        if (marketplace) {
            results = results.filter(product => product.marketplaceId === marketplace);
        }
        // Фильтрация по категории
        if (category) {
            results = results.filter(product => product.category === category);
        }
        // Пагинация
        const startIndex = offset;
        const endIndex = startIndex + limit;
        results = results.slice(startIndex, endIndex);
        return results;
    }
    /**
     * Получение товара по ID
     */
    async getProduct(id) {
        return this.products.get(id) || null;
    }
    /**
     * Создание товара
     */
    async createProduct(dto) {
        // Валидация данных
        this.validateProductData(dto);
        const now = new Date().toISOString();
        const product = {
            id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...dto,
            scrapedAt: dto.sourceUrl ? now : undefined,
            createdAt: now,
            updatedAt: now
        };
        this.products.set(product.id, product);
        return product;
    }
    /**
     * Обновление товара
     */
    async updateProduct(id, dto) {
        const existingProduct = this.products.get(id);
        if (!existingProduct) {
            return null;
        }
        // Валидация данных
        this.validateProductData(dto, false);
        const updatedProduct = {
            ...existingProduct,
            ...dto,
            updatedAt: new Date().toISOString()
        };
        this.products.set(id, updatedProduct);
        return updatedProduct;
    }
    /**
     * Получение списка маркетплейсов
     */
    async getMarketplaces() {
        return Array.from(this.marketplaces.values()).filter(m => m.isActive);
    }
    /**
     * Получение списка категорий
     */
    async getCategories() {
        return Array.from(this.categories.values()).filter(c => c.isActive);
    }
    /**
     * Скраппинг товара (заглушка для будущего функционала)
     */
    async scrapeProduct(url, marketplaceId) {
        // В будущем здесь будет интеграция с Puppeteer/Playwright
        console.log(`🔍 Скраппинг товара с URL: ${url} для маркетплейса: ${marketplaceId}`);
        // Эмуляция скраппинга
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Создание мокового товара на основе URL
        const product = {
            id: `scraped_${Date.now()}`,
            name: `Товар из ${marketplaceId}`,
            price: Math.floor(Math.random() * 50000) + 10000,
            category: 'electronics',
            marketplaceId,
            characteristics: {
                weight: Math.floor(Math.random() * 1000) + 100,
                dimensions: {
                    length: Math.floor(Math.random() * 200) + 50,
                    width: Math.floor(Math.random() * 100) + 20,
                    height: Math.floor(Math.random() * 50) + 10
                },
                brand: 'Scraped Brand',
                rating: Math.floor(Math.random() * 5) + 1,
                reviews: Math.floor(Math.random() * 1000) + 100
            },
            scrapedAt: new Date().toISOString(),
            sourceUrl: url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.products.set(product.id, product);
        return product;
    }
    /**
     * Валидация данных товара
     */
    validateProductData(data, isCreate = true) {
        if (isCreate || data.name !== undefined) {
            if (!data.name || data.name.length < types_1.VALIDATION_RULES.productName.minLength) {
                throw new Error(`Название товара должно содержать минимум ${types_1.VALIDATION_RULES.productName.minLength} символа`);
            }
            if (data.name.length > types_1.VALIDATION_RULES.productName.maxLength) {
                throw new Error(`Название товара не должно превышать ${types_1.VALIDATION_RULES.productName.maxLength} символов`);
            }
            if (!types_1.VALIDATION_RULES.productName.pattern.test(data.name)) {
                throw new Error('Название товара содержит недопустимые символы');
            }
        }
        if (isCreate || data.price !== undefined) {
            if (data.price === undefined || data.price < types_1.VALIDATION_RULES.price.min) {
                throw new Error(`Цена должна быть не менее ${types_1.VALIDATION_RULES.price.min}`);
            }
            if (data.price > types_1.VALIDATION_RULES.price.max) {
                throw new Error(`Цена не должна превышать ${types_1.VALIDATION_RULES.price.max}`);
            }
        }
        if (isCreate || data.marketplaceId !== undefined) {
            if (!data.marketplaceId || !this.marketplaces.has(data.marketplaceId)) {
                throw new Error('Указан несуществующий маркетплейс');
            }
        }
        if (isCreate || data.category !== undefined) {
            if (!data.category || !this.categories.has(data.category)) {
                throw new Error('Указана несуществующая категория');
            }
        }
    }
    /**
     * Получение статистики товаров
     */
    async getStats() {
        const products = Array.from(this.products.values());
        const marketplaces = Array.from(this.marketplaces.values());
        const categories = Array.from(this.categories.values());
        const productsByMarketplace = {};
        const productsByCategory = {};
        products.forEach(product => {
            productsByMarketplace[product.marketplaceId] =
                (productsByMarketplace[product.marketplaceId] || 0) + 1;
            productsByCategory[product.category] =
                (productsByCategory[product.category] || 0) + 1;
        });
        return {
            totalProducts: products.length,
            totalMarketplaces: marketplaces.filter(m => m.isActive).length,
            totalCategories: categories.filter(c => c.isActive).length,
            productsByMarketplace,
            productsByCategory
        };
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map