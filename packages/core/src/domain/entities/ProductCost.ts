// \packages\core\src\domain\entities\ProductCost.ts
// Сущность для затрат на товар

import { Money } from '../value-objects/Money'
import { Currency } from '../value-objects/Currency'
import { Weight } from '../value-objects/Weight'

/**
 * Структура затрат на товар
 */
export interface ProductCost {
  purchasePrice: Money        // Цена закупки
  sellingPrice: Money         // Цена продажи
  shippingCost: Money         // Стоимость доставки
  customsDuty: Money          // Таможенная пошлина
  marketplaceCommission: Money // Комиссия маркетплейса
  marketingCosts: Money       // Затраты на маркетинг
  photographyCosts: Money     // Затраты на фото/видео
  packagingCosts: Money       // Затраты на упаковку
  otherCosts: Money          // Другие затраты
  weight: Weight             // Вес товара
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
    return {
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
    }
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
