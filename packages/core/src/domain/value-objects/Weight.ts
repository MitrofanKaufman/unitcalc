// \packages\core\src\domain\value-objects\Weight.ts
// Value Object для работы с весом

import { z } from 'zod';

/**
 * Единицы измерения веса
 */
export enum WeightUnit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  TON = 't',
  POUND = 'lb',
  OUNCE = 'oz'
}

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
const WEIGHT_CONVERSIONS: Record<WeightUnit, number> = {
  [WeightUnit.GRAM]: 1,
  [WeightUnit.KILOGRAM]: 1000,
  [WeightUnit.TON]: 1000000,
  [WeightUnit.POUND]: 453.592,
  [WeightUnit.OUNCE]: 28.3495
}

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

export class Weight implements IWeight {
  constructor(
    public readonly value: number,
    public readonly unit: WeightUnit
  ) {
    this.validate()
  }

  /**
   * Валидация бизнес-правил для веса
   */
  private validate(): void {
    if (this.value <= 0) {
      throw new Error('Вес должен быть положительным')
    }

    if (!Object.values(WeightUnit).includes(this.unit)) {
      throw new Error(`Неподдерживаемая единица веса: ${this.unit}`)
    }
  }

  /**
   * Конвертация в граммы
   */
  toGrams(): number {
    return this.value * WEIGHT_CONVERSIONS[this.unit]
  }

  /**
   * Конвертация в килограммы
   */
  toKilograms(): number {
    return this.toGrams() / 1000
  }

  /**
   * Конвертация в указанную единицу
   */
  convertTo(targetUnit: WeightUnit): Weight {
    if (this.unit === targetUnit) {
      return new Weight(this.value, targetUnit)
    }

    const grams = this.toGrams()
    const targetValue = grams / WEIGHT_CONVERSIONS[targetUnit]

    return new Weight(targetValue, targetUnit)
  }

  /**
   * Сложение весов (только одинаковые единицы)
   */
  add(other: Weight): Weight {
    if (this.unit !== other.unit) {
      throw new Error('Нельзя складывать вес в разных единицах')
    }

    return new Weight(this.value + other.value, this.unit)
  }

  /**
   * Вычитание весов
   */
  subtract(other: Weight): Weight {
    if (this.unit !== other.unit) {
      throw new Error('Нельзя вычитать вес в разных единицах')
    }

    const result = this.value - other.value
    if (result <= 0) {
      throw new Error('Результат вычитания должен быть положительным')
    }

    return new Weight(result, this.unit)
  }

  /**
   * Умножение веса на число
   */
  multiply(factor: number): Weight {
    if (factor < 0) {
      throw new Error('Множитель должен быть положительным')
    }

    return new Weight(this.value * factor, this.unit)
  }

  /**
   * Сравнение весов
   */
  equals(other: Weight): boolean {
    try {
      const otherInThisUnit = other.convertTo(this.unit)
      return Math.abs(this.value - otherInThisUnit.value) < 0.001
    } catch {
      return false
    }
  }

  /**
   * Проверка больше ли вес
   */
  isGreaterThan(other: Weight): boolean {
    try {
      const otherInGrams = other.toGrams()
      return this.toGrams() > otherInGrams
    } catch {
      return false
    }
  }

  /**
   * Форматирование для отображения
   */
  format(): string {
    const formatter = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    })

    return `${formatter.format(this.value)} ${this.unit}`
  }

  /**
   * Конвертация в тонны
   */
  toTons(): number {
    return this.toGrams() / 1000000
  }

  /**
   * Конвертация в фунты
   */
  toPounds(): number {
    return this.toGrams() / 453.592
  }

  /**
   * Конвертация в унции
   */
  toOunces(): number {
    return this.toGrams() / 28.3495
  }

  /**
   * Проверка меньше ли вес
   */
  isLessThan(other: Weight): boolean {
    try {
      const otherInGrams = other.toGrams()
      return this.toGrams() < otherInGrams
    } catch {
      return false
    }
  }

  /**
   * Деление веса на число
   */
  divide(divisor: number): Weight {
    if (divisor <= 0) {
      throw new Error('Делитель должен быть положительным числом');
    }

    return new Weight(this.value / divisor, this.unit);
  }
}
