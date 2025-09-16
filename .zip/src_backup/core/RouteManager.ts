// path: src/core/RouteManager.ts
/**
 * Менеджер маршрутов приложения
 * Настраивает все API-эндпоинты и подключает соответствующие роутеры
 */
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';

// Интерфейс для описания маршрута
interface Route {
  path: string;
  router: any; // TODO: Заменить на конкретный тип роутера
  description: string;
  prefix?: string;
}

export class RouteManager {
  private readonly app: Express;
  private readonly basePath: string;
  private readonly routes: Route[] = [];

  /**
   * Создает экземпляр менеджера маршрутов
   * @param app Экземпляр Express-приложения
   * @param basePath Базовый путь для статических файлов
   */
  constructor(app: Express, basePath: string) {
    this.app = app;
    this.basePath = basePath;
    
    // Инициализируем маршруты асинхронно
    this.initializeRoutes()
      .then(() => {
        this.setupRoutes();
        this.setupErrorHandlers();
      })
      .catch(error => {
        console.error('Ошибка при инициализации приложения:', error);
        process.exit(1);
      });
  }

  /**
   * Инициализирует все маршруты приложения
   * @private
   */
  /**
   * Инициализирует все маршруты приложения
   * @private
   */
  private async initializeRoutes(): Promise<void> {
    // Основной эндпоинт для проверки доступности API
    const pingRouter = express.Router();
    pingRouter.get('/api/ping', (req: Request, res: Response) => {
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
      });
    });

    this.routes.push({
      path: '/',
      router: pingRouter,
      description: 'Проверка доступности API'
    });

    try {
      // Динамический импорт роутеров
      const { default: productRouter } = await import('../api/v1/product/product.routes');
      
      // Создаем роутер для API v1
      const apiV1Router = express.Router();
      
      // Регистрируем маршруты товаров
      apiV1Router.use('/products', productRouter);
      apiV1Router.use('/product', productRouter); // Для обратной совместимости
      
      // Регистрируем API v1 роутер
      this.routes.push({
        path: '/api/v1',
        router: apiV1Router,
        description: 'API v1 маршруты'
      });
      
      // Здесь можно добавить дополнительные маршруты по мере необходимости
      // Пример:
      // try {
      //   const { default: calculatorRouter } = await import('../api/v1/calculator/calculator.routes');
      //   apiV1Router.use('/calculator', calculatorRouter);
      // } catch (error) {
      //   console.warn('Модуль calculator.routes не найден, пропускаем...');
      // }
    } catch (error) {
      console.error('Ошибка при инициализации маршрутов:', error);
      throw new Error('Не удалось загрузить маршруты приложения');
    }
  }

  /**
   * Настраивает все зарегистрированные маршруты
   * @private
   */
  private setupRoutes(): void {
    // Логирование всех входящих запросов
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });

    // Настройка статических файлов
    this.app.use(express.static(path.join(this.basePath, 'public')));

    // Настройка API-маршрутов
    this.routes.forEach(route => {
      if (typeof route.router === 'function') {
        this.app.use(route.path, route.router);
      }
    });

    // Документация API
    this.setupApiDocumentation();
  }

  /**
   * Настраивает документацию API
   * @private
   */
  private setupApiDocumentation(): void {
    this.app.get('/api', (req: Request, res: Response) => {
      const apiDocs = {
        name: 'WB Calculator API',
        version: '1.0.0',
        endpoints: this.routes.map(route => ({
          path: route.path,
          description: route.description
        }))
      };
      res.json(apiDocs);
    });
  }

  /**
   * Настраивает обработчики ошибок
   * @private
   */
  private setupErrorHandlers(): void {
    // Обработка 404
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ 
        error: 'Маршрут не найден',
        path: req.path,
        method: req.method 
      });
    });

    // Обработка ошибок
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Ошибка:', err);
      
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Внутренняя ошибка сервера';
      
      res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });
  }
}
