export interface BaseEntity {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface MarketplaceEntity extends BaseEntity {
    name: string;
    icon: string;
    color: string;
    commission: {
        base: number;
        categoryMultiplier?: Record<string, number>;
    };
    isActive: boolean;
}
export interface ProductEntity extends BaseEntity {
    name: string;
    price: number;
    category: string;
    marketplaceId: string;
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
    scrapedAt?: string;
    sourceUrl?: string;
}
export interface ProductCategoryEntity extends BaseEntity {
    name: string;
    description?: string;
    parentId?: string;
    isActive: boolean;
}
export interface ProfitabilityCalculationEntity extends BaseEntity {
    productId: string;
    purchasePrice: number;
    sellingPrice: number;
    logisticsCost: number;
    otherCosts: number;
    marketplaceId: string;
    categoryId: string;
    result: CalculationResultEntity;
    userId?: string;
}
export interface CalculationResultEntity {
    revenue: number;
    commission: number;
    logistics: number;
    otherCosts: number;
    profit: number;
    profitability: number;
    roi: number;
    calculatedAt: string;
}
export interface UserEntity extends BaseEntity {
    email: string;
    name: string;
    role: 'admin' | 'user' | 'manager';
    isActive: boolean;
    lastLoginAt?: string;
    settings?: UserSettingsEntity;
}
export interface UserSettingsEntity {
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
    timestamp: string;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
export interface ProductSearchFilters {
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
export interface CreateProductDto {
    name: string;
    price: number;
    category: string;
    marketplaceId: string;
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
    sourceUrl?: string;
}
export interface UpdateProductDto extends Partial<CreateProductDto> {
}
export interface CalculateProfitabilityDto {
    productId: string;
    purchasePrice: number;
    sellingPrice: number;
    logisticsCost: number;
    otherCosts: number;
    marketplaceId?: string;
    categoryId?: string;
}
export interface SearchProductsDto {
    query: string;
    marketplace?: string;
    category?: string;
    limit?: number;
    offset?: number;
}
export declare const MARKETPLACE_COMMISSIONS: {
    readonly wb: {
        readonly base: 15;
        readonly categoryMultiplier: {
            readonly electronics: 0.05;
            readonly clothing: 0.15;
            readonly home: 0.1;
        };
    };
    readonly ozon: {
        readonly base: 12;
        readonly categoryMultiplier: {
            readonly electronics: 0.08;
            readonly books: 0.12;
            readonly toys: 0.15;
        };
    };
    readonly yandex: {
        readonly base: 8;
        readonly categoryMultiplier: {
            readonly electronics: 0.05;
            readonly fashion: 0.12;
            readonly food: 0.08;
        };
    };
};
export declare const PRODUCT_CATEGORIES: readonly [{
    readonly id: "electronics";
    readonly name: "Электроника";
}, {
    readonly id: "clothing";
    readonly name: "Одежда";
}, {
    readonly id: "home";
    readonly name: "Товары для дома";
}, {
    readonly id: "books";
    readonly name: "Книги";
}, {
    readonly id: "toys";
    readonly name: "Игрушки";
}, {
    readonly id: "fashion";
    readonly name: "Мода";
}, {
    readonly id: "food";
    readonly name: "Еда";
}];
export declare const VALIDATION_RULES: {
    readonly productName: {
        readonly minLength: 3;
        readonly maxLength: 200;
        readonly pattern: RegExp;
    };
    readonly price: {
        readonly min: 0.01;
        readonly max: 1000000;
    };
    readonly percentage: {
        readonly min: 0;
        readonly max: 100;
    };
    readonly email: {
        readonly pattern: RegExp;
    };
};
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly CONFLICT: "CONFLICT";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
};
export type OperationStatus = 'pending' | 'processing' | 'completed' | 'failed';
export interface OperationResult {
    success: boolean;
    status: OperationStatus;
    message?: string;
    data?: unknown;
    errors?: string[];
}
//# sourceMappingURL=index.d.ts.map