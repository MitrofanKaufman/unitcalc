import axios from 'axios';

/**
 * Проверяет доступность бэкенд-сервера
 * @returns Promise с булевым значением, указывающим на доступность бэкенда
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/api/health', {
      // Уменьшаем таймаут для быстрого ответа
      timeout: 2000,
      // Не бросать исключение при кодах ошибок HTTP
      validateStatus: () => true
    });
    
    // Считаем бэкенд доступным, если получили ответ с кодом 200-399
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

/**
 * Хук для проверки доступности бэкенда
 * @returns Объект с состоянием загрузки и доступностью бэкенда
 */
export const useBackendHealth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: checkBackendHealth,
    retry: 1,
    refetchOnWindowFocus: false,
    // Не делать повторные запросы при монтировании
    refetchOnMount: false,
    // Время устаревания данных - 1 минута
    staleTime: 60 * 1000,
  });

  return {
    isBackendAvailable: !!data,
    isLoading,
    error: error as Error | null,
  };
};
