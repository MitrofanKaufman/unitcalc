import { z } from 'zod';
import { Currency } from './Currency';
/**
 * Интерфейс для объекта Money
 */
interface IMoney {
    amount: number;
    currency: Currency;
    convertTo(targetCurrency: Currency, exchangeRate?: number): Money;
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    divide(divisor: number): Money;
    equals(other: Money): boolean;
    isGreaterThan(other: Money): boolean;
    isLessThan(other: Money): boolean;
    format(locale?: string): string;
    getMinorUnits(): number;
}
/**
 * Схема валидации для Money
 */
export declare const MoneySchema: z.ZodEffects<z.ZodObject<{
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
/**
 * Value Object для представления денег
 */
export declare class Money implements IMoney {
    readonly amount: number;
    readonly currency: Currency;
    constructor(amount: number, currency: Currency);
    /**
     * Валидация бизнес-правил для денег
     */
    private validate;
    /**
     * Конвертация в другую валюту
     */
    convertTo(targetCurrency: Currency, exchangeRate?: number): Money;
    /**
     * Получение курса обмена
     */
    private getExchangeRate;
    /**
     * Получение курсов валют
     */
    private getExchangeRates;
    /**
     * Сложение денег (только одинаковая валюта)
     */
    add(other: Money): Money;
    /**
     * Вычитание денег (только одинаковая валюта)
     */
    subtract(other: Money): Money;
    /**
     * Умножение на число
     */
    multiply(factor: number): Money;
    /**
     * Деление на число
     */
    divide(divisor: number): Money;
    /**
     * Сравнение с другой суммой
     */
    equals(other: Money): boolean;
    /**
     * Проверка, больше ли сумма
     */
    isGreaterThan(other: Money): boolean;
    /**
     * Проверка, меньше ли сумма
     */
    isLessThan(other: Money): boolean;
    /**
     * Форматирование для отображения
     */
    format(locale?: string): string;
    /**
     * Получение суммы в копейках/центах
     */
    getMinorUnits(): number;
    /**
     * Создание из копеек/центов
     */
    static fromMinorUnits(minorUnits: number, currency: Currency): Money;
}
export {};
//# sourceMappingURL=Money.d.ts.map