declare module '@/services/wildberries' {
  interface ProgressCallback {
    (currentStep: number, totalSteps: number): void;
  }

  interface Product {
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
    };
  }

  export const WildberriesService: {
    fetchSuggestions(query: string): Promise<string[]>;
    fetchProducts(
      query: string,
      onProgress?: ProgressCallback
    ): Promise<Product[]>;
  };
}
