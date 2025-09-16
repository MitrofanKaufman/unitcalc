// path: src/App.tsx
// Главный компонент приложения, который содержит маршруты и глобальные провайдеры.
// Отвечает за навигацию между страницами и подключение глобальных UI-компонентов.

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layouts/Layout";

// UI компоненты глобального уровня
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Страницы приложения
import HomePage from "@/pages/home"; // Главная страница
import CalculatorForm from "@/components/pages/CalculatorForm";
import CalculationHistory from "@/components/pages/CalculationHistory";
import Calculator from "@/components/pages/Calculator";
import CalculatorResultData from "@/components/pages/CalculatorResultData";
import CalculatorAdd from "@/components/pages/CalculatorAdd";
import CalculatorLatest from "@/components/pages/CalculatorLatest";
import CalculatorVersion from "@/components/pages/CalculatorVersion";
import ProductDetails from "@/components/pages/ProductDetails";
import SellerDetails from "@/components/pages/SellerDetails";
import Feedback from "@/components/pages/Feedback";
import CardsDemo from "@/components/pages/CardsDemo";
import NotFound from "@/components/pages/NotFound";
import ProductAnalyse from "@/components/pages/ProductAnalyse"; // Updated path to match the actual file location
import SettingsPage from "@pages/pages/settings"; // Страница настроек приложения
import TestPage from "@/pages/TestPage"; // Тестовая страница для проверки стилей

// Инициализация клиента React Query с настройками для оффлайн-режима
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Уменьшаем количество попыток ретрая
      // Не делать запросы при фокусе окна, если бэкенд недоступен
      refetchOnWindowFocus: false,
      // Не делать повторные запросы при восстановлении соединения
      refetchOnReconnect: false,
      // Не делать повторные запросы при монтировании
      refetchOnMount: false,
      // Время кеширования 5 минут
      staleTime: 5 * 60 * 1000,
      // Время хранения кеша 10 минут
      cacheTime: 10 * 60 * 1000,
      // Обработчик ошибок
      onError: (error) => {
        console.error('React Query Error:', error);
      }
    },
    mutations: {
      // Настройки для мутаций
      onError: (error) => {
        console.error('Mutation Error:', error);
      }
    }
  }
});

const App: React.FC = () => (
  // Провайдер React Query для глобального управления данными из API
  <QueryClientProvider client={queryClient}>
    {/* Провайдер тултипов для всех элементов с подсказками */}
    <TooltipProvider>
      {/* Компоненты для уведомлений */}
      <Toaster />
      <Sonner />

      {/* Роутинг приложения */}
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Главная страница */}
            <Route index element={<HomePage />} />

            {/* Поиск товаров */}
            <Route path="search" element={<CalculatorForm />} />
            <Route path="product" element={<CalculatorForm />} />

            {/* История расчетов */}
            <Route path="history" element={<CalculationHistory />} />

            {/* Калькулятор логистики */}
            <Route path="calculator" element={<Calculator />} />
            <Route path="calculator/:id" element={<CalculatorResultData />} />
            <Route path="calculator/:id/add" element={<CalculatorAdd />} />
            <Route path="calculator/:id/latest" element={<CalculatorLatest />} />
            <Route path="calculator/:id/:version" element={<CalculatorVersion />} />

            {/* Детали товара */}
            <Route path="product-details" element={<ProductDetails />} />
            <Route path="product/:id" element={<ProductDetails />} />

            {/* Маршрут для запуска сбора данных товара по ID */}
            <Route path="get/:id" element={<ProductAnalyse />} />

            {/* Детали продавца */}
            <Route path="seller-details" element={<SellerDetails />} />

            {/* Обратная связь */}
            <Route path="feedback" element={<Feedback />} />

            {/* Страница настроек */}
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Тестовая страница */}
            <Route path="/test" element={<TestPage />} />

            {/* 404 - несуществующий маршрут */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
