// packages/core/src/domain/value-objects/Currency.ts

import { z } from 'zod';

/**
 * Поддерживаемые валюты
 */
export const Currency = {
  RUB: 'RUB', // Russian Ruble
  USD: 'USD', // US Dollar
  EUR: 'EUR', // Euro
  CNY: 'CNY', // Chinese Yuan
  GBP: 'GBP', // British Pound
  JPY: 'JPY', // Japanese Yen
  KZT: 'KZT', // Kazakhstani Tenge
  TRY: 'TRY'  // Turkish Lira
} as const;

export type Currency = keyof typeof Currency;

/**
 * Схема валидации для валюты
 */
export const CurrencySchema = z.nativeEnum(Currency, {
  errorMap: () => ({ message: 'Неподдерживаемая валюта' })
});

// Exchange rates relative to RUB (as of knowledge cutoff)
const EXCHANGE_RATES: Record<Currency, number> = {
  [Currency.RUB]: 1,
  [Currency.USD]: 90,    // 1 USD = 90 RUB
  [Currency.EUR]: 95,    // 1 EUR = 95 RUB
  [Currency.CNY]: 12.5,  // 1 CNY = 12.5 RUB
  [Currency.GBP]: 110,   // 1 GBP = 110 RUB
  [Currency.JPY]: 0.6,   // 1 JPY = 0.6 RUB
  [Currency.KZT]: 0.2,   // 1 KZT = 0.2 RUB
  [Currency.TRY]: 3.0    // 1 TRY = 3.0 RUB
};

export const CurrencyUtils = {
  convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;
    // Convert to RUB first, then to target currency
    const amountInRub = amount * EXCHANGE_RATES[from];
    return amountInRub / EXCHANGE_RATES[to];
  },
  
  format(amount: number, currency: Currency, locale = 'ru-RU'): string {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Fallback for non-standard currency codes
    try {
      return formatter.format(amount);
    } catch (e) {
      return `${amount.toFixed(2)} ${currency}`;
    }
    }
  }
