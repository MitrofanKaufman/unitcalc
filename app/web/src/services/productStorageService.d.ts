import type { Product } from '@/types';
/**
 * Сервис для управления локальным хранилищем товаров
 * Реализует алгоритм: локально → сервер → скраппинг
 */
export declare class ProductStorageService {
    private static readonly STORAGE_KEY;
    private static readonly CACHE_DURATION;
    /**
     * Получение данных товара по ID
     * Алгоритм: локально → сервер → скраппинг
     */
    static getProduct(productId: string): Promise<Product | null>;
    /**
     * Поиск товаров по запросу
     */
    static searchProducts(query: string, _marketplace?: string, _category?: string): Promise<Product[]>;
    /**
     * Получение данных из локального хранилища
     */
    private static getFromLocalStorage;
    /**
     * Поиск в локальном хранилище
     */
    private static searchInLocalStorage;
    /**
     * Проверка соответствия поисковому запросу
     */
    private static matchesSearchQuery;
    /**
     * Сохранение в локальное хранилище
     */
    private static saveToLocalStorage;
    /**
     * Проверка валидности кеша
     */
    private static isCacheValid;
    /**
     * Запрос к серверу (заглушка - в будущем реальный API)
     */
    private static getFromServer;
    /**
     * Поиск на сервере (заглушка)
     */
    private static searchOnServer;
    /**
     * Скраппинг товара (заглушка - в будущем интеграция с Puppeteer/Playwright)
     */
    private static scrapeProduct;
    /**
     * Скраппинг списка товаров (заглушка)
     */
    private static scrapeProducts;
    /**
     * Отправка данных на сервер (заглушка)
     */
    private static sendToServer;
    /**
     * Отправка списка товаров на сервер (заглушка)
     */
    private static sendProductsToServer;
    /**
     * Очистка устаревшего кеша
     */
    static cleanupCache(): void;
    /**
     * Получение статистики кеша
     */
    static getCacheStats(): {
        total: number;
        valid: number;
        expired: number;
    };
}
