import { catalogById, planId, type CatalogEntry } from "@/data/catalog";
import { planItemById, type PlanItem } from "@/data/plans";
import { currency, formatPrice } from "@/lib/currency";

/**
 * The cart, as stored: catalog ids plus "sin:<planItemId>" tokens for items
 * taken out of a plan. Shared by the browser cart (CartProvider) and the
 * server (/api/notify), so an order is always priced from the catalog —
 * never from anything the browser sends.
 */
export const REMOVED = "sin:";

export function isValidToken(x: unknown): x is string {
  if (typeof x !== "string") return false;
  if (x.startsWith(REMOVED)) return x.slice(REMOVED.length) in planItemById;
  return x in catalogById;
}

/** The plan a removed-item token belongs to, as a cart id. */
export const tokenPlan = (x: string) => planId(planItemById[x.slice(REMOVED.length)].planId);

/** A cart line. A customized plan carries the items taken out, already deducted from its price. */
export type CartItem = CatalogEntry & { removed?: PlanItem[] };

export function cartItems(tokens: string[]): CartItem[] {
  const valid = tokens.filter(isValidToken);
  const removed = valid.filter((x) => x.startsWith(REMOVED));
  return [...new Set(valid.filter((x) => !x.startsWith(REMOVED)))].map((id) => {
    const entry = catalogById[id];
    const out = removed.filter((x) => tokenPlan(x) === id).map((x) => planItemById[x.slice(REMOVED.length)]);
    if (entry.kind !== "plan" || !out.length || entry.price === undefined) return entry;
    const price = Math.round((entry.price - out.reduce((sum, r) => sum + r.price, 0)) * 100) / 100;
    return { ...entry, price: Math.max(0, price), removed: out };
  });
}

export function cartTotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, i) => sum + (i.price ?? 0), 0) * 100) / 100;
}

/** One line per item, e.g. "Asher Origin — $2.237,25 (sin: Meta Ads básico)". */
export function orderLines(items: CartItem[]): string[] {
  return items.map((i) => {
    const price = i.price === undefined ? "a cotizar" : formatPrice({ ...i, price: i.price });
    const removed = i.removed?.length ? ` (sin: ${i.removed.map((r) => r.title).join(", ")})` : "";
    return `${i.title} — ${price}${removed}`;
  });
}

/** Plain-text order summary. */
export function orderText(items: CartItem[]): string {
  const hasQuote = items.some((i) => i.price === undefined);
  return `${orderLines(items).join("\n")}\nTotal: ${currency.format(cartTotal(items))} + IVA${hasQuote ? " (+ plan a cotizar)" : ""}`;
}
