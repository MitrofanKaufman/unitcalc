import type { Product } from '@/types/dto';
interface UseProductSearchReturn {
    query: string;
    setQuery: (query: string) => void;
    suggestions: string[];
    products: Product[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    progress: {
        progress: number;
        status: string;
    };
    showSuggestions: boolean;
    highlightedIndex: number;
    searchInputRef: React.RefObject<HTMLInputElement>;
    fetchSuggestions: (query: string) => Promise<void>;
    fetchProducts: (query: string) => Promise<void>;
    handleSuggestionSelect: (suggestion: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    loadMore: () => void;
    setShowSuggestions: (show: boolean) => void;
}
export declare const useProductSearch: () => UseProductSearchReturn;
export {};
