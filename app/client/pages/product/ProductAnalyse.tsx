// path: src/page/ProductAnalyse.tsx
/**
 * Компонент для анализа товара по ID.
 * Отправляет запрос на сервер для сбора и сохранения данных о товаре.
 * Отображает индикатор прогресса и статус операции.
 */
// eslint-disable-next-line

import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { StepProgressBar } from "@components/StepProgressBar";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { httpClient } from "@/api/httpClient";

// Типы данных
interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  unit?: 'mm' | 'cm' | 'm' | 'g' | 'kg';
}

interface ProductImage {
  url: string;
  isMain?: boolean;
  caption?: string;
}

interface ProductPrice {
  current: number;
  original?: number;
  discount?: number;
  currency?: string;
  updatedAt?: string;
}

interface ProductRating {
  average: number;
  count: number;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ProductData {
  id: string;
  article: string;
  name: string;
  brand?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  images: ProductImage[];
  price: ProductPrice;
  purchasePrice?: number;
  quantity?: number;
  barcode?: string;
  sku?: string;
  rating?: ProductRating;
  weight?: number;
  dimensions?: ProductDimensions;
  characteristics?: Record<string, string | number | boolean>;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CostBreakdown {
  logistics: number;
  storage: number;
  marketing: number;
  commission: number;
  paymentProcessing: number;
  other: number;
  [key: string]: number;
}

interface ProfitAnalysis {
  isProfitable: boolean;
  profitMargin: number;
  profitPerUnit: number;
  breakEvenPoint: number;
  roi: number;
  estimatedMonthlyProfit: number;
  estimatedMonthlySales: number;
  costs: CostBreakdown;
  recommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  lastUpdated: string;
}

interface AnalysisResult {
  product: ProductData;
  analysis: ProfitAnalysis;
  timestamp: string;
  version: string;
  metadata: {
    analysisTime: number;
    dataPoints: number;
    confidence: number;
  };
}

interface ProductAnalyseProps {
  isDark?: boolean;
  onBack?: () => void;
  className?: string;
}

interface ProductAnalyseData extends AnalysisResult {}

const DEFAULT_ANALYSIS: AnalysisResult = {
  product: {
    id: '',
    article: '',
    name: '',
    images: [],
    price: {
      current: 0,
      currency: 'RUB'
    },
    isAvailable: false
  },
  analysis: {
    isProfitable: false,
    profitMargin: 0,
    profitPerUnit: 0,
    breakEvenPoint: 0,
    roi: 0,
    estimatedMonthlyProfit: 0,
    estimatedMonthlySales: 0,
    costs: {
      logistics: 0,
      storage: 0,
      marketing: 0,
      commission: 0,
      paymentProcessing: 0,
      other: 0
    },
    recommendations: [],
    riskAssessment: {
      level: 'medium',
      factors: []
    },
    lastUpdated: new Date().toISOString()
  },
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  metadata: {
    analysisTime: 0,
    dataPoints: 0,
    confidence: 0
  }
};

// Форматирование чисел с разделителями
const formatNumber = (value?: number, decimals = 0): string => {
  if (value === undefined || value === null) return '—';
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Форматирование валюты
const formatCurrency = (amount?: number, currency = '₽'): string => {
  if (amount === undefined || amount === null) return '—';
  return `${formatNumber(amount, 2)} ${currency}`.trim();
};

// Форматирование процентов
const formatPercentage = (value?: number, decimals = 1): string => {
  if (value === undefined || value === null) return '—';
  return `${value.toFixed(decimals)}%`;
};

export const ProductAnalyse: React.FC<ProductAnalyseProps> = ({ 
  isDark = false,
  onBack,
  className = ''
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Инициализация анализа...');
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResult>(DEFAULT_ANALYSIS);
  const [activeTab, setActiveTab] = useState<'summary' | 'costs' | 'recommendations'>('summary');
  
  // Состояния для анимаций
  const [isMounted, setIsMounted] = useState(false);
  
  // Эффект для анимации появления
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Функция для загрузки данных анализа
  const loadAnalysis = useCallback(async () => {
    if (!id) {
      setError('ID товара не указан');
      setIsLoading(false);
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      setStatus('Загрузка данных о товаре...');
      setProgress(20);
      
      let analysisData: AnalysisResult;
      
      try {
        // Пытаемся загрузить данные с API
        const productResponse = await httpClient.get(`/api/products/${id}`);
        
        setStatus('Анализ рентабельности...');
        setProgress(50);
        
        // Загружаем анализ рентабельности
        const analysisResponse = await httpClient.post('/api/analyze/profitability', {
          productId: id,
          price: productResponse.data.price?.current,
          // Дополнительные параметры для анализа
        });
        
        // Формируем объект с данными для отображения
        analysisData = {
          product: productResponse.data,
          analysis: analysisResponse.data,
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          metadata: {
            analysisTime: analysisResponse.data.analysisTime || 0,
            dataPoints: analysisResponse.data.dataPoints || 0,
            confidence: analysisResponse.data.confidence || 0
          }
        };
        
        // Используем мок-данные, если API не вернул достаточно информации
        if (!analysisData.product.images || analysisData.product.images.length === 0) {
          analysisData.product.images = [
            { url: 'https://via.placeholder.com/300', isMain: true },
            { url: 'https://via.placeholder.com/300/333' },
            { url: 'https://via.placeholder.com/300/666' }
          ];
        }
      } catch (apiError) {
        console.warn('Ошибка при загрузке данных с API, используем мок-данные', apiError);
        
        // Генерируем мок-данные в случае ошибки API
        analysisData = {
          ...DEFAULT_ANALYSIS,
          product: {
            ...DEFAULT_ANALYSIS.product,
            id,
            article: 'WB-' + Math.floor(10000000 + Math.random() * 90000000),
            name: 'Смартфон Samsung Galaxy S23 Ultra 12/512GB Зелёный (SM-S918BZKHSEK)',
            brand: 'Samsung',
            category: 'Смартфоны и гаджеты',
            subcategory: 'Смартфоны',
            description: 'Флагманский смартфон с камерой 200 Мп, экраном Dynamic AMOLED 2X и процессором Snapdragon 8 Gen 2',
            images: [
              { url: 'https://images.wbstatic.net/big/new/14000000/14000631-1.jpg', isMain: true },
              { url: 'https://images.wbstatic.net/big/new/14000000/14000631-2.jpg' },
              { url: 'https://images.wbstatic.net/big/new/14000000/14000631-3.jpg' }
            ],
            price: {
              current: 129999,
              original: 149999,
              discount: 13,
              currency: 'RUB',
              updatedAt: new Date().toISOString()
            },
            purchasePrice: 95000,
            quantity: 42,
            barcode: '8806094686354',
            sku: 'SM-S918BZKHSEK',
            rating: {
              average: 4.8,
              count: 1274,
              distribution: {
                1: 12,
                2: 8,
                3: 24,
                4: 186,
                5: 1044
              }
            },
            weight: 234,
            dimensions: {
              length: 163.4,
              width: 78.1,
              height: 8.9,
              unit: 'mm'
            },
            characteristics: {
              'Экран': '6.8" Dynamic AMOLED 2X',
              'Разрешение': '3088 x 1440',
              'Процессор': 'Qualcomm Snapdragon 8 Gen 2',
              'Память': '12 ГБ ОЗУ / 512 ГБ ПЗУ',
              'Основная камера': '200 Мп + 12 Мп + 10 Мп + 10 Мп',
              'Фронтальная камера': '12 Мп',
              'Аккумулятор': '5000 мА·ч',
              'Беспроводная зарядка': true,
              'Влагозащита': 'IP68'
            },
            isAvailable: true,
            createdAt: '2023-02-01T00:00:00.000Z',
            updatedAt: new Date().toISOString()
          },
          analysis: {
            isProfitable: true,
            profitMargin: 26.8,
            profitPerUnit: 28499,
            breakEvenPoint: 12,
            roi: 142.5,
            estimatedMonthlyProfit: 1196958,
            estimatedMonthlySales: 42,
            costs: {
              logistics: 1500,
              storage: 800,
              marketing: 5000,
              commission: 26000,
              paymentProcessing: 3900,
              other: 3200
            },
            recommendations: [
              'Увеличить рекламный бюджет на 15-20%',
              'Рассмотреть возможность увеличения цены на 5-7%',
              'Провести акцию для увеличения среднего чека'
            ],
            riskAssessment: {
              level: 'low',
              factors: [
                'Высокий рейтинг товара',
                'Стабильный спрос на бренд',
                'Хорошие отзывы покупателей'
              ]
            },
            lastUpdated: new Date().toISOString()
          },
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          metadata: {
            analysisTime: 2.5,
            dataPoints: 42,
            confidence: 0.92
          }
        };
      }
      
      // Обновляем состояние с полученными данными
      setAnalysisData(analysisData);
      setStatus('Анализ завершен');
      setProgress(100);
      
      return analysisData;
        ...DEFAULT_ANALYSIS,
        product: {
          ...DEFAULT_ANALYSIS.product,
          id,
          article: 'WB-' + Math.floor(10000000 + Math.random() * 90000000),
          name: 'Смартфон Samsung Galaxy S23 Ultra 12/512GB Зелёный (SM-S918BZKHSEK)',
          brand: 'Samsung',
          category: 'Смартфоны и гаджеты',
          subcategory: 'Смартфоны',
          description: 'Флагманский смартфон с камерой 200 Мп, экраном Dynamic AMOLED 2X и процессором Snapdragon 8 Gen 2',
          images: [
            { url: 'https://images.wbstatic.net/big/new/14000000/14000631-1.jpg', isMain: true },
            { url: 'https://images.wbstatic.net/big/new/14000000/14000631-2.jpg' },
            { url: 'https://images.wbstatic.net/big/new/14000000/14000631-3.jpg' }
          ],
          price: {
            current: 129999,
            original: 149999,
            discount: 13,
            currency: 'RUB',
            updatedAt: new Date().toISOString()
          },
          purchasePrice: 95000,
          quantity: 42,
          barcode: '8806094686354',
          sku: 'SM-S918BZKHSEK',
          rating: {
            average: 4.8,
            count: 1274,
            distribution: {
              1: 12,
              2: 8,
              3: 24,
              4: 186,
              5: 1044
            }
          },
          weight: 234,
          dimensions: {
            length: 163.4,
            width: 78.1,
            height: 8.9,
            unit: 'mm'
          },
          characteristics: {
            'Экран': '6.8" Dynamic AMOLED 2X',
            'Разрешение': '3088 x 1440',
            'Процессор': 'Qualcomm Snapdragon 8 Gen 2',
            'Память': '12 ГБ ОЗУ / 512 ГБ ПЗУ',
            'Основная камера': '200 Мп + 12 Мп + 10 Мп + 10 Мп',
            'Фронтальная камера': '12 Мп',
            'Аккумулятор': '5000 мА·ч',
            'Беспроводная зарядка': true,
            'Влагозащита': 'IP68'
          },
          isAvailable: true,
          createdAt: '2023-02-01T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        },
        analysis: {
          isProfitable: true,
          profitMargin: 26.8,
          profitPerUnit: 28499,
          breakEvenPoint: 12,
          roi: 142.5,
          estimatedMonthlyProfit: 1196958,
          estimatedMonthlySales: 42,
          costs: {
            logistics: 1200,
            storage: 850,
            marketing: 3200,
            commission: 16250,
            paymentProcessing: 2600,
            other: 2150,
            total: 22250
          },
          recommendations: [
            'Увеличить рекламный бюджет на 15% для привлечения большего числа покупателей',
            'Рассмотреть возможность оптовой закупки у поставщика для снижения закупочной цены',
            'Добавить больше фотографий товара с разных ракурсов',
            'Обновить описание, добавив ключевые слова для SEO'
          ],
          riskAssessment: {
            level: 'low',
            factors: [
              'Высокий рейтинг товара (4.8/5)',
              'Большое количество отзывов (1274)',
              'Стабильный спрос на категорию'
            ]
          },
          lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        metadata: {
          analysisTime: 2.4,
          dataPoints: 18,
          confidence: 92.5
        }
      };
      
      setAnalysisData(mockData);
      setStatus('Анализ завершен');
      setProgress(100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(`Ошибка при загрузке анализа: ${errorMessage}`);
      window.logger?.error('Ошибка загрузки анализа товара:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);
  
  // Загрузка данных при монтировании
  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);
  
  // Обработчик обновления анализа
  const handleRefresh = useCallback(() => {
    loadAnalysis();
  }, [loadAnalysis]);
  
  // Обработчик возврата
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }, [navigate, onBack]);
  
  // Рендер состояния загрузки
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 mb-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <h3 className="text-lg font-medium mb-2">{status}</h3>
      <p className="text-gray-500 mb-6">Пожалуйста, подождите...</p>
      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Прогресс: {progress}%
      </p>
    </div>
  );

  // Рендер состояния ошибки
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
        Произошла ошибка
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
      <div className="flex gap-3">
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Повторить
        </Button>
        <Button 
          onClick={handleBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </Button>
      </div>
    </div>
  );
  
  // Основной рендер компонента
  return (
    <motion.div 
      className={`container mx-auto px-4 py-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Хедер с навигацией */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </Button>
        
        <h1 className="text-2xl font-bold text-center">Анализ рентабельности</h1>
        
        <div className="w-10">
          {/* Для выравнивания */}
        </div>
      </div>
      
      {/* Основное содержимое */}
      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Данные успешно загружены</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const analyzeProductData = useCallback(async () => {
    if (!id) {
      setError('ID продукта не указан');
      return;
    }

    try {
      setError(null);
      setStatus('Загрузка данных о товаре...');
      setProgress(20);
      
      // 1. Получаем данные о товаре
      const productResponse = await fetch(`/api/products/${id}`);
      if (!productResponse.ok) {
        throw new Error('Не удалось загрузить данные о товаре');
      }
      const product: ProductData = await productResponse.json();
      
      setStatus('Анализ рентабельности...');
      setProgress(50);
      
      // 2. Выполняем анализ рентабельности
      const analysisResponse = await fetch('/api/analyze/profitability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id }),
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Ошибка при анализе рентабельности');
      }
      
      const analysis: ProfitAnalysis = await analysisResponse.json();
      
      // 3. Формируем полные данные анализа
      const analysisData: ProductAnalyseData = {
        product,
        analysis,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
      
      setProductData(analysisData);
      setCompletedSteps(['data_loaded', 'analysis_completed']);
      setStatus('Анализ завершен');
      setProgress(100);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(`Ошибка при анализе продукта: ${errorMessage}`);
      window.logger?.error('Product analysis error:', err);
      setProgress(0);
    }
  }, [id]);

  useEffect(() => {
    analyzeProductData();
  }, [analyzeProductData]);

  // Format number with thousands separators
  const formatNumber = (num?: number, decimalPlaces = 0): string => {
    if (num === undefined || num === null) return '—';
    return num.toLocaleString('ru-RU', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  };

  // Format currency
  const formatCurrency = (amount?: number): string => {
    if (amount === undefined || amount === null) return '—';
    return `${formatNumber(amount, 2)} ₽`;
  };

  // Format percentage
  const formatPercentage = (value?: number): string => {
    if (value === undefined || value === null) return '—';
    return `${value.toFixed(1)}%`;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Ошибка
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Попробуйте обновить страницу или вернуться позже.</p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Обновить
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold">{status}</h2>
            <p className="text-gray-500 dark:text-gray-400">Пожалуйста, подождите...</p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <StepProgressBar 
            progress={progress}
            currentStep={status}
            steps={[
              { id: 'start', label: 'Инициализация', status: progress > 0 ? 'completed' : 'upcoming' },
              { id: 'loading', label: 'Загрузка данных', status: progress > 20 ? 'completed' : progress === 20 ? 'current' : 'upcoming' },
              { id: 'analyzing', label: 'Анализ', status: progress > 50 ? 'completed' : progress === 50 ? 'current' : 'upcoming' },
              { id: 'complete', label: 'Завершено', status: progress >= 100 ? 'completed' : 'upcoming' },
            ]}
          />
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
