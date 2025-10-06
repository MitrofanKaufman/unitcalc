// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\ui\src\components\DataCollection\DataCollectionDemo.tsx
/**
 * path/to/file.ts
 * Описание: Демонстрационная страница для сбора данных товаров
 * Логика: Клиентская (React компонент)
 * Зависимости: React, компоненты сбора данных, API клиента
 * Примечания: Показывает полный процесс сбора данных с визуализацией
 */

import React, { useState, useCallback } from 'react';
import { ProgressIndicator, ProductDataDisplay } from './index';

interface ProductData {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  questions: number;
  image: string;
  description: string;
  parameters: Record<string, string>;
  originalMark: boolean;
  sellerId: string;
  collectedAt?: string;
  sourceUrl?: string;
}

interface CollectionProgress {
  currentStep: string;
  totalSteps: number;
  percentage: number;
  message: string;
  errors: string[];
  data?: any;
}

interface DataCollectionDemoProps {
  className?: string;
}

export const DataCollectionDemo: React.FC<DataCollectionDemoProps> = ({
  className = ''
}) => {
  const [productId, setProductId] = useState('220156288');
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState<CollectionProgress | null>(null);
  const [result, setResult] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCollectData = useCallback(async () => {
    if (!productId.trim()) {
      setError('Введите ID товара');
      return;
    }

    setIsCollecting(true);
    setProgress(null);
    setResult(null);
    setError(null);

    try {
      // Здесь будет вызов API
      // const response = await fetch(`/api/wildberries/product/${productId}`);
      // const data = await response.json();

      // Имитация процесса сбора данных для демонстрации
      const mockProgress: CollectionProgress[] = [
        { currentStep: 'pageLoad', totalSteps: 8, percentage: 0, message: 'Подключение к сайту...', errors: [] },
        { currentStep: 'captchaCheck', totalSteps: 8, percentage: 12, message: 'Проверка капчи...', errors: [] },
        { currentStep: 'title', totalSteps: 8, percentage: 25, message: 'Получение названия...', errors: [] },
        { currentStep: 'price', totalSteps: 8, percentage: 37, message: 'Получение цены...', errors: [] },
        { currentStep: 'ratingAndReviews', totalSteps: 8, percentage: 50, message: 'Анализ отзывов...', errors: [] },
        { currentStep: 'image', totalSteps: 8, percentage: 62, message: 'Загрузка изображений...', errors: [] },
        { currentStep: 'productParameters', totalSteps: 8, percentage: 75, message: 'Сбор характеристик...', errors: [] },
        { currentStep: 'sellerId', totalSteps: 8, percentage: 87, message: 'Определение продавца...', errors: [] },
      ];

      // Имитация прогресса
      for (const progressStep of mockProgress) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(progressStep);
      }

      // Имитация финального результата
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockResult: ProductData = {
        id: productId,
        title: 'Паста Птитим 1 кг.',
        price: 359,
        rating: 4.9,
        reviews: 4748,
        questions: 23,
        image: 'https://basket-15.wbbasket.ru/vol2201/part220156/220156288/images/c246x328/1.webp',
        description: 'Птитим (жемчужная паста) — это мелкие макароны круглой формы...',
        parameters: {
          'Состав': 'птитим',
          'Вид муки': 'мука из твердых сортов',
          'Срок годности': '24 мес',
          'Страна производства': 'Россия'
        },
        originalMark: true,
        sellerId: '1420910',
        collectedAt: new Date().toISOString(),
        sourceUrl: `https://www.wildberries.ru/catalog/${productId}/detail.aspx`
      };

      setResult(mockResult);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сборе данных');
    } finally {
      setIsCollecting(false);
    }
  }, [productId]);

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Сбор данных товаров Wildberries
        </h1>
        <p className="text-gray-600 mb-6">
          Введите ID товара для автоматического сбора подробной информации о продукте.
        </p>

        {/* Форма ввода */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                ID товара
              </label>
              <input
                type="text"
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Введите ID товара (например, 220156288)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isCollecting}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCollectData}
                disabled={isCollecting || !productId.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                {isCollecting ? 'Сбор данных...' : 'Собрать данные'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Прогресс сбора данных */}
      {isCollecting && progress && (
        <div className="mb-8">
          <ProgressIndicator
            progress={progress}
            title="Процесс сбора данных"
            showDetails={true}
          />
        </div>
      )}

      {/* Результаты */}
      {result && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Результаты сбора данных
          </h2>
          <ProductDataDisplay
            product={result}
            showActions={true}
            onCollect={handleCollectData}
          />
        </div>
      )}

      {/* Инструкции */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Как использовать:
        </h3>
        <ol className="text-blue-800 space-y-2">
          <li>1. Введите ID товара Wildberries в поле выше</li>
          <li>2. Нажмите кнопку "Собрать данные"</li>
          <li>3. Следите за прогрессом в реальном времени</li>
          <li>4. Просмотрите собранную информацию о товаре</li>
        </ol>
        <p className="mt-4 text-sm text-blue-700">
          <strong>Примечание:</strong> В демонстрации используется моковые данные.
          В реальном приложении данные будут собираться с сайта Wildberries автоматически.
        </p>
      </div>
    </div>
  );
};

export default DataCollectionDemo;
