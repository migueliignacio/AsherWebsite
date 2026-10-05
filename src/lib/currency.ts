const whole = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const cents = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** USD; cents only when the amount has them ($100 vs $391,25). */
export const currency = {
  format: (amount: number) => (Number.isInteger(amount) ? whole : cents).format(amount),
};

/** A catalog price with its context: "desde $50", "$100 /mes". */
export function formatPrice({ price, unit, priceFrom }: { price: number; unit?: string; priceFrom?: boolean }) {
  return `${priceFrom ? "desde " : ""}${currency.format(price)}${unit ? ` /${unit}` : ""}`;
}
