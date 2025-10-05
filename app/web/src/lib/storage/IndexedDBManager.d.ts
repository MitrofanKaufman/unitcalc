/**
 * Результат операции с хранилищем
 */
interface StorageResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Менеджер IndexedDB для оффлайн работы
 */
export declare class IndexedDBManager {
    private db;
    private readonly config;
    /**
     * Инициализация базы данных
     */
    initialize(): Promise<StorageResult<void>>;
    /**
     * Сохранение данных
     */
    save<T>(storeName: string, data: T): Promise<StorageResult<T>>;
    /**
     * Получение данных по ID
     */
    get<T>(storeName: string, id: string): Promise<StorageResult<T>>;
    /**
     * Получение всех данных из хранилища
     */
    getAll<T>(storeName: string): Promise<StorageResult<T[]>>;
    /**
     * Удаление данных
     */
    delete(storeName: string, id: string): Promise<StorageResult<void>>;
    /**
     * Очистка хранилища
     */
    clear(storeName: string): Promise<StorageResult<void>>;
    /**
     * Поиск по индексу
     */
    findByIndex<T>(storeName: string, indexName: string, value: any): Promise<StorageResult<T[]>>;
    /**
     * Добавление в очередь синхронизации
     */
    addToSyncQueue(action: string, data: any): Promise<StorageResult<number>>;
    /**
     * Получение очереди синхронизации
     */
    getSyncQueue(): Promise<StorageResult<any[]>>;
    /**
     * Обновление статуса синхронизации
     */
    updateSyncStatus(id: number, status: string, error?: string): Promise<StorageResult<void>>;
    /**
     * Сохранение в кеш
     */
    saveToCache(url: string, data: any, ttlMinutes?: number): Promise<StorageResult<void>>;
    /**
     * Получение из кеша
     */
    getFromCache(url: string): Promise<StorageResult<any>>;
    /**
     * Очистка просроченного кеша
     */
    cleanExpiredCache(): Promise<StorageResult<void>>;
    /**
     * Получение статистики хранилища
     */
    getStorageStats(): Promise<StorageResult<{
        [storeName: string]: number;
    }>>;
    /**
     * Экспорт данных для резервного копирования
     */
    exportData(): Promise<StorageResult<any>>;
    /**
     * Импорт данных из резервной копии
     */
    importData(data: any): Promise<StorageResult<void>>;
    /**
     * Закрытие соединения с базой данных
     */
    close(): void;
}
export declare const indexedDBManager: IndexedDBManager;
export {};
