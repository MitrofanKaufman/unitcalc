interface ProductInfo {
    title: string;
    brand: string;
    category: string;
    rating: number;
    reviewCount: number;
    price: number;
    images: string[];
    description?: string;
    specifications?: Record<string, string>;
    seller?: SellerInfo;
    fallbackImage?: string; // URL для заглушки изображения
}