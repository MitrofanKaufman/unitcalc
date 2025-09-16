// path: src/utils/ApiError.ts
/**
 * Класс для обработки ошибок API
 * Расширяет стандартный класс Error для добавления кода статуса и кода ошибки
 */

import { ERROR_CODES } from '../../../../cfg/constants';

class ApiError extends Error {
  /**
   * HTTP статус код
   */
  statusCode: number;
  
  /**
   * Код ошибки для клиентской обработки
   */
  errorCode: string;
  
  /**
   * Дополнительные данные об ошибке
   */
  details?: any;
  
  /**
   * Стек вызовов (только в режиме разработки)
   */
  stackTrace?: string;
  
  /**
   * Создает новый экземпляр ошибки API
   * @param message Сообщение об ошибке
   * @param statusCode HTTP статус код (по умолчанию 500)
   * @param errorCode Код ошибки (по умолчанию INTERNAL_ERROR)
   * @param details Дополнительные данные об ошибке
   * @param isOperational Является ли ошибка операционной (ожидаемой)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = ERROR_CODES.INTERNAL_ERROR,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    
    // Устанавливаем прототип для корректного наследования
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    
    // Сохраняем стек вызовов (исключая вызов конструктора)
    if (process.env.NODE_ENV === 'development') {
      this.stackTrace = this.stack;
    }
    
    // Устанавливаем флаг isOperational
    (this as any).isOperational = isOperational;
    
    // Удаляем конструктор из стека вызовов
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Создает ошибку "Не авторизован"
   */
  static unauthorized(message: string = 'Не авторизован', details?: any): ApiError {
    return new ApiError(
      message,
      401,
      ERROR_CODES.UNAUTHORIZED,
      details,
      true
    );
  }
  
  /**
   * Создает ошибку "Доступ запрещен"
   */
  static forbidden(message: string = 'Доступ запрещен', details?: any): ApiError {
    return new ApiError(
      message,
      403,
      ERROR_CODES.FORBIDDEN,
      details,
      true
    );
  }
  
  /**
   * Создает ошибку "Не найдено"
   */
  static notFound(message: string = 'Ресурс не найден', details?: any): ApiError {
    return new ApiError(
      message,
      404,
      ERROR_CODES.NOT_FOUND,
      details,
      true
    );
  }
  
  /**
   * Создает ошибку валидации
   */
  static validationError(message: string = 'Ошибка валидации', details?: any): ApiError {
    return new ApiError(
      message,
      422,
      ERROR_CODES.VALIDATION_ERROR,
      details,
      true
    );
  }
  
  /**
   * Создает ошибку конфликта
   */
  static conflict(message: string = 'Конфликт данных', details?: any): ApiError {
    return new ApiError(
      message,
      409,
      'CONFLICT',
      details,
      true
    );
  }
  
  /**
   * Создает ошибку "Слишком много запросов"
   */
  static tooManyRequests(message: string = 'Слишком много запросов', details?: any): ApiError {
    return new ApiError(
      message,
      429,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      details,
      true
    );
  }
  
  /**
   * Создает ошибку API Wildberries
   */
  static wbApiError(message: string = 'Ошибка при обращении к API Wildberries', details?: any): ApiError {
    return new ApiError(
      message,
      502,
      ERROR_CODES.WB_API_ERROR,
      details,
      true
    );
  }
  
  /**
   * Создает ошибку расчета
   */
  static calculationError(message: string = 'Ошибка при расчете рентабельности', details?: any): ApiError {
    return new ApiError(
      message,
      400,
      ERROR_CODES.CALCULATION_ERROR,
      details,
      true
    );
  }
  
  /**
   * Преобразует ошибку в формат для отправки клиенту
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message,
        ...(this.details && { details: this.details }),
        ...(this.stackTrace && { stack: this.stackTrace }),
      },
    };
  }
}

export default ApiError;
