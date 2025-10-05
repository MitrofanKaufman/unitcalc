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
   * Получает список товаров по запросу с отслеживанием прогресса
   * @param query Поисковый запрос (название товара)
   * @param onProgressCallback Колбек для отслеживания прогресса (текущий шаг, всего шагов)
   * @returns Promise с массивом товаров или пустым массивом в случае ошибки
   * @throws {Error} При ошибке сети или некорректном ответе API
   *
   * @example
   * ```typescript
   * const products = await WildberriesService.fetchProducts(
   *   'смартфон Samsung',
   *   (current, total) => console.log(`${current}/${total}`)
   * );
   * ```
   */
  static async fetchProducts(query: string, onProgressCallback?: (current: number, total: number) => void) {
    const base = "https://search.wb.ru/exactmatch/sng/common/v14/search";
    const params = new URLSearchParams({
      appType: "1",
      curr: "rub",
      dest: "233",
      hide_dtype: "13;14",
      lang: "ru",
      page: "1",
      query,
      q1: query,
      resultset: "catalog",
      sort: "popular",
      spp: "30",
      suppressSpellcheck: "false",
    });

    try {
      if (onProgressCallback) onProgressCallback(1, 10);

      const res = await fetch(`${base}?${params.toString()}`);
      if (!res.ok) throw new Error("WB fetch error");

      if (onProgressCallback) onProgressCallback(3, 10);
      const data = await res.json();

      if (onProgressCallback) onProgressCallback(5, 10);
      const rawProducts = Array.isArray(data.data?.products)
        ? data.data.products
        : Array.isArray(data.products)
          ? data.products
          : [];

      if (onProgressCallback) onProgressCallback(7, 10);

      const processedProducts = rawProducts.map((p: any, index: number) => {
        if (onProgressCallback) {
          const progress = 7 + Math.floor((index / rawProducts.length) * 3);
          onProgressCallback(progress, 10);
        }

        return {
          id: p.id,
          name: p.name,
          price: p.sizes?.[0]?.price?.product || 0,
          rating: p.reviewRating ?? null,
          image: WildberriesService.getImageUrl(p.id),
          images: p.pics > 0 ? [WildberriesService.getImageUrl(p.id)] : [],
          brand: p.brand || 'Неизвестно',
          seller: {
            id: p.sellerId,
            name: p.brand || 'Неизвестный продавец',
            rating: p.supplierRating || 0,
          },
          feedbacks: p.feedbacks || 0,
          inStock: p.sizes?.[0]?.stocks?.some((s: any) => s.qty > 0) || false,
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
   * @throws {Error} При ошибке сети или некорректном ответе API
   */
  static async fetchSuggestions(query: string): Promise<string[]> {
    try {
      const res = await fetch(`https://search.wb.ru/suggests?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("WB suggestions fetch error");

      const data = await res.json();
      return Array.isArray(data?.suggests) ? data.suggests : [];
    } catch (error) {
      console.error("WB fetchSuggestions error:", error);
      return [];
    }
  }

  /**
   * Генерирует URL изображения товара по его ID
   * @param productId ID товара
   * @returns URL изображения товара в формате WebP
   * @example
   * ```typescript
   * const imageUrl = WildberriesService.getImageUrl(123456);
   * // "https://basket-01.wb.ru/vol1/part1/12/123456/images/c516x688/1.webp"
   * ```
   */
  static getImageUrl(productId: number) {
    const idStr = productId.toString();
    return `https://basket-${idStr.slice(0, 3)}.wb.ru/vol${idStr.slice(0, 4)}/part${idStr.slice(0, 6)}/${productId}/images/c516x688/1.webp`;
  }

  /**
   * Получает детальную информацию о товаре по ID
   * @param id ID товара
   * @returns Promise с объектом товара или null в случае ошибки
   * @throws {Error} При ошибке сети или отсутствии товара
   */
  static async getProductById(id: number) {
    try {
      const products = await this.fetchProducts(id.toString(), undefined);
      const product = products.find((p: any) => p.id === id);

      if (product) return product;

      const res = await fetch(`https://card.wb.ru/cards/detail?nm=${id}`);
      if (!res.ok) return null;

      const data = await res.json();
      const wbProduct = data.data?.products?.[0];

      if (!wbProduct) return null;

      return {
        id: wbProduct.id,
        name: wbProduct.name,
        price: wbProduct.salePriceU ? wbProduct.salePriceU / 100 : 0,
        rating: wbProduct.rating ?? null,
        image: this.getImageUrl(Number(wbProduct.id)),
        images: wbProduct.pics > 0 ? [this.getImageUrl(Number(wbProduct.id))] : [],
      };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }
}

export { WildberriesService };
