import { Product } from '../entities/Product';
import { Money } from '../value-objects/Money';
/**
 * Результат расчета доходности
 */
export interface ProfitabilityResult {
    product: Product;
    costPrice: Money;
    sellingPrice: Money;
    netProfit: Money;
    margin: number;
    breakEvenPoint: number;
    roi: number;
    profitabilityScore: number;
    recommendations: string[];
}
/**
 * Параметры для расчета доходности
 */
export interface ProfitabilityParams {
    salesCount?: number;
    timePeriod?: number;
    competitorPrices?: Money[];
    marketDemand?: 'low' | 'medium' | 'high';
}
/**
 * Основной сервис расчета доходности
 */
export declare class ProfitCalculator {
    /**
     * Расчет полной доходности товара
     */
    static calculateProfitability(product: Product, params?: ProfitabilityParams): ProfitabilityResult;
    /**
     * Расчет балла доходности (0-100)
     */
    private static calculateProfitabilityScore;
    /**
     * Генерация рекомендаций по оптимизации
     */
    private static generateRecommendations;
    /**
     * Сравнение доходности товаров
     */
    static compareProducts(products: Product[]): {
        bestMargin: Product;
        bestROI: Product;
        bestScore: Product;
        worstMargin: Product;
        worstROI: Product;
        worstScore: Product;
    };
    /**
     * Пакетный расчет доходности
     */
    static calculateBatch(products: Product[], params?: ProfitabilityParams): ProfitabilityResult[];
    /**
     * Экспорт результатов в CSV
     */
    static exportToCSV(results: ProfitabilityResult[]): string;
}
