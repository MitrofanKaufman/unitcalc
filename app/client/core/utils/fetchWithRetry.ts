/**
 * Утилита для выполнения повторных запросов с экспоненциальной задержкой
 * @param url - URL для запроса
 * @param options - Опции запроса
 * @param maxRetries - Максимальное количество попыток
 * @param retryDelay - Начальная задержка перед повторной попыткой (в мс)
 * @returns Promise с результатом запроса
 */

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Если ответ успешный, возвращаем его
      if (response.ok) {
        return response;
      }
      
      // Если это последняя попытка, выбрасываем ошибку
      if (attempt === maxRetries) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
      
      // Логируем неудачную попытку
      console.warn(`Attempt ${attempt} failed with status ${response.status}, retrying...`);
      
    } catch (error) {
      lastError = error as Error;
      
      // Если это последняя попытка, выбрасываем ошибку
      if (attempt === maxRetries) {
        break;
      }
      
      // Логируем ошибку
      console.warn(`Attempt ${attempt} failed with error: ${(error as Error).message}`);
    }
    
    // Вычисляем задержку с экспоненциальной задержкой
    const delay = retryDelay * Math.pow(2, attempt - 1);
    console.log(`Waiting ${delay}ms before next attempt...`);
    
    // Ждем перед следующей попыткой
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Если дошли сюда, значит все попытки исчерпаны
  throw new Error(`All ${maxRetries} attempts failed. Last error: ${lastError?.message}`);
}

// Экспортируем по умолчанию для обратной совместимости
export default fetchWithRetry;
