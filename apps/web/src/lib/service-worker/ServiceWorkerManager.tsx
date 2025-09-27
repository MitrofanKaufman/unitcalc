// \apps\web\src\lib\service-worker\ServiceWorkerManager.tsx
// Менеджер Service Worker для PWA функциональности

import React, { useEffect, useState } from 'react'
import { configLoader } from '@wb-calc/config'

interface ServiceWorkerManagerProps {
  children: React.ReactNode
}

export const ServiceWorkerManager: React.FC<ServiceWorkerManagerProps> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const config = await configLoader.load()

      if (!config.ui.pwa.enabled) {
        console.log('Service Worker отключен в конфигурации')
        return
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      setRegistration(registration)

      // Проверка обновлений
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
            }
          })
        }
      })

      // Обработка сообщений от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          window.location.reload()
        }
      })

      console.log('Service Worker зарегистрирован успешно')
    } catch (error) {
      console.error('Ошибка регистрации Service Worker:', error)
    }
  }

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Не рендерим ничего, если Service Worker не поддерживается
  if (!isSupported) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Доступно обновление</p>
              <p className="text-sm opacity-90">Перезагрузите страницу для применения</p>
            </div>
            <button
              onClick={updateServiceWorker}
              className="ml-4 px-4 py-2 bg-white text-blue-600 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Обновить
            </button>
          </div>
        </div>
      )}
    </>
  )
}
