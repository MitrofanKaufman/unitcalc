// \packages\core\src\domain\value-objects\Money.ts
// Value Object для работы с деньгами

/**
 * Валюты поддерживаемые системой
 */
export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  CNY = 'CNY',
  EUR = 'EUR'
}

/**
 * Курсы валют (базовые значения)
 */
export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  'USD_RUB': 90,
  'CNY_RUB': 12.5,
  'EUR_RUB': 100
}

/**
 * Value Object для представления денег
 */
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {
    this.validate()
  }

  /**
   * Валидация бизнес-правил для денег
   */
  private validate(): void {
    if (this.amount < 0) {
      throw new Error('Сумма не может быть отрицательной')
    }

    if (!Object.values(Currency).includes(this.currency)) {
      throw new Error(`Неподдерживаемая валюта: ${this.currency}`)
    }
  }

  /**
   * Конвертация в другую валюту
   */
  convertTo(targetCurrency: Currency, exchangeRate?: number): Money {
    if (this.currency === targetCurrency) {
      return new Money(this.amount, targetCurrency)
    }

    const rate = exchangeRate || this.getExchangeRate(targetCurrency)
    const convertedAmount = this.amount * rate

    return new Money(convertedAmount, targetCurrency)
  }

  /**
   * Получение курса обмена
   */
  private getExchangeRate(targetCurrency: Currency): number {
    const rateKey = `${this.currency}_${targetCurrency}`
    const reverseRateKey = `${targetCurrency}_${this.currency}`

    if (DEFAULT_EXCHANGE_RATES[rateKey]) {
      return DEFAULT_EXCHANGE_RATES[rateKey]
    }

    if (DEFAULT_EXCHANGE_RATES[reverseRateKey]) {
      return 1 / DEFAULT_EXCHANGE_RATES[reverseRateKey]
    }

    throw new Error(`Курс обмена не найден: ${rateKey}`)
  }

  /**
   * Сложение денег (только одинаковая валюта)
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Нельзя складывать деньги разных валют')
    }

    return new Money(this.amount + other.amount, this.currency)
  }

  /**
   * Вычитание денег (только одинаковая валюта)
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Нельзя вычитать деньги разных валют')
    }

    const result = this.amount - other.amount
    if (result < 0) {
      throw new Error('Результат вычитания не может быть отрицательным')
    }

    return new Money(result, this.currency)
  }

  /**
   * Умножение на число
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Множитель не может быть отрицательным')
    }

    return new Money(this.amount * factor, this.currency)
  }

  /**
   * Деление на число
   */
  divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new Error('Делитель должен быть положительным')
    }

    return new Money(this.amount / divisor, this.currency)
  }

  /**
   * Сравнение с другой суммой
   */
  equals(other: Money): boolean {
    try {
      const otherInThisCurrency = other.convertTo(this.currency)
      return Math.abs(this.amount - otherInThisCurrency.amount) < 0.01 // Допуск 1 копейка
    } catch {
      return false
    }
  }

  /**
   * Проверка больше ли сумма
   */
  isGreaterThan(other: Money): boolean {
    try {
      const otherInThisCurrency = other.convertTo(this.currency)
      return this.amount > otherInThisCurrency.amount
    } catch {
      return false
    }
  }

  /**
   * Проверка меньше ли сумма
   */
  isLessThan(other: Money): boolean {
    try {
      const otherInThisCurrency = other.convertTo(this.currency)
      return this.amount < otherInThisCurrency.amount
    } catch {
      return false
    }
  }

  /**
   * Форматирование для отображения
   */
  format(): string {
    const formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

    return formatter.format(this.amount)
  }

  /**
   * Получение суммы в копейках/центах
   */
  getMinorUnits(): number {
    const minorUnitsPerUnit: Record<Currency, number> = {
      [Currency.RUB]: 100,
      [Currency.USD]: 100,
      [Currency.CNY]: 100,
      [Currency.EUR]: 100
    }

    return Math.round(this.amount * minorUnitsPerUnit[this.currency])
  }

  /**
   * Создание из копеек/центов
   */
  static fromMinorUnits(minorUnits: number, currency: Currency): Money {
    const minorUnitsPerUnit: Record<Currency, number> = {
      [Currency.RUB]: 100,
      [Currency.USD]: 100,
      [Currency.CNY]: 100,
      [Currency.EUR]: 100
    }

    const amount = minorUnits / minorUnitsPerUnit[currency]
    return new Money(amount, currency)
  }
}
