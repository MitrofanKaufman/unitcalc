import axios, { AxiosResponse } from 'axios';
import {
  Product,
  Marketplace,
  ProductCategory,
  ApiResponse,
  CreateProductDto,
  UpdateProductDto,
  CalculateProfitabilityDto,
  SearchProductsDto,
  PaginatedResponse,
  ProfitabilityCalculation,
  CalculationResult
} from '@/types';

/**
 * API клиент для взаимодействия с сервером
 */
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        params,
        timeout: 10000,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'API request failed');
      }

      return response.data.data as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Методы для работы с товарами
  async searchProducts(dto: SearchProductsDto): Promise<Product[]> {
    return this.request<Product[]>('GET', '/api/products/search', undefined, dto);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>('GET', `/api/products/${id}`);
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    return this.request<Product>('POST', '/api/products', dto);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.request<Product>('PUT', `/api/products/${id}`, dto);
  }

  async calculateProfitability(dto: CalculateProfitabilityDto): Promise<ProfitabilityCalculation> {
    return this.request<ProfitabilityCalculation>('POST', `/api/products/${dto.productId}/calculate`, dto);
  }

  // Методы для получения справочников
  async getMarketplaces(): Promise<Marketplace[]> {
    return this.request<Marketplace[]>('GET', '/api/products/marketplaces');
  }

  async getCategories(): Promise<ProductCategory[]> {
    return this.request<ProductCategory[]>('GET', '/api/products/categories');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request('GET', '/health');
  }
}

// Экспорт singleton инстанса
export const apiClient = new ApiClient();
export default apiClient;
