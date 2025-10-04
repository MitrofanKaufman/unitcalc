import React, { ReactNode, useState } from 'react';
import { Button } from '@mui/material';
import { Menu, X } from 'lucide-react';
import styles from './FeaturesLayout.module.css';

interface FeaturesLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function FeaturesLayout({ children, title, subtitle }: FeaturesLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <Button
              className={styles.menuToggle}
              onClick={toggleMenu}
              aria-label="Меню"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            <div className={styles.brandInfo}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск товаров..."
                className={styles.searchInput}
              />
              <Button className={styles.searchButton}>
                Поиск
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        {/* Sidebar Menu */}
        <aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ''}`}>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <a href="/features/wb-search" className={styles.navLink}>
                  Поиск товаров
                </a>
              </li>
              <li className={styles.navItem}>
                <a href="/features/profitability-calculator" className={styles.navLink}>
                  Калькулятор прибыли
                </a>
              </li>
              <li className={styles.navItem}>
                <a href="/features/unit-converter" className={styles.navLink}>
                  Конвертер единиц
                </a>
              </li>
              <li className={styles.navItem}>
                <a href="/features/admin" className={styles.navLink}>
                  Админ панель
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 WB Calculator. Все права защищены.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy">Политика конфиденциальности</a>
            <a href="/terms">Условия использования</a>
            <a href="/support">Поддержка</a>
          </div>
        </div>
      </footer>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu} />
      )}
    </div>
  );
}

export default FeaturesLayout;
