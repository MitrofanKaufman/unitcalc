declare class WildberriesService {
    static fetchSuggestions(query: string): Promise<any>;
    /**
     * Получает список товаров по запросу с отслеживанием прогресса
     * @param query Поисковый запрос
     * @param onProgressCallback Колбек для отслеживания прогресса (текущий шаг, всего шагов)
     */
    static fetchProducts(query: string, onProgressCallback?: (current: number, total: number) => void): Promise<any>;
    static getImageUrl(productId: number): string;
    static getProductById(id: number): Promise<any>;
}
export { WildberriesService };
