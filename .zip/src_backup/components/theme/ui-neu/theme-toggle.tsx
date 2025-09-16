import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { NeuButton as Button } from '@ui/../ui-neu/neu-button';

/**
 * Компонент для переключения между светлой и тёмной темой
 * 
 * @param {boolean} isDark - Текущая тема (true для тёмной темы)
 * @param {() => void} onToggle - Обработчик переключения темы
 */
type ThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <Button
      variant="ghost"
      onClick={onToggle}
      className="flex items-center gap-2"
      aria-label="Переключить тему"
    >
      {isDark ? (
        <>
          <Moon className="h-5 w-5 text-yellow-400" />
          <span className="hidden sm:inline">Тёмная</span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 text-blue-500" />
          <span className="hidden sm:inline">Светлая</span>
        </>
      )}
    </Button>
  );
};
