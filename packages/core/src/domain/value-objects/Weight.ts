// \packages\core\src\domain\value-objects\Weight.ts
// Value Object для работы с весом

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
export class Weight {
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
   * Получение оптимальной единицы измерения для отображения
   */
  getOptimalUnit(): Weight {
    const grams = this.toGrams()

    if (grams >= 1000000) {
      return this.convertTo(WeightUnit.TON)
    } else if (grams >= 1000) {
      return this.convertTo(WeightUnit.KILOGRAM)
    } else if (grams >= 500) {
      return this.convertTo(WeightUnit.KILOGRAM)
    } else {
      return this.convertTo(WeightUnit.GRAM)
    }
  }
}
