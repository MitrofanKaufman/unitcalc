// path: src/main.tsx
import React from 'react';
import { createRoot } from "react-dom/client";
import App from "@/App";

// Global styles - Порядок важен!
import "./components/css/fonts.css"; // 1. Шрифты и глобальные переменные
import "./components/css/index.css"; // 2. Базовые стили Tailwind (должны загружаться после шрифтов)
import "./components/css/main.css"; // 3. Основные стили приложения
import "./components/css/calculator.css"; // 4. Стили для калькулятора
import "./components/css/scraper.css"; // 5. Стили для скрапера
import "./components/css/home.css"; // 6. Стили для главной страницы

// Инициализация приложения
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
