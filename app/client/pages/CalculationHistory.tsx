// path: src/pages/CalculationHistory.tsx
// External dependencies
import { motion } from "framer-motion";
import {
  ArrowLeft,
  History,
  Calendar,
  Package,
  Trash2,
  Eye,
  Moon,
  Sun,
  Download,
  Sparkles,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
import { CalculationHistory } from "@/types/calculation";

const CalculationHistoryPage = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Check system preference
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
    navigate("/");
  };

  // Mock data для истории расчетов
  const mockHistory: CalculationHistory[] = [
    {
      id: "1",
      date: "2024-01-15T10:30:00Z",
      productInfo: {
        title: "Протеиновые батончики без сахара Layers Ассорти, 4шт х 60г",
        price: 435,
        rating: 4.8,
        reviewCount: 5247,
        articleId: "123456789",
        category: "Спортивное питание",
        brand: "Layers",
      },
      formData: {
        box: "small",
        marketplace: "wildberries",
        weight: 0.28,
        dimensions: { length: 15, width: 10, height: 3 },
        quantity: 1,
        price: 435,
      },
      results: {
        logistics: {
          deliveryCost: 47.5,
          storageCost: 0.0,
          returnCost: 137.5,
          totalExpenses: 185.0,
        },
        commissions: {
          marketplaceCommission: 67.42,
          marketplaceCommissionPercent: 15.5,
          supplierCommission: 67.42,
          supplierCommissionPercent: 15.5,
        },
        productInfo: {
          title: "Протеиновые батончики без сахара Layers Ассорти, 4шт х 60г",
          price: 435,
          rating: 4.8,
          reviewCount: 5247,
        },
      },
      notes: "Анализ конкурента в категории спортивного питания",
    },
    {
      id: "2",
      date: "2024-01-14T15:45:00Z",
      productInfo: {
        title: "Кроссовки беговые Nike Air Max 270",
        price: 8999,
        rating: 4.6,
        reviewCount: 2134,
        articleId: "987654321",
        category: "Обувь",
        brand: "Nike",
      },
      formData: {
        box: "medium",
        marketplace: "wildberries",
        weight: 0.8,
        dimensions: { length: 35, width: 25, height: 15 },
        quantity: 1,
        price: 8999,
      },
      results: {
        logistics: {
          deliveryCost: 85.0,
          storageCost: 12.5,
          returnCost: 245.0,
          totalExpenses: 342.5,
        },
        commissions: {
          marketplaceCommission: 1394.84,
          marketplaceCommissionPercent: 15.5,
          supplierCommission: 1394.84,
          supplierCommissionPercent: 15.5,
        },
        productInfo: {
          title: "Кроссовки беговые Nike Air Max 270",
          price: 8999,
          rating: 4.6,
          reviewCount: 2134,
        },
      },
    },
    {
      id: "3",
      date: "2024-01-13T09:20:00Z",
      productInfo: {
        title: "Смартфон Samsung Galaxy A54 128GB",
        price: 25990,
        rating: 4.7,
        reviewCount: 892,
        articleId: "456789123",
        category: "Электроника",
        brand: "Samsung",
      },
      formData: {
        box: "small",
        marketplace: "ozon",
        weight: 0.4,
        dimensions: { length: 18, width: 12, height: 2 },
        quantity: 1,
        price: 25990,
      },
      results: {
        logistics: {
          deliveryCost: 65.0,
          storageCost: 18.5,
          returnCost: 389.85,
          totalExpenses: 473.35,
        },
        commissions: {
          marketplaceCommission: 4028.45,
          marketplaceCommissionPercent: 15.5,
          supplierCommission: 4028.45,
          supplierCommissionPercent: 15.5,
        },
        productInfo: {
          title: "Смартфон Samsung Galaxy A54 128GB",
          price: 25990,
          rating: 4.7,
          reviewCount: 892,
        },
      },
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getMarketplaceLabel = (value: string) => {
    const marketplaces: Record<string, string> = {
      wildberries: "Wildberries",
      ozon: "Ozon",
      yandex: "Яндекс.Маркет",
      avito: "Avito",
    };
    return marketplaces[value] || value;
  };

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.productInfo.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" || item.formData.marketplace === filterType;
    return matchesSearch && matchesFilter;
  });

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
            История расчетов
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
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="text-center relative p-6">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${isDark ? "glass" : "neu"} flex items-center justify-center relative overflow-hidden`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-gradient-accent opacity-90 rounded-2xl" />
                  <History className="w-8 h-8 text-white relative z-10" />
                </motion.div>

                <CardTitle className="text-xl font-bold text-foreground mb-3">
                  История расчетов
                </CardTitle>

                <div className="text-sm text-muted-foreground mb-6">
                  Все ваши предыдущие расчеты
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-6">
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Поиск по названию товара..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white placeholder:text-white/60" : "neu border-gray-200"}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger
                        className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white" : "neu border-gray-200"}`}
                      >
                        <SelectValue placeholder="Маркетплейс" />
                      </SelectTrigger>
                      <SelectContent
                        className={`${isDark ? "glass-intense border-white/20" : "bg-white border-gray-200"}`}
                      >
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="wildberries">Wildberries</SelectItem>
                        <SelectItem value="ozon">Ozon</SelectItem>
                        <SelectItem value="yandex">Яндекс.Маркет</SelectItem>
                        <SelectItem value="avito">Avito</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className={`h-12 text-sm ${isDark ? "glass border-primary/50 text-primary hover:bg-primary/10" : "neu border-primary/30"}`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Экспорт
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {searchQuery || filterType !== "all"
                        ? "Ничего не найдено"
                        : "История расчетов пуста"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              filteredHistory.map((item, _index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="glass-card border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-sm leading-tight mb-2">
                            {item.productInfo.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className={`${isDark ? "glass" : "neu"} border-0 text-xs`}
                            >
                              {getMarketplaceLabel(item.formData.marketplace)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.productInfo.articleId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(item.productInfo.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Затраты:{" "}
                            {formatCurrency(
                              item.results.logistics.totalExpenses +
                                item.results.commissions.marketplaceCommission +
                                item.results.commissions.supplierCommission,
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs glass-button"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Открыть
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalculationHistoryPage;
