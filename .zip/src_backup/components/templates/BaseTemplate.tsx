/**
 * Базовый шаблон экрана с общими элементами интерфейса
 * 
 * @component
 * @example
 * return (
 *   <BaseTemplate 
 *     title="Главная"
 *     isDark={isDark}
 *     onToggleTheme={toggleTheme}
 *     onBack={handleBack}
 *   >
 *     <div>Контент страницы</div>
 *   </BaseTemplate>
 * )
 */

import React, { ReactNode, useCallback, memo } from "react";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { BottomNavigation } from "@template/BottomNavigation";
import { cn } from "../../../../app/client/lib/utils";
import "@/index.css";

/** Пропсы компонента BaseTemplate */
export interface BaseScreenLayoutProps {
  /** Заголовок страницы */
  title: string;
  /** Текущая тема (темная/светлая) */
  isDark: boolean;
  /** Обработчик нажатия кнопки "Назад" */
  onBack?: () => void;
  /** Обработчик переключения темы */
  onToggleTheme: () => void;
  /** Дочерние элементы */
  children: ReactNode;
  /** Дополнительные действия в правом верхнем углу */
  actions?: ReactNode;
  /** Кастомная кнопка "Назад" */
  customBackButton?: ReactNode;
}

// Константы для стилей
const COMMON_BUTTON_STYLES = "p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-primary";
const LAYOUT_STYLES = "min-h-screen flex flex-col justify-between relative overflow-hidden";
const HEADER_STYLES = "absolute inset-x-0 top-0 z-50 p-4 flex items-center justify-between max-w-md mx-auto w-full";
const CONTENT_STYLES = "flex-grow overflow-auto max-w-md mx-auto px-4 pt-16 pb-20";

/**
 * Кнопка переключения темы
 */
const ThemeButton = memo(({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    aria-label={isDark ? "Переключить на светлую тему" : "Переключить на темную тему"}
    className={COMMON_BUTTON_STYLES}
  >
    {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
  </button>
));

ThemeButton.displayName = 'ThemeButton';

/**
 * Базовая кнопка "Назад"
 */
const BaseBackButton = memo(({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    aria-label="Назад"
    className={COMMON_BUTTON_STYLES}
  >
    <ArrowLeft className="w-6 h-6" />
  </button>
));

BaseBackButton.displayName = 'BaseBackButton';

/**
 * Основной компонент шаблона
 */
const BaseTemplate: React.FC<BaseScreenLayoutProps> = ({
  title,
  isDark,
  onBack,
  onToggleTheme,
  children,
  actions,
  customBackButton,
}) => {
  const handleThemeToggle = useCallback(() => {
    onToggleTheme();
    document.documentElement.classList.toggle("dark", !isDark);
  }, [isDark, onToggleTheme]);

  // Рендер кнопки "Назад" с возможностью кастомизации
  const renderBackButton = useCallback(() => {
    if (customBackButton) return customBackButton;
    if (!onBack) return <div className="w-6 h-6" />; // Заглушка для выравнивания
    return <BaseBackButton onClick={onBack} />;
  }, [customBackButton, onBack]);

  return (
    <div className={LAYOUT_STYLES} style={{ minWidth: "465px" }}>
      {/* Верхний бар с навигацией */}
      <header className={HEADER_STYLES}>
        <div className="flex items-center space-x-2">
          {renderBackButton()}
          <ThemeButton isDark={isDark} onToggle={handleThemeToggle} />
        </div>
        
        <h1 className="text-lg font-semibold text-foreground text-center flex-1 line-clamp-1">
          {title}
        </h1>
        
        <div className="w-12 h-12 flex items-center justify-center">
          {actions}
        </div>
      </header>

      {/* Основной контент */}
      <main className={CONTENT_STYLES}>
        {children}
      </main>

      {/* Нижняя навигация */}
      <BottomNavigation />
    </div>
  );
};

// Оптимизация с помощью memo
const MemoizedBaseTemplate = memo(BaseTemplate);

// Добавляем displayName для удобства отладки
MemoizedBaseTemplate.displayName = 'BaseTemplate';

export default BaseTemplate;
