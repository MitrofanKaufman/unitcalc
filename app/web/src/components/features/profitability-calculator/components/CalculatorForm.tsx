import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { Calculate as CalculateIcon, Clear as ClearIcon } from '@mui/icons-material';
import { type Product, MARKETPLACES, PRODUCT_CATEGORIES } from '@/types';

interface CalculatorFormProps {
  product: Product;
  onClose: () => void;
}

interface CalculationResult {
  revenue: number;
  commission: number;
  logistics: number;
  otherCosts: number;
  profit: number;
  profitability: number;
  roi: number;
}

/**
 * Форма калькулятора доходности для конкретного товара
 */
export function CalculatorForm({ product, onClose }: CalculatorFormProps) {
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [logisticsCost, setLogisticsCost] = useState<number | ''>('');
  const [otherCosts, setOtherCosts] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>(product.price);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const calculateProfitability = () => {
    if (purchasePrice === '' || logisticsCost === '' || otherCosts === '' || sellingPrice === '') {
      return;
    }

    const purchase = Number(purchasePrice);
    const logistics = Number(logisticsCost);
    const other = Number(otherCosts);
    const selling = Number(sellingPrice);

    // Получение комиссии маркетплейса
    const marketplace = MARKETPLACES.find(m => m.id === product.marketplace);
    const baseCommission = marketplace?.commission.base || 15;
    const categoryMultiplier = marketplace?.commission.categoryMultiplier?.[product.category] || 0.1;
    const commission = selling * (baseCommission / 100) * (1 + categoryMultiplier);

    // Расчет показателей
    const revenue = selling - commission - logistics - other;
    const profit = revenue - purchase;
    const profitability = (profit / selling) * 100;
    const roi = (profit / purchase) * 100;

    setCalculationResult({
      revenue: Number(revenue.toFixed(2)),
      commission: Number(commission.toFixed(2)),
      logistics,
      otherCosts: other,
      profit: Number(profit.toFixed(2)),
      profitability: Number(profitability.toFixed(2)),
      roi: Number(roi.toFixed(2))
    });
  };

  const clearAll = () => {
    setPurchasePrice('');
    setLogisticsCost('');
    setOtherCosts('');
    setSellingPrice(product.price);
    setCalculationResult(null);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography variant="h6">
              Расчет доходности: {product.name}
            </Typography>
            <Chip
              label={MARKETPLACES.find(m => m.id === product.marketplace)?.name}
              sx={{
                backgroundColor: MARKETPLACES.find(m => m.id === product.marketplace)?.color,
                color: 'white'
              }}
            />
          </div>
        }
      />
      <CardContent>
        {/* Характеристики товара */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Характеристики товара:
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <Typography variant="body2" color="text.secondary">Категория</Typography>
              <Typography variant="body1">
                {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name || product.category}
              </Typography>
            </div>
            {product.characteristics?.weight && (
              <div>
                <Typography variant="body2" color="text.secondary">Вес</Typography>
                <Typography variant="body1">{product.characteristics.weight} г</Typography>
              </div>
            )}
            {product.characteristics?.brand && (
              <div>
                <Typography variant="body2" color="text.secondary">Бренд</Typography>
                <Typography variant="body1">{product.characteristics.brand}</Typography>
              </div>
            )}
            {product.characteristics?.rating && (
              <div>
                <Typography variant="body2" color="text.secondary">Рейтинг</Typography>
                <Typography variant="body1">★ {product.characteristics.rating}</Typography>
              </div>
            )}
          </div>
        </Paper>

        {/* Форма ввода данных для расчета */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <TextField
            fullWidth
            label="Цена закупки (₽)"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="0.00"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Логистика (₽)"
            type="number"
            value={logisticsCost}
            onChange={(e) => setLogisticsCost(e.target.value ? Number(e.target.value) : '')}
            placeholder="0.00"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Другие затраты (₽)"
            type="number"
            value={otherCosts}
            onChange={(e) => setOtherCosts(e.target.value ? Number(e.target.value) : '')}
            placeholder="0.00"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Цена продажи (₽)"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="0.00"
            variant="outlined"
          />
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <Button
            variant="contained"
            size="large"
            onClick={calculateProfitability}
            disabled={!purchasePrice || !logisticsCost || !otherCosts || !sellingPrice}
            startIcon={<CalculateIcon />}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #17a2b8 90%)',
              }
            }}
          >
            Рассчитать доходность
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={clearAll}
            startIcon={<ClearIcon />}
          >
            Очистить
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={onClose}
          >
            Закрыть
          </Button>
        </div>

        {/* Результаты расчета */}
        {calculationResult && (
          <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Результаты расчета доходности
            </Typography>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Выручка:</Typography>
                    <Typography variant="h6" sx={{ color: 'success.main' }}>
                      {calculationResult.revenue} ₽
                    </Typography>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Комиссия маркетплейса:</Typography>
                    <Typography variant="h6" sx={{ color: 'error.main' }}>
                      -{calculationResult.commission} ₽
                    </Typography>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Логистика:</Typography>
                    <Typography variant="h6" sx={{ color: 'error.main' }}>
                      -{calculationResult.logistics} ₽
                    </Typography>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Другие затраты:</Typography>
                    <Typography variant="h6" sx={{ color: 'error.main' }}>
                      -{calculationResult.otherCosts} ₽
                    </Typography>
                  </div>

                  <Divider sx={{ my: 1 }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Чистая прибыль:</Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: calculationResult.profit >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {calculationResult.profit} ₽
                    </Typography>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Рентабельность:</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: calculationResult.profitability >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {calculationResult.profitability}%
                    </Typography>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">ROI (окупаемость):</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: calculationResult.roi >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {calculationResult.roi}%
                    </Typography>
                  </div>

                  <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Рекомендация:
                    </Typography>
                    <Typography variant="body1">
                      {calculationResult.profitability >= 20
                        ? "✅ Отличная доходность! Рекомендуем к запуску."
                        : calculationResult.profitability >= 10
                        ? "⚠️ Средняя доходность. Требует дополнительного анализа."
                        : "❌ Низкая доходность. Рекомендуем пересмотреть ценообразование."
                      }
                    </Typography>
                  </Paper>
                </div>
              </div>
            </div>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
}

export default CalculatorForm;
