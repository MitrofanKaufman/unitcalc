import { ProductCost } from '../entities/ProductCost';
import { Money } from '../value-objects/Money';
/**
 * Сервис для расчета стоимости товара
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
     * Расчет маржинальности (%)
     */
    static calculateMargin(cost: ProductCost): number;
    /**
     * Расчет точки безубыточности (в единицах товара)
     */
    static calculateBreakEvenPoint(cost: ProductCost): number;
    /**
     * Расчет ROI (Return on Investment) в процентах
     */
    static calculateROI(cost: ProductCost, salesCount: number): number;
    /**
     * Расчет цены с учетом желаемой маржинальности
     */
    static calculatePriceWithMargin(cost: ProductCost, targetMargin: number): Money;
    /**
     * Расчет скидки с учетом желаемой цены
     */
    static calculateDiscount(originalPrice: Money, salePrice: Money): number;
    /**
     * Расчет стоимости доставки на основе веса и расстояния
     */
    static calculateShippingCost(weight: number, distance: number, ratePerKgPerKm: number): Money;
}
