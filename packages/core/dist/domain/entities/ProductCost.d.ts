import { z } from 'zod';
import { Money } from '../value-objects/Money';
import { Weight } from '../value-objects/Weight';
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
export declare const ProductCostSchema: z.ZodEffects<z.ZodObject<{
    purchasePrice: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    sellingPrice: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    shippingCost: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    customsDuty: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    marketplaceCommission: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    marketingCosts: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    photographyCosts: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    packagingCosts: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    otherCosts: z.ZodEffects<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodNativeEnum<{
            readonly RUB: "RUB";
            readonly USD: "USD";
            readonly EUR: "EUR";
            readonly CNY: "CNY";
            readonly GBP: "GBP";
            readonly JPY: "JPY";
            readonly KZT: "KZT";
            readonly TRY: "TRY";
        }>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>, Money, {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    }>;
    weight: z.ZodEffects<z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodNativeEnum<typeof import("../value-objects/Weight").WeightUnit>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    }, {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    }>, Weight, {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    }>;
}, "strip", z.ZodTypeAny, {
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
}, {
    purchasePrice: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    sellingPrice: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    shippingCost: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    customsDuty: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    marketplaceCommission: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    marketingCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    photographyCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    packagingCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    otherCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    weight: {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    };
}>, ProductCost, {
    purchasePrice: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    sellingPrice: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    shippingCost: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    customsDuty: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    marketplaceCommission: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    marketingCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    photographyCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    packagingCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    otherCosts: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    weight: {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    };
}>;
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
export declare class ProductCost implements IProductCost {
    readonly purchasePrice: Money;
    readonly sellingPrice: Money;
    readonly weight: Weight;
    readonly shippingCost: Money;
    readonly customsDuty: Money;
    readonly marketplaceCommission: Money;
    readonly marketingCosts: Money;
    readonly photographyCosts: Money;
    readonly packagingCosts: Money;
    readonly otherCosts: Money;
    constructor({ purchasePrice, sellingPrice, weight, shippingCost, customsDuty, marketplaceCommission, marketingCosts, photographyCosts, packagingCosts, otherCosts }: ProductCostParams);
    /**
     * Получение общей стоимости закупки
     */
    getTotalPurchaseCost(): Money;
    /**
     * Получение общей стоимости продажи
     */
    getTotalSellingCost(): Money;
    /**
     * Расчет прибыли
     */
    calculateProfit(): Money;
    /**
     * Расчет маржи (%)
     */
    calculateMargin(): number;
    /**
     * Расчет рентабельности (ROI %)
     */
    calculateROI(salesCount?: number): number;
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
export {};
//# sourceMappingURL=ProductCost.d.ts.map