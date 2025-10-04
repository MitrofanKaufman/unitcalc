import { ProfitabilityCalculationEntity, CalculateProfitabilityDto } from '../types';
/**
 * Сервис для расчетов доходности товаров
 * Содержит математическую логику расчетов
 */
export declare class CalculationService {
    private calculations;
    /**
     * Расчет доходности товара
     */
    calculateProfitability(dto: CalculateProfitabilityDto): Promise<ProfitabilityCalculationEntity>;
    /**
     * Получение расчета по ID
     */
    getCalculation(id: string): Promise<ProfitabilityCalculationEntity | null>;
    /**
     * Получение истории расчетов для товара
     */
    getCalculationHistory(productId: string): Promise<ProfitabilityCalculationEntity[]>;
    /**
     * Расчет комиссии маркетплейса
     */
    private calculateCommission;
    /**
     * Расчет оптимальной цены продажи
     */
    calculateOptimalSellingPrice(productId: string, purchasePrice: number, logisticsCost: number, otherCosts: number, targetProfitability: number, marketplaceId: string, categoryId: string): Promise<number>;
    /**
     * Анализ чувствительности прибыли к изменению цены
     */
    analyzePriceSensitivity(productId: string, basePurchasePrice: number, baseLogisticsCost: number, baseOtherCosts: number, baseSellingPrice: number, marketplaceId: string, categoryId: string, priceRange: {
        min: number;
        max: number;
        step: number;
    }): Promise<Array<{
        sellingPrice: number;
        profit: number;
        profitability: number;
        roi: number;
    }>>;
    /**
     * Расчет точки безубыточности
     */
    calculateBreakEvenPoint(productId: string, purchasePrice: number, logisticsCost: number, otherCosts: number, marketplaceId: string, categoryId: string): Promise<number>;
    /**
     * Сравнение доходности между маркетплейсами
     */
    compareMarketplaces(productId: string, purchasePrice: number, logisticsCost: number, otherCosts: number, sellingPrice: number, categoryId: string): Promise<Array<{
        marketplaceId: string;
        marketplaceName: string;
        commission: number;
        profit: number;
        profitability: number;
        roi: number;
    }>>;
    /**
     * Получение названия маркетплейса
     */
    private getMarketplaceName;
    /**
     * Получение статистики расчетов
     */
    getCalculationStats(): Promise<{
        totalCalculations: number;
        averageProfitability: number;
        averageRoi: number;
        profitableCalculations: number;
        unprofitableCalculations: number;
    }>;
}
//# sourceMappingURL=CalculationService.d.ts.map