import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { logger } from '../../utils/logger';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteConfig {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
  middlewares?: RequestHandler[];
  description?: string;
}

export abstract class BaseRouter {
  public readonly router: Router;
  public readonly basePath: string;
  protected routes: RouteConfig[] = [];

  constructor(basePath: string = '') {
    this.router = Router();
    this.basePath = basePath;
  }

  /**
   * Инициализация маршрутов (должен быть реализован в дочерних классах)
   */
  protected abstract initializeRoutes(): void;

  /**
   * Настройка всех зарегистрированных маршрутов
   */
  private setupRoutes(): void {
    this.routes.forEach(route => {
      const { method, path, handler, middlewares = [] } = route;
      const fullPath = `${this.basePath}${path}`;
      
      // Добавляем мидлвары, если они есть
      const handlers = [...middlewares, this.wrapAsync(handler)];
      
      // Регистрируем маршрут
      this.router[method](path, ...handlers);
      
      logger.info(`Route registered: ${method.toUpperCase()} ${fullPath}`);
    });
  }

  /**
   * Обертка для асинхронных обработчиков с централизованной обработкой ошибок
   */
  private wrapAsync(fn: RequestHandler): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Вспомогательные методы для регистрации маршрутов
   */
  protected get(path: string, handler: RequestHandler, config?: Omit<RouteConfig, 'path' | 'method' | 'handler'>): void {
    this.registerRoute({ method: 'get', path, handler, ...config });
  }

  protected post(path: string, handler: RequestHandler, config?: Omit<RouteConfig, 'path' | 'method' | 'handler'>): void {
    this.registerRoute({ method: 'post', path, handler, ...config });
  }

  protected put(path: string, handler: RequestHandler, config?: Omit<RouteConfig, 'path' | 'method' | 'handler'>): void {
    this.registerRoute({ method: 'put', path, handler, ...config });
  }

  protected delete(path: string, handler: RequestHandler, config?: Omit<RouteConfig, 'path' | 'method' | 'handler'>): void {
    this.registerRoute({ method: 'delete', path, handler, ...config });
  }

  protected patch(path: string, handler: RequestHandler, config?: Omit<RouteConfig, 'path' | 'method' | 'handler'>): void {
    this.registerRoute({ method: 'patch', path, handler, ...config });
  }

  /**
   * Регистрация маршрута с валидацией
   */
  private registerRoute(route: RouteConfig): void {
    this.routes.push(route);
  }
}
