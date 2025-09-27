import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CalculationResult {
  revenue: number;
  commission: number;
  logistics: number;
  profit: number;
  profitability: number;
}

export function ProfitabilityCalculator() {
  const [price, setPrice] = useState<number | ''>('');
  const [cost, setCost] = useState<number | ''>('');
  const [commissionRate, setCommissionRate] = useState<number>(10); // Default 10% commission
  const [logisticsCost, setLogisticsCost] = useState<number | ''>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateProfitability = () => {
    if (price === '' || cost === '' || logisticsCost === '') {
      setResult(null);
      return;
    }

    const priceValue = Number(price);
    const costValue = Number(cost);
    const logisticsValue = Number(logisticsCost);
    
    const commission = (priceValue * commissionRate) / 100;
    const revenue = priceValue - commission - logisticsValue;
    const profit = revenue - costValue;
    const profitability = (profit / priceValue) * 100;

    setResult({
      revenue: Number(revenue.toFixed(2)),
      commission: Number(commission.toFixed(2)),
      logistics: logisticsValue,
      profit: Number(profit.toFixed(2)),
      profitability: Number(profitability.toFixed(2))
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Калькулятор доходности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена продажи (₽)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Себестоимость (₽)</Label>
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value ? Number(e.target.value) : '')}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Комиссия WB (%)</Label>
              <Input
                id="commission"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logistics">Логистика (₽)</Label>
              <Input
                id="logistics"
                type="number"
                value={logisticsCost}
                onChange={(e) => setLogisticsCost(e.target.value ? Number(e.target.value) : '')}
                placeholder="0.00"
              />
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={calculateProfitability}
            disabled={!price || !cost || !logisticsCost}
          >
            Рассчитать
          </Button>

          {result && (
            <div className="mt-6 space-y-2 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-lg">Результаты расчета</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>Выручка:</div>
                <div className="text-right font-medium">{result.revenue} ₽</div>
                
                <div>Комиссия WB:</div>
                <div className="text-right text-red-600">-{result.commission} ₽</div>
                
                <div>Логистика:</div>
                <div className="text-right text-red-600">-{result.logistics} ₽</div>
                
                <div className="border-t border-gray-200 pt-2 font-medium">Прибыль:</div>
                <div className="border-t border-gray-200 pt-2 text-right font-medium">
                  {result.profit} ₽
                </div>
                
                <div className="font-medium">Рентабельность:</div>
                <div className={`text-right font-medium ${result.profitability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.profitability}%
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
