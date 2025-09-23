import { AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Skeleton } from '../components/ui/skeleton.js';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  barcode: string;
  metadata: {
    brand?: string;
    category?: string;
    weight?: number;
    dimensions?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ProductAnalyseProps {
  productId?: string | number;
}

/**
 * Компонент для отображения и анализа данных о товаре
 * @param {ProductAnalyseProps} props - Свойства компонента
 * @param {string|number} [props.productId] - ID товара. Если не указан, будет использован ID из URL
 */
export const ProductAnalyse: React.FC<ProductAnalyseProps> = ({ productId: propProductId }) => {
  const { id: urlProductId } = useParams<{ id: string }>();
  const productId = propProductId || urlProductId;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError('ID товара не указан');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/get/${productId}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки товара: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Ошибка при загрузке товара:', err);
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Товар не найден</AlertTitle>
        <AlertDescription>Попробуйте обновить страницу или выбрать другой товар</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Основная информация</h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Артикул</p>
              <p>{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Штрих-код</p>
              <p>{product.barcode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Цена</p>
              <p>{product.price} ₽</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Остаток на складе</p>
              <p>{product.stock} шт.</p>
            </div>
          </div>
        </div>

        {product.metadata && (
          <div>
            <h3 className="text-lg font-medium mt-6 mb-2">Дополнительная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.metadata.brand && (
                <div>
                  <p className="text-sm text-muted-foreground">Бренд</p>
                  <p>{product.metadata.brand}</p>
                </div>
              )}
              {product.metadata.category && (
                <div>
                  <p className="text-sm text-muted-foreground">Категория</p>
                  <p>{product.metadata.category}</p>
                </div>
              )}
              {product.metadata.weight && (
                <div>
                  <p className="text-sm text-muted-foreground">Вес</p>
                  <p>{product.metadata.weight} кг</p>
                </div>
              )}
              {product.metadata.dimensions && (
                <div>
                  <p className="text-sm text-muted-foreground">Размеры</p>
                  <p>{product.metadata.dimensions} см</p>
                </div>
              )}
            </div>
          </div>
        )}

        {product.description && (
          <div>
            <h3 className="text-lg font-medium mt-6 mb-2">Описание</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAnalyse;