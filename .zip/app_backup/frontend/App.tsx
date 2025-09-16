// path: src/App.tsx
// Главный компонент приложения, который содержит маршруты и глобальные провайдеры.
// Отвечает за навигацию между страницами и подключение глобальных UI-компонентов.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "../../../app/client/components/layouts/Layout";

// UI компоненты глобального уровня

// Страницы приложения
import CalculationHistory from "../../../app/client/components/pages/CalculationHistory";
import Calculator from "../../../app/client/components/pages/Calculator";
import CalculatorAdd from "../../../app/client/components/pages/CalculatorAdd";
import CalculatorForm from "../../../app/client/components/pages/CalculatorForm";
import CalculatorLatest from "../../../app/client/components/pages/CalculatorLatest";
import CalculatorResultData from "../../../app/client/components/pages/CalculatorResultData";
import CalculatorVersion from "../../../app/client/components/pages/CalculatorVersion";
import CardsDemo from "../../../app/client/components/pages/CardsDemo";
import Feedback from "../../../app/client/components/pages/Feedback";
import NotFound from "../../../app/client/components/pages/NotFound";
import ProductAnalyse from "../../../app/client/components/pages/ProductAnalyse"; // Updated path to match the actual file location
import ProductDetails from "../../../app/client/components/pages/ProductDetails";
import SellerDetails from "../../../app/client/components/pages/SellerDetails";
import { Toaster as Sonner } from "../../../app/client/components/ui/sonner";
import { Toaster } from "../../../app/client/components/ui/toaster";
import { TooltipProvider } from "../../../app/client/components/ui/tooltip";
import Index from "../../../app/client/pages";

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
