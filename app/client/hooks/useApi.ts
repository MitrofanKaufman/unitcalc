import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { config } from '../config';

// Базовый URL для API запросов
const API_BASE_URL = `${config.api.prefix}/${config.api.version}`;

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Интерфейс для ответа API
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

// Интерфейс для ошибки API
interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Обработчик ошибок API
const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    // Ошибка от сервера с ответом
    const { status, data, statusText } = error.response;
    const errorMessage = (data as any)?.message || statusText || 'Произошла ошибка при выполнении запроса';
    
    throw {
      message: errorMessage,
      status,
      data,
    } as ApiError;
  } else if (error.request) {
    // Запрос был отправлен, но ответ не получен
    throw {
      message: 'Не удалось получить ответ от сервера. Пожалуйста, проверьте подключение к интернету.',
    } as ApiError;
  } else {
    // Ошибка при настройке запроса
    throw {
      message: error.message || 'Произошла ошибка при настройке запроса',
    } as ApiError;
  }
};

// Обертка для запросов с обработкой ошибок
const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request<T>(config);
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

// Хук для GET запросов
export const useApiGet = <T>(
  key: string | unknown[], 
  url: string, 
  options?: UseQueryOptions<T, ApiError>,
  params?: Record<string, any>
) => {
  return useQuery<T, ApiError>(
    Array.isArray(key) ? key : [key],
    async () => {
      const response = await apiRequest<T>({ 
        method: 'GET',
        url,
        params 
      });
      return response.data;
    },
    {
      retry: (failureCount, error) => {
        // Не повторяем запрос при ошибках 4xx, кроме 401 и 403
        if (error.status && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Повторяем не более 3 раз для остальных ошибок
        return failureCount < 3;
      },
      ...options,
    }
  );
};

// Хук для POST запросов
export const useApiPost = <T, D = any>(
  url: string,
  options?: UseMutationOptions<T, ApiError, D>
) => {
  return useMutation<T, ApiError, D>(
    async (data) => {
      const response = await apiRequest<T>({
        method: 'POST',
        url,
        data,
      });
      return response.data;
    },
    {
      ...options,
    }
  );
};

// Хук для PUT запросов
export const useApiPut = <T, D = any>(
  url: string,
  options?: UseMutationOptions<T, ApiError, D>
) => {
  return useMutation<T, ApiError, D>(
    async (data) => {
      const response = await apiRequest<T>({
        method: 'PUT',
        url,
        data,
      });
      return response.data;
    },
    {
      ...options,
    }
  );
};

// Хук для DELETE запросов
export const useApiDelete = <T>(
  url: string,
  options?: UseMutationOptions<T, ApiError, void>
) => {
  return useMutation<T, ApiError, void>(
    async () => {
      const response = await apiRequest<T>({
        method: 'DELETE',
        url,
      });
      return response.data;
    },
    {
      ...options,
    }
  );
};

// Интерцептор для добавления токена аутентификации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок аутентификации
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Обработка истечения срока действия токена
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
