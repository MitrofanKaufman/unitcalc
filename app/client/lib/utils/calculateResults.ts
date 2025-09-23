/**
 * Calculates the results based on the input values
 * @param input - The input values for calculation
 * @returns The calculated results
 */
export function calculateResults(input: {
  price: number;
  quantity: number;
  cost: number;
  taxRate: number;
  discount: number;
}) {
  const { price, quantity, cost, taxRate, discount } = input;
  
  // Calculate subtotal
  const subtotal = price * quantity;
  
  // Calculate discount amount
  const discountAmount = subtotal * (discount / 100);
  
  // Calculate subtotal after discount
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  // Calculate tax amount
  const taxAmount = subtotalAfterDiscount * (taxRate / 100);
  
  // Calculate total
  const total = subtotalAfterDiscount + taxAmount;
  
  // Calculate profit
  const profit = total - cost * quantity;
  
  // Calculate profit margin
  const profitMargin = total > 0 ? (profit / total) * 100 : 0;
  
  return {
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    total,
    profit,
    profitMargin,
  };
}
