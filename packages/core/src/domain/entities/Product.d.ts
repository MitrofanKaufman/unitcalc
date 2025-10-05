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
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
        amount: number;
    }, {
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
        amount: number;
    }>, Money, {
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
        amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        }>, Money, {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
        weight: Weight;
        purchasePrice: Money;
        otherCosts: Money;
        sellingPrice: Money;
        shippingCost: Money;
        customsDuty: Money;
        marketplaceCommission: Money;
        marketingCosts: Money;
        photographyCosts: Money;
        packagingCosts: Money;
    }, {
        weight: {
            value: number;
            unit: import("../value-objects/Weight").WeightUnit;
        };
        purchasePrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        otherCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        sellingPrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        shippingCost: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        customsDuty: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketplaceCommission: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        photographyCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        packagingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
    }>, ProductCost, {
        weight: {
            value: number;
            unit: import("../value-objects/Weight").WeightUnit;
        };
        purchasePrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        otherCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        sellingPrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        shippingCost: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        customsDuty: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketplaceCommission: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        photographyCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        packagingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
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
        width: number;
        height: number;
        length: number;
        unit: "m" | "in" | "cm" | "mm" | "ft";
    }, {
        width: number;
        height: number;
        length: number;
        unit?: "m" | "in" | "cm" | "mm" | "ft" | undefined;
    }>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    weight: Weight;
    basePrice: Money;
    cost: ProductCost;
    createdAt: Date;
    updatedAt: Date;
    category?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
        length: number;
        unit: "m" | "in" | "cm" | "mm" | "ft";
    } | undefined;
    sku?: string | undefined;
    description?: string | undefined;
    images?: string[] | undefined;
}, {
    id: string;
    name: string;
    weight: {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    };
    basePrice: {
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
        amount: number;
    };
    cost: {
        weight: {
            value: number;
            unit: import("../value-objects/Weight").WeightUnit;
        };
        purchasePrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        otherCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        sellingPrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        shippingCost: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        customsDuty: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketplaceCommission: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        photographyCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        packagingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
    };
    category?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
        length: number;
        unit?: "m" | "in" | "cm" | "mm" | "ft" | undefined;
    } | undefined;
    sku?: string | undefined;
    description?: string | undefined;
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
    category?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
        length: number;
        unit: "m" | "in" | "cm" | "mm" | "ft";
    } | undefined;
    sku?: string | undefined;
    description?: string | undefined;
    images?: string[] | undefined;
}, {
    id: string;
    name: string;
    weight: {
        value: number;
        unit: import("../value-objects/Weight").WeightUnit;
    };
    basePrice: {
        currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
        amount: number;
    };
    cost: {
        weight: {
            value: number;
            unit: import("../value-objects/Weight").WeightUnit;
        };
        purchasePrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        otherCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        sellingPrice: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        shippingCost: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        customsDuty: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketplaceCommission: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        marketingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        photographyCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
        packagingCosts: {
            currency: "RUB" | "USD" | "EUR" | "CNY" | "GBP" | "JPY" | "KZT" | "TRY";
            amount: number;
        };
    };
    category?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
        length: number;
        unit?: "m" | "in" | "cm" | "mm" | "ft" | undefined;
    } | undefined;
    sku?: string | undefined;
    description?: string | undefined;
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
