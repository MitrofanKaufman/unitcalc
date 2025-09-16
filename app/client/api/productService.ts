// app/client/api/productService.ts
// Клиент для взаимодействия с API продуктов

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Получить информацию о товаре по ID
 * @param productId - ID товара
 */
export const getProduct = async (productId: string) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Проанализировать товар по ID
 * @param productId - ID товара
 */
export const analyzeProduct = async (productId: string) => {
  // В реальном приложении здесь может быть отдельный эндпоинт для анализа
  // Пока что будем использовать тот же, что и для получения товара
  try {
    const response = await apiClient.get(`/products/${productId}/analyze`); // Предполагаем, что такой эндпоинт существует
    return response.data;
  } catch (error) {
    console.error('Error analyzing product:', error);
    throw error;
  }
};
