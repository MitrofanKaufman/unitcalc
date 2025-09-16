// path: src/App.tsx
// Главный компонент приложения, который содержит маршруты и глобальные провайдеры.
// Отвечает за навигацию между страницами и подключение глобальных UI-компонентов.

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@template/layouts/Layout";

// UI компоненты глобального уровня
import { Toaster } from "@components/theme/ui/toaster";
import { Toaster as Sonner } from "@components/theme/ui/sonner";
import { TooltipProvider } from "@components/theme/ui/tooltip";

// Страницы приложения
import Index from "../../app/client/pages";
import CalculatorForm from "@/pages/CalculatorForm";
import CalculationHistory from "@/pages/CalculationHistory";
import Calculator from "../../app/client/pages/calculator";
import CalculatorResultData from "@/pages/CalculatorResultData";
import CalculatorAdd from "@/pages/CalculatorAdd";
import CalculatorLatest from "@/pages/CalculatorLatest";
import CalculatorVersion from "@/pages/CalculatorVersion";
import ProductDetails from "@/pages/ProductDetails";
import SellerDetails from "@/pages/SellerDetails";
import Feedback from "@/pages/Feedback";
import CardsDemo from "@/pages/CardsDemo";
import NotFound from "@/pages/NotFound";
import ProductAnalyse from "@/pages/ProductAnalyse"; // Updated path to match the actual file location

// Инициализация клиента React Query для кеширования запросов
const queryClient = new QueryClient();

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
            <Route index element={<Index />} />

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

            {/* Демонстрационные карточки */}
            <Route path="cards-demo" element={<CardsDemo />} />

            {/* Обработка неизвестных маршрутов - 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
