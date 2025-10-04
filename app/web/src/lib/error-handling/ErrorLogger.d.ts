/**
 * Типы логов ошибок
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
/**
 * Интерфейс для лога ошибки
 */
export interface ErrorLog {
    id: string;
    level: LogLevel;
    message: string;
    stack?: string;
    component?: string;
    action?: string;
    userId?: string;
    sessionId?: string;
    timestamp: string;
    url: string;
    userAgent: string;
    viewport: {
        width: number;
        height: number;
    };
    memory?: {
        used: number;
        total: number;
        limit: number;
    };
    network?: {
        online: boolean;
        connection?: string;
    };
    customData?: Record<string, any>;
    breadcrumbs?: Breadcrumb[];
}
/**
 * Хлебные крошки для отслеживания действий пользователя
 */
export interface Breadcrumb {
    timestamp: string;
    level: LogLevel;
    message: string;
    category: string;
    data?: Record<string, any>;
}
/**
 * Система логирования ошибок
 */
export declare class ErrorLogger {
    private static instance;
    private breadcrumbs;
    private sessionId;
    private maxBreadcrumbs;
    private flushInterval?;
    private pendingLogs;
    constructor();
    static getInstance(): ErrorLogger;
    /**
     * Логирование ошибки
     */
    log(level: LogLevel, message: string, error?: Error, customData?: Record<string, any>): Promise<void>;
    /**
     * Добавление хлебной крошки
     */
    addBreadcrumb(level: LogLevel, message: string, category: string, data?: Record<string, any>): void;
    /**
     * Отправка накопленных логов
     */
    flush(): Promise<void>;
    /**
     * Настройка глобальных обработчиков ошибок
     */
    private setupGlobalErrorHandlers;
    /**
     * Настройка периодической отправки логов
     */
    private setupFlushTimer;
    /**
     * Получение информации о памяти
     */
    private getMemoryInfo;
    /**
     * Получение информации о сети
     */
    private getNetworkInfo;
    /**
     * Генерация ID сессии
     */
    private generateSessionId;
    /**
     * Генерация ID лога
     */
    private generateLogId;
    /**
     * Остановка логирования
     */
    stop(): void;
    /**
     * Получение статистики логирования
     */
    getStats(): {
        sessionId: string;
        breadcrumbsCount: number;
        pendingLogsCount: number;
        sessionDuration: number;
    };
}
export declare const errorLogger: ErrorLogger;
export declare const useErrorLogger: () => {
    log: (level: LogLevel, message: string, error?: Error, customData?: Record<string, any>) => Promise<void>;
    addBreadcrumb: (level: LogLevel, message: string, category: string, data?: Record<string, any>) => void;
    getStats: () => {
        sessionId: string;
        breadcrumbsCount: number;
        pendingLogsCount: number;
        sessionDuration: number;
    };
};
export declare const logError: (message: string, error?: Error, data?: Record<string, any>) => void;
export declare const logWarn: (message: string, data?: Record<string, any>) => void;
export declare const logInfo: (message: string, data?: Record<string, any>) => void;
export declare const addBreadcrumb: (message: string, category?: string, data?: Record<string, any>) => void;
