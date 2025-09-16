import { httpClient } from './httpClient';

/**
 * Базовый URL для API
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * API сервис для работы с товарами
 */
export const productApi = {
  /**
   * Получить информацию о товаре по ID
   */
  getProduct: async (productId: string | number) => {
    const response = await httpClient.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
  },

  /**
   * Поиск товаров
   */
  searchProducts: async (query: string, params = {}) => {
    const response = await httpClient.get(`${API_BASE_URL}/products/search`, {
      params: { query, ...params },
    });
    return response.data;
  },
};

/**
 * API сервис для работы с продавцами
 */
export const sellerApi = {
  /**
   * Получить информацию о продавце
   */
  getSeller: async (sellerId: string | number) => {
    const response = await httpClient.get(`${API_BASE_URL}/sellers/${sellerId}`);
    return response.data;
  },
};

/**
 * API сервис для работы с расчетами
 */
export const calculatorApi = {
  /**
   * Рассчитать рентабельность товара
   */
  calculateProfitability: async (productData: any) => {
    const response = await httpClient.post(`${API_BASE_URL}/calculator/profitability`, productData);
    return response.data;
  },
};

// Экспортируем все API сервисы
export default {
  product: productApi,
  seller: sellerApi,
  calculator: calculatorApi,
  http: httpClient, // Экспортируем httpClient для прямого использования при необходимости
};
