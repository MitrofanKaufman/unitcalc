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
 * Value Object для представления веса
 */
export declare class Weight {
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
     * Получение оптимальной единицы измерения для отображения
     */
    getOptimalUnit(): Weight;
}
//# sourceMappingURL=Weight.d.ts.map