/**
 * Product type representing a product from Wildberries
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number | null;
  image: string;
  images?: string[];
  brand?: string;
  salePrice?: number;
  salePercent?: number;
}

/**
 * Search result with pagination info
 */
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
}

/**
 * Search parameters for product search
 */
export interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular';
  inStock?: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  code?: number;
  details?: Record<string, unknown>;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  success: boolean;
}
