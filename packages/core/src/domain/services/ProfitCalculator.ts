// \packages\core\src\domain\services\ProfitCalculator.ts
// Сервис расчета доходности товаров

import { Product } from '../entities/Product';
import { ProductCost } from '../entities/ProductCost';
import { Money } from '../value-objects/Money';
import { CostCalculator } from './CostCalculator';

/**
 * Результат расчета доходности
 */
export interface ProfitabilityResult {
  product: Product;
  costPrice: Money;            // Себестоимость
  sellingPrice: Money;         // Цена продажи
  netProfit: Money;            // Чистая прибыль
  margin: number;              // Маржинальность (%)
  breakEvenPoint: number;      // Точка безубыточности
  roi: number;                 // ROI (%)
  profitabilityScore: number;  // Балл доходности (0-100)
  recommendations: string[];   // Рекомендации
}

/**
 * Параметры для расчета доходности
 */
export interface ProfitabilityParams {
  salesCount?: number;              // Количество продаж
  timePeriod?: number;              // Период в днях
  competitorPrices?: Money[];       // Цены конкурентов
  marketDemand?: 'low' | 'medium' | 'high'; // Спрос на рынке
}

/**
 * Основной сервис расчета доходности
 */
export class ProfitCalculator {
  /**
   * Расчет полной доходности товара
   */
  static calculateProfitability(
    product: Product,
    params: ProfitabilityParams = {}
  ): ProfitabilityResult {
    const {
      salesCount = 100,
      timePeriod = 30,
      competitorPrices = [],
      marketDemand = 'medium'
    } = params;

    // Расчет базовых метрик
    const costPrice = CostCalculator.calculateCostPrice(product.cost);
    const netProfit = CostCalculator.calculateNetProfit(product.cost);
    const margin = CostCalculator.calculateMargin(product.cost);
    const breakEvenPoint = CostCalculator.calculateBreakEvenPoint(product.cost);
    const roi = CostCalculator.calculateROI(product.cost, salesCount);

    // Расчет балла доходности
    const profitabilityScore = this.calculateProfitabilityScore({
      margin,
      roi,
      breakEvenPoint,
      salesCount,
      timePeriod,
      marketDemand,
      competitorPrices
    });

    // Генерация рекомендаций
    const recommendations = this.generateRecommendations({
      product,
      margin,
      breakEvenPoint,
      profitabilityScore,
      competitorPrices
    });

    return {
      product,
      costPrice,
      sellingPrice: product.cost.sellingPrice,
      netProfit,
      margin,
      breakEvenPoint,
      roi,
      profitabilityScore,
      recommendations
    };
  }

  /**
   * Расчет балла доходности (0-100)
   */
  private static calculateProfitabilityScore(params: {
    margin: number
    roi: number
    breakEvenPoint: number
    salesCount: number
    timePeriod: number
    marketDemand: 'low' | 'medium' | 'high'
    competitorPrices: Money[]
  }): number {
    let score = 0

    // Оценка маржинальности (40% веса)
    if (params.margin >= 50) score += 40
    else if (params.margin >= 30) score += 30
    else if (params.margin >= 15) score += 20
    else if (params.margin >= 5) score += 10
    else score += 0

    // Оценка ROI (30% веса)
    if (params.roi >= 100) score += 30
    else if (params.roi >= 50) score += 25
    else if (params.roi >= 20) score += 20
    else if (params.roi >= 10) score += 15
    else if (params.roi >= 0) score += 10
    else score += 0

    // Оценка точки безубыточности (20% веса)
    if (params.breakEvenPoint <= 10) score += 20
    else if (params.breakEvenPoint <= 25) score += 15
    else if (params.breakEvenPoint <= 50) score += 10
    else if (params.breakEvenPoint <= 100) score += 5
    else score += 0

    // Корректировка по спросу на рынке (10% веса)
    const demandMultiplier = {
      high: 1.1,
      medium: 1.0,
      low: 0.9
    }[params.marketDemand]

    score = Math.round(score * demandMultiplier)

    return Math.min(100, Math.max(0, score))
  }

  /**
   * Генерация рекомендаций по оптимизации
   */
  private static generateRecommendations(params: {
    product: Product
    margin: number
    breakEvenPoint: number
    profitabilityScore: number
    competitorPrices: Money[]
  }): string[] {
    const recommendations: string[] = []
    const { product, margin, breakEvenPoint, profitabilityScore, competitorPrices } = params

    // Анализ маржинальности
    if (margin < 15) {
      recommendations.push('Рассмотрите возможность снижения закупочной цены или увеличения цены продажи')
    } else if (margin > 50) {
      recommendations.push('Высокая маржинальность - можно увеличить объем закупок')
    }

    // Анализ точки безубыточности
    if (breakEvenPoint > 100) {
      recommendations.push('Высокая точка безубыточности - рассмотрите снижение фиксированных затрат')
    } else if (breakEvenPoint < 20) {
      recommendations.push('Низкая точка безубыточности - продукт имеет хороший потенциал')
    }

    // Анализ конкурентных цен
    if (competitorPrices.length > 0) {
      const avgCompetitorPrice = competitorPrices.reduce((sum, price) => sum + price.amount, 0) / competitorPrices.length

      if (product.cost.sellingPrice.amount > avgCompetitorPrice * 1.2) {
        recommendations.push('Цена выше рыночной - рассмотрите снижение для повышения конкурентоспособности')
      } else if (product.cost.sellingPrice.amount < avgCompetitorPrice * 0.8) {
        recommendations.push('Цена ниже рыночной - можно увеличить цену продажи')
      }
    }

    // Общие рекомендации
    if (profitabilityScore >= 80) {
      recommendations.push('Отличная доходность - рекомендуется увеличить инвестиции в этот товар')
    } else if (profitabilityScore < 40) {
      recommendations.push('Низкая доходность - рекомендуется пересмотреть стратегию или отказаться от товара')
    }

    return recommendations
  }

  /**
   * Сравнение доходности товаров
   */
  static compareProducts(products: Product[]): {
    bestMargin: Product
    bestROI: Product
    bestScore: Product
    worstMargin: Product
    worstROI: Product
    worstScore: Product
  } {
    if (products.length === 0) {
      throw new Error('Список товаров пуст')
    }

    const results = products.map(product =>
      this.calculateProfitability(product)
    )

    return {
      bestMargin: results.reduce((best, current) =>
        current.margin > best.margin ? current : best
      ).product,

      bestROI: results.reduce((best, current) =>
        current.roi > best.roi ? current : best
      ).product,

      bestScore: results.reduce((best, current) =>
        current.profitabilityScore > best.profitabilityScore ? current : best
      ).product,

      worstMargin: results.reduce((worst, current) =>
        current.margin < worst.margin ? current : worst
      ).product,

      worstROI: results.reduce((worst, current) =>
        current.roi < worst.roi ? current : worst
      ).product,

      worstScore: results.reduce((worst, current) =>
        current.profitabilityScore < worst.profitabilityScore ? current : worst
      ).product
    }
  }

  /**
   * Пакетный расчет доходности
   */
  static calculateBatch(products: Product[], params?: ProfitabilityParams): ProfitabilityResult[] {
    return products.map(product => this.calculateProfitability(product, params))
  }

  /**
   * Экспорт результатов в CSV
   */
  static exportToCSV(results: ProfitabilityResult[]): string {
    const headers = [
      'Название товара',
      'Маржинальность (%)',
      'ROI (%)',
      'Точка безубыточности',
      'Балл доходности',
      'Себестоимость',
      'Цена продажи',
      'Чистая прибыль'
    ]

    const rows = results.map(result => [
      result.product.name,
      result.margin.toFixed(2),
      result.roi.toFixed(2),
      result.breakEvenPoint.toString(),
      result.profitabilityScore.toString(),
      result.costPrice.format(),
      result.sellingPrice.format(),
      result.netProfit.format()
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return csvContent
  }
}
