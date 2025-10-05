// \packages\core\src\domain\entities\ProductCost.ts
// Сущность для затрат на товар

import { z } from 'zod';
import { Money, MoneySchema } from '../value-objects/Money';
import { Currency } from '../value-objects/Currency';
import { Weight, WeightSchema } from '../value-objects/Weight';

/**
 * Интерфейс для ProductCost
 */
interface IProductCost {
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
 * Схема валидации для ProductCost
 */
export const ProductCostSchema = z.object({
  purchasePrice: MoneySchema,
  sellingPrice: MoneySchema,
  shippingCost: MoneySchema,
  customsDuty: MoneySchema,
  marketplaceCommission: MoneySchema,
  marketingCosts: MoneySchema,
  photographyCosts: MoneySchema,
  packagingCosts: MoneySchema,
  otherCosts: MoneySchema,
  weight: WeightSchema
}).transform((data) => new ProductCost({
  purchasePrice: data.purchasePrice,
  sellingPrice: data.sellingPrice,
  weight: data.weight,
  shippingCost: data.shippingCost,
  customsDuty: data.customsDuty,
  marketplaceCommission: data.marketplaceCommission,
  marketingCosts: data.marketingCosts,
  photographyCosts: data.photographyCosts,
  packagingCosts: data.packagingCosts,
  otherCosts: data.otherCosts
}));

/**
 * Параметры для создания ProductCost
 */
interface ProductCostParams {
  purchasePrice: Money;
  sellingPrice: Money;
  weight: Weight;
  shippingCost?: Money;
  customsDuty?: Money;
  marketplaceCommission?: Money;
  marketingCosts?: Money;
  photographyCosts?: Money;
  packagingCosts?: Money;
  otherCosts?: Money;
}

/**
 * Класс для представления затрат на товар
 */
export class ProductCost implements IProductCost {
  public readonly purchasePrice: Money;
  public readonly sellingPrice: Money;
  public readonly weight: Weight;
  public readonly shippingCost: Money;
  public readonly customsDuty: Money;
  public readonly marketplaceCommission: Money;
  public readonly marketingCosts: Money;
  public readonly photographyCosts: Money;
  public readonly packagingCosts: Money;
  public readonly otherCosts: Money;

  constructor({
    purchasePrice,
    sellingPrice,
    weight,
    shippingCost = new Money(0, purchasePrice.currency),
    customsDuty = new Money(0, purchasePrice.currency),
    marketplaceCommission = new Money(0, purchasePrice.currency),
    marketingCosts = new Money(0, purchasePrice.currency),
    photographyCosts = new Money(0, purchasePrice.currency),
    packagingCosts = new Money(0, purchasePrice.currency),
    otherCosts = new Money(0, purchasePrice.currency)
  }: ProductCostParams) {
    this.purchasePrice = purchasePrice;
    this.sellingPrice = sellingPrice;
    this.weight = weight;
    this.shippingCost = shippingCost;
    this.customsDuty = customsDuty;
    this.marketplaceCommission = marketplaceCommission;
    this.marketingCosts = marketingCosts;
    this.photographyCosts = photographyCosts;
    this.packagingCosts = packagingCosts;
    this.otherCosts = otherCosts;
  }

  /**
   * Получение общей стоимости закупки
   */
  getTotalPurchaseCost(): Money {
    return this.purchasePrice
      .add(this.shippingCost)
      .add(this.customsDuty)
      .add(this.packagingCosts);
  }

  /**
   * Получение общей стоимости продажи
   */
  getTotalSellingCost(): Money {
    return this.sellingPrice
      .subtract(this.marketplaceCommission)
      .subtract(this.marketingCosts)
      .subtract(this.photographyCosts);
  }

  /**
   * Расчет прибыли
   */
  calculateProfit(): Money {
    return this.getTotalSellingCost().subtract(this.getTotalPurchaseCost());
  }

  /**
   * Расчет маржи (%)
   */
  calculateMargin(): number {
    const revenue = this.getTotalSellingCost().amount;
    const profit = this.calculateProfit().amount;
    return revenue > 0 ? (profit / revenue) * 100 : 0;
  }

  /**
   * Расчет рентабельности (ROI %)
   */
  calculateROI(salesCount = 1): number {
    const totalCost = this.getTotalPurchaseCost().amount * salesCount;
    const totalRevenue = this.getTotalSellingCost().amount * salesCount;
    const profit = totalRevenue - totalCost;
    
    return totalCost > 0 ? (profit / totalCost) * 100 : 0;
  }
}

/**
 * Фабрика для создания ProductCost
 */
export class ProductCostFactory {
  static create(
    purchasePrice: Money,
    sellingPrice: Money,
    weight: Weight,
    options: {
      shippingCost?: Money
      customsDuty?: Money
      marketplaceCommission?: Money
      marketingCosts?: Money
      photographyCosts?: Money
      packagingCosts?: Money
      otherCosts?: Money
    } = {}
  ): ProductCost {
    return new ProductCost({
      purchasePrice,
      sellingPrice,
      shippingCost: options.shippingCost || new Money(0, purchasePrice.currency),
      customsDuty: options.customsDuty || new Money(0, purchasePrice.currency),
      marketplaceCommission: options.marketplaceCommission || new Money(0, purchasePrice.currency),
      marketingCosts: options.marketingCosts || new Money(0, purchasePrice.currency),
      photographyCosts: options.photographyCosts || new Money(0, purchasePrice.currency),
      packagingCosts: options.packagingCosts || new Money(0, purchasePrice.currency),
      otherCosts: options.otherCosts || new Money(0, purchasePrice.currency),
      weight
    })
  }
}

/**
 * Сервис для расчета общих затрат
 */
export class CostCalculator {
  /**
   * Расчет себестоимости товара
   */
  static calculateCostPrice(cost: ProductCost): Money {
    const totalCosts = [
      cost.purchasePrice,
      cost.shippingCost,
      cost.customsDuty,
      cost.marketingCosts,
      cost.photographyCosts,
      cost.packagingCosts,
      cost.otherCosts
    ].reduce((sum, current) => sum.add(current), new Money(0, cost.purchasePrice.currency))

    return totalCosts
  }

  /**
   * Расчет чистой прибыли
   */
  static calculateNetProfit(cost: ProductCost): Money {
    const costPrice = this.calculateCostPrice(cost)
    const revenue = cost.sellingPrice
    const commission = cost.marketplaceCommission

    return revenue.subtract(costPrice).subtract(commission)
  }

  /**
   * Расчет маржинальности
   */
  static calculateMargin(cost: ProductCost): number {
    const netProfit = this.calculateNetProfit(cost)
    const revenue = cost.sellingPrice

    if (revenue.amount === 0) {
      return 0
    }

    return (netProfit.amount / revenue.amount) * 100
  }

  /**
   * Расчет точки безубыточности
   */
  static calculateBreakEvenPoint(cost: ProductCost): number {
    const fixedCosts = [
      cost.marketingCosts,
      cost.photographyCosts,
      cost.packagingCosts,
      cost.otherCosts
    ].reduce((sum, current) => sum.add(current), new Money(0, cost.purchasePrice.currency))

    const variableCostPerUnit = [
      cost.purchasePrice,
      cost.shippingCost,
      cost.customsDuty
    ].reduce((sum, current) => sum.add(current), new Money(0, cost.purchasePrice.currency))

    const profitPerUnit = cost.sellingPrice.subtract(cost.marketplaceCommission).subtract(variableCostPerUnit)

    if (profitPerUnit.amount <= 0) {
      throw new Error('Прибыль с единицы должна быть положительной')
    }

    return Math.ceil(fixedCosts.amount / profitPerUnit.amount)
  }

  /**
   * Расчет ROI (Return on Investment)
   */
  static calculateROI(cost: ProductCost, salesCount: number): number {
    const totalInvestment = this.calculateCostPrice(cost)
    const totalRevenue = cost.sellingPrice.multiply(salesCount)
    const totalCommission = cost.marketplaceCommission.multiply(salesCount)

    const netProfit = totalRevenue.subtract(totalInvestment).subtract(totalCommission)

    if (totalInvestment.amount === 0) {
      return 0
    }

    return (netProfit.amount / totalInvestment.amount) * 100
  }
}
