import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import FeaturesLayout from '../FeaturesLayout';

export function ProfitabilityCalculator() {
  const [formData, setFormData] = useState({
    productPrice: '',
    costPrice: '',
    shippingCost: '',
    commission: ''
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const calculateProfit = () => {
    const productPrice = parseFloat(formData.productPrice) || 0;
    const costPrice = parseFloat(formData.costPrice) || 0;
    const shippingCost = parseFloat(formData.shippingCost) || 0;
    const commission = parseFloat(formData.commission) || 0;

    const totalCost = costPrice + shippingCost + commission;
    const profit = productPrice - totalCost;
    const margin = productPrice > 0 ? (profit / productPrice) * 100 : 0;

    return { totalCost, profit, margin };
  };

  const { totalCost, profit, margin } = calculateProfit();

  return (
    <FeaturesLayout title="Калькулятор прибыли" subtitle="Рассчитайте прибыльность товара">
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Typography variant="h5" gutterBottom>
              Калькулятор прибыли
            </Typography>

            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
              <TextField
                label="Цена товара"
                type="number"
                value={formData.productPrice}
                onChange={handleInputChange('productPrice')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Себестоимость"
                type="number"
                value={formData.costPrice}
                onChange={handleInputChange('costPrice')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Стоимость доставки"
                type="number"
                value={formData.shippingCost}
                onChange={handleInputChange('shippingCost')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Комиссия"
                type="number"
                value={formData.commission}
                onChange={handleInputChange('commission')}
                fullWidth
                margin="normal"
              />
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Результаты расчета:
              </Typography>
              <Typography>
                Общие затраты: {totalCost.toFixed(2)} ₽
              </Typography>
              <Typography>
                Прибыль: {profit.toFixed(2)} ₽
              </Typography>
              <Typography>
                Маржа: {margin.toFixed(2)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    </FeaturesLayout>
  );
}

export default ProfitabilityCalculator;
