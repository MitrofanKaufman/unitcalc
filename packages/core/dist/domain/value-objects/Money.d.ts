/**
 * Валюты поддерживаемые системой
 */
export declare enum Currency {
    RUB = "RUB",
    USD = "USD",
    CNY = "CNY",
    EUR = "EUR"
}
/**
 * Курсы валют (базовые значения)
 */
export declare const DEFAULT_EXCHANGE_RATES: Record<string, number>;
/**
 * Value Object для представления денег
 */
export declare class Money {
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
     * Проверка больше ли сумма
     */
    isGreaterThan(other: Money): boolean;
    /**
     * Проверка меньше ли сумма
     */
    isLessThan(other: Money): boolean;
    /**
     * Форматирование для отображения
     */
    format(): string;
    /**
     * Получение суммы в копейках/центах
     */
    getMinorUnits(): number;
    /**
     * Создание из копеек/центов
     */
    static fromMinorUnits(minorUnits: number, currency: Currency): Money;
}
//# sourceMappingURL=Money.d.ts.map