// path: src/components/pages/CalculatorResultData.tsx

import { calculateResults, CalculatorResults as TCalculatorResults } from "@utils/calculateResults"; // ⬅ Переименован тип
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Sparkles, Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

const easeOutExpo = [0.4, 0, 0.2, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutExpo,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

const CalculatorResultData: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<TCalculatorResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark", !isDark);
  };

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
  }, []);

  // маршрут получения результата:
  useEffect(() => {
    if (!id) return setError('ID не указан');
    fetch(`/api/v1/calculator/${id}/latest`)
      .then(r => r.json())
      .then(setResults)
      .catch(e => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("ID товара не указан");
      return;
    }

    fetch(`/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const calculated = calculateResults(data);
        setResults(calculated);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return <Navigate to="/error" state={{ message: error }} replace />;
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Загрузка результатов...
      </div>
    );
  }

  const goBack = () => navigate("/search");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(amount);

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

export default CalculatorResultData;
