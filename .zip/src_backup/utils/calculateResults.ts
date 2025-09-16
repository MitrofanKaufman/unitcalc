export interface CalculatorResultData {
  Q: number;
  revenue: number;
  commission: number;
  deliveryWBAdjusted: number;
  tax: number;
  investPerUnit: number;
  profitPerUnit: number;
  profitTotal: number;
  ROI: number;
  marginPercent: number;
  priceMin: number;
  maxDiscount: number;
  breakEvenPoint: number;
}

export function calculateResults(data: CalculatorFormData): CalculatorResultData {
  const {
    price: P,
    cost: C,
    commissionPercent: p_WB,
    deliveryFromProducer: L_prod,
    packaging: U,
    deliveryToMP: L_market,
    fulfillment: F,
    deliveryToWB: L_WB,
    defectPercent: D,
    storageCost,
    buyoutPercent: Y,
    taxRate: T,
    taxMode,
    additionalExpenses: R,
    investments: Inv_total,
  } = data;

  const Q = Inv_total / C;
  const K_WB = P * (p_WB / 100);
  const L_WB_adj = L_WB / (Y / 100);
  const revenue = P * Q * (Y / 100);

  let tax = 0;
  const expenses = Q * (C + L_prod + U + L_market + F + K_WB + L_WB_adj);
  if (taxMode === "income") {
    tax = P * Q * (T / 100);
  } else {
    tax = (revenue - expenses) * (T / 100);
  }

  const investPerUnit = C + L_prod + U + L_market + F + K_WB + L_WB_adj + (R + tax) / Q;
  const profitPerUnit = (P * (Y / 100)) - investPerUnit;
  const profitTotal = profitPerUnit * Q;
  const ROI = (profitPerUnit / investPerUnit) * 100;
  const marginPercent = (profitPerUnit / (P * (Y / 100))) * 100;
  const priceMin = investPerUnit / ((Y / 100) * (1 - p_WB / 100));
  const maxDiscount = ((P - priceMin) / P) * 100;
  const breakEvenPoint = Inv_total / profitPerUnit;

  return {
    Q,
    revenue,
    commission: K_WB,
    deliveryWBAdjusted: L_WB_adj,
    tax,
    investPerUnit,
    profitPerUnit,
    profitTotal,
    ROI,
    marginPercent,
    priceMin,
    maxDiscount,
    breakEvenPoint,
  };
}
