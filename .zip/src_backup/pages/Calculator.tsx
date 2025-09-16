// path: src/components/pages/Calculator.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator as CalculatorIcon,
  TrendingUp,
  Package,
  Moon,
  Sun,
  Zap,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@components/theme/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/theme/ui/card.tsx";
import { Input } from "@components/theme/ui/input.tsx";
import { Label } from "@components/theme/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/theme/ui/select.tsx";
import { useNavigate } from "react-router-dom";
import {
  CalculatorFormData,
  MarketplaceOption,
  BoxOption,
} from "@core/types/product.ts";
import { calculateResults } from "@utils/calculateResults";

const Calculator = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CalculatorFormData>({
    box: "",
    marketplace: "",
    weight: 0.28,
    dimensions: { length: 0, width: 0, height: 0 },
    quantity: 1,
    price: 435,
    cost: 200,
    commissionPercent: 15,
    deliveryFromProducer: 10,
    packaging: 5,
    deliveryToMP: 15,
    fulfillment: 7,
    deliveryToWB: 20,
    defectPercent: 2,
    storageCost: 3,
    buyoutPercent: 90,
    taxRate: 6,
    taxMode: "income",
    additionalExpenses: 12,
    investments: 20000,
  });

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const marketplaces: MarketplaceOption[] = [
    { value: "wildberries", label: "Wildberries" },
    { value: "ozon", label: "Ozon" },
    { value: "yandex", label: "Яндекс.Маркет" },
    { value: "avito", label: "Avito" },
  ];

  const boxTypes: BoxOption[] = [
    { value: "small", label: "Малая коробка (до 1 кг)" },
    { value: "medium", label: "Средняя коробка (до 5 кг)" },
    { value: "large", label: "Большая коробка (до 25 кг)" },
    { value: "envelope", label: "Конверт (до 500 г)" },
  ];

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDimensionChange = (
    dimension: "length" | "width" | "height",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: parseFloat(value) || 0,
      },
    }));
  };

  const handleCalculate = () => {
    setIsLoading(true);
    const results = calculateResults(formData);
    navigate("/calculator/:id", {
      state: {
        formData,
        results,
      },
    });
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen relative ${isDark ? "bg-black" : "bg-white"}`}>
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      <div className="relative z-10 flex flex-col pt-20 p-4 max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Калькулятор WB</CardTitle>
            <CardDescription>Расчет логистики и комиссий</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Label>Маркетплейс</Label>
            <Select
              value={formData.marketplace}
              onValueChange={(value) => handleInputChange("marketplace", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите маркетплейс" />
              </SelectTrigger>
              <SelectContent>
                {marketplaces.map((mp) => (
                  <SelectItem key={mp.value} value={mp.value}>
                    {mp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Тип коробки</Label>
            <Select
              value={formData.box}
              onValueChange={(value) => handleInputChange("box", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип коробки" />
              </SelectTrigger>
              <SelectContent>
                {boxTypes.map((box) => (
                  <SelectItem key={box.value} value={box.value}>
                    {box.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Прочие числовые поля */}
            {Object.entries({
              price: "Цена товара (₽)",
              cost: "Себестоимость (₽)",
              investments: "Инвестиции в товар (₽)",
              weight: "Вес (кг)",
              commissionPercent: "Комиссия WB (%)",
              buyoutPercent: "Процент выкупа (%)",
              deliveryFromProducer: "Доставка от производителя (₽)",
              deliveryToMP: "Доставка до маркетплейса (₽)",
              deliveryToWB: "Логистика до WB (₽)",
              packaging: "Упаковка (₽)",
              fulfillment: "Фулфилмент (₽)",
              defectPercent: "Брак (%)",
              storageCost: "Хранение (₽/мес)",
              taxRate: "Налог (%)",
              additionalExpenses: "Прочие расходы (₽)",
              quantity: "Количество (шт)",
            }).map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  value={(formData as any)[key]}
                  onChange={(e) => handleInputChange(key as keyof CalculatorFormData, parseFloat(e.target.value) || 0)}
                />
              </div>
            ))}

            <Label>Налоговый режим</Label>
            <Select
              value={formData.taxMode}
              onValueChange={(value) => handleInputChange("taxMode", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите режим" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">УСН доходы</SelectItem>
                <SelectItem value="income_minus_expenses">УСН доходы-расходы</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleCalculate}
              disabled={isLoading || !formData.marketplace || !formData.box}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Анализ данных...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" /> Рассчитать
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
