// path: src/tests/api/suggest.test.ts
import { test, expect } from '@playwright/test';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { createServer } from 'http';
import express from 'express';
import suggestRouter from '../../api/suggest';

// Создаем тестовый сервер Express
const app = express();
app.use(express.json());
app.use('/api', suggestRouter);

// Создаем мок-сервер для внешнего API Wildberries
const wbApiMock = setupServer(
  http.get('https://suggests.wb.ru/suggests/api/v7/hint', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    
    if (!query) {
      return new HttpResponse(JSON.stringify({ error: 'Query parameter is required' }), { status: 400 });
    }
    
    // Мок-ответ от API Wildberries
    return HttpResponse.json({
      query,
      suggestions: [
        { value: `${query} 1` },
        { value: `${query} 2` },
        { value: `${query} 3` }
      ]
    });
  })
);

// Запускаем тестовый сервер
let server;
let baseURL;

test.beforeAll(async () => {
  // Запускаем мок-сервер
  await wbApiMock.listen({ onUnhandledRequest: 'bypass' });
  
  // Запускаем тестовый сервер
  await new Promise((resolve) => {
    server = createServer(app);
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        baseURL = `http://localhost:${address.port}`;
      }
      resolve(null);
    });
  });
});

test.afterAll(async () => {
  // Останавливаем серверы после завершения тестов
  await new Promise((resolve) => server.close(resolve));
  await wbApiMock.close();
});

test.describe('GET /api/suggest', () => {
  test('должен возвращать подсказки для поискового запроса', async ({ request }) => {
    const query = 'телефон';
    const response = await request.get(`${baseURL}/api/suggest?q=${encodeURIComponent(query)}`);
    
    // Проверяем статус ответа
    expect(response.status()).toBe(200);
    
    // Проверяем структуру ответа
    const data = await response.json();
    expect(data).toHaveProperty('query', query);
    expect(Array.isArray(data.suggestions)).toBeTruthy();
    expect(data.suggestions.length).toBeGreaterThan(0);
    
    // Проверяем, что в ответе есть ожидаемые подсказки
    data.suggestions.forEach((suggestion) => {
      expect(suggestion).toHaveProperty('value');
      expect(suggestion.value).toContain(query);
    });
  });
  
  test('должен возвращать 400 при отсутствии параметра запроса', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/suggest`);
    
    // Проверяем статус ответа
    expect(response.status()).toBe(400);
    
    // Проверяем сообщение об ошибке
    const data = await response.json();
    expect(data).toHaveProperty('error', 'No query');
  });
  
  test('должен корректно обрабатывать ошибки внешнего API', async ({ request }) => {
    // Мокаем ошибку от внешнего API
    wbApiMock.use(
      http.get('https://suggests.wb.ru/suggests/api/v7/hint', () => {
        return new HttpResponse(
          JSON.stringify({ error: 'Internal Server Error' }),
          { status: 500 }
        );
      })
    );
    
    const response = await request.get(`${baseURL}/api/suggest?q=телефон`);
    
    // Проверяем, что наш эндпоинт корректно обрабатывает ошибки от внешнего API
    expect(response.status()).toBe(500);
    
    const data = await response.json();
    expect(data).toHaveProperty('error', 'WB Suggest failed');
  });
});
