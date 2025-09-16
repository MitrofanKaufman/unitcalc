// path: src/lib/telegram.ts
// Хелперы для взаимодействия с Telegram WebApp API.
// Предоставляет: getWebApp(), useTelegram() (React-хук), syncTheme().

import { useEffect, useState } from "react";
import { ThemeManager } from "@lib/theme-manager";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
  // tslint:disable-next-line:interface-name
  interface TelegramWebApp {
    initData?: string;
    BackButton: {
      show: () => void;
      hide: () => void;
      onClick: (cb: () => void) => void;
    };
    MainButton: {
      show: () => void;
      hide: () => void;
      setText: (text: string) => void;
      onClick: (cb: () => void) => void;
    };
    colorScheme: "light" | "dark";
    themeParams?: {
      bg_color?: string;
      text_color?: string;
    };
    isExpanded?: boolean;
    expand: () => void;
    ready: () => void;
    onEvent: (event: string, cb: () => void) => void;
  }
}

export function getWebApp(): TelegramWebApp | undefined {
  return window.Telegram?.WebApp;
}

export function syncTheme(theme: ThemeManager) {
  const tg = getWebApp();
  if (!tg) return;
  theme.toggle(); // ensure toggle aligns? we'll set to match tg
  if (tg.colorScheme === "dark" && !theme.isDark) theme.toggle();
  if (tg.colorScheme === "light" && theme.isDark) theme.toggle();
  tg.onEvent("themeChanged", () => {
    if (tg.colorScheme === "dark" && !theme.isDark) theme.toggle();
    if (tg.colorScheme === "light" && theme.isDark) theme.toggle();
  });
}

export function useTelegram() {
  const [tg] = useState(() => getWebApp());

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, [tg]);

  return tg;
}
