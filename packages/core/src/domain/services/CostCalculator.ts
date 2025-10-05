// \packages\core\src\domain\services\CostCalculator.ts
// Сервис для расчета стоимости товара

import { ProductCost } from '../entities/ProductCost';
import { Money } from '../value-objects/Money';

/**
 * Сервис для расчета стоимости товара
 */
export class CostCalculator {
  /**
   * Расчет себестоимости товара
   */
  static calculateCostPrice(cost: ProductCost): Money {
    return cost.getTotalPurchaseCost();
  }

  /**
   * Расчет чистой прибыли
   */
  static calculateNetProfit(cost: ProductCost): Money {
    return cost.calculateProfit();
  }

  /**
   * Расчет маржинальности (%)
   */
  static calculateMargin(cost: ProductCost): number {
    return cost.calculateMargin();
  }

  /**
   * Расчет точки безубыточности (в единицах товара)
   */
  static calculateBreakEvenPoint(cost: ProductCost): number {
    const fixedCosts = cost.getTotalPurchaseCost().amount;
    const sellingPrice = cost.sellingPrice.amount;
    
    if (sellingPrice <= 0) {
      return 0;
    }
    
    return Math.ceil(fixedCosts / sellingPrice);
  }

  /**
   * Расчет ROI (Return on Investment) в процентах
   */
  static calculateROI(cost: ProductCost, salesCount: number): number {
    const netProfit = cost.calculateProfit().amount;
    const totalCost = cost.getTotalPurchaseCost().amount;
    
    if (totalCost <= 0) {
      return 0;
    }
    
    return (netProfit / totalCost) * 100;
  }

  /**
   * Расчет цены с учетом желаемой маржинальности
   */
  static calculatePriceWithMargin(cost: ProductCost, targetMargin: number): Money {
    if (targetMargin < 0 || targetMargin >= 100) {
      throw new Error('Маржинальность должна быть в диапазоне от 0 до 100%');
    }

    const costPrice = cost.getTotalPurchaseCost().amount;
    const sellingPrice = costPrice / (1 - targetMargin / 100);
    
    return new Money(sellingPrice, cost.sellingPrice.currency);
  }

  /**
   * Расчет скидки с учетом желаемой цены
   */
  static calculateDiscount(originalPrice: Money, salePrice: Money): number {
    if (originalPrice.currency !== salePrice.currency) {
      throw new Error('Валюты цен должны совпадать');
    }

    if (originalPrice.amount <= 0) {
      return 0;
    }

    return ((originalPrice.amount - salePrice.amount) / originalPrice.amount) * 100;
  }

  /**
   * Расчет стоимости доставки на основе веса и расстояния
   */
  static calculateShippingCost(weight: number, distance: number, ratePerKgPerKm: number): Money {
    if (weight <= 0 || distance <= 0 || ratePerKgPerKm <= 0) {
      throw new Error('Вес, расстояние и тариф должны быть положительными числами');
    }

    const shippingCost = weight * distance * ratePerKgPerKm;
    return new Money(shippingCost, 'RUB'); // TODO: Сделать валюту настраиваемой
  }
}
