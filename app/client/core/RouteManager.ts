// path: src/core/RouteManager.ts
/**
 * Менеджер маршрутов приложения
 * Настраивает все API-эндпоинты и подключает соответствующие роутеры
 */
import express, { 
  Express, 
  Request, 
  Response, 
  NextFunction, 
  Router, 
  RequestHandler, 
  ErrorRequestHandler 
} from 'express';
import path from 'path';
import { logger } from '@utils/logger';

// Тип для роутера (может быть как Router, так и RequestHandler)
type RouteHandler = Router | RequestHandler;

// Интерфейс для описания маршрута
interface Route {
  path: string;
  router: RouteHandler;
  description: string;
  prefix?: string;
  version?: string;
  methods?: string[];
}

export class RouteManager {
  private readonly app: Express;
  private readonly basePath: string;
  private readonly routes: Route[] = [];
  private static instance: RouteManager | null = null;

  /**
   * Статический метод для инициализации маршрутов
   * @param app Экземпляр Express-приложения
   * @param basePath Базовый путь для статических файлов (по умолчанию: process.cwd())
   */
  public static async initializeRoutes(app: Express, basePath: string = process.cwd()): Promise<void> {
    if (!RouteManager.instance) {
      const routeManager = new RouteManager(app, basePath);
      await routeManager.initializeRoutes();
      routeManager.setupRoutes();
      routeManager.setupErrorHandlers();
      RouteManager.instance = routeManager;
    }
    return Promise.resolve();
  }

  /**
   * Создает экземпляр менеджера маршрутов
   * @param app Экземпляр Express-приложения
   * @param basePath Базовый путь для статических файлов
   */
  private constructor(app: Express, basePath: string) {
    this.app = app;
    this.basePath = basePath;
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
    logger.info('Инициализация маршрутов приложения...');

    // Основные системные маршруты
    this.addSystemRoutes();

    // API маршруты
    await this.addApiRoutes();

    // Статические файлы и SPA роутинг
    this.addStaticRoutes();
  }

  /**
   * Добавляет системные маршруты (health check, ping и т.д.)
   * @private
   */
  private addSystemRoutes(): void {
    this.routes.push({
      path: '/health',
      router: (req: Request, res: Response) => 
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }),
      description: 'Проверка работоспособности сервиса',
      methods: ['GET']
    });

    this.routes.push({
      path: '/api/ping',
      router: (req: Request, res: Response) => 
        res.status(200).json({ status: 'pong', timestamp: new Date().toISOString() }),
      description: 'Проверка доступности API',
      methods: ['GET']
    });
  }

  /**
   * Добавляет API маршруты
   * @private
   */
  private async addApiRoutes(): Promise<void> {
    try {
      // API v1
      const apiV1Router = express.Router();
      
      // Продукты
      const { default: productRouter } = await import('@/api/v1/product/product.routes');
      apiV1Router.use('/products', productRouter);
      
      // TODO: Добавить другие API роуты
      // const { default: calculatorRouter } = await import('@/api/v1/calculator/calculator.routes');
      // apiV1Router.use('/calculator', calculatorRouter);
      
      this.routes.push({
        path: '/api/v1',
        router: apiV1Router,
        description: 'API версии 1',
        version: '1.0.0'
      });
      
      // Обратная совместимость для старых маршрутов
      this.routes.push({
        path: '/api/v1/product',
        router: productRouter,
        description: 'Устаревший маршрут для работы с товарами (для обратной совместимости)',
        version: '1.0.0',
        methods: ['GET', 'POST']
      });
      
    } catch (error) {
      logger.error('Ошибка при загрузке API маршрутов:', error);
      throw new Error('Не удалось загрузить API маршруты');
    }
  }

  /**
   * Добавляет маршруты для статических файлов и SPA
   * @private
   */
  private addStaticRoutes(): void {
    // NOTE: Static file serving removed - frontend (Vite) handles static files
    // Обслуживание статических файлов отключено - фронтенд (Vite) обслуживает статические файлы

    // Если нужно обслуживать статические файлы с бэкенда, раскомментируйте ниже:
    // this.app.use(express.static(path.join(this.basePath, 'public')));

    // Обработка SPA маршрутов отключена - пусть фронтенд обрабатывает 404
    // this.app.get('*', (req: Request, res: Response) => {
    //   res.sendFile(path.join(this.basePath, 'public', 'index.html'));
    // });
  }

  /**
   * Настраивает все зарегистрированные маршруты
   * @private
   */
  private setupRoutes(): void {
    // Логирование всех входящих запросов
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
      });
      
      next();
    });

    // Парсинг JSON и URL-encoded тел запросов
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Настройка CORS
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
      }
      
      next();
    });

    // Настройка маршрутов
    this.routes.forEach(route => {
      if (route.router) {
        this.app.use(route.path, route.router);
        logger.debug(`Маршрут зарегистрирован: ${route.path} - ${route.description}`);
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
        service: 'WB Calculator API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        endpoints: this.routes
          .filter(route => route.path.startsWith('/api/'))
          .map(route => ({
            path: route.path,
            methods: route.methods || ['ALL'],
            description: route.description,
            version: route.version || '1.0.0'
          }))
      };
      
      res.status(200).json(apiDocs);
    });
    
    // Swagger документация (если используется)
    if (process.env.NODE_ENV !== 'production') {
      this.app.get('/api/docs', (req: Request, res: Response) => {
        // Здесь может быть рендеринг Swagger UI или редирект на него
        res.send('Документация API доступна в Swagger UI');
      });
    }
  }

  /**
   * Настраивает обработчики ошибок
   * @private
   */
  private setupErrorHandlers(): void {
    // Обработка 404
    this.app.use((req: Request, res: Response) => {
      logger.warn(`Маршрут не найден: ${req.method} ${req.path}`);
      
      res.status(404).json({ 
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Запрошенный ресурс не найден',
          path: req.path,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    });

    // Обработка ошибок
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Внутренняя ошибка сервера';
      const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
      
      // Логируем ошибку
      logger.error(`Ошибка ${statusCode}: ${message}`, {
        error: err,
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
      
      // Формируем ответ об ошибке
      const errorResponse: any = {
        success: false,
        error: {
          code: errorCode,
          message: message,
          timestamp: new Date().toISOString()
        }
      };
      
      // Добавляем стектрейс в режиме разработки
      if (process.env.NODE_ENV === 'development' && err.stack) {
        errorResponse.error.stack = err.stack;
      }
      
      // Добавляем валидационные ошибки, если они есть
      if (err.errors) {
        errorResponse.error.details = err.errors;
      }
      
      res.status(statusCode).json(errorResponse);
    });
  }
}
