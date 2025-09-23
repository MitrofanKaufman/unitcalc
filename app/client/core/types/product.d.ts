/**
 * Типы данных, связанные с товарами
 */

declare module './product' {
  /**
   * Информация о продавце
   */
  export interface SellerInfo {
    id?: string | number;
    name: string;
    rating?: number;
    status?: 'verified' | 'top' | 'new' | '';
    reviewsCount?: number;
    details?: Record<string, string>;
  }

  /**
   * Основная информация о товаре
   */
  export interface ProductInfo {
    id: string | number;
    name: string;
    title: string;
    brand: string;
    category: string;
    rating: number;
    reviewCount: number;
    price: number;
    oldPrice?: number;
    discount?: number;
    stock?: number;
    image: string;
    images: string[];
    description?: string;
    specifications?: Record<string, string>;
    seller?: SellerInfo;
    isFavorite?: boolean;
    isInCart?: boolean;
    sku?: string;
    barcode?: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    warranty?: string;
    countryOfOrigin?: string;
    tags?: string[];
    variants?: Array<{
      id: string | number;
      name: string;
      price: number;
      image?: string;
      stock: number;
    }>;
  }

  /**
   * Пропсы компонента ProductCard
   */
  export interface ProductCardProps {
    product: ProductInfo;
    isDark?: boolean;
    compact?: boolean;
    onViewDetails?: () => void;
    onAddToFavorites?: (productId: string | number) => void;
    onShare?: (product: ProductInfo) => void;
    onAnalytics?: (productId: string | number) => void;
    isFirstInRow?: boolean;
    isLastInRow?: boolean;
    isSingleInRow?: boolean;
    isSecondInRow?: boolean;
    isPreLastInRow?: boolean;
    className?: string;
  }
}
