import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Box, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackendHealth } from '@/services/api/health';

import CTASection from '@/pages/home/components/CTASection';
import FeaturesSection from '@/pages/home/components/FeaturesSection';
import Footer from '@/pages/home/components/Footer';
import HeroSection from '@/pages/home/components/HeroSection';

import { containerVariants } from '@/core/types/containerVariants';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showBackendWarning, setShowBackendWarning] = useState(false);
  
  // Проверяем доступность бэкенда
  const { isBackendAvailable, isLoading, error } = useBackendHealth();

  useEffect(() => {
    setIsMounted(true);
    // Check system preference
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Показываем предупреждение о недоступности бэкенда с задержкой
  useEffect(() => {
    if (!isLoading && error) {
      const timer = setTimeout(() => setShowBackendWarning(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, error]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleStartCalculation = () => {
    navigate("/calculator");
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {/* Баннер о недоступности бэкенда */}
      {showBackendWarning && !isBackendAvailable && (
        <motion.div
          key="backend-warning"
          className="fixed top-4 right-4 z-50 max-w-md p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-lg shadow-lg flex items-start gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Backend недоступен</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Некоторые функции могут быть ограничены. Пожалуйста, проверьте подключение к интернету и убедитесь, что сервер запущен.
            </p>
            <button
              onClick={() => setShowBackendWarning(false)}
              className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              Скрыть
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        key="main-content"
        className="min-h-screen bg-background"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        {/* Header with neumorphism */}
        <header className="w-full fixed top-0 left-0 right-0 z-40 neu-container">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-primary">
                WB Calc
              </span>
            </div>

            <motion.button
              onClick={toggleTheme}
              className="neu-button w-10 h-10 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ opacity: 0, rotate: isDark ? 90 : -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isDark ? -90 : 90 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground/70" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </nav>
        </header>

        {/* Neumorphism background */}
        <div className="fixed inset-0 -z-10 bg-background"></div>

        {/* Main content */}
        <main className="pt-20">
          <HeroSection onStartCalculation={handleStartCalculation} />
          <FeaturesSection />
          <CTASection onStartCalculation={handleStartCalculation} />
        </main>

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePage;
