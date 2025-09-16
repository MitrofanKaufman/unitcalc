// path: src/page/ProductAnalyse.tsx
/**
 * Компонент для анализа товара по ID.
 * Отправляет запрос на сервер для сбора и сохранения данных о товаре.
 * Отображает индикатор прогресса и статус операции.
 */

import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { StepProgressBar } from "../../../../../app/client/components/StepProgressBar";
import { Card } from "../../../../../app/client/components/ui/card";

import { analyzeProduct } from "@/core/services/productService";

interface ProductAnalyseProps {
  isDark?: boolean;
}

interface ProductData {
  product: any; // Замените на конкретный тип продукта
  analysis: {
    isProfitable: boolean;
    profitMargin?: number;
    roi?: number;
    priceHistory?: Array<{ date: string; price: number }>;
  };
}

export const ProductAnalyse: React.FC<ProductAnalyseProps> = ({ isDark = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Инициализация...');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const analyzeProductData = useCallback(async () => {
    if (!id) {
      setError('Не указан ID товара');
      setStatus('Ошибка: Не указан ID товара');
      setCompletedSteps(prev => [...prev, 'Ошибка: Не указан ID товара']);
      return;
    }

    // Сбрасываем состояние перед началом анализа
    setLoading(true);
    setError(null);
    setProgress(0);
    setStatus('Инициализация анализа...');
    setCompletedSteps([]);
    
    // Выносим handleProgress за пределы блока try, чтобы избежать замыкания
    const handleProgress = (step: string, message: string, percent: number) => {
      setProgress(percent);
      setStatus(message);
      
      // Добавляем завершенные шаги в список
      if (step === 'completed') {
        setCompletedSteps(prev => [...prev, 'Анализ завершен']);
      } else if (step === 'error') {
        setError(message);
        setCompletedSteps(prev => [...prev, `Ошибка: ${message}`]);
      } else if (message && !message.includes('...')) {
        // Добавляем только значимые шаги, не промежуточные статусы с многоточием
        setCompletedSteps(prev => {
          // Проверяем, нет ли уже такого шага в списке
          if (!prev.includes(message)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    };

    try {
      const result = await analyzeProduct(id, handleProgress);
      
      if (result.success && result.data) {
        setProductData(result.data);
        setActiveTab('details');
        navigate(`/product/${id}`);
      } else {
        let errorMessage = 'Произошла ошибка при анализе товара';
        
        // Более информативные сообщения об ошибках
        if (result.error?.includes('503')) {
          errorMessage = 'Сервер временно недоступен. Пожалуйста, попробуйте позже.';
        } else if (result.error?.includes('NetworkError')) {
          errorMessage = 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.';
        } else if (result.error) {
          errorMessage = result.error;
        }
        
        setError(errorMessage);
        setStatus('Ошибка анализа');
        setCompletedSteps(prev => [...prev, `Ошибка: ${errorMessage}`]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла непредвиденная ошибка';
      setError(errorMessage);
      setStatus('Ошибка');
      setCompletedSteps(prev => [...prev, `Критическая ошибка: ${errorMessage}`]);
      console.error('Ошибка при анализе товара:', err);
    } finally {
      setLoading(false);
      // Убедимся, что прогресс установлен в 100% при завершении
      setProgress(100);
    }
  }, [id, navigate]); // Убираем progress из зависимостей, чтобы избежать рекурсии

  useEffect(() => {
    analyzeProductData();
  }, [analyzeProductData]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Ошибка
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Анализ товара
            </h2>
            <p className="text-muted-foreground">
              Пожалуйста, подождите, пока мы анализируем товар...
            </p>
          </div>
          
          <StepProgressBar
            progress={progress}
            currentStep={status}
            completedSteps={completedSteps}
            className="mt-4"
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductAnalyse;
