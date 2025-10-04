// \apps\web\src\lib\storage\IndexedDBManager.ts
// Менеджер IndexedDB для оффлайн хранения данных

/**
 * Конфигурация хранилища
 */
interface StorageConfig {
  name: string
  version: number
  stores: {
    [storeName: string]: {
      keyPath?: string
      autoIncrement?: boolean
      indexes?: { [indexName: string]: string }
    }
  }
}

/**
 * Результат операции с хранилищем
 */
interface StorageResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Менеджер IndexedDB для оффлайн работы
 */
export class IndexedDBManager {
  private db: IDBDatabase | null = null
  private readonly config: StorageConfig = {
    name: 'wb-marketplace-calculator',
    version: 1,
    stores: {
      products: {
        keyPath: 'id',
        indexes: {
          category: 'category',
          status: 'status',
          lastModified: 'lastModified'
        }
      },
      calculations: {
        keyPath: 'id',
        indexes: {
          productId: 'productId',
          timestamp: 'timestamp'
        }
      },
      syncQueue: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          timestamp: 'timestamp',
          status: 'status'
        }
      },
      settings: {
        keyPath: 'key'
      },
      cache: {
        keyPath: 'url',
        indexes: {
          timestamp: 'timestamp',
          expiresAt: 'expiresAt'
        }
      }
    }
  }

  /**
   * Инициализация базы данных
   */
  async initialize(): Promise<StorageResult<void>> {
    try {
      if (!('indexedDB' in window)) {
        return { success: false, error: 'IndexedDB не поддерживается' }
      }

      const request = indexedDB.open(this.config.name, this.config.version)

      return new Promise((resolve) => {
        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка открытия базы данных' })
        }

        request.onsuccess = () => {
          this.db = request.result
          resolve({ success: true })
        }

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          // Создаем object stores
          Object.entries(this.config.stores).forEach(([storeName, storeConfig]) => {
            if (!db.objectStoreNames.contains(storeName)) {
              const store = db.createObjectStore(storeName, {
                keyPath: storeConfig.keyPath,
                autoIncrement: storeConfig.autoIncrement
              })

              // Создаем индексы
              if (storeConfig.indexes) {
                Object.entries(storeConfig.indexes).forEach(([indexName, keyPath]) => {
                  store.createIndex(indexName, keyPath)
                })
              }
            }
          })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка инициализации: ${error}` }
    }
  }

  /**
   * Сохранение данных
   */
  async save<T>(storeName: string, data: T): Promise<StorageResult<T>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      // Добавляем временные метки
      const dataWithTimestamp = {
        ...data,
        lastModified: new Date().toISOString(),
        createdAt: (data as any).createdAt || new Date().toISOString()
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put(dataWithTimestamp)

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка сохранения' })
        }

        request.onsuccess = () => {
          resolve({ success: true, data: dataWithTimestamp })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка сохранения: ${error}` }
    }
  }

  /**
   * Получение данных по ID
   */
  async get<T>(storeName: string, id: string): Promise<StorageResult<T>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(id)

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка получения' })
        }

        request.onsuccess = () => {
          if (request.result) {
            resolve({ success: true, data: request.result })
          } else {
            resolve({ success: false, error: 'Запись не найдена' })
          }
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка получения: ${error}` }
    }
  }

  /**
   * Получение всех данных из хранилища
   */
  async getAll<T>(storeName: string): Promise<StorageResult<T[]>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка получения всех записей' })
        }

        request.onsuccess = () => {
          resolve({ success: true, data: request.result })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка получения всех записей: ${error}` }
    }
  }

  /**
   * Удаление данных
   */
  async delete(storeName: string, id: string): Promise<StorageResult<void>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(id)

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка удаления' })
        }

        request.onsuccess = () => {
          resolve({ success: true })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка удаления: ${error}` }
    }
  }

  /**
   * Очистка хранилища
   */
  async clear(storeName: string): Promise<StorageResult<void>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка очистки' })
        }

        request.onsuccess = () => {
          resolve({ success: true })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка очистки: ${error}` }
    }
  }

  /**
   * Поиск по индексу
   */
  async findByIndex<T>(
    storeName: string,
    indexName: string,
    value: any
  ): Promise<StorageResult<T[]>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const index = store.index(indexName)
        const request = index.getAll(value)

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка поиска по индексу' })
        }

        request.onsuccess = () => {
          resolve({ success: true, data: request.result })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка поиска по индексу: ${error}` }
    }
  }

  /**
   * Добавление в очередь синхронизации
   */
  async addToSyncQueue(action: string, data: any): Promise<StorageResult<number>> {
    try {
      const syncItem = {
        action,
        data,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }

      const result = await this.save('syncQueue', syncItem)
      if (result.success) {
        // Извлекаем ID из сохраненного объекта
        const savedData = result.data as any
        const id = savedData?.id || savedData?.autoIncrementedId || Date.now()
        return { success: true, data: typeof id === 'number' ? id : parseInt(id.toString()) }
      }

      return { success: false, error: 'Не удалось сохранить элемент синхронизации' }
    } catch (error) {
      return { success: false, error: `Ошибка добавления в очередь синхронизации: ${error}` }
    }
  }

  /**
   * Получение очереди синхронизации
   */
  async getSyncQueue(): Promise<StorageResult<any[]>> {
    try {
      return await this.findByIndex('syncQueue', 'status', 'pending')
    } catch (error) {
      return { success: false, error: `Ошибка получения очереди синхронизации: ${error}` }
    }
  }

  /**
   * Обновление статуса синхронизации
   */
  async updateSyncStatus(id: number, status: string, error?: string): Promise<StorageResult<void>> {
    try {
      const existing = await this.get('syncQueue', id.toString())

      if (!existing.success || !existing.data) {
        return { success: false, error: 'Элемент синхронизации не найден' }
      }

      const updated = {
        ...existing.data,
        status,
        error,
        syncedAt: status === 'completed' ? new Date().toISOString() : undefined
      }

      await this.save('syncQueue', updated)
      return { success: true }
    } catch (error) {
      return { success: false, error: `Ошибка обновления статуса синхронизации: ${error}` }
    }
  }

  /**
   * Сохранение в кеш
   */
  async saveToCache(url: string, data: any, ttlMinutes = 60): Promise<StorageResult<void>> {
    try {
      const cacheItem = {
        url,
        data,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
      }

      await this.save('cache', cacheItem)
      return { success: true }
    } catch (error) {
      return { success: false, error: `Ошибка сохранения в кеш: ${error}` }
    }
  }

  /**
   * Получение из кеша
   */
  async getFromCache(url: string): Promise<StorageResult<any>> {
    try {
      const cached = await this.get('cache', url)

      if (!cached.success || !cached.data) {
        return { success: false, error: 'Кеш не найден' }
      }

      // Проверяем срок действия кеша
      const cacheData = cached.data as { expiresAt: string; data: any }
      const expiresAt = new Date(cacheData.expiresAt)
      if (expiresAt < new Date()) {
        await this.delete('cache', url)
        return { success: false, error: 'Кеш истек' }
      }

      return { success: true, data: cacheData.data }
    } catch (error) {
      return { success: false, error: `Ошибка получения из кеша: ${error}` }
    }
  }

  /**
   * Очистка просроченного кеша
   */
  async cleanExpiredCache(): Promise<StorageResult<void>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        const index = store.index('expiresAt')
        const request = index.openCursor(IDBKeyRange.upperBound(new Date().toISOString()))

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve({ success: true })
          }
        }

        request.onerror = () => {
          resolve({ success: false, error: 'Ошибка очистки кеша' })
        }
      })
    } catch (error) {
      return { success: false, error: `Ошибка очистки кеша: ${error}` }
    }
  }

  /**
   * Получение статистики хранилища
   */
  async getStorageStats(): Promise<StorageResult<{
    [storeName: string]: number
  }>> {
    try {
      if (!this.db) {
        await this.initialize()
      }

      if (!this.db) {
        return { success: false, error: 'База данных недоступна' }
      }

      const stats: { [storeName: string]: number } = {}

      for (const storeName of Object.keys(this.config.stores)) {
        const result = await this.getAll(storeName)
        if (result.success) {
          stats[storeName] = result.data?.length || 0
        }
      }

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: `Ошибка получения статистики: ${error}` }
    }
  }

  /**
   * Экспорт данных для резервного копирования
   */
  async exportData(): Promise<StorageResult<any>> {
    try {
      const exportData: any = {}

      for (const storeName of Object.keys(this.config.stores)) {
        const result = await this.getAll(storeName)
        if (result.success) {
          exportData[storeName] = result.data
        }
      }

      return { success: true, data: exportData }
    } catch (error) {
      return { success: false, error: `Ошибка экспорта данных: ${error}` }
    }
  }

  /**
   * Импорт данных из резервной копии
   */
  async importData(data: any): Promise<StorageResult<void>> {
    try {
      for (const [storeName, items] of Object.entries(data)) {
        if (Array.isArray(items)) {
          for (const item of items) {
            await this.save(storeName, item)
          }
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: `Ошибка импорта данных: ${error}` }
    }
  }

  /**
   * Закрытие соединения с базой данных
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// Экспорт singleton instance
export const indexedDBManager = new IndexedDBManager()
