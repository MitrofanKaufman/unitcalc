// path: src/components/layouts/Layout.tsx
// Neumorphic шаблон страницы. Содержит Header, боковое Menu и
// `<main>` для вывода текущего маршрута (`<Outlet />`).
// Управляет темой через ThemeManager (dark/light).

import React, { useRef, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

// import { useTelegram, syncTheme } from "@/lib/telegram";
import { ThemeManager } from "@/core/utils/themeManager";
import { Header } from "@/components/layouts/Header";

const Layout: React.FC = () => {
  const themeRef = useRef(new ThemeManager());
  const [dark, setDark] = useState(themeRef.current.isDark);

  const tg = null; // useTelegram();
  const _isTG = Boolean(tg); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    // if (tg) syncTheme(themeRef.current);

    // Применяем класс темы к корневому элементу
    document.documentElement.classList.toggle('dark', dark);
    
    // Сохраняем предпочтение темы в localStorage
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Временно убираем Header по требованию
  const showHeader = false;

  // Обработчик переключения темы
  const handleToggleTheme = () => {
    const newDark = themeRef.current.toggle();
    setDark(newDark);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${dark ? 'dark' : ''}`}>
      {showHeader && (
        <Header
          dark={dark}
          onToggleTheme={handleToggleTheme}
          showBurger={false}
        />
      )}

      <main className="flex-1 p-4 overflow-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export { Layout };
