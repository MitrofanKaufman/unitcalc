// packages/core/src/domain/value-objects/Currency.ts

import { z } from 'zod';

export const CurrencySchema = z.enum([
  'RUB', // Russian Ruble
  'USD', // US Dollar
  'EUR', // Euro
  'CNY', // Chinese Yuan
  'GBP', // British Pound
  'JPY', // Japanese Yen
  'KZT', // Kazakhstani Tenge
  'TRY'  // Turkish Lira
]);

export type Currency = z.infer<typeof CurrencySchema>;

// Exchange rates relative to RUB (as of knowledge cutoff)
const EXCHANGE_RATES: Record<Currency, number> = {
  RUB: 1,
  USD: 90,    // 1 USD = 90 RUB
  EUR: 95,    // 1 EUR = 95 RUB
  CNY: 12.5,  // 1 CNY = 12.5 RUB
  GBP: 110,   // 1 GBP = 110 RUB
  JPY: 0.6,   // 1 JPY = 0.6 RUB
  KZT: 0.2,   // 1 KZT = 0.2 RUB
  TRY: 3.0    // 1 TRY = 3.0 RUB
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
};
