import type { Product } from '@/types/dto';
/**
 * Кастомный хук для работы с товарами через API
 * Реализует взаимодействие с сервером через API клиент
 *
 * @param productId - ID товара для получения (опционально)
 * @returns Состояние загрузки товара и функции управления
 */
export declare function useProduct(productId?: string): {
    product: Product | null | undefined;
    productLoading: boolean;
    productError: string | undefined;
    refetchProduct: () => "" | Promise<void> | undefined;
    searchResults: Product[] | undefined;
    searchLoading: boolean;
    searchError: string | undefined;
    searchProducts: (query: string, marketplace?: string, category?: string) => Promise<never[]>;
};
/**
 * Хук для получения справочников (маркетплейсы, категории)
 */
export declare function useReferences(): {
    marketplaces: any[];
    categories: any[];
    referencesLoading: boolean;
    referencesError: string | undefined;
    refetchReferences: () => void;
};
