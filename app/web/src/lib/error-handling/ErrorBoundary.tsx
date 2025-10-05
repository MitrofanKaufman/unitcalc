// \apps\web\src\lib\error-handling\ErrorBoundary.tsx
// Компонент Error Boundary с восстановлением

import React, { Component, ReactNode } from 'react'
import { configLoader } from '@wb-calc/config'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
  errorId: string
  retryCount: number
}

/**
 * Error Boundary с автоматическим восстановлением
 */
export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null
  private maxRetries = 3

  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    })

    // Вызов пользовательского обработчика ошибок
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Отправка ошибки в сервис логирования
    this.logError(error, errorInfo)

    // Автоматическая попытка восстановления
    this.scheduleAutoRecovery()
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // Сброс Error Boundary при изменении ключевых пропов
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey
      )

      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }
  }

  /**
   * Сброс Error Boundary
   */
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    })
  }

  /**
   * Попытка восстановления
   */
  retry = () => {
    const { retryCount } = this.state

    if (retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  /**
   * Логирование ошибки
   */
  private logError = async (error: Error, errorInfo: any) => {
    try {
      const config = await configLoader.load()

      if (!config.analytics.tracking.errors) {
        return
      }

      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        errorId: this.state.errorId,
        retryCount: this.state.retryCount,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        memory: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        } : undefined
      }

      // Отправка на сервер
      await fetch('/api/errors/frontend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      })
    } catch (logError) {
      console.error('Ошибка логирования ошибки:', logError)
    }
  }

  /**
   * Планирование автоматического восстановления
   */
  private scheduleAutoRecovery = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    // Автоматическая попытка восстановления через 5 секунд
    this.resetTimeoutId = window.setTimeout(() => {
      if (this.state.retryCount < this.maxRetries) {
        console.log('Попытка автоматического восстановления...')
        this.retry()
      }
    }, 5000)
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  render() {
    const { hasError, error, errorId, retryCount } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // Пользовательский fallback
      if (fallback) {
        return fallback
      }

      // Дефолтный fallback
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              Что-то пошло не так
            </h1>

            <p className="text-sm text-gray-600 mb-6">
              Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
            </p>

            {import.meta.env?.DEV && error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Детали ошибки (для разработчиков)
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  <div className="mb-2">
                    <strong>ID:</strong> {errorId}
                  </div>
                  <div className="mb-2">
                    <strong>Retry:</strong> {retryCount}/{this.maxRetries}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.retry}
                disabled={retryCount >= this.maxRetries}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {retryCount >= this.maxRetries
                  ? 'Превышено количество попыток'
                  : `Попробовать снова (${this.maxRetries - retryCount} попыток)`
                }
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Перезагрузить страницу
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Вернуться на главную
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Если проблема повторяется, пожалуйста, свяжитесь с поддержкой
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}
