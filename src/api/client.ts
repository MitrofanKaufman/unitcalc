// \src\api\client.ts
// Axios клиент для API запросов - настройка базового URL и перехватчиков

import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Типы для Vite environment variables
interface ImportMetaEnv {
  VITE_API_URL?: string
}

interface ImportMeta {
  env: ImportMetaEnv
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Здесь можно добавить токен авторизации
        // config.headers.Authorization = `Bearer ${token}`
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          // Обработка неавторизованного доступа
          console.error('Unauthorized access')
        } else if (error.response?.status >= 500) {
          // Обработка серверных ошибок
          console.error('Server error')
        }
        return Promise.reject(error)
      }
    )
  }

  public get instance(): AxiosInstance {
    return this.client
  }

  // Convenience methods
  public get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config)
  }

  public delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config)
  }
}

// Экспорт singleton instance
export const apiClient = new ApiClient().instance
