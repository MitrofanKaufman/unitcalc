// расположение: src/components/ui/ProductCard.tsx
/**
 * Компонент карточки товара.
 * Загружает изображение по ID через API, когда карточка появляется в зоне видимости.
 */

import { useEffect, useState, useRef } from 'react';
import { ProductInfo } from '@core/types/product';

type Props = {
    product: ProductInfo;
};

export const ProductCard = ({ product }: Props) => {
    const [imageUrl, setImageUrl] = useState<string | null>(product.image || null);
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    useEffect(() => {
        if (isVisible && !imageUrl) {
            const url = `/api/v1/media/image/${product.id}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) throw new Error('Not found');
                    return url;
                })
                .then(setImageUrl)
                .catch(() => {
                    setImageUrl('/placeholder.webp'); // запасное изображение
                });
        }
    }, [isVisible]);

    return (
        <div ref={ref} className="rounded-xl shadow p-4 bg-white w-full max-w-sm">
            <img
                src={imageUrl ?? '/placeholder.webp'}
                alt={product.name}
                className="w-full h-48 object-contain mb-2"
                loading="lazy"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <div className="text-sm text-gray-600">Артикул: #{product.id}</div>
            <div className="text-yellow-500">⭐ {product.rating}</div>
        </div>
    );
};
