"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { catalogById, planId, type CatalogEntry } from "@/data/catalog";
import { planItemById, type PlanItem } from "@/data/plans";
import { currency, formatPrice } from "@/lib/currency";

// The cart stores only catalog ids (plus "sin:<planItemId>" tokens for items
// taken out of a plan) in localStorage; titles and prices are always resolved
// from the catalog, so they can't go stale or be tampered with.
const STORAGE_KEY = "asher-cart";
const EMPTY: string[] = [];
/** Prefix of a token meaning "this plan item was taken out of its plan". */
const REMOVED = "sin:";

let memoryRaw: string | null = null;
let storageOk = true;
let cache: { raw: string | null; ids: string[] } = { raw: null, ids: EMPTY };
const listeners = new Set<() => void>();

function readRaw(): string | null {
  if (storageOk) {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      storageOk = false;
    }
  }
  return memoryRaw;
}

function writeRaw(raw: string) {
  memoryRaw = raw;
  if (storageOk) {
    try {
      window.localStorage.setItem(STORAGE_KEY, raw);
    } catch {
      storageOk = false;
    }
  }
}

function isValidToken(x: unknown): x is string {
  if (typeof x !== "string") return false;
  if (x.startsWith(REMOVED)) return x.slice(REMOVED.length) in planItemById;
  return x in catalogById;
}

function getIds(): string[] {
  const raw = readRaw();
  if (raw === cache.raw) return cache.ids;
  let ids = EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(isValidToken);
      if (valid.length) ids = valid;
    }
  } catch {
    // corrupted storage: start from an empty cart
  }
  cache = { raw, ids };
  return ids;
}

function setIds(ids: string[]) {
  writeRaw(JSON.stringify(ids));
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

const getServerIds = () => EMPTY;

const isPlanToken = (x: string) => x.startsWith(REMOVED) || catalogById[x]?.kind === "plan";

/** The plan a removed-item token belongs to, as a cart id. */
const tokenPlan = (x: string) => planId(planItemById[x.slice(REMOVED.length)].planId);

/** Drops a plan from the id list together with its removed-item tokens. */
function withoutPlan(ids: string[], cartPlanId: string): string[] {
  return ids.filter((x) => x !== cartPlanId && !(x.startsWith(REMOVED) && tokenPlan(x) === cartPlanId));
}

/** A cart line. A customized plan carries the items taken out, already deducted from its price. */
export type CartItem = CatalogEntry & { removed?: PlanItem[] };

interface CartContextValue {
  items: CartItem[];
  count: number;
  /** Sum of the priced items. */
  total: number;
  /** True when the cart holds something without a price yet (a plan). */
  hasQuote: boolean;
  has: (id: string) => boolean;
  /** Adds or removes. Only one plan can be in the cart: adding another replaces it. */
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Whether a plan item has been taken out of its plan. */
  isRemoved: (planItemId: string) => boolean;
  /** Takes a plan item out (or puts it back); puts that plan in the cart if it isn't. */
  togglePlanItem: (planItemId: string) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

/** Plain-text order summary, prefilled into the contact form at checkout. */
export function cartMessage(items: CartItem[], total: number, hasQuote: boolean) {
  const lines = items.map((i) => {
    const price = i.price === undefined ? "a cotizar" : formatPrice({ ...i, price: i.price });
    const removed = i.removed?.length ? `, sin: ${i.removed.map((r) => r.title).join(", ")}` : "";
    return `${i.title} (${price}${removed})`;
  });
  const suffix = hasQuote ? " + plan a cotizar" : "";
  return `Pedido desde el carrito: ${lines.join(" · ")}. Total servicios: ${currency.format(total)} + IVA${suffix}.`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const ids = useSyncExternalStore(subscribe, getIds, getServerIds);
  const [isOpen, setOpen] = useState(false);

  const items = useMemo<CartItem[]>(() => {
    const removed = ids.filter((x) => x.startsWith(REMOVED));
    return ids
      .filter((x) => !x.startsWith(REMOVED))
      .map((id) => {
        const entry = catalogById[id];
        const out = removed.filter((x) => tokenPlan(x) === id).map((x) => planItemById[x.slice(REMOVED.length)]);
        if (entry.kind !== "plan" || !out.length || entry.price === undefined) return entry;
        const price = Math.round((entry.price - out.reduce((sum, r) => sum + r.price, 0)) * 100) / 100;
        return { ...entry, price: Math.max(0, price), removed: out };
      });
  }, [ids]);
  const total = useMemo(() => items.reduce((sum, i) => sum + (i.price ?? 0), 0), [items]);
  const hasQuote = items.some((i) => i.price === undefined);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const isRemoved = useCallback((planItemId: string) => ids.includes(REMOVED + planItemId), [ids]);

  const toggle = useCallback((id: string) => {
    const current = getIds();
    if (current.includes(id)) {
      setIds(catalogById[id].kind === "plan" ? withoutPlan(current, id) : current.filter((x) => x !== id));
      return;
    }
    const base = catalogById[id].kind === "plan" ? current.filter((x) => !isPlanToken(x)) : current;
    setIds([...base, id]);
  }, []);

  const togglePlanItem = useCallback((planItemId: string) => {
    const token = REMOVED + planItemId;
    const cartPlanId = planId(planItemById[planItemId].planId);
    let current = getIds();
    // Customizing a plan picks it: any other plan (and its changes) leaves the cart.
    if (!current.includes(cartPlanId)) current = [...current.filter((x) => !isPlanToken(x)), cartPlanId];
    setIds(current.includes(token) ? current.filter((x) => x !== token) : [...current, token]);
  }, []);

  const remove = useCallback((id: string) => {
    const current = getIds();
    setIds(catalogById[id]?.kind === "plan" ? withoutPlan(current, id) : current.filter((x) => x !== id));
  }, []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, total, hasQuote, has, toggle, remove, clear, isRemoved, togglePlanItem, isOpen, setOpen }),
    [items, total, hasQuote, has, toggle, remove, clear, isRemoved, togglePlanItem, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
