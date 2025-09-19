// API response and error types
declare namespace Api {
  // Common response structure
  interface Response<T = unknown> {
    success: boolean;
    data?: T;
    error?: ErrorDetails;
    message?: string;
    meta?: Record<string, unknown>;
  }

  // Error details structure
  interface ErrorDetails {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  }

  // Standard error codes
  type ErrorCode = 
    | 'VALIDATION_ERROR'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'TOO_MANY_REQUESTS'
    | 'INTERNAL_SERVER_ERROR'
    | 'SERVICE_UNAVAILABLE'
    | 'BAD_GATEWAY'
    | 'GATEWAY_TIMEOUT'
    | 'WB_API_ERROR'
    | 'CALCULATION_ERROR';

  // Validation error details
  interface ValidationError {
    field: string;
    message: string;
    code?: string;
    value?: unknown;
  }

  // API error parameters
  interface ApiErrorParams {
    message: string;
    code?: ErrorCode;
    statusCode?: number;
    details?: unknown;
    meta?: Record<string, unknown>;
  }

  // Request options
  interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
    data?: unknown;
    headers?: HeadersInit;
  }
}
