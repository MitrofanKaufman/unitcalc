export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
    timestamp: string;
    version?: string;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface QueryParams extends PaginationParams {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filter?: Record<string, any>;
}
export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface UserPayload {
    id: string;
    email: string;
    role: string;
}
export interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    data?: any;
    userId?: string;
    ip?: string;
    userAgent?: string;
}
//# sourceMappingURL=common.d.ts.map