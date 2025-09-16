/**
 * Управление темой приложения с поддержкой SSR
 */

export class ThemeManager {
  private darkMode = false;

  constructor(initial = false) {
    this.darkMode = initial;
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', this.darkMode);
    }
  }

  toggle(): boolean {
    this.darkMode = !this.darkMode;
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', this.darkMode);
    }
    return this.darkMode;
  }

  get isDarkMode(): boolean {
    return this.darkMode;
  }
}

