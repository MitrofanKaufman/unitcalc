/**
 * Модуль логирования для приложения
 * Обеспечивает единый интерфейс для логирования с разными уровнями важности
 */

// Определяем типы уровней логирования
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Класс логгера с поддержкой разных уровней логирования
 */
class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  // Цвета для разных уровней логирования в консоли
  private colors = {
    error: '\x1b[31m', // Красный
    warn: '\x1b[33m',  // Желтый
    info: '\x1b[36m',  // Голубой
    debug: '\x1b[35m', // Пурпурный
    reset: '\x1b[0m'   // Сброс цвета
  };

  private constructor(level: LogLevel = 'info') {
    this.logLevel = level;
  }

  /**
   * Получить экземпляр логгера (синглтон)
   */
  public static getInstance(level?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(level);
    }
    return Logger.instance;
  }

  /**
   * Установить уровень логирования
   */
  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Логирование ошибок
   */
  public error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  /**
   * Логирование предупреждений
   */
  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  /**
   * Информационное логирование
   */
  public info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  /**
   * Отладочное логирование
   */
  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  /**
   * Основной метод логирования
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    // Проверяем, нужно ли логировать сообщение с текущим уровнем
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const color = this.colors[level] || '';
      const reset = this.colors.reset;
      
      // Форматируем сообщение с меткой времени и уровнем логирования
      console.log(
        `${timestamp} ${color}[${level.toUpperCase()}]${reset} ${message}`,
        ...args
      );
    }
  }

  /**
   * Проверяет, нужно ли логировать сообщение с указанным уровнем
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    return levels[level] <= levels[this.logLevel];
  }
}

// Создаем экземпляр логгера по умолчанию
const logger = Logger.getInstance();

// Экспортируем синглтон логгера и класс для кастомизации
export { Logger, logger };
