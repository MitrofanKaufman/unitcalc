// path: src/components/pages/CardsDemo.tsx
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Moon, Sun, Package, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard.tsx";
import SellerCard from "../components/SellerCard.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";

import { ProductInfo, SellerInfo } from "@/types/product.ts";

const CardsDemo = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const goBack = () => {
    navigate(-1);
  };

  // Mock data для демонстрации
  const mockProduct: ProductInfo = {
    title: "Протеиновые батончики без сахара Layers Ассорти, 4шт х 60г",
    price: 435,
    rating: 4.8,
    reviewCount: 5247,
    articleId: "123456789",
    category: "Спортивное питание",
    brand: "Layers",
    description:
      "Протеиновые батончики без добавления сахара с высоким содержанием белка",
  };

  const mockSeller: SellerInfo = {
    id: "seller_123",
    name: "ООО Спортивное питание",
    type: "company",
    rating: 4.9,
    reviewCount: 12847,
    registrationDate: "2019-03-15T00:00:00Z",
    totalProducts: 486,
    verificationStatus: "verified",
    location: {
      country: "Россия",
      city: "Москва",
      region: "Московская область",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${isDark ? "bg-gradient-mobile-dark" : "bg-gradient-mobile-light"}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-primary opacity-20 blur-3xl floating"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-accent opacity-15 blur-3xl floating"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-secondary opacity-10 blur-3xl floating"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 glass-button text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Header */}
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
            Компоненты карточек
          </h1>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary opacity-60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-start pt-8 p-4 max-w-md mx-auto">
        <motion.div
          className="w-full space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="text-center relative p-6">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${isDark ? "glass" : "neu"} flex items-center justify-center relative overflow-hidden`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-gradient-accent opacity-90 rounded-2xl" />
                  <Package className="w-8 h-8 text-white relative z-10" />
                </motion.div>

                <CardTitle className="text-xl font-bold text-foreground mb-3">
                  Компоненты карточек
                </CardTitle>

                <div className="text-sm text-muted-foreground mb-6">
                  Демонстрация стилизованных карточек товаров и продавцов
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Product Card Section */}
          <motion.div variants={itemVariants}>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-lg border border-white/30" />
                  <Package className="w-4 h-4 text-white relative z-10" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Карточка товара (компактная)
                </h4>
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-lg border border-white/30" />
                    <Sparkles className="w-4 h-4 text-white relative z-10" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">
                    Особенности компонентов
                  </h4>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Адаптивный дизайн с поддержкой темной/светлой темы</p>
                  <p>• Компактный и обычный варианты отображения</p>
                  <p>• Анимации при наведении и нажатии</p>
                  <p>• Градиентные иконки с border эффектами</p>
                  <p>• Единый стиль с glassmorphism эффектами</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardsDemo;
