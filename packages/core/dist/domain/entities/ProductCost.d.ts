import { Money } from '../value-objects/Money';
import { Weight } from '../value-objects/Weight';
/**
 * Структура затрат на товар
 */
export interface ProductCost {
    purchasePrice: Money;
    sellingPrice: Money;
    shippingCost: Money;
    customsDuty: Money;
    marketplaceCommission: Money;
    marketingCosts: Money;
    photographyCosts: Money;
    packagingCosts: Money;
    otherCosts: Money;
    weight: Weight;
}
/**
 * Фабрика для создания ProductCost
 */
export declare class ProductCostFactory {
    static create(purchasePrice: Money, sellingPrice: Money, weight: Weight, options?: {
        shippingCost?: Money;
        customsDuty?: Money;
        marketplaceCommission?: Money;
        marketingCosts?: Money;
        photographyCosts?: Money;
        packagingCosts?: Money;
        otherCosts?: Money;
    }): ProductCost;
}
/**
 * Сервис для расчета общих затрат
 */
export declare class CostCalculator {
    /**
     * Расчет себестоимости товара
     */
    static calculateCostPrice(cost: ProductCost): Money;
    /**
     * Расчет чистой прибыли
     */
    static calculateNetProfit(cost: ProductCost): Money;
    /**
     * Расчет маржинальности
     */
    static calculateMargin(cost: ProductCost): number;
    /**
     * Расчет точки безубыточности
     */
    static calculateBreakEvenPoint(cost: ProductCost): number;
    /**
     * Расчет ROI (Return on Investment)
     */
    static calculateROI(cost: ProductCost, salesCount: number): number;
}
//# sourceMappingURL=ProductCost.d.ts.map