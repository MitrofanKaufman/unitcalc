// path: src/types/product.ts

export type ProductInfo = {
  id: string | number;
  name: string;
  price?: number;
  rating: number | null;
  reviewRating: number;
  nmReviewRating: number;
  feedbacks: number;
  nmFeedbacks: number;
  pics: number;
  brand: string;
  brandId: number;
  siteBrandId: number;
  colors: Array<{
    name: string;
    id: number;
  }>;
  subjectId: number;
  subjectParentId: number;
  entity: string;
  matchId: number;
  supplier: string;
  supplierId: number;
  supplierRating: number;
  supplierFlags: number;
  volume: number;
  viewFlags: number;
  image?: string;
  images?: string[];
  sizes: Array<{
    name: string;
    origName: string;
    rank: number;
    optionId: number;
    wh: number;
    time1: number;
    time2: number;
    dtype: number;
    price: {
      basic: number;
      product: number;
      logistics: number;
      return: number;
    };
    stocks?: Array<{
      qty: number;
      // Add other stock properties if needed
    }>;
    saleConditions: number;
    payload: string;
  }>;
  totalQuantity: number;
  inStock?: boolean;
  seller?: {
    id: string | number;
    name: string;
    rating: number;
  };
  meta?: {
    tokens: string[];
    presetId: number;
  };
};


export type CalculationResults = {
  product: {
    id: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    parameters: Record<string, string>;
    description: string,
    originalMark: boolean;
    sellerId: string;
    seller?: {
      id: string;
      name: string | null;
      rating: number;
      reviews: number;
      logo: string | null;
      sales: number;
      buyoutRate: number;
      timeOnWB: string;
    };
  };
  seller: {
    id: string;
    name: string | null;
    rating: number;
    reviews: number;
    logo: string | null;
    sales: number;
    buyoutRate: number;
    timeOnWB: string;
  };
  errors: Array<{ step: string; message: string }>;
};
