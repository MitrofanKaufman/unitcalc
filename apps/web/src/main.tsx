// \apps\web\src\main.tsx
// Точка входа PWA веб-приложения с оффлайн поддержкой

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App'
import { configLoader } from '@wb-calc/config'
import { ServiceWorkerManager } from './lib/service-worker/ServiceWorkerManager'
import { OfflineManager } from './lib/offline/OfflineManager'
import { ThemeProvider } from './lib/theme/ThemeProvider'
import { NotificationProvider } from './lib/notifications/NotificationProvider'
import { ErrorFallback } from './components/shared/ErrorFallback'
import './styles/index.css'

// Инициализация конфигурации
let config: any = null
try {
  config = await configLoader.load()
} catch (error) {
  console.error('Ошибка загрузки конфигурации:', error)
  // Продолжаем с дефолтными настройками
}

// Создание QueryClient с настройками для оффлайн
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Не повторять запросы при оффлайн
        if (error?.message?.includes('Network Error') && !navigator.onLine) {
          return false
        }
        return failureCount < 3
      },
      staleTime: config?.offline?.maxCacheAge || 86400000, // 24 часа
      gcTime: config?.offline?.maxCacheAge || 86400000,
      refetchOnWindowFocus: navigator.onLine,
      refetchOnReconnect: true
    },
    mutations: {
      retry: false
    }
  }
})

// Глобальный обработчик ошибок
const handleGlobalError = (error: Error, errorInfo: any) => {
  console.error('Глобальная ошибка:', error, errorInfo)

  // Отправка ошибки на сервер логирования
  if (config?.analytics?.tracking?.errors) {
    // Отправка ошибки в сервис логирования
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(console.error)
  }
}

// Обработчик ошибок промисов
window.addEventListener('unhandledrejection', (event) => {
  console.error('Необработанная ошибка промиса:', event.reason)

  if (config?.analytics?.tracking?.errors) {
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'unhandledrejection',
        reason: event.reason,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error)
  }
})

const root = document.getElementById('root')!

// Рендеринг приложения
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleGlobalError}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <NotificationProvider>
              <ServiceWorkerManager />
              <OfflineManager />
              <App />
            </NotificationProvider>
          </ThemeProvider>
        </BrowserRouter>
        {config?.ui?.debug && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
