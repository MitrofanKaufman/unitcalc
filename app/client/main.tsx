// path: src/main.tsx
import React from 'react';
import { createRoot } from "react-dom/client";
import App from "@/App";

// Global styles
import "./components/css/globals.css";
import "./components/css/fonts.css"; // Шрифты
import "./components/css/App.css";
import "./components/css/index.css";
import "./components/css/calculator.css";

// Инициализация приложения
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
