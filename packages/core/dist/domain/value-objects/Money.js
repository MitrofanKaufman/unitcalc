// \packages\core\src\domain\value-objects\Money.ts
// Value Object для работы с деньгами
import { z } from 'zod';
import { Currency, CurrencySchema } from './Currency';
/**
 * Схема валидации для Money
 */
export const MoneySchema = z.object({
    amount: z.number().min(0, 'Amount must be a positive number'),
    currency: CurrencySchema
}).transform((data) => new Money(data.amount, data.currency));
/**
 * Value Object для представления денег
 */
export class Money {
    constructor(amount, currency) {
        this.amount = amount;
        this.currency = currency;
        this.validate();
    }
    /**
     * Валидация бизнес-правил для денег
     */
    validate() {
        if (this.amount < 0) {
            throw new Error('Сумма не может быть отрицательной');
        }
        if (!Object.values(Currency).includes(this.currency)) {
            throw new Error(`Неподдерживаемая валюта: ${this.currency}`);
        }
    }
    /**
     * Конвертация в другую валюту
     */
    convertTo(targetCurrency, exchangeRate) {
        if (this.currency === targetCurrency) {
            return this;
        }
        const rate = exchangeRate || this.getExchangeRate(targetCurrency);
        const convertedAmount = this.amount * rate;
        return new Money(convertedAmount, targetCurrency);
    }
    /**
     * Получение курса обмена
     */
    getExchangeRate(targetCurrency) {
        const rateKey = `${this.currency}_${targetCurrency}`;
        const reverseRateKey = `${targetCurrency}_${this.currency}`;
        const rates = this.getExchangeRates();
        if (rates[rateKey]) {
            return rates[rateKey];
        }
        if (rates[reverseRateKey]) {
            return 1 / rates[reverseRateKey];
        }
        throw new Error(`Курс обмена не найден: ${rateKey}`);
    }
    /**
     * Получение курсов валют
     */
    getExchangeRates() {
        return {
            'USD_RUB': 90,
            'CNY_RUB': 12.5,
            'EUR_RUB': 100,
            'GBP_RUB': 110,
            'JPY_RUB': 0.6,
            'KZT_RUB': 0.2,
            'TRY_RUB': 3.0
        };
    }
    /**
     * Сложение денег (только одинаковая валюта)
     */
    add(other) {
        if (this.currency !== other.currency) {
            throw new Error('Нельзя складывать деньги разных валют');
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    /**
     * Вычитание денег (только одинаковая валюта)
     */
    subtract(other) {
        if (this.currency !== other.currency) {
            throw new Error('Нельзя вычитать деньги разных валют');
        }
        const result = this.amount - other.amount;
        if (result < 0) {
            throw new Error('Результат вычитания не может быть отрицательным');
        }
        return new Money(result, this.currency);
    }
    /**
     * Умножение на число
     */
    multiply(factor) {
        if (factor < 0) {
            throw new Error('Множитель не может быть отрицательным');
        }
        return new Money(this.amount * factor, this.currency);
    }
    /**
     * Деление на число
     */
    divide(divisor) {
        if (divisor <= 0) {
            throw new Error('Делитель должен быть положительным числом');
        }
        return new Money(this.amount / divisor, this.currency);
    }
    /**
     * Сравнение с другой суммой
     */
    equals(other) {
        return (this.amount === other.amount &&
            this.currency === other.currency);
    }
    /**
     * Проверка, больше ли сумма
     */
    isGreaterThan(other) {
        if (this.currency !== other.currency) {
            throw new Error('Нельзя сравнивать деньги разных валют');
        }
        return this.amount > other.amount;
    }
    /**
     * Проверка, меньше ли сумма
     */
    isLessThan(other) {
        if (this.currency !== other.currency) {
            throw new Error('Нельзя сравнивать деньги разных валют');
        }
        return this.amount < other.amount;
    }
    /**
     * Форматирование для отображения
     */
    format(locale = 'ru-RU') {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: this.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        try {
            return formatter.format(this.amount);
        }
        catch (e) {
            return `${this.amount.toFixed(2)} ${this.currency}`;
        }
    }
    /**
     * Получение суммы в копейках/центах
     */
    getMinorUnits() {
        // Для валют без копеек/центов (например, японская иена)
        const minorUnitMultipliers = {
            [Currency.RUB]: 100,
            [Currency.USD]: 100,
            [Currency.EUR]: 100,
            [Currency.CNY]: 100,
            [Currency.GBP]: 100,
            [Currency.JPY]: 1, // Иена не имеет копеек
            [Currency.KZT]: 100,
            [Currency.TRY]: 100
        };
        const multiplier = minorUnitMultipliers[this.currency] || 100;
        return Math.round(this.amount * multiplier);
    }
    /**
     * Создание из копеек/центов
     */
    static fromMinorUnits(minorUnits, currency) {
        // Для валют без копеек/центов (например, японская иена)
        const minorUnitDivisors = {
            [Currency.RUB]: 100,
            [Currency.USD]: 100,
            [Currency.EUR]: 100,
            [Currency.CNY]: 100,
            [Currency.GBP]: 100,
            [Currency.JPY]: 1, // Иена не имеет копеек
            [Currency.KZT]: 100,
            [Currency.TRY]: 100
        };
        const divisor = minorUnitDivisors[currency] || 100;
        const amount = minorUnits / divisor;
        return new Money(amount, currency);
    }
}
