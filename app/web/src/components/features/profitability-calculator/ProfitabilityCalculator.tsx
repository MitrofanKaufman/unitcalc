import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import FeaturesLayout from '../FeaturesLayout';

/**
 * A component that calculates the profitability of a product based on its cost price, shipping cost, and commission.
 * It renders a form with four input fields for the cost price, shipping cost, commission, and product price.
 * The component also renders a box with the results of the calculation, including the total cost, profit, and margin.
 */
export function ProfitabilityCalculator() {
  const [formData, setFormData] = useState({
    productPrice: '',
    costPrice: '',
    shippingCost: '',
    commission: ''
  });

  /**
   * Returns a function that updates the state of the given field in the formData state.
   * @param {string} field - The name of the field to update.
   * @returns {(event: React.ChangeEvent<HTMLInputElement>) => void} - A function that updates the state of the given field.
   */
  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  /**
   * Calculates the profitability of a product based on its cost price, shipping cost, and commission.
   *
   * @returns {Object} An object containing the total cost, profit, and margin of the product.
   * @property {number} totalCost - The total cost of the product, including the cost price, shipping cost, and commission.
   * @property {number} profit - The profit of the product, calculated as the product price minus the total cost.
   * @property {number} margin - The margin of the product, calculated as the profit divided by the product price, multiplied by 100.
   */
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
