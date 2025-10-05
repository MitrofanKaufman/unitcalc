// \packages\core\src\domain\value-objects\Weight.ts
// Value Object для работы с весом
import { z } from 'zod';
/**
 * Единицы измерения веса
 */
export var WeightUnit;
(function (WeightUnit) {
    WeightUnit["GRAM"] = "g";
    WeightUnit["KILOGRAM"] = "kg";
    WeightUnit["TON"] = "t";
    WeightUnit["POUND"] = "lb";
    WeightUnit["OUNCE"] = "oz";
})(WeightUnit || (WeightUnit = {}));
/**
 * Схема валидации для Weight
 */
export const WeightSchema = z.object({
    value: z.number().positive('Вес должен быть положительным числом'),
    unit: z.nativeEnum(WeightUnit, {
        errorMap: () => ({ message: 'Неподдерживаемая единица веса' })
    })
}).transform((data) => new Weight(data.value, data.unit));
/**
 * Коэффициенты конвертации в граммы
 */
const WEIGHT_CONVERSIONS = {
    [WeightUnit.GRAM]: 1,
    [WeightUnit.KILOGRAM]: 1000,
    [WeightUnit.TON]: 1000000,
    [WeightUnit.POUND]: 453.592,
    [WeightUnit.OUNCE]: 28.3495
};
export class Weight {
    constructor(value, unit) {
        this.value = value;
        this.unit = unit;
        this.validate();
    }
    /**
     * Валидация бизнес-правил для веса
     */
    validate() {
        if (this.value <= 0) {
            throw new Error('Вес должен быть положительным');
        }
        if (!Object.values(WeightUnit).includes(this.unit)) {
            throw new Error(`Неподдерживаемая единица веса: ${this.unit}`);
        }
    }
    /**
     * Конвертация в граммы
     */
    toGrams() {
        return this.value * WEIGHT_CONVERSIONS[this.unit];
    }
    /**
     * Конвертация в килограммы
     */
    toKilograms() {
        return this.toGrams() / 1000;
    }
    /**
     * Конвертация в указанную единицу
     */
    convertTo(targetUnit) {
        if (this.unit === targetUnit) {
            return new Weight(this.value, targetUnit);
        }
        const grams = this.toGrams();
        const targetValue = grams / WEIGHT_CONVERSIONS[targetUnit];
        return new Weight(targetValue, targetUnit);
    }
    /**
     * Сложение весов (только одинаковые единицы)
     */
    add(other) {
        if (this.unit !== other.unit) {
            throw new Error('Нельзя складывать вес в разных единицах');
        }
        return new Weight(this.value + other.value, this.unit);
    }
    /**
     * Вычитание весов
     */
    subtract(other) {
        if (this.unit !== other.unit) {
            throw new Error('Нельзя вычитать вес в разных единицах');
        }
        const result = this.value - other.value;
        if (result <= 0) {
            throw new Error('Результат вычитания должен быть положительным');
        }
        return new Weight(result, this.unit);
    }
    /**
     * Умножение веса на число
     */
    multiply(factor) {
        if (factor < 0) {
            throw new Error('Множитель должен быть положительным');
        }
        return new Weight(this.value * factor, this.unit);
    }
    /**
     * Сравнение весов
     */
    equals(other) {
        try {
            const otherInThisUnit = other.convertTo(this.unit);
            return Math.abs(this.value - otherInThisUnit.value) < 0.001;
        }
        catch {
            return false;
        }
    }
    /**
     * Проверка больше ли вес
     */
    isGreaterThan(other) {
        try {
            const otherInGrams = other.toGrams();
            return this.toGrams() > otherInGrams;
        }
        catch {
            return false;
        }
    }
    /**
     * Форматирование для отображения
     */
    format() {
        const formatter = new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        });
        return `${formatter.format(this.value)} ${this.unit}`;
    }
    /**
     * Конвертация в тонны
     */
    toTons() {
        return this.toGrams() / 1000000;
    }
    /**
     * Конвертация в фунты
     */
    toPounds() {
        return this.toGrams() / 453.592;
    }
    /**
     * Конвертация в унции
     */
    toOunces() {
        return this.toGrams() / 28.3495;
    }
    /**
     * Проверка меньше ли вес
     */
    isLessThan(other) {
        try {
            const otherInGrams = other.toGrams();
            return this.toGrams() < otherInGrams;
        }
        catch {
            return false;
        }
    }
    /**
     * Деление веса на число
     */
    divide(divisor) {
        if (divisor <= 0) {
            throw new Error('Делитель должен быть положительным числом');
        }
        return new Weight(this.value / divisor, this.unit);
    }
}
