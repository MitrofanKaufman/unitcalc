import { z } from 'zod';
/**
 * Поддерживаемые валюты
 */
export declare const Currency: {
    readonly RUB: "RUB";
    readonly USD: "USD";
    readonly EUR: "EUR";
    readonly CNY: "CNY";
    readonly GBP: "GBP";
    readonly JPY: "JPY";
    readonly KZT: "KZT";
    readonly TRY: "TRY";
};
export type Currency = keyof typeof Currency;
/**
 * Схема валидации для валюты
 */
export declare const CurrencySchema: z.ZodNativeEnum<{
    readonly RUB: "RUB";
    readonly USD: "USD";
    readonly EUR: "EUR";
    readonly CNY: "CNY";
    readonly GBP: "GBP";
    readonly JPY: "JPY";
    readonly KZT: "KZT";
    readonly TRY: "TRY";
}>;
export declare const CurrencyUtils: {
    convert(amount: number, from: Currency, to: Currency): number;
    format(amount: number, currency: Currency, locale?: string): string;
};
//# sourceMappingURL=Currency.d.ts.map