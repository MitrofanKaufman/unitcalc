import { z } from 'zod';
/**
 * Единицы измерения веса
 */
export declare enum WeightUnit {
    GRAM = "g",
    KILOGRAM = "kg",
    TON = "t",
    POUND = "lb",
    OUNCE = "oz"
}
/**
 * Схема валидации для Weight
 */
export declare const WeightSchema: z.ZodEffects<z.ZodObject<{
    value: z.ZodNumber;
    unit: z.ZodNativeEnum<typeof WeightUnit>;
}, "strip", z.ZodTypeAny, {
    value: number;
    unit: WeightUnit;
}, {
    value: number;
    unit: WeightUnit;
}>, Weight, {
    value: number;
    unit: WeightUnit;
}>;
/**
 * Value Object для представления веса
 */
/**
 * Интерфейс для объекта Weight
 */
interface IWeight {
    value: number;
    unit: WeightUnit;
    toGrams(): number;
    toKilograms(): number;
    toTons(): number;
    toPounds(): number;
    toOunces(): number;
    convertTo(unit: WeightUnit): Weight;
    add(other: Weight): Weight;
    subtract(other: Weight): Weight;
    multiply(factor: number): Weight;
    divide(divisor: number): Weight;
    equals(other: Weight): boolean;
    isGreaterThan(other: Weight): boolean;
    isLessThan(other: Weight): boolean;
    format(precision?: number): string;
}
export declare class Weight implements IWeight {
    readonly value: number;
    readonly unit: WeightUnit;
    constructor(value: number, unit: WeightUnit);
    /**
     * Валидация бизнес-правил для веса
     */
    private validate;
    /**
     * Конвертация в граммы
     */
    toGrams(): number;
    /**
     * Конвертация в килограммы
     */
    toKilograms(): number;
    /**
     * Конвертация в указанную единицу
     */
    convertTo(targetUnit: WeightUnit): Weight;
    /**
     * Сложение весов (только одинаковые единицы)
     */
    add(other: Weight): Weight;
    /**
     * Вычитание весов
     */
    subtract(other: Weight): Weight;
    /**
     * Умножение веса на число
     */
    multiply(factor: number): Weight;
    /**
     * Сравнение весов
     */
    equals(other: Weight): boolean;
    /**
     * Проверка больше ли вес
     */
    isGreaterThan(other: Weight): boolean;
    /**
     * Форматирование для отображения
     */
    format(): string;
    /**
     * Конвертация в тонны
     */
    toTons(): number;
    /**
     * Конвертация в фунты
     */
    toPounds(): number;
    /**
     * Конвертация в унции
     */
    toOunces(): number;
    /**
     * Проверка меньше ли вес
     */
    isLessThan(other: Weight): boolean;
    /**
     * Деление веса на число
     */
    divide(divisor: number): Weight;
}
export {};
