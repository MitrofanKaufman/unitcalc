export interface BaseEntity {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface Marketplace {
    id: string;
    name: string;
    icon: string;
    color: string;
    commission: {
        base: number;
        categoryMultiplier?: Record<string, number>;
    };
    isActive: boolean;
}
export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    marketplace: string;
    characteristics?: {
        weight?: number;
        dimensions?: {
            length?: number;
            width?: number;
            height?: number;
        };
        brand?: string;
        rating?: number;
        reviews?: number;
        inStock?: boolean;
    };
    cached?: boolean;
    lastUpdated?: string;
}
export interface ProductCategory {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    isActive: boolean;
}
export interface ProfitabilityCalculation {
    id: string;
    productId: string;
    purchasePrice: number;
    sellingPrice: number;
    logisticsCost: number;
    otherCosts: number;
    marketplaceId: string;
    categoryId: string;
    result: CalculationResult;
    createdAt: string;
    userId?: string;
}
export interface CalculationResult {
    revenue: number;
    commission: number;
    logistics: number;
    otherCosts: number;
    profit: number;
    profitability: number;
    roi: number;
}
export interface User extends BaseEntity {
    email: string;
    name: string;
    role: 'admin' | 'user' | 'manager';
    isActive: boolean;
    lastLoginAt?: string;
}
export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    language: 'ru' | 'en';
    currency: 'RUB' | 'USD' | 'EUR';
    notifications: {
        email: boolean;
        push: boolean;
        calculationComplete: boolean;
        newProducts: boolean;
    };
}
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
export interface SearchFilters {
    query?: string;
    marketplace?: string[];
    category?: string[];
    priceRange?: {
        min?: number;
        max?: number;
    };
    rating?: number;
    inStock?: boolean;
    dateRange?: {
        start?: string;
        end?: string;
    };
}
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'select' | 'multiselect' | 'date' | 'boolean';
    required?: boolean;
    placeholder?: string;
    options?: Array<{
        value: string;
        label: string;
    }>;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: (value: unknown) => string | null;
    };
}
export interface FormConfig {
    fields: FormField[];
    submitLabel?: string;
    cancelLabel?: string;
    layout?: 'horizontal' | 'vertical' | 'inline';
}
export declare const MARKETPLACES: Marketplace[];
export declare const PRODUCT_CATEGORIES: ProductCategory[];
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export interface AsyncState<T> {
    loading: boolean;
    error: string | null;
}
export type OperationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export interface OperationResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

// CSS Modules support
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
