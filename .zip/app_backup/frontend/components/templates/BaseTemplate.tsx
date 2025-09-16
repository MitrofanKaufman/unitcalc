// src/components/BaseTemplate.tsx
import { BottomNavigation } from "@template/BottomNavigation";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import React, { ReactNode, useState } from "react";
import "@/index.css";

interface BaseScreenLayoutProps {
  title: string;
  isDark: boolean;
  onBack?: () => void;
  onToggleTheme: () => void;
  children: ReactNode;
  actions?: ReactNode;
  customBackButton?: ReactNode;
}

const BaseTemplate: React.FC<BaseScreenLayoutProps> = ({
                                                         title,
                                                         isDark,
                                                         onBack,
                                                         onToggleTheme,
                                                         children,
                                                         actions,
                                                         customBackButton,
                                                       }) => {
  const [dark, setDark] = useState(isDark);

  const handleThemeToggle = () => {
    onToggleTheme();
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark", !dark);
  };

  const BackButton = () =>
    customBackButton ? (
      customBackButton
    ) : (
      <button
        onClick={onBack}
        aria-label="Назад"
        className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-primary"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    );

  const ThemeButton = () => (
    <button
      onClick={handleThemeToggle}
      aria-label="Переключить тему"
      className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-primary"
    >
      {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-hidden"
      style={{ minWidth: "465px" }}
    >
      {/* Верхний бар */}
      <div className="absolute inset-x-0 top-0 z-50 p-4 flex items-center justify-between max-w-md mx-auto w-full">
        <div className="flex items-center space-x-2">
          <BackButton />
          <ThemeButton />
        </div>
        <h1 className="text-lg font-semibold text-foreground text-center flex-1">
          {title}
        </h1>
        <div className="w-12 h-12 flex items-center justify-center">{actions}</div>
      </div>

      {/* Контент */}
      <div className="flex-grow overflow-auto max-w-md mx-auto px-4 pt-16 pb-20">
        {children}
      </div>

      {/* Нижнее меню */}
      <BottomNavigation />
    </div>
  );
};

export default BaseTemplate;
