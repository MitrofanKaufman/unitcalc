// path: src/lib/theme-manager.ts
// ThemeManager — класс для управления dark/light темой приложения.
// Предоставляет методы toggle() и геттер isDarkMode. Использует classList "dark" на <html>.

export class ThemeManager {
  private darkMode: boolean;
  constructor(initial?: boolean) {
    this.darkMode =
      initial ?? window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", this.darkMode);
  }
  toggle(): boolean {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle("dark", this.darkMode);
    return this.darkMode;
  }
  get isDark(): boolean {
    return this.darkMode;
  }
}
