// path: src/components/layouts/Layout.tsx
// Neumorphic шаблон страницы. Содержит Header, боковое Menu и
// `<main>` для вывода текущего маршрута (`<Outlet />`).
// Управляет темой через ThemeManager (dark/light).

import React, { useRef, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "../../../../../app/client/components/layouts/Header";
import { useTelegram, syncTheme } from "../../../../../app/client/lib/telegram";
import { ThemeManager } from "../../../../../app/client/lib/theme-manager";

const Layout: React.FC = () => {
  const themeRef = useRef(new ThemeManager());
  const [dark, setDark] = useState(themeRef.current.isDark);

  const tg = useTelegram();
  const isTG = Boolean(tg);

  useEffect(() => {
    if (tg) syncTheme(themeRef.current);
  }, [tg]);

  // Временно убираем Header по требованию
  const showHeader = false;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Header
          dark={dark}
          onToggleTheme={() => setDark(themeRef.current.toggle())}
          showBurger={false}
        />
      )}

      <main className="flex-1 neu p-4 overflow-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export { Layout };
