// path: src/hooks/useProduct.ts
import { useEffect, useState } from 'react';
import { getProduct } from '@/pages/product/ProductService';
import { ProductInfo } from '@core/types/product';

interface UseProductResult {
    data: ProductInfo | null;
    loading: boolean;
    error: string | null;
    source: 'cache' | 'api' | null;
}

export const useProduct = (productId: string): UseProductResult => {
    const [data, setData] = useState<ProductInfo | null>(null);
    const [source, setSource] = useState<'cache' | 'api' | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;

        setLoading(true);
        setError(null);

        getProduct(productId)
            .then((res) => {
                setData(res.data);
                setSource(res.source);
                if (res.error) setError(res.error);
            })
            .catch((err) => {
                setError(err.message || 'Ошибка загрузки');
            })
            .finally(() => setLoading(false));
    }, [productId]);

    return { data, loading, error, source };
};
