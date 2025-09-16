// path: src/routes/index.ts
/**
 * Основной файл маршрутов приложения
 * Объединяет все маршруты API в один роутер
 */

import { Router } from 'express';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Получаем текущую директорию в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Создаем экземпляр роутера
const router = Router();

// Функция для рекурсивного поиска файлов маршрутов
const setupRoutes = async (basePath: string, routerInstance: Router, currentPath = '') => {
  const fullPath = join(basePath, currentPath);
  
  // Получаем список файлов и директорий
  const items = readdirSync(fullPath);
  
  for (const item of items) {
    const itemPath = join(fullPath, item);
    const stat = statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Рекурсивно обрабатываем поддиректории
      await setupRoutes(basePath, routerInstance, join(currentPath, item));
    } else if (
      item.endsWith('.routes.ts') || 
      item.endsWith('.routes.js')
    ) {
      try {
        // Импортируем маршруты из файла
        const modulePath = `./${join(currentPath, item.replace(/\.[jt]s$/, '').replace(/\\/g, '/'))}`;
        const routeModule = await import(modulePath);
        const routePath = `/${currentPath.replace(/\\/g, '/')}`
          .replace(/\/index$/, '') // Удаляем /index из пути
          .replace(/\[([^\]]+)\]/g, ':$1'); // Заменяем [param] на :param
        
        // Используем маршруты с префиксом /api/v1
        const apiPath = `/api/v1${routePath}`;
        
        // Если экспортируется функция, вызываем её с роутером
        if (typeof routeModule.default === 'function') {
          const subRouter = Router();
          routeModule.default(subRouter);
          routerInstance.use(apiPath, subRouter);
          console.log(`[Routes] Mounted ${apiPath} (function)`);
        } 
        // Если экспортируется роутер, используем его напрямую
        else if (routeModule.default && routeModule.default.stack) {
          routerInstance.use(apiPath, routeModule.default);
          console.log(`[Routes] Mounted ${apiPath} (router)`);
        } 
        // Если экспортируется объект с методами (контроллер), создаем для него роутер
        else if (typeof routeModule.default === 'object') {
          const subRouter = Router();
          const controller = routeModule.default;
          
          // Автоматически связываем методы контроллера с маршрутами
          for (const [method, handler] of Object.entries(controller)) {
            if (typeof handler === 'function') {
              const [httpMethod, path] = method.split('_');
              const routeHandler = handler.bind(controller);
              
              switch (httpMethod.toLowerCase()) {
                case 'get':
                  subRouter.get(path || '/', routeHandler);
                  break;
                case 'post':
                  subRouter.post(path || '/', routeHandler);
                  break;
                case 'put':
                  subRouter.put(path || '/:id', routeHandler);
                  break;
                case 'delete':
                  subRouter.delete(path || '/:id', routeHandler);
                  break;
                case 'patch':
                  subRouter.patch(path || '/:id', routeHandler);
                  break;
                default:
                  // Если метод не распознан, предполагаем, что это путь
                  subRouter.all(`/${method}`, routeHandler);
              }
              
              console.log(`[Routes] ${httpMethod.toUpperCase()} ${apiPath}${path ? `/${path}` : ''}`);
            }
          }
          
          routerInstance.use(apiPath, subRouter);
        }
      } catch (error) {
        console.error(`[Routes] Error loading route ${item}:`, error);
      }
    }
  }
};

// Функция для инициализации маршрутов
const initRoutes = async () => {
  try {
    // Загружаем все маршруты из текущей директории
    await setupRoutes(__dirname, router);
    
    // Добавляем обработчик 404 для API
    router.use('/api', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Запрашиваемый ресурс не найден',
        },
      });
    });
    
    console.log('[Routes] All routes initialized successfully');
    return router;
  } catch (error) {
    console.error('[Routes] Error initializing routes:', error);
    throw error;
  }
};

// Экспортируем инициализированный роутер
const routes = initRoutes();
export default routes;
