// \apps\web\src\lib\error-handling\ErrorLogger.ts
// Система отправки логов ошибок на сервер

import configLoader from '@wb-calc/config'

/**
 * Типы логов ошибок
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

/**
 * Интерфейс для лога ошибки
 */
export interface ErrorLog {
  id: string
  level: LogLevel
  message: string
  stack?: string
  component?: string
  action?: string
  userId?: string
  sessionId?: string
  timestamp: string
  url: string
  userAgent: string
  viewport: {
    width: number
    height: number
  }
  memory?: {
    used: number
    total: number
    limit: number
  }
  network?: {
    online: boolean
    connection?: string
  }
  customData?: Record<string, any>
  breadcrumbs?: Breadcrumb[]
}

/**
 * Хлебные крошки для отслеживания действий пользователя
 */
export interface Breadcrumb {
  timestamp: string
  level: LogLevel
  message: string
  category: string
  data?: Record<string, any>
}

/**
 * Система логирования ошибок
 */
export class ErrorLogger {
  private static instance: ErrorLogger
  private breadcrumbs: Breadcrumb[] = []
  private sessionId: string
  private maxBreadcrumbs = 50
  private flushInterval?: NodeJS.Timeout
  private pendingLogs: ErrorLog[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
    this.setupFlushTimer()
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * Логирование ошибки
   */
  async log(
    level: LogLevel,
    message: string,
    error?: Error,
    customData?: Record<string, any>
  ): Promise<void> {
    const errorLog: ErrorLog = {
      id: this.generateLogId(),
      level,
      message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: this.getMemoryInfo(),
      network: this.getNetworkInfo(),
      customData,
      breadcrumbs: [...this.breadcrumbs]
    }

    // Добавляем в локальную очередь
    this.pendingLogs.push(errorLog)

    // Добавляем в breadcrumbs
    this.addBreadcrumb(level, message, 'error', { error: error?.message })

    // Немедленная отправка для критических ошибок
    if (level === LogLevel.FATAL || level === LogLevel.ERROR) {
      await this.flush()
    }
  }

  /**
   * Добавление хлебной крошки
   */
  addBreadcrumb(
    level: LogLevel,
    message: string,
    category: string,
    data?: Record<string, any>
  ): void {
    const breadcrumb: Breadcrumb = {
      timestamp: new Date().toISOString(),
      level,
      message,
      category,
      data
    }

    this.breadcrumbs.push(breadcrumb)

    // Ограничиваем количество breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs)
    }
  }

  /**
   * Отправка накопленных логов
   */
  async flush(): Promise<void> {
    if (this.pendingLogs.length === 0) {
      return
    }

    const logsToSend = [...this.pendingLogs]
    this.pendingLogs = []

    try {
      const config = await configLoader.load()

      if (!config.analytics.tracking.errors) {
        return
      }

      const response = await fetch('/api/logs/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          logs: logsToSend,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log(`Отправлено ${logsToSend.length} логов ошибок`)
    } catch (error) {
      console.error('Ошибка отправки логов:', error)

      // Возвращаем логи в очередь для повторной отправки
      this.pendingLogs.unshift(...logsToSend)
    }
  }

  /**
   * Настройка глобальных обработчиков ошибок
   */
  private setupGlobalErrorHandlers(): void {
    // Обработка необработанных ошибок
    window.addEventListener('error', (event) => {
      this.log(LogLevel.ERROR, 'Uncaught error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Обработка необработанных промисов
    window.addEventListener('unhandledrejection', (event) => {
      this.log(LogLevel.ERROR, 'Unhandled promise rejection', undefined, {
        reason: event.reason
      })
    })

    // Обработка ошибок ресурсов
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.log(LogLevel.WARN, 'Resource loading error', undefined, {
          target: event.target,
          type: 'resource'
        })
      }
    }, true)
  }

  /**
   * Настройка периодической отправки логов
   */
  private setupFlushTimer(): void {
    // Отправка каждые 30 секунд
    this.flushInterval = window.setInterval(() => {
      this.flush()
    }, 30000) as any;
  }

  /**
   * Получение информации о памяти
   */
  private getMemoryInfo(): ErrorLog['memory'] {
    if (!(performance as any).memory) {
      return undefined
    }

    return {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit
    }
  }

  /**
   * Получение информации о сети
   */
  private getNetworkInfo(): ErrorLog['network'] {
    return {
      online: navigator.onLine,
      connection: (navigator as any).connection?.effectiveType
    }
  }

  /**
   * Генерация ID сессии
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Генерация ID лога
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Остановка логирования
   */
  stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = undefined
    }

    // Финальная отправка всех логов
    this.flush()
  }

  /**
   * Получение статистики логирования
   */
  getStats(): {
    sessionId: string
    breadcrumbsCount: number
    pendingLogsCount: number
    sessionDuration: number
  } {
    return {
      sessionId: this.sessionId,
      breadcrumbsCount: this.breadcrumbs.length,
      pendingLogsCount: this.pendingLogs.length,
      sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1])
    }
  }
}

// Экспорт singleton instance
export const errorLogger = ErrorLogger.getInstance()

// Хуки для удобного использования
export const useErrorLogger = () => {
  return {
    log: errorLogger.log.bind(errorLogger),
    addBreadcrumb: errorLogger.addBreadcrumb.bind(errorLogger),
    getStats: errorLogger.getStats.bind(errorLogger)
  }
}

// Глобальные функции для быстрого логирования
export const logError = (message: string, error?: Error, data?: Record<string, any>) => {
  errorLogger.log(LogLevel.ERROR, message, error, data)
}

export const logWarn = (message: string, data?: Record<string, any>) => {
  errorLogger.log(LogLevel.WARN, message, undefined, data)
}

export const logInfo = (message: string, data?: Record<string, any>) => {
  errorLogger.log(LogLevel.INFO, message, undefined, data)
}

export const addBreadcrumb = (message: string, category = 'user', data?: Record<string, any>) => {
  errorLogger.addBreadcrumb(LogLevel.INFO, message, category, data)
}
