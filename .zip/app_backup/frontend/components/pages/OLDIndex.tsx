// path: src/components/pages/Index.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeuButton as Button } from "../../../../../app/client/components/ui-neu/neu-button";
import { NeuCard, NeuCardContent } from "../../../../../app/client/components/ui-neu/neu-card";
import { cn } from "../../../../../app/client/lib/utils";
import {
  Calculator,
  ArrowRight,
  Package,
  TrendingUp,
  Moon,
  Sun,
  BarChart,
  Search,
  Zap,
  DollarSign,
  Box,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, className }: { 
  icon: React.ComponentType<{ className?: string }>, 
  title: string, 
  description: string,
  className?: string 
}) => (
  <motion.div 
    className={cn("p-6 rounded-2xl neu hover:neu-hover transition-all duration-300 cursor-default", className)}
    whileHover={{ y: -5 }}
  >
    <div className="w-12 h-12 rounded-xl neu-inset flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
);

const OLDIndex = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check system preference
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleStartCalculation = () => {
    navigate("/search");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {/* First Section - Light Background */}
        <section className="min-h-screen w-full relative overflow-hidden snap-start">
          {/* Page Title */}
          <header className="bg-gradient-to-r from-primary/10 to-background py-4 border-b border-border/40">
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-bold text-center text-foreground">Калькулятор прибыли Wildberries</h1>
            </div>
          </header>

          {/* Animated background elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Navigation */}
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Box className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                WB Calc
              </span>
            </div>
            <motion.button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl neu flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>
          </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full neu-sm mb-6"
          >
            <span className="text-sm font-medium text-primary">
              Wildberries Profit Calculator
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Рассчитайте прибыль
            <span className="block text-primary">с Wildberries</span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Точный расчет рентабельности с учетом всех затрат на логистику, комиссий и налогов
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="sm"
              className="flex items-center gap-2 group h-8"
              onClick={handleStartCalculation}
            >
              Начать расчет
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 group h-8"
            >
              <Search className="w-3 h-3" />
              Найти товар
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { value: "100%", label: "Точность" },
              { value: "5 мин", label: "Экономия" },
              { value: "24/7", label: "Доступ" },
              { value: "0₽", label: "Бесплатно" },
            ].map((stat, index) => (
              <div key={index} className="p-4 rounded-xl neu">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают нас</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Все необходимое для точного расчета прибыли с продаж на Wildberries
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={Calculator}
              title="Быстрый расчет"
              description="Мгновенный расчет всех затрат и прибыли в несколько кликов"
            />
            <FeatureCard
              icon={BarChart}
              title="Детальная аналитика"
              className="md:translate-y-6"
              description="Полная разбивка по всем статьям расходов и доходам"
            />
            <FeatureCard
              icon={DollarSign}
              title="Максимальная прибыль"
              description="Оптимизация цен для увеличения вашей выручки"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-background border border-border/50">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Начните зарабатывать больше уже сегодня</h2>
              <p className="text-muted-foreground mb-8">
                Присоединяйтесь к тысячам продавцов, которые уже увеличили свою прибыль с нашим калькулятором
              </p>
              <Button
                size="lg"
                className="group"
                onClick={handleStartCalculation}
              >
                Начать бесплатно
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Box className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">WB Calc</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WB Calculator. Все права защищены.
            </div>
          </div>
        </div>
      </footer>

      {/* Second Section - Dark Background */}
      <section className="min-h-screen w-full bg-muted/30 snap-start flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Преимущества нашего калькулятора</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calculator className="w-8 h-8 mb-4 text-primary" />,
                title: "Быстрый расчет",
                description: "Мгновенные расчеты рентабельности с учетом всех параметров"
              },
              {
                icon: <TrendingUp className="w-8 h-8 mb-4 text-primary" />,
                title: "Аналитика",
                description: "Подробная аналитика по каждому товару"
              },
              {
                icon: <DollarSign className="w-8 h-8 mb-4 text-primary" />,
                title: "Экономия",
                description: "Помогаем увеличить вашу прибыль"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-background neu"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
      );
      };

export default Index;