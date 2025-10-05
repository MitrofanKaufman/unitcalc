/**
 * Сервис для интеграции с API Wildberries
 *
 * Предоставляет методы для:
 * - Поиска товаров через официальное API WB
 * - Получения подсказок поиска
 * - Получения детальной информации о товаре
 * - Генерации URL изображений товаров
 *
 * @example
 * ```typescript
 * // Поиск товаров
 * const products = await WildberriesService.fetchProducts('смартфон');
 *
 * // Получение подсказок
 * const suggestions = await WildberriesService.fetchSuggestions('смартф');
 *
 * // Получение товара по ID
 * const product = await WildberriesService.getProductById(123456);
 * ```
 */
class WildberriesService {
  /**
   * Моковые данные для демонстрации поиска
   */
  private static mockProducts = [
    {
      id: 123456,
      name: 'Смартфон Samsung Galaxy A54 5G 8/256GB Black',
      price: 35990,
      rating: 4.5,
      brand: 'Samsung',
      seller: { id: 1, name: 'Samsung', rating: 4.8 },
      feedbacks: 1247,
      inStock: true,
    },
    {
      id: 123457,
      name: 'Смартфон Xiaomi 13T 12/256GB Black',
      price: 42990,
      rating: 4.7,
      brand: 'Xiaomi',
      seller: { id: 2, name: 'Xiaomi', rating: 4.6 },
      feedbacks: 892,
      inStock: true,
    },
    {
      id: 123458,
      name: 'Смартфон Apple iPhone 15 128GB Black',
      price: 89990,
      rating: 4.9,
      brand: 'Apple',
      seller: { id: 3, name: 'Apple', rating: 4.9 },
      feedbacks: 2156,
      inStock: true,
    },
    {
      id: 123459,
      name: 'Смартфон OnePlus 11 16/256GB Black',
      price: 54990,
      rating: 4.6,
      brand: 'OnePlus',
      seller: { id: 4, name: 'OnePlus', rating: 4.7 },
      feedbacks: 634,
      inStock: false,
    },
    {
      id: 123460,
      name: 'Смартфон Google Pixel 8 8/128GB Obsidian',
      price: 61990,
      rating: 4.8,
      brand: 'Google',
      seller: { id: 5, name: 'Google', rating: 4.8 },
      feedbacks: 423,
      inStock: true,
    },
  ];

  /**
   * Получает список товаров по запросу с отслеживанием прогресса
   * @param query Поисковый запрос (название товара)
   * @param onProgressCallback Колбек для отслеживания прогресса (текущий шаг, всего шагов)
   * @returns Promise с массивом товаров или пустым массивом в случае ошибки
   * @throws {Error} При ошибке сети или некорректном ответе API
   */
  static async fetchProducts(query: string, onProgressCallback?: (current: number, total: number) => void) {
    // Симуляция задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (onProgressCallback) onProgressCallback(1, 10);

    try {
      // Фильтрация моковых данных по запросу
      const filteredProducts = this.mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      if (onProgressCallback) onProgressCallback(5, 10);

      const processedProducts = filteredProducts.map((product, index) => {
        if (onProgressCallback) {
          const progress = 5 + Math.floor((index / filteredProducts.length) * 5);
          onProgressCallback(progress, 10);
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price * 100, // Цена в копейках
          rating: product.rating,
          image: this.getImageUrl(product.id),
          images: [this.getImageUrl(product.id)],
          brand: product.brand,
          seller: product.seller,
          feedbacks: product.feedbacks,
          inStock: product.inStock,
        };
      });

      if (onProgressCallback) onProgressCallback(10, 10);
      return processedProducts;

    } catch (error) {
      console.error("WB fetchProducts error:", error);
      return [];
    }
  }

  /**
   * Получает подсказки поиска для автодополнения
   * @param query Начало поискового запроса
   * @returns Promise с массивом строк подсказок
   */
  static async fetchSuggestions(query: string): Promise<string[]> {
    // Симуляция задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const allSuggestions = [
        'смартфон Samsung',
        'смартфон Xiaomi',
        'смартфон Apple iPhone',
        'смартфон OnePlus',
        'смартфон Google Pixel',
        'наушники беспроводные',
        'часы умные',
        'планшет Samsung',
        'ноутбук Apple MacBook',
        'телевизор 4K',
      ];

      return allSuggestions
        .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);

    } catch (error) {
      console.error("WB fetchSuggestions error:", error);
      return [];
    }
  }

  /**
   * Генерирует URL изображения товара по его ID
   * @param productId ID товара
   * @returns URL изображения товара в формате WebP
   */
  static getImageUrl(productId: number) {
    // Для моковых данных используем placeholder изображения
    return `https://picsum.photos/400/400?random=${productId}`;
  }

  /**
   * Получает детальную информацию о товаре по ID
   * @param id ID товара
   * @returns Promise с объектом товара или null в случае ошибки
   */
  static async getProductById(id: number) {
    try {
      const products = await this.fetchProducts(id.toString(), undefined);
      return products.find((p: any) => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }
}

export { WildberriesService };
