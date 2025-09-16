// path: src/hooks/useProductAnalysis.ts
import { useEffect, useState } from 'react';
import { analyzeProduct, ProgressCallback } from '@/pages/product/ProductService';
import { ProductInfo } from '@core/types/product';

interface UseProductAnalysisResult {
    product: ProductInfo | null;
    analysis: {
        isProfitable: boolean;
        profitMargin?: number;
        roi?: number;
        priceHistory?: Array<{ date: string; price: number }>;
    } | null;
    progress: { step: string; message: string; percent: number };
    loading: boolean;
    error: string | null;
}

export const useProductAnalysis = (productId: string): UseProductAnalysisResult => {
    const [product, setProduct] = useState<ProductInfo | null>(null);
    const [analysis, setAnalysis] = useState<UseProductAnalysisResult['analysis']>(null);
    const [progress, setProgress] = useState({ step: 'init', message: '', percent: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;

        setLoading(true);
        setError(null);
        setProgress({ step: 'init', message: '', percent: 0 });

        const onProgress: ProgressCallback = (step, message, percent) => {
            setProgress({ step, message, percent });
        };

        analyzeProduct(productId, onProgress)
            .then((res) => {
                if (res.success) {
                    setProduct(res.data?.product || null);
                    setAnalysis(res.data?.analysis || null);
                } else {
                    setError(res.error || 'Ошибка анализа');
                }
            })
            .catch((err) => {
                setError(err.message || 'Ошибка анализа');
            })
            .finally(() => setLoading(false));
    }, [productId]);

    return { product, analysis, progress, loading, error };
};
