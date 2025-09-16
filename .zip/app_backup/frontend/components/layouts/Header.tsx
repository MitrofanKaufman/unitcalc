// path: src/components/layouts/Header.tsx
// Neumorphic Header с названием приложения и переключателем темы.

import { Sun, Moon, Menu as MenuIcon, X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { NeuButton } from "../../../../../app/client/components/ui-neu/neu-button";

interface HeaderProps {
  dark: boolean;
  onToggleTheme: () => void;
  onToggleMenu?: () => void;
  menuOpen?: boolean;
  showBurger?: boolean;
}

const Header: React.FC<HeaderProps> = ({ dark, onToggleTheme, onToggleMenu, menuOpen, showBurger }) => (
  <header className="neu flex items-center justify-between px-4 py-3 mb-4 md:mb-6">
    <div className="flex items-center gap-2">
      {/* Burger only visible on mobile */}
      {showBurger && onToggleMenu && (
        <NeuButton
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleMenu}
          aria-label="Меню"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </NeuButton>
      )}
      <Link to="/" className="text-lg font-semibold select-none">
        Unit&nbsp;Calculator
      </Link>
    </div>
    <NeuButton variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Переключить тему">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </NeuButton>
  </header>
);

export { Header, type HeaderProps };
