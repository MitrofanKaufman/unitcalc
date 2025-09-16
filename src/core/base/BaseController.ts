import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export abstract class BaseController {
  /**
   * Успешный ответ
   */
  protected success<T = any>(
    res: Response,
    data: T,
    meta?: Record<string, any>,
    statusCode: number = 200
  ): Response<IApiResponse<T>> {
    const response: IApiResponse<T> = { success: true, data };
    
    if (meta) {
      response.meta = meta;
    }
    
    return res.status(statusCode).json(response);
  }

  /**
   * Ответ с ошибкой
   */
  protected error(
    res: Response,
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: any
  ): Response<IApiResponse> {
    const response: IApiResponse = {
      success: false,
      error: {
        code,
        message,
        details
      }
    };
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Обработчик ошибок для асинхронных методов
   */
  protected catchError(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        logger.error('Controller error:', error);
        this.error(
          res,
          error instanceof Error ? error.message : 'Internal server error',
          'INTERNAL_ERROR',
          500,
          process.env.NODE_ENV === 'development' ? error : undefined
        );
      }
    };
  }

  /**
   * Валидация входящих данных (может быть переопределен в дочерних классах)
   */
  protected validate(schema: any, data: any): { valid: boolean; errors?: any } {
    // TODO: Интеграция с библиотекой валидации (например, Joi, class-validator)
    return { valid: true };
  }
}
