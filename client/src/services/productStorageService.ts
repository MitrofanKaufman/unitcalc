import { Product, ApiResponse, AsyncState } from '@/types';

/**
 * Сервис для управления локальным хранилищем товаров
 * Реализует алгоритм: локально → сервер → скраппинг
 */
export class ProductStorageService {
  private static readonly STORAGE_KEY = 'marketplace_products';
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

  /**
   * Получение данных товара по ID
   * Алгоритм: локально → сервер → скраппинг
   */
  static async getProduct(productId: string): Promise<Product | null> {
    try {
      // 1. Проверка локального хранилища
      const localProduct = this.getFromLocalStorage(productId);
      if (localProduct && this.isCacheValid(localProduct)) {
        console.log('✅ Данные получены из локального хранилища');
        return localProduct;
      }

      // 2. Запрос к серверу
      const serverProduct = await this.getFromServer(productId);
      if (serverProduct) {
        console.log('✅ Данные получены с сервера');
        this.saveToLocalStorage(serverProduct);
        return serverProduct;
      }

      // 3. Скраппинг данных
      console.log('🔄 Запуск скраппинга данных...');
      const scrapedProduct = await this.scrapeProduct(productId);
      if (scrapedProduct) {
        this.saveToLocalStorage(scrapedProduct);
        // Отправка на сервер в фоне
        this.sendToServer(scrapedProduct);
        return scrapedProduct;
      }

      return null;
    } catch (error) {
      console.error('❌ Ошибка при получении данных товара:', error);
      return null;
    }
  }

  /**
   * Поиск товаров по запросу
   */
  static async searchProducts(
    query: string,
    marketplace?: string,
    category?: string
  ): Promise<Product[]> {
    try {
      // Сначала проверяем локальное хранилище
      const localProducts = this.searchInLocalStorage(query, marketplace, category);

      if (localProducts.length > 0) {
        console.log('✅ Найдены данные в локальном хранилище');
        return localProducts;
      }

      // Запрос к серверу
      const serverProducts = await this.searchOnServer(query, marketplace, category);

      if (serverProducts.length > 0) {
        console.log('✅ Данные получены с сервера');
        // Сохраняем в локальное хранилище
        serverProducts.forEach(product => this.saveToLocalStorage(product));
        return serverProducts;
      }

      // Скраппинг
      console.log('🔄 Запуск скраппинга для поиска...');
      const scrapedProducts = await this.scrapeProducts(query, marketplace, category);

      if (scrapedProducts.length > 0) {
        // Сохраняем локально
        scrapedProducts.forEach(product => this.saveToLocalStorage(product));
        // Отправляем на сервер в фоне
        this.sendProductsToServer(scrapedProducts);
        return scrapedProducts;
      }

      return [];
    } catch (error) {
      console.error('❌ Ошибка при поиске товаров:', error);
      return [];
    }
  }

  /**
   * Получение данных из локального хранилища
   */
  private static getFromLocalStorage(productId: string): Product | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${productId}`);
      if (!stored) return null;

      const product = JSON.parse(stored) as Product;
      return product;
    } catch {
      return null;
    }
  }

  /**
   * Поиск в локальном хранилище
   */
  private static searchInLocalStorage(
    query: string,
    marketplace?: string,
    category?: string
  ): Product[] {
    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.STORAGE_KEY)
      );

      const products: Product[] = [];

      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (!stored) continue;

        const product = JSON.parse(stored) as Product;

        // Проверка условий поиска
        if (marketplace && product.marketplace !== marketplace) continue;
        if (category && product.category !== category) continue;

        // Проверка текста поиска
        if (query && !this.matchesSearchQuery(product, query)) continue;

        products.push(product);
      }

      return products.slice(0, 20); // Ограничиваем результаты
    } catch {
      return [];
    }
  }

  /**
   * Проверка соответствия поисковому запросу
   */
  private static matchesSearchQuery(product: Product, query: string): boolean {
    const searchText = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchText) ||
      product.characteristics?.brand?.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  }

  /**
   * Сохранение в локальное хранилище
   */
  private static saveToLocalStorage(product: Product): void {
    try {
      const productWithCache = {
        ...product,
        cached: true,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(
        `${this.STORAGE_KEY}_${product.id}`,
        JSON.stringify(productWithCache)
      );
    } catch (error) {
      console.error('❌ Ошибка сохранения в локальное хранилище:', error);
    }
  }

  /**
   * Проверка валидности кеша
   */
  private static isCacheValid(product: Product): boolean {
    if (!product.lastUpdated) return false;

    const cacheTime = new Date(product.lastUpdated).getTime();
    const now = Date.now();

    return (now - cacheTime) < this.CACHE_DURATION;
  }

  /**
   * Запрос к серверу (заглушка - в будущем реальный API)
   */
  private static async getFromServer(productId: string): Promise<Product | null> {
    // В будущем здесь будет реальный запрос к API
    // return await api.get(`/products/${productId}`);

    // Временная заглушка
    await new Promise(resolve => setTimeout(resolve, 200));
    return null; // Сервер не вернул данные
  }

  /**
   * Поиск на сервере (заглушка)
   */
  private static async searchOnServer(
    query: string,
    marketplace?: string,
    category?: string
  ): Promise<Product[]> {
    // В будущем здесь будет реальный запрос к API
    // return await api.get('/products/search', { params: { query, marketplace, category } });

    await new Promise(resolve => setTimeout(resolve, 300));
    return []; // Сервер не вернул данные
  }

  /**
   * Скраппинг товара (заглушка - в будущем интеграция с Puppeteer/Playwright)
   */
  private static async scrapeProduct(productId: string): Promise<Product | null> {
    // В будущем здесь будет реальный скраппинг
    // return await scraper.scrapeProduct(productId);

    console.log(`🔍 Скраппинг товара ${productId}...`);

    // Эмуляция скраппинга
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Моковые данные
    if (Math.random() > 0.3) { // 70% шанс успеха
      return {
        id: productId,
        name: `Товар ${productId}`,
        price: Math.floor(Math.random() * 50000) + 10000,
        category: 'electronics',
        marketplace: 'wb',
        characteristics: {
          weight: Math.floor(Math.random() * 1000) + 100,
          dimensions: {
            length: Math.floor(Math.random() * 200) + 50,
            width: Math.floor(Math.random() * 100) + 20,
            height: Math.floor(Math.random() * 50) + 10
          },
          brand: 'BrandName',
          rating: Math.floor(Math.random() * 5) + 1,
          reviews: Math.floor(Math.random() * 1000) + 100
        },
        cached: false,
        lastUpdated: new Date().toISOString()
      };
    }

    return null;
  }

  /**
   * Скраппинг списка товаров (заглушка)
   */
  private static async scrapeProducts(
    query: string,
    marketplace?: string,
    category?: string
  ): Promise<Product[]> {
    console.log(`🔍 Скраппинг товаров по запросу: "${query}"`);

    // Эмуляция скраппинга
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Моковые данные
    const products: Product[] = [];
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 товаров

    for (let i = 0; i < count; i++) {
      products.push({
        id: `${marketplace || 'wb'}_${Date.now()}_${i}`,
        name: `${query} ${i + 1}`,
        price: Math.floor(Math.random() * 50000) + 10000,
        category: category || 'electronics',
        marketplace: marketplace || 'wb',
        characteristics: {
          weight: Math.floor(Math.random() * 1000) + 100,
          dimensions: {
            length: Math.floor(Math.random() * 200) + 50,
            width: Math.floor(Math.random() * 100) + 20,
            height: Math.floor(Math.random() * 50) + 10
          },
          brand: `Brand ${i + 1}`,
          rating: Math.floor(Math.random() * 5) + 1,
          reviews: Math.floor(Math.random() * 1000) + 100
        },
        cached: false,
        lastUpdated: new Date().toISOString()
      });
    }

    return products;
  }

  /**
   * Отправка данных на сервер (заглушка)
   */
  private static async sendToServer(product: Product): Promise<void> {
    try {
      // В будущем здесь будет реальный запрос к API
      // await api.post('/products', product);

      console.log(`📤 Отправка данных на сервер: ${product.id}`);
    } catch (error) {
      console.error('❌ Ошибка отправки данных на сервер:', error);
    }
  }

  /**
   * Отправка списка товаров на сервер (заглушка)
   */
  private static async sendProductsToServer(products: Product[]): Promise<void> {
    try {
      // В будущем здесь будет реальный запрос к API
      // await api.post('/products/batch', { products });

      console.log(`📤 Отправка ${products.length} товаров на сервер`);
    } catch (error) {
      console.error('❌ Ошибка отправки товаров на сервер:', error);
    }
  }

  /**
   * Очистка устаревшего кеша
   */
  static cleanupCache(): void {
    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.STORAGE_KEY)
      );

      let cleaned = 0;
      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (!stored) continue;

        const product = JSON.parse(stored) as Product;
        if (!this.isCacheValid(product)) {
          localStorage.removeItem(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Очищено ${cleaned} устаревших записей кеша`);
      }
    } catch (error) {
      console.error('❌ Ошибка очистки кеша:', error);
    }
  }

  /**
   * Получение статистики кеша
   */
  static getCacheStats(): { total: number; valid: number; expired: number } {
    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.STORAGE_KEY)
      );

      let valid = 0;
      let expired = 0;

      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (!stored) continue;

        const product = JSON.parse(stored) as Product;
        if (this.isCacheValid(product)) {
          valid++;
        } else {
          expired++;
        }
      }

      return {
        total: keys.length,
        valid,
        expired
      };
    } catch {
      return { total: 0, valid: 0, expired: 0 };
    }
  }
}
