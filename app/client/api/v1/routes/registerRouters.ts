// path: src/api/v1/routes/registerRouters.ts
import express, { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для регистрации всех роутеров
export async function registerRouters(app: express.Application): Promise<void> {
  // Импортируем роутер напрямую
  let resultRouter;

  const productModule = await import('./product.js');
  const productRouter = productModule.default;
  app.use('/api/v1/product', productRouter);



  try {
    // Используем относительный путь с правильным расширением
    const module = await import('./json/results.js');
    resultRouter = module.default;
    console.log('[DEBUG] Successfully imported resultRouter');
  } catch (error) {
    console.error('[ERROR] Failed to import resultRouter:', error);
    throw error;
  }
  try {
    console.log('[DEBUG] Starting router registration...');
    
    // Регистрируем роутеры
    if (resultRouter && typeof resultRouter === 'function') {
      app.use('/results', resultRouter);
      console.log('[INFO] Successfully registered route: /results');
    } else {
      console.error('[ERROR] Failed to register resultRouter: router is not a function or undefined');
      console.error('[DEBUG] resultRouter type:', typeof resultRouter);
      console.error('[DEBUG] resultRouter value:', resultRouter);
    }
    
    console.log('[INFO] Router registration completed');
  } catch (error) {
    console.error('[CRITICAL] Error during router registration:', error);
    throw error; // Пробрасываем ошибку дальше, чтобы приложение не запускалось с нерабочими роутами
  }
  
  // Создаем базовый роутер для API
  const apiRouter = express.Router();
  
  // Регистрируем роутер для результатов
  apiRouter.use('/results', resultRouter);
  
  // Добавляем тестовый маршрут
  apiRouter.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
  
  // Подключаем все API маршруты с префиксом /api
  app.use('/api', apiRouter);
  
  // Возвращаем базовый роутер для использования в других частях приложения
  return apiRouter;
}
