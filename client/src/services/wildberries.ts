
class WildberriesService {
    static async fetchSuggestions(query: string) {
        const res = await fetch(`https://suggests.wb.ru/suggests/api/v7/hint?ab_testing=false&query=${encodeURIComponent(query)}&gender=common&locale=kz&lang=ru&appType=1` );
        if (!res.ok)
            throw new Error("WB suggestions error");
        const data = await res.json();
        return Array.isArray(data.suggests)
            ? data.suggests.map((s: any) => s.name)
            : [];
    }

    /**
     * Получает список товаров по запросу с отслеживанием прогресса
     * @param query Поисковый запрос
     * @param onProgressCallback Колбек для отслеживания прогресса (текущий шаг, всего шагов)
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
            // Уведомление о начале загрузки
            if (onProgressCallback)
                onProgressCallback(1, 10);
            // Получение данных с WB
            const res = await fetch(`${base}?${params.toString()}` );
            if (!res.ok)
                throw new Error("WB fetch error");
            // Обработка ответа
            if (onProgressCallback)
                onProgressCallback(3, 10);
            const data = await res.json();
            // Извлечение списка товаров
            if (onProgressCallback)
                onProgressCallback(5, 10);
            const rawProducts = Array.isArray(data.data?.products)
                ? data.data.products
                : Array.isArray(data.products)
                    ? data.products
                    : [];
            // Уведомление о количестве найденных товаров
            if (onProgressCallback)
                onProgressCallback(7, 10);
            // Обработка каждого товара с обновлением прогресса
            const processedProducts = rawProducts.map((p: any, index: number) => {
                // Обновление прогресса для каждого товара
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
            // Уведомление о завершении обработки
            if (onProgressCallback)
                onProgressCallback(10, 10);
            return processedProducts;
        }
        catch (error) {
            console.error("WB fetchProducts error:", error);
            return [];
        }
    }

    static getImageUrl(productId: number) {
        const idStr = productId.toString();
        return `https://basket-${idStr.slice(0, 3)}.wb.ru/vol${idStr.slice(0, 4)}/part${idStr.slice(0, 6)}/${productId}/images/c516x688/1.webp` ;
    }

    static async getProductById(id: number) {
        try {
            const products = await this.fetchProducts(id.toString(), undefined);
            const product = products.find((p: any) => p.id === id);
            if (product)
                return product;
            const res = await fetch(`https://card.wb.ru/cards/detail?nm=${id}` );
            if (!res.ok)
                return null;
            const data = await res.json();
            const wbProduct = data.data?.products?.[0];
            if (!wbProduct)
                return null;
            return {
                id: wbProduct.id,
                name: wbProduct.name,
                price: wbProduct.salePriceU ? wbProduct.salePriceU / 100 : 0,
                rating: wbProduct.rating ?? null,
                image: this.getImageUrl(Number(wbProduct.id)),
                images: wbProduct.pics > 0 ? [this.getImageUrl(Number(wbProduct.id))] : [],
            };
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            return null;
        }
    }
}

export { WildberriesService };
