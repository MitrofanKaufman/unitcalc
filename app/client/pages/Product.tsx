import { Button } from "@ui/button";
import { Card, CardContent } from "@ui/card";
import { CalculatorResults as TCalculatorResults } from "@utils/calculateResults";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sparkles, Sun } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Product = () => {
  const { id } = useParams<{ id: string }>();  // получаем :id из URL:contentReference[oaicite:11]{index=11}
  interface ProductData {
    id: string;
    name: string;
    price: number;
    description?: string;
    [key: string]: unknown;
  }

  const [product, setProduct] = useState<ProductData | null>(null);
  // Remove unused navigate since it's not being used
  // const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark ? "bg-gradient-mobile-dark" : "bg-gradient-mobile-light"
      }`}
    >
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 glass-button text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="glass-button text-foreground hover:bg-white/10 rounded-full h-12 w-12"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Результаты расчета
          </h1>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary opacity-60" />
          </motion.div>
        </div>
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col justify-start pt-8 p-4 max-w-md mx-auto">
        <motion.div
          className="w-full space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className={`${isDark ? "glass-intense" : "neu-inset"} border-0 shadow-xl`}>
              <CardContent className="p-6 space-y-4">
                {Object.entries({
                  Q: "Кол-во ед.",
                  revenue: "Выручка",
                  commission: "Комиссия WB",
                  deliveryWBAdjusted: "Логистика (с учетом выкупа)",
                  tax: "Налоги",
                  investPerUnit: "Инвестиции на 1 ед.",
                  profitPerUnit: "Прибыль на 1 ед.",
                  profitTotal: "Общая прибыль",
                  ROI: "Доходность (ROI, %)",
                  marginPercent: "Маржинальность (%)",
                  priceMin: "Минимальная цена",
                  maxDiscount: "Макс. скидка (%)",
                  breakEvenPoint: "Точка безубыточности (шт)",
                }).map(([key, label]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground text-sm">{label}</span>
                    <span className="font-medium">
                      {typeof results[key as keyof TCalculatorResults] === "number"
                        ? key.includes("ROI") || key.includes("Percent") || key.includes("Discount")
                          ? `${(results[key as keyof TCalculatorResults] as number).toFixed(1)}%`
                          : formatCurrency(results[key as keyof TCalculatorResults] as number)
                        : "—"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
export default Product;
