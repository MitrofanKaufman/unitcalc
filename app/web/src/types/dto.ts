export interface SearchProductsDto {
  query?: string;
  marketplace?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  basePrice: {
    amount: number;
    currency: string;
  };
  cost: {
    purchasePrice: number;
    sellingPrice: number;
    weight: number;
  };
  weight: {
    value: number;
    unit: string;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CalculationResult {
  profit: number;
  profitability: number;
  roi: number;
  commission: number;
  totalCost: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string;
}
