"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationService = void 0;
const types_1 = require("../types");
/**
 * Сервис для расчетов доходности товаров
 * Содержит математическую логику расчетов
 */
class CalculationService {
    constructor() {
        this.calculations = new Map();
    }
    /**
     * Расчет доходности товара
     */
    async calculateProfitability(dto) {
        const { productId, purchasePrice, sellingPrice, logisticsCost, otherCosts, marketplaceId, categoryId } = dto;
        // Получение комиссии маркетплейса
        const commission = this.calculateCommission(sellingPrice, marketplaceId, categoryId);
        // Расчет показателей
        const revenue = sellingPrice - commission - logisticsCost - otherCosts;
        const profit = revenue - purchasePrice;
        const profitability = (profit / sellingPrice) * 100;
        const roi = (profit / purchasePrice) * 100;
        const result = {
            revenue: Number(revenue.toFixed(2)),
            commission: Number(commission.toFixed(2)),
            logistics: logisticsCost,
            otherCosts,
            profit: Number(profit.toFixed(2)),
            profitability: Number(profitability.toFixed(2)),
            roi: Number(roi.toFixed(2)),
            calculatedAt: new Date().toISOString()
        };
        const calculation = {
            id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            productId,
            purchasePrice,
            sellingPrice,
            logisticsCost,
            otherCosts,
            marketplaceId,
            categoryId,
            result,
            createdAt: new Date().toISOString()
        };
        this.calculations.set(calculation.id, calculation);
        return calculation;
    }
    /**
     * Получение расчета по ID
     */
    async getCalculation(id) {
        return this.calculations.get(id) || null;
    }
    /**
     * Получение истории расчетов для товара
     */
    async getCalculationHistory(productId) {
        return Array.from(this.calculations.values())
            .filter(calc => calc.productId === productId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    /**
     * Расчет комиссии маркетплейса
     */
    calculateCommission(sellingPrice, marketplaceId, categoryId) {
        var _a;
        const marketplace = types_1.MARKETPLACE_COMMISSIONS[marketplaceId];
        if (!marketplace) {
            throw new Error(`Неизвестный маркетплейс: ${marketplaceId}`);
        }
        const baseCommission = marketplace.base;
        const categoryMultiplier = ((_a = marketplace.categoryMultiplier) === null || _a === void 0 ? void 0 : _a[categoryId]) || 0;
        return sellingPrice * (baseCommission / 100) * (1 + categoryMultiplier);
    }
    /**
     * Расчет оптимальной цены продажи
     */
    async calculateOptimalSellingPrice(productId, purchasePrice, logisticsCost, otherCosts, targetProfitability, marketplaceId, categoryId) {
        var _a;
        const marketplace = types_1.MARKETPLACE_COMMISSIONS[marketplaceId];
        if (!marketplace) {
            throw new Error(`Неизвестный маркетплейс: ${marketplaceId}`);
        }
        const baseCommission = marketplace.base;
        const categoryMultiplier = ((_a = marketplace.categoryMultiplier) === null || _a === void 0 ? void 0 : _a[categoryId]) || 0;
        // Формула: Цена продажи = (Закупка + Логистика + Другие затраты + Целевая прибыль) / (1 - Комиссия)
        const totalCosts = purchasePrice + logisticsCost + otherCosts;
        const commissionRate = (baseCommission / 100) * (1 + categoryMultiplier);
        return totalCosts / (1 - commissionRate);
    }
    /**
     * Анализ чувствительности прибыли к изменению цены
     */
    async analyzePriceSensitivity(productId, basePurchasePrice, baseLogisticsCost, baseOtherCosts, baseSellingPrice, marketplaceId, categoryId, priceRange) {
        const results = [];
        for (let price = priceRange.min; price <= priceRange.max; price += priceRange.step) {
            const commission = this.calculateCommission(price, marketplaceId, categoryId);
            const revenue = price - commission - baseLogisticsCost - baseOtherCosts;
            const profit = revenue - basePurchasePrice;
            const profitability = (profit / price) * 100;
            const roi = (profit / basePurchasePrice) * 100;
            results.push({
                sellingPrice: price,
                profit: Number(profit.toFixed(2)),
                profitability: Number(profitability.toFixed(2)),
                roi: Number(roi.toFixed(2))
            });
        }
        return results;
    }
    /**
     * Расчет точки безубыточности
     */
    async calculateBreakEvenPoint(productId, purchasePrice, logisticsCost, otherCosts, marketplaceId, categoryId) {
        var _a;
        const marketplace = types_1.MARKETPLACE_COMMISSIONS[marketplaceId];
        if (!marketplace) {
            throw new Error(`Неизвестный маркетплейс: ${marketplaceId}`);
        }
        const baseCommission = marketplace.base;
        const categoryMultiplier = ((_a = marketplace.categoryMultiplier) === null || _a === void 0 ? void 0 : _a[categoryId]) || 0;
        const commissionRate = (baseCommission / 100) * (1 + categoryMultiplier);
        // Точка безубыточности: Закупка + Логистика + Другие затраты / (1 - Комиссия)
        const totalFixedCosts = purchasePrice + logisticsCost + otherCosts;
        return totalFixedCosts / (1 - commissionRate);
    }
    /**
     * Сравнение доходности между маркетплейсами
     */
    async compareMarketplaces(productId, purchasePrice, logisticsCost, otherCosts, sellingPrice, categoryId) {
        var _a;
        const results = [];
        for (const [marketplaceId, commission] of Object.entries(types_1.MARKETPLACE_COMMISSIONS)) {
            const categoryMultiplier = ((_a = commission.categoryMultiplier) === null || _a === void 0 ? void 0 : _a[categoryId]) || 0;
            const commissionAmount = sellingPrice * (commission.base / 100) * (1 + categoryMultiplier);
            const revenue = sellingPrice - commissionAmount - logisticsCost - otherCosts;
            const profit = revenue - purchasePrice;
            const profitability = (profit / sellingPrice) * 100;
            const roi = (profit / purchasePrice) * 100;
            results.push({
                marketplaceId,
                marketplaceName: this.getMarketplaceName(marketplaceId),
                commission: Number(commissionAmount.toFixed(2)),
                profit: Number(profit.toFixed(2)),
                profitability: Number(profitability.toFixed(2)),
                roi: Number(roi.toFixed(2))
            });
        }
        return results;
    }
    /**
     * Получение названия маркетплейса
     */
    getMarketplaceName(id) {
        const names = {
            'wb': 'Wildberries',
            'ozon': 'Ozon',
            'yandex': 'Yandex Market'
        };
        return names[id] || id;
    }
    /**
     * Получение статистики расчетов
     */
    async getCalculationStats() {
        const calculations = Array.from(this.calculations.values());
        if (calculations.length === 0) {
            return {
                totalCalculations: 0,
                averageProfitability: 0,
                averageRoi: 0,
                profitableCalculations: 0,
                unprofitableCalculations: 0
            };
        }
        const totalProfitability = calculations.reduce((sum, calc) => sum + calc.result.profitability, 0);
        const totalRoi = calculations.reduce((sum, calc) => sum + calc.result.roi, 0);
        const profitableCalculations = calculations.filter(calc => calc.result.profit > 0).length;
        const unprofitableCalculations = calculations.filter(calc => calc.result.profit <= 0).length;
        return {
            totalCalculations: calculations.length,
            averageProfitability: Number((totalProfitability / calculations.length).toFixed(2)),
            averageRoi: Number((totalRoi / calculations.length).toFixed(2)),
            profitableCalculations,
            unprofitableCalculations
        };
    }
}
exports.CalculationService = CalculationService;
//# sourceMappingURL=CalculationService.js.map