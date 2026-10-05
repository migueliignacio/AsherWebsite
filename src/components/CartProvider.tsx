"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { catalogById, type CatalogEntry } from "@/data/catalog";
import { currency, formatPrice } from "@/lib/currency";

// The cart stores only catalog ids in localStorage; titles and prices are
// always resolved from the catalog, so they can't go stale or be tampered with.
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
      const valid = parsed.filter((x): x is string => typeof x === "string" && x in catalogById);
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

interface CartContextValue {
  items: CatalogEntry[];
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
export function cartMessage(items: CatalogEntry[], total: number, hasQuote: boolean) {
  const lines = items.map((i) => `${i.title} (${i.price === undefined ? "a cotizar" : formatPrice({ ...i, price: i.price })})`);
  const suffix = hasQuote ? " + plan a cotizar" : "";
  return `Pedido desde el carrito: ${lines.join(" · ")}. Total servicios: ${currency.format(total)} + IVA${suffix}.`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const ids = useSyncExternalStore(subscribe, getIds, getServerIds);
  const [isOpen, setOpen] = useState(false);

  const items = useMemo(() => ids.map((id) => catalogById[id]), [ids]);
  const total = useMemo(() => items.reduce((sum, i) => sum + (i.price ?? 0), 0), [items]);
  const hasQuote = items.some((i) => i.price === undefined);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const current = getIds();
    if (current.includes(id)) {
      setIds(current.filter((x) => x !== id));
      return;
    }
    const base = catalogById[id].kind === "plan" ? current.filter((x) => catalogById[x].kind !== "plan") : current;
    setIds([...base, id]);
  }, []);

  const remove = useCallback((id: string) => setIds(getIds().filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, total, hasQuote, has, toggle, remove, clear, isOpen, setOpen }),
    [items, total, hasQuote, has, toggle, remove, clear, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
