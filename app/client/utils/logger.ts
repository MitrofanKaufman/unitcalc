/**
 * Логгер для приложения
 * Предоставляет единый интерфейс для логирования с разными уровнями важности
 * Файл: app/client/utils/logger.ts
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'fatal';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private colors = {
    fatal: '\x1b[31m', // Красный
    error: '\x1b[31m', // Красный
    warn: '\x1b[33m',  // Желтый
    info: '\x1b[36m',  // Голубой
    debug: '\x1b[35m', // Пурпурный
    reset: '\x1b[0m'   // Сброс цвета
  };

  private constructor(level: LogLevel = 'info') {
    this.logLevel = level;
  }

  public static getInstance(level?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(level);
    }
    return Logger.instance;
  }

  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public fatal(message: string, ...args: unknown[]): void {
    this.log('fatal', message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const color = this.colors[level] || '';
      const reset = this.colors.reset;
      
      const logMethod = level === 'fatal' || level === 'error' 
        ? console.error 
        : level === 'warn' 
          ? console.warn 
          : level === 'info' 
            ? console.info 
            : console.log;
            
      logMethod(
        `${timestamp} ${color}[${level.toUpperCase()}]${reset} ${message}`,
        ...args
      );
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4
    };

    return levels[level] <= levels[this.logLevel];
  }
}

const logger = Logger.getInstance(process.env.NODE_ENV === 'development' ? 'debug' : 'info');

export { Logger, logger };
export default logger;
