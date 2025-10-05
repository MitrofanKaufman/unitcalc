import { ProductEntity, MarketplaceEntity, ProductCategoryEntity, CreateProductDto, UpdateProductDto, SearchProductsDto } from '../types';
/**
 * Сервис для работы с товарами
 * Содержит бизнес-логику обработки товаров
 */
export declare class ProductService {
    private products;
    private marketplaces;
    private categories;
    constructor();
    /**
     * Инициализация данных по умолчанию
     */
    private initializeDefaultData;
    /**
     * Инициализация тестовых товаров для демонстрации
     */
    private initializeTestProducts;
    /**
     * Поиск товаров
     */
    searchProducts(dto: SearchProductsDto): Promise<ProductEntity[]>;
    /**
     * Получение товара по ID
     */
    getProduct(id: string): Promise<ProductEntity | null>;
    /**
     * Создание товара
     */
    createProduct(dto: CreateProductDto): Promise<ProductEntity>;
    /**
     * Обновление товара
     */
    updateProduct(id: string, dto: UpdateProductDto): Promise<ProductEntity | null>;
    /**
     * Получение списка маркетплейсов
     */
    getMarketplaces(): Promise<MarketplaceEntity[]>;
    /**
     * Получение списка категорий
     */
    getCategories(): Promise<ProductCategoryEntity[]>;
    /**
     * Скраппинг товара (заглушка для будущего функционала)
     */
    scrapeProduct(url: string, marketplaceId: string): Promise<ProductEntity | null>;
    /**
     * Валидация данных товара
     */
    private validateProductData;
    /**
     * Получение статистики товаров
     */
    getStats(): Promise<{
        totalProducts: number;
        totalMarketplaces: number;
        totalCategories: number;
        productsByMarketplace: Record<string, number>;
        productsByCategory: Record<string, number>;
    }>;
}
