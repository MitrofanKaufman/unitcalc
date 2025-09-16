// path: src/pages/calculator/CalculatorResult.tsx
/**
 * Calculator Result Component
 * 
 * Displays the calculation results including profitability metrics,
 * cost breakdown, and recommendations for the product on Wildberries.
 */

import { motion } from 'framer-motion';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Badge } from '../../../../../../app/client/components/ui/badge';
import { Button } from '../../../../../../app/client/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../../../app/client/components/ui/card';

import { containerVariants } from '@/core/types/containerVariants';

interface CalculationResult {
  productName: string;
  purchasePrice: number;
  sellingPrice: number;
  wbCommission: number;
  logisticsCost: number;
  otherCosts: number;
  businessModel: string;
  profit: number;
  profitMargin: number;
  roi: number;
  breakEvenPoint: number;
  commissionAmount: number;
  totalCosts: number;
}

const CalculatorResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get calculation results from location state or default values
  const result: CalculationResult = location.state?.result || {
    productName: 'Неизвестный товар',
    purchasePrice: 0,
    sellingPrice: 0,
    wbCommission: 0,
    logisticsCost: 0,
    otherCosts: 0,
    businessModel: 'FBO',
    profit: 0,
    profitMargin: 0,
    roi: 0,
    breakEvenPoint: 0,
    commissionAmount: 0,
    totalCosts: 0
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  const handleNewCalculation = () => {
    navigate('/calculator');
  };

  const handleSaveToHistory = () => {
    // TODO: Implement save to history functionality
    console.log('Saving to history:', result);
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Результаты расчета</h1>
            <p className="text-muted-foreground">
              Анализ рентабельности для {result.productName}
            </p>
          </div>
          <Badge variant={result.profit > 0 ? 'success' : 'destructive'} className="text-sm">
            {result.profit > 0 ? 'Прибыльный' : 'Убыточный'}
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Прибыль</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {formatCurrency(result.profit)}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Маржа</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {formatPercentage(result.profitMargin)}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ROI</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {formatPercentage(result.roi)}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Детали расчета</CardTitle>
            <CardDescription>Подробная информация о расчетах</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Параметры товара</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Модель: {result.businessModel === 'FBO' ? 'FBO (Fulfillment by Wildberries)' : 'FBS (Fulfillment by Seller)'}</p>
                  <p>Цена закупки: {formatCurrency(result.purchasePrice)}</p>
                  <p>Цена продажи: {formatCurrency(result.sellingPrice)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Расходы</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Комиссия WB ({result.wbCommission}%): {formatCurrency(result.commissionAmount)}</p>
                  <p>Логистика: {formatCurrency(result.logisticsCost)}</p>
                  <p>Прочие расходы: {formatCurrency(result.otherCosts)}</p>
                  <p className="font-medium pt-2">Итого расходы: {formatCurrency(result.totalCosts)}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Точка безубыточности</h3>
              <p className="text-sm text-muted-foreground">
                Вам нужно продать {Math.ceil(result.breakEvenPoint)} единиц товара, чтобы выйти в ноль.
              </p>
            </div>
            
            {result.profit <= 0 && (
              <div className="p-4 bg-destructive/10 rounded-lg text-destructive">
                <h4 className="font-medium mb-1">Внимание: убыточный товар</h4>
                <p className="text-sm">
                  При текущих параметрах продажа товара принесет убытки. Рекомендуется пересмотреть цену или сократить издержки.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Назад
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleSaveToHistory}>
                Сохранить в историю
              </Button>
              <Button onClick={handleNewCalculation}>
                Новый расчет
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Рекомендации</CardTitle>
            <CardDescription>Советы по увеличению прибыльности</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert">
              {result.profit > 0 ? (
                <>
                  <p>Товар выглядит прибыльным. Вот как можно увеличить прибыль:</p>
                  <ul>
                    <li>Попробуйте увеличить цену на 5-10% и проанализируйте спрос</li>
                    <li>Ищите поставщиков с более выгодными условиями</li>
                    <li>Оптимизируйте логистику для снижения издержек</li>
                    <li>Используйте акции и скидки для увеличения объема продаж</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>Товар убыточен. Рекомендации по улучшению:</p>
                  <ul>
                    <li>Попробуйте договориться о скидке с поставщиком</li>
                    <li>Рассмотрите возможность увеличения цены продажи</li>
                    <li>Ищите способы снижения логистических издержек</li>
                    <li>Проверьте, нет ли возможности снизить комиссию WB (например, участвуя в акциях маркетплейса)</li>
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CalculatorResult;
