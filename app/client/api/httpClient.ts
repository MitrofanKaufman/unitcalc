import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP-клиент с обработкой ошибок и перенаправлением на работающий порт
 */
class HttpClient {
  private instance: AxiosInstance;
  private readonly baseUrl: string;
  private readonly availablePorts: number[] = [3000, 3001, 3002, 3003];
  private currentPort: number;
  private retryCount = 0;
  private readonly maxRetries = 3;

  constructor(baseURL: string) {
    this.baseUrl = this.extractBaseUrl(baseURL);
    this.currentPort = this.extractPort(baseURL) || 3000;
    this.instance = this.createInstance();
    this.setupInterceptors();
  }

  /**
   * Создает экземпляр axios с базовыми настройками
   */
  private createInstance(): AxiosInstance {
    return axios.create({
      baseURL: `${this.baseUrl}:${this.currentPort}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Настраивает перехватчики запросов и ответов
   */
  private setupInterceptors(): void {
    // Перехватчик для обработки ошибок
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Если ошибка связана с соединением и есть порты для перебора
        if (
          (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') &&
          this.retryCount < this.maxRetries &&
          !originalRequest?._retry
        ) {
          originalRequest._retry = true;
          this.retryCount++;

          // Пробуем следующий порт
          const nextPort = this.getNextPort();
          if (nextPort) {
            console.log(`Попытка подключения к порту ${nextPort}...`);
            this.currentPort = nextPort;
            this.instance = this.createInstance();
            this.setupInterceptors();
            return this.instance(originalRequest);
          }
        }

        // Если попытки исчерпаны, перенаправляем на текущий порт
        if (this.retryCount >= this.maxRetries) {
          window.location.port = this.currentPort.toString();
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Получает следующий доступный порт для подключения
   */
  private getNextPort(): number | null {
    const currentIndex = this.availablePorts.indexOf(this.currentPort);
    const nextIndex = (currentIndex + 1) % this.availablePorts.length;
    
    // Если прошли все порты по кругу
    if (nextIndex === 0) {
      return null;
    }
    
    return this.availablePorts[nextIndex];
  }

  /**
   * Извлекает базовый URL без порта
   */
  private extractBaseUrl(url: string): string {
    return url.replace(/:[0-9]+$/, '');
  }

  /**
   * Извлекает порт из URL
   */
  private extractPort(url: string): number | null {
    const match = url.match(/:([0-9]+)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Обертка для методов axios
   */
  public async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config);
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

// Создаем экземпляр HTTP-клиента с базовым URL текущего хоста
const baseURL = window.location.origin;
export const httpClient = new HttpClient(baseURL);

export default httpClient;
