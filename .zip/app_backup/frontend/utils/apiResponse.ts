// path: src/utils/apiResponse.ts
/**
 * Утилиты для формирования стандартизированных ответов API
 * Обеспечивает единый формат ответов для всех эндпоинтов
 */

import { Response } from 'express';
import { HTTP_STATUS_CODES, ERROR_CODES } from '../../../../cfg/constants';

// Типы для ответов API
interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  meta?: Record<string, any>;
}

type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Класс для создания стандартизированных ответов API
 */
class ApiResponse {
  /**
   * Успешный ответ
   */
  static success<T = any>(
    res: Response,
    data: T,
    message: string = 'Успешно',
    statusCode: number = HTTP_STATUS_CODES.OK,
    meta?: Record<string, any>
  ): Response<SuccessResponse<T>> {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      message,
      ...(meta && { meta }),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Ответ с ошибкой
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    errorCode: string = ERROR_CODES.INTERNAL_ERROR,
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: new Error().stack }),
      },
      ...(meta && { meta }),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Ответ с ошибкой валидации
   */
  static validationError(
    res: Response,
    message: string = 'Ошибка валидации',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.VALIDATION_ERROR,
      ERROR_CODES.VALIDATION_ERROR,
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой "Не найдено"
   */
  static notFound(
    res: Response,
    message: string = 'Ресурс не найден',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.NOT_FOUND,
      ERROR_CODES.NOT_FOUND,
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой доступа
   */
  static unauthorized(
    res: Response,
    message: string = 'Не авторизован',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой запрета доступа
   */
  static forbidden(
    res: Response,
    message: string = 'Доступ запрещен',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой конфликта
   */
  static conflict(
    res: Response,
    message: string = 'Конфликт данных',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.CONFLICT,
      'CONFLICT',
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой лимита запросов
   */
  static tooManyRequests(
    res: Response,
    message: string = 'Слишком много запросов',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой API Wildberries
   */
  static wbApiError(
    res: Response,
    message: string = 'Ошибка при обращении к API Wildberries',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.BAD_GATEWAY,
      ERROR_CODES.WB_API_ERROR,
      details,
      meta
    );
  }

  /**
   * Ответ с ошибкой расчета
   */
  static calculationError(
    res: Response,
    message: string = 'Ошибка при расчете рентабельности',
    details?: any,
    meta?: Record<string, any>
  ): Response<ErrorResponse> {
    return this.error(
      res,
      message,
      HTTP_STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.CALCULATION_ERROR,
      details,
      meta
    );
  }
}

export default ApiResponse;
