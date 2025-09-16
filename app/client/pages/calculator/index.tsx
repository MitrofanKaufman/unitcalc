// path: src/pages/calculator/index.tsx
/**
 * Main Calculator Page Component
 * 
 * This is the main calculator page that provides an interface for users to
 * calculate the profitability of products on the Wildberries marketplace.
 * It includes form inputs for product details, costs, and other parameters
 * needed to calculate profitability metrics.
 */

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { containerVariants } from '@/core/types/containerVariants';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    purchasePrice: '',
    sellingPrice: '',
    wbCommission: 15, // Default commission percentage
    logisticsCost: '',
    otherCosts: '',
    businessModel: 'FBO' // FBO or FBS
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement calculation logic
    console.log('Form submitted:', formData);
    navigate('/calculator/result');
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Калькулятор рентабельности Wildberries</CardTitle>
          <CardDescription>
            Введите данные о товаре для расчета рентабельности
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName">Название товара</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Введите название товара"
                  required
                />
              </div>

              {/* Business Model */}
              <div className="space-y-2">
                <Label htmlFor="businessModel">Бизнес-модель</Label>
                <Select
                  value={formData.businessModel}
                  onValueChange={(value) => handleSelectChange(value, 'businessModel')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FBO">FBO (Fulfillment by Wildberries)</SelectItem>
                    <SelectItem value="FBS">FBS (Fulfillment by Seller)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Purchase Price */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Закупочная цена (₽)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Selling Price */}
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Цена продажи на WB (₽)</Label>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* WB Commission */}
              <div className="space-y-2">
                <Label htmlFor="wbCommission">Комиссия WB (%)</Label>
                <Input
                  id="wbCommission"
                  name="wbCommission"
                  type="number"
                  value={formData.wbCommission}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              {/* Logistics Cost */}
              <div className="space-y-2">
                <Label htmlFor="logisticsCost">Логистика (₽)</Label>
                <Input
                  id="logisticsCost"
                  name="logisticsCost"
                  type="number"
                  value={formData.logisticsCost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Other Costs */}
              <div className="space-y-2">
                <Label htmlFor="otherCosts">Прочие расходы (₽)</Label>
                <Input
                  id="otherCosts"
                  name="otherCosts"
                  type="number"
                  value={formData.otherCosts}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Назад
            </Button>
            <Button type="submit">
              Рассчитать
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default Calculator;
