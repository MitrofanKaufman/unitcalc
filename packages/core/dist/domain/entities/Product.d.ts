import { z } from 'zod';
import { ProductCost } from './ProductCost';
import { Weight } from '../value-objects/Weight';
import { Money } from '../value-objects/Money';
/**
 * Интерфейс для Product
 */
interface IProduct {
    id: string;
    name: string;
    sku?: string;
    description?: string;
    category?: string;
    basePrice: Money;
    cost: ProductCost;
    weight: Weight;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'mm' | 'cm' | 'm' | 'in' | 'ft';
    };
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Схема валидации для Product
 */
export declare const ProductSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    sku: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    basePrice: z.ZodEffects<z.ZodObject<{
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
    cost: z.ZodEffects<z.ZodObject<{
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
    dimensions: z.ZodOptional<z.ZodObject<{
        length: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        unit: z.ZodDefault<z.ZodEnum<["mm", "cm", "m", "in", "ft"]>>;
    }, "strip", z.ZodTypeAny, {
        length: number;
        unit: "mm" | "cm" | "m" | "in" | "ft";
        width: number;
        height: number;
    }, {
        length: number;
        width: number;
        height: number;
        unit?: "mm" | "cm" | "m" | "in" | "ft" | undefined;
    }>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    basePrice: Money;
    weight: Weight;
    cost: ProductCost;
    createdAt: Date;
    updatedAt: Date;
    sku?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    dimensions?: {
        length: number;
        unit: "mm" | "cm" | "m" | "in" | "ft";
        width: number;
        height: number;
    } | undefined;
    images?: string[] | undefined;
}, {
    id: string;
    name: string;
    basePrice: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    weight: {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    };
    cost: {
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
    };
    sku?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit?: "mm" | "cm" | "m" | "in" | "ft" | undefined;
    } | undefined;
    images?: string[] | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>, {
    weight: Weight;
    basePrice: Money;
    id: string;
    name: string;
    cost: ProductCost;
    createdAt: Date;
    updatedAt: Date;
    sku?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    dimensions?: {
        length: number;
        unit: "mm" | "cm" | "m" | "in" | "ft";
        width: number;
        height: number;
    } | undefined;
    images?: string[] | undefined;
}, {
    id: string;
    name: string;
    basePrice: {
        amount: number;
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
    };
    weight: {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    };
    cost: {
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
    };
    sku?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit?: "mm" | "cm" | "m" | "in" | "ft" | undefined;
    } | undefined;
    images?: string[] | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
/**
 * Класс для представления товара
 */
export declare class Product implements IProduct {
    readonly id: string;
    readonly name: string;
    readonly sku?: string;
    readonly description?: string;
    readonly category?: string;
    readonly basePrice: Money;
    readonly cost: ProductCost;
    readonly weight: Weight;
    readonly dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'mm' | 'cm' | 'm' | 'in' | 'ft';
    };
    readonly images?: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(data: Omit<IProduct, 'createdAt' | 'updatedAt'>);
    /**
     * Валидация данных товара
     */
    private validate;
    /**
     * Обновление данных товара
     */
    update(updates: Partial<Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>>): Product;
}
export {};
//# sourceMappingURL=Product.d.ts.map