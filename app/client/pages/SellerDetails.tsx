// path: src/components/pages/SellerDetails.tsx
import { motion, easeOut, easeInOut } from "framer-motion"; // убрали linear
import {
  ArrowLeft,
  Users,
  Star,
  Shield,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  FileText,
  CheckCircle,
  Sparkles,
  Package,
  TrendingUp,
  Moon,
  Sun,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

import { SellerInfo } from "@/types/seller.ts";

const SellerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
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

  const goBack = () => {
    navigate(-1);
  };

  // Mock seller data
  const defaultSeller: SellerInfo = {
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
    contactInfo: {
      phone: "+7 (495) 123-45-67",
      email: "info@sportnutrition.ru",
      website: "www.sportnutrition.ru",
    },
    businessInfo: {
      inn: "7712345678",
      ogrn: "1127746123456",
      legalAddress: "г. Москва, ул. Примерная, д. 1, оф. 100",
    },
  };

  const seller = location.state?.seller || defaultSeller;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getYearsInBusiness = (registrationDate: string) => {
    const years = new Date().getFullYear() - new Date(registrationDate).getFullYear();
    return years;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark ? "bg-gradient-mobile-dark" : "bg-gradient-mobile-light"
      }`}
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
            ease: easeInOut,
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
            ease: easeInOut,
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
            ease: easeInOut,
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
          <h1 className="text-lg font-semibold text-foreground">О продавце</h1>
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
          className="w-full space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Seller Header */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="text-center relative p-6">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${
                    isDark ? "glass" : "neu"
                  } flex items-center justify-center relative overflow-hidden`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-gradient-accent opacity-90 rounded-2xl" />
                  {seller.type === "company" ? (
                    <Building className="w-8 h-8 text-white relative z-10" />
                  ) : (
                    <Users className="w-8 h-8 text-white relative z-10" />
                  )}
                </motion.div>

                <CardTitle className="text-xl font-bold text-foreground mb-3 leading-tight">
                  {seller.name}
                </CardTitle>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div
                    className={`flex items-center gap-1 ${
                      isDark ? "glass" : "neu"
                    } rounded-full px-3 py-2`}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-medium">
                      {seller.rating}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${isDark ? "glass" : "neu"} border-0 text-sm px-3 py-1`}
                  >
                    {seller.reviewCount?.toLocaleString("ru-RU")} отзывов
                  </Badge>
                  {seller.verificationStatus === "verified" && (
                    <Badge variant="default" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Проверен
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground mb-6">
                  {seller.type === "company" ? "Юридическое лицо" : "Физическое лицо"}
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Basic Info */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-lg border border-white/30" />
                    <Users className="w-4 h-4 text-white relative z-10" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Основная информация</h4>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID продавца:</span>
                    <span className="font-medium text-foreground">{seller.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Тип аккаунта:</span>
                    <span className="font-medium text-foreground">
                      {seller.type === "company" ? "Компания" : "Частное лицо"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">На платформе с:</span>
                    <span className="font-medium text-foreground">{formatDate(seller.registrationDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Опыт работы:</span>
                    <span className="font-medium text-foreground">{getYearsInBusiness(seller.registrationDate)} лет</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Всего товаров:</span>
                    <span className="font-medium text-foreground">{seller.totalProducts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-lg border border-white/30" />
                    <MapPin className="w-4 h-4 text-white relative z-10" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Местоположение</h4>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Страна:</span>
                    <span className="font-medium text-foreground">{seller.location.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Город:</span>
                    <span className="font-medium text-foreground">{seller.location.city}</span>
                  </div>
                  {seller.location.region && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Регион:</span>
                      <span className="font-medium text-foreground">{seller.location.region}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          {seller.contactInfo && (
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-lg border border-white/30" />
                      <Phone className="w-4 h-4 text-white relative z-10" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Контактная информация</h4>
                  </div>

                  <div className="space-y-4">
                    {seller.contactInfo.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">Телефон:</span>
                        </div>
                        <span className="font-medium text-foreground text-sm">{seller.contactInfo.phone}</span>
                      </div>
                    )}
                    {seller.contactInfo.email && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">Email:</span>
                        </div>
                        <span className="font-medium text-foreground text-sm">{seller.contactInfo.email}</span>
                      </div>
                    )}
                    {seller.contactInfo.website && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">Сайт:</span>
                        </div>
                        <span className="font-medium text-foreground text-sm">{seller.contactInfo.website}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Business Info */}
          {seller.businessInfo && seller.type === "company" && (
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-lg border border-white/30" />
                      <FileText className="w-4 h-4 text-white relative z-10" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Реквизиты компании</h4>
                  </div>

                  <div className="space-y-3 text-sm">
                    {seller.businessInfo.inn && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ИНН:</span>
                        <span className="font-medium text-foreground">{seller.businessInfo.inn}</span>
                      </div>
                    )}
                    {seller.businessInfo.ogrn && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ОГРН:</span>
                        <span className="font-medium text-foreground">{seller.businessInfo.ogrn}</span>
                      </div>
                    )}
                    {seller.businessInfo.legalAddress && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Юр. адрес:</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">
                          {seller.businessInfo.legalAddress}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Statistics */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-lg border border-white/30" />
                    <TrendingUp className="w-4 h-4 text-white relative z-10" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Статистика</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`text-center ${isDark ? "glass" : "neu"} rounded-lg p-4`}>
                    <div className="w-8 h-8 mx-auto mb-3 rounded-lg bg-gradient-primary flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-lg border border-white/30" />
                      <Package className="w-4 h-4 text-white relative z-10" />
                    </div>
                    <div className="text-xl font-bold text-primary mb-1">{seller.totalProducts}</div>
                    <div className="text-muted-foreground text-xs">Товаров</div>
                  </div>
                  <div className={`text-center ${isDark ? "glass" : "neu"} rounded-lg p-4`}>
                    <div className="w-8 h-8 mx-auto mb-3 rounded-lg bg-gradient-accent flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-lg border border-white/30" />
                      <CheckCircle className="w-4 h-4 text-white relative z-10" />
                    </div>
                    <div className="text-xl font-bold text-accent mb-1">
                      {seller.verificationStatus === "verified" ? "Проверен" : "Не проверен"}
                    </div>
                    <div className="text-muted-foreground text-xs">Статус</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerDetails;
