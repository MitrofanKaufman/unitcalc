import React from "react";
import { Search, HelpCircle } from "lucide-react";

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="glass bottom-notch h-12 flex items-center justify-between px-6">

        {/* Левая кнопка Поиск */}
        <button
          aria-label="Поиск"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-primary"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Пустой слот по центру */}
        <div />

        {/* Правая кнопка - оборачиваем с hover зоной */}
        <div className="relative w-10 group">
          {/* Зона наведения у края */}
          <div className="absolute -right-4 top-0 bottom-0 w-8 pointer-events-auto" />

          {/* Сама кнопка */}
          <button
            aria-label="Справка"
            className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-primary"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Центральная кнопка Калькулятор */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
        <button
          onClick={() => alert("Калькулятор")}
          className="main-btn pointer-events-auto glass-button bg-accent flex items-center justify-center w-16 h-16 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 -mt-8 mx-4"
          aria-label="Калькулятор"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-accent-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
