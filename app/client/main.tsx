// path: src/main.tsx
import React from 'react';
import { createRoot } from "react-dom/client";
import App from "@/App";

// Global styles
import "./styles/globals.css";
import "./styles/fonts.css"; // Шрифты

// Инициализация приложения
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
