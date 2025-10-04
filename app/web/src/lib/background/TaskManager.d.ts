/**
 * Типы заданий
 */
export declare enum TaskType {
    CALCULATION = "calculation",
    SYNC = "sync",
    EXPORT = "export",
    IMPORT = "import",
    ANALYSIS = "analysis",
    SCRAPING = "scraping",
    NOTIFICATION = "notification"
}
/**
 * Статус задания
 */
export declare enum TaskStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
/**
 * Приоритет задания
 */
export declare enum TaskPriority {
    LOW = 1,
    NORMAL = 2,
    HIGH = 3,
    URGENT = 4
}
/**
 * Интерфейс задания
 */
export interface Task {
    id: string;
    type: TaskType;
    priority: TaskPriority;
    status: TaskStatus;
    data: any;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    error?: string;
    retryCount: number;
    maxRetries: number;
    progress?: number;
}
/**
 * Результат выполнения задания
 */
export interface TaskResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    duration: number;
}
/**
 * Конфигурация обработчика заданий
 */
export interface TaskHandlerConfig {
    maxConcurrentTasks: number;
    retryDelay: number;
    maxRetryDelay: number;
    retryBackoffMultiplier: number;
    taskTimeout: number;
    cleanupInterval: number;
}
/**
 * Обработчик заданий
 */
export type TaskHandler = (task: Task, updateProgress: (progress: number) => void) => Promise<TaskResult>;
/**
 * Менеджер фоновых заданий
 */
export declare class TaskManager {
    private tasks;
    private handlers;
    private runningTasks;
    private config;
    private cleanupTimer?;
    constructor(config?: Partial<TaskHandlerConfig>);
    /**
     * Регистрация обработчика для типа заданий
     */
    registerHandler(type: TaskType, handler: TaskHandler): void;
    /**
     * Добавление задания в очередь
     */
    addTask(type: TaskType, data: any, priority?: TaskPriority): string;
    /**
     * Отмена задания
     */
    cancelTask(taskId: string): boolean;
    /**
     * Получение статуса задания
     */
    getTaskStatus(taskId: string): Task | null;
    /**
     * Получение всех заданий
     */
    getAllTasks(): Task[];
    /**
     * Получение заданий по типу
     */
    getTasksByType(type: TaskType): Task[];
    /**
     * Получение заданий по статусу
     */
    getTasksByStatus(status: TaskStatus): Task[];
    /**
     * Очистка завершенных заданий старше указанного времени
     */
    cleanupOldTasks(maxAgeHours?: number): void;
    /**
     * Генерация уникального ID для задания
     */
    private generateTaskId;
    /**
     * Обработка очереди заданий
     */
    private processQueue;
    /**
     * Выполнение задания
     */
    private executeTask;
    /**
     * Завершение задания успешно
     */
    private completeTask;
    /**
     * Провал задания с возможностью повтора
     */
    private retryOrFail;
    /**
     * Финальный провал задания
     */
    private failTask;
    /**
     * Настройка таймера очистки
     */
    private setupCleanupTimer;
    /**
     * Остановка менеджера
     */
    stop(): void;
    /**
     * Получение статистики
     */
    getStats(): {
        total: number;
        pending: number;
        running: number;
        completed: number;
        failed: number;
        cancelled: number;
        averageExecutionTime: number;
    };
}
export declare const taskManager: TaskManager;
