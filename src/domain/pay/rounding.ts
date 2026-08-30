export const quantityToHundredths = (quantity: number): number =>
  Math.round(quantity * 100);

export const hundredthsToQuantity = (value: number): number => value / 100;

export const roundHalfUpProduct = (
  quantityHundredths: number,
  ratePence: number,
): number => Math.floor((quantityHundredths * ratePence + 50) / 100);

export const roundHalfUpOneAndAHalf = (ratePence: number): number =>
  Math.floor((ratePence * 3 + 1) / 2);
