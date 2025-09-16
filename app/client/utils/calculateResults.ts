// app/client/utils/calculateResults.ts
// Утилита для выполнения расчетов рентабельности

interface CalculationInput {
  price: number;
  costPrice: number;
  commission: number;
  logisticsCost: number;
  storageCost: number;
  vat: number;
}

interface CalculationOutput {
  profit: number;
  profitMargin: number;
  breakEvenPoint: number;
}

export function calculateResults(input: CalculationInput): CalculationOutput {
  const { price, costPrice, commission, logisticsCost, storageCost, vat } = input;

  const commissionAmount = price * (commission / 100);
  const vatAmount = price * (vat / 100);
  const totalCosts = costPrice + commissionAmount + logisticsCost + storageCost + vatAmount;

  const profit = price - totalCosts;
  const profitMargin = (profit / price) * 100;
  const breakEvenPoint = totalCosts;

  return {
    profit: parseFloat(profit.toFixed(2)),
    profitMargin: parseFloat(profitMargin.toFixed(2)),
    breakEvenPoint: parseFloat(breakEvenPoint.toFixed(2)),
  };
}
