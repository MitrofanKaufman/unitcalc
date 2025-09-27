// \apps\web\src\lib\offline\OfflineManager.tsx
// Менеджер оффлайн режима и локального хранения

import React, { useEffect, useState, createContext, useContext } from 'react'
import { configLoader } from '@wb-calc/config'

interface OfflineContextType {
  isOnline: boolean
  isOfflineMode: boolean
  syncStatus: 'idle' | 'syncing' | 'error'
  lastSyncTime: Date | null
  pendingChanges: number
  queueSize: number
  forceSync: () => Promise<void>
  clearCache: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType | null>(null)

interface OfflineManagerProps {
  children: React.ReactNode
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = useState(0)
  const [queueSize, setQueueSize] = useState(0)

  // Инициализация
  useEffect(() => {
    initializeOfflineMode()
    setupEventListeners()
    loadSyncStatus()

    return () => {
      removeEventListeners()
    }
  }, [])

  // Синхронизация при изменении статуса сети
  useEffect(() => {
    if (isOnline && isOfflineMode) {
      handleNetworkReconnection()
    } else if (!isOnline) {
      handleNetworkDisconnection()
    }
  }, [isOnline])

  const initializeOfflineMode = async () => {
    try {
      const config = await configLoader.load()

      if (!config.offline.enabled) {
        return
      }

      // Проверяем доступность IndexedDB
      if (!('indexedDB' in window)) {
        console.warn('IndexedDB не поддерживается, оффлайн режим недоступен')
        return
      }

      // Инициализируем хранилища
      await initializeStorage()

      // Проверяем есть ли данные для синхронизации
      await checkPendingChanges()

      setIsOfflineMode(true)
    } catch (error) {
      console.error('Ошибка инициализации оффлайн режима:', error)
    }
  }

  const setupEventListeners = () => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }

  const removeEventListeners = () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }

  const handleOnline = () => {
    setIsOnline(true)
  }

  const handleOffline = () => {
    setIsOnline(false)
  }

  const handleNetworkReconnection = async () => {
    try {
      setSyncStatus('syncing')
      await performSync()
      setSyncStatus('idle')
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('Ошибка синхронизации:', error)
      setSyncStatus('error')
    }
  }

  const handleNetworkDisconnection = () => {
    setIsOnline(false)
    // Переключаемся в оффлайн режим
  }

  const initializeStorage = async () => {
    // Инициализация IndexedDB
    const db = await openDatabase()
    console.log('IndexedDB инициализирован')
  }

  const loadSyncStatus = async () => {
    try {
      const lastSync = localStorage.getItem('lastSyncTime')
      if (lastSync) {
        setLastSyncTime(new Date(lastSync))
      }

      const pending = localStorage.getItem('pendingChanges')
      if (pending) {
        setPendingChanges(parseInt(pending))
      }
    } catch (error) {
      console.error('Ошибка загрузки статуса синхронизации:', error)
    }
  }

  const checkPendingChanges = async () => {
    try {
      // Проверяем очередь изменений
      const queue = await getSyncQueue()
      setQueueSize(queue.length)
    } catch (error) {
      console.error('Ошибка проверки ожидающих изменений:', error)
    }
  }

  const performSync = async () => {
    const config = await configLoader.load()

    if (!config.offline.enabled) {
      return
    }

    try {
      // Получаем очередь изменений
      const queue = await getSyncQueue()

      for (const item of queue) {
        await syncItem(item)
      }

      // Очищаем очередь после успешной синхронизации
      await clearSyncQueue()
      setPendingChanges(0)
      setQueueSize(0)

      // Обновляем время последней синхронизации
      const now = new Date()
      setLastSyncTime(now)
      localStorage.setItem('lastSyncTime', now.toISOString())

    } catch (error) {
      console.error('Ошибка синхронизации:', error)
      throw error
    }
  }

  const forceSync = async () => {
    if (!isOnline) {
      throw new Error('Нет подключения к сети')
    }

    await handleNetworkReconnection()
  }

  const clearCache = async () => {
    try {
      // Очищаем IndexedDB
      await clearDatabase()

      // Очищаем localStorage (кроме критических данных)
      const keysToKeep = ['lastSyncTime', 'userPreferences', 'authToken']
      const keysToRemove = Object.keys(localStorage).filter(
        key => !keysToKeep.includes(key)
      )

      keysToRemove.forEach(key => localStorage.removeItem(key))

      console.log('Кеш очищен')
    } catch (error) {
      console.error('Ошибка очистки кеша:', error)
    }
  }

  // Вспомогательные функции для работы с IndexedDB
  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('wb-calc-offline', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Создаем object stores
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
          syncStore.createIndex('timestamp', 'timestamp')
        }

        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' })
          productStore.createIndex('category', 'category')
          productStore.createIndex('lastModified', 'lastModified')
        }

        if (!db.objectStoreNames.contains('calculations')) {
          db.createObjectStore('calculations', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'url' })
          cacheStore.createIndex('timestamp', 'timestamp')
        }
      }
    })
  }

  const getSyncQueue = async (): Promise<any[]> => {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncQueue'], 'readonly')
      const store = transaction.objectStore('syncQueue')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const syncItem = async (item: any) => {
    // Логика синхронизации конкретного элемента
    // Отправка на сервер, обработка ответа
    console.log('Синхронизация элемента:', item)
  }

  const clearSyncQueue = async () => {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const clearDatabase = async () => {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('wb-calc-offline')
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const contextValue: OfflineContextType = {
    isOnline,
    isOfflineMode,
    syncStatus,
    lastSyncTime,
    pendingChanges,
    queueSize,
    forceSync,
    clearCache
  }

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  )
}

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline должен использоваться внутри OfflineManager')
  }
  return context
}
