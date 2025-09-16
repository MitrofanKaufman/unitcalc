// src/utils/ApiError.ts
// Кастомный класс для обработки ошибок API

class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details: any;

  constructor(message: string, statusCode: number, errorCode: string, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
