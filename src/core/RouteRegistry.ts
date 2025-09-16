import { Router } from 'express';
import { logger } from '../utils/logger';
import { BaseRouter } from './base/BaseRouter';

type RouterConfig = {
  path: string;
  router: BaseRouter;
  description: string;
  version?: string;
};

export class RouteRegistry {
  private static instance: RouteRegistry;
  private routes: RouterConfig[] = [];
  private router: Router;

  private constructor() {
    this.router = Router();
  }

  public static getInstance(): RouteRegistry {
    if (!RouteRegistry.instance) {
      RouteRegistry.instance = new RouteRegistry();
    }
    return RouteRegistry.instance;
  }

  /**
   * Регистрация нового роутера
   */
  public register(config: RouterConfig): void {
    const { path, router, description, version = 'v1' } = config;
    const versionedPath = `/api/${version}${path}`;
    
    this.routes.push({
      path: versionedPath,
      router: router,
      description,
      version
    });

    // Регистрируем роутер в Express
    this.router.use(versionedPath, router.router);
    
    logger.info(`Registered route: ${versionedPath} - ${description}`);
  }

  /**
   * Получение всех зарегистрированных маршрутов
   */
  public getRoutes(): RouterConfig[] {
    return [...this.routes];
  }

  /**
   * Получение основного роутера с зарегистрированными маршрутами
   */
  public getRouter(): Router {
    // Добавляем эндпоинт для получения списка всех маршрутов
    this.router.get('/api/routes', (req, res) => {
      const routesInfo = this.routes.map(route => ({
        path: route.path,
        description: route.description,
        version: route.version
      }));
      
      res.json({
        success: true,
        data: routesInfo
      });
    });

    return this.router;
  }

  /**
   * Инициализация всех маршрутов
   */
  public static async initializeRoutes(app: any): Promise<void> {
    const instance = RouteRegistry.getInstance();
    
    // Регистрируем базовые маршруты
    instance.register({
      path: '/ping',
      router: new (class extends BaseRouter {
        protected initializeRoutes(): void {
          this.get('/', (req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
          });
        }
      })(),
      description: 'Проверка доступности API'
    });

    // Динамически загружаем и регистрируем остальные роутеры
    try {
      // Пример регистрации роутера товаров
      const { ProductRouter } = await import('../api/v1/product/product.router');
      instance.register({
        path: '/products',
        router: new ProductRouter(),
        description: 'API для работы с товарами'
      });
      
      // TODO: Добавить регистрацию других роутеров по мере необходимости
      
    } catch (error) {
      logger.error('Ошибка при загрузке роутеров:', error);
      throw error;
    }

    // Подключаем основной роутер к приложению
    app.use(instance.getRouter());
  }
}
