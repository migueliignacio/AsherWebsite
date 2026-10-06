"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { catalogById, planId } from "@/data/catalog";
import { planItemById } from "@/data/plans";
import { REMOVED, cartItems, cartTotal, isValidToken, orderLines, tokenPlan, type CartItem } from "@/lib/order";
import { currency } from "@/lib/currency";

export type { CartItem };

// The cart stores only catalog ids (plus "sin:<planItemId>" tokens for items
// taken out of a plan) in localStorage; titles and prices are always resolved
// from the catalog, so they can't go stale or be tampered with.
const STORAGE_KEY = "asher-cart";
const EMPTY: string[] = [];

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


/** Drops a plan from the id list together with its removed-item tokens. */
function withoutPlan(ids: string[], cartPlanId: string): string[] {
  return ids.filter((x) => x !== cartPlanId && !(x.startsWith(REMOVED) && tokenPlan(x) === cartPlanId));
}


interface CartContextValue {
  /** The raw cart (ids + removal tokens), sent with an order so the server can price it. */
  tokens: string[];
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
  const suffix = hasQuote ? " + plan a cotizar" : "";
  return `Pedido desde el carrito: ${orderLines(items).join(" · ")}. Total: ${currency.format(total)} + IVA${suffix}.`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const ids = useSyncExternalStore(subscribe, getIds, getServerIds);
  const [isOpen, setOpen] = useState(false);

  const items = useMemo(() => cartItems(ids), [ids]);
  const total = useMemo(() => cartTotal(items), [items]);
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
    () => ({ tokens: ids, items, count: items.length, total, hasQuote, has, toggle, remove, clear, isRemoved, togglePlanItem, isOpen, setOpen }),
    [ids, items, total, hasQuote, has, toggle, remove, clear, isRemoved, togglePlanItem, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
