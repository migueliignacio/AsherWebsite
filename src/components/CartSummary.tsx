"use client";

import { motion, AnimatePresence } from "framer-motion";
import { currency, formatPrice } from "@/lib/currency";
import { useCart } from "./CartProvider";

/** Sticky sidebar next to the catalogs: a live view of the whole shared cart. */
export default function CartSummary({ title = "Tu carrito" }: { title?: string }) {
  const { items, count, total, hasQuote, remove, setOpen } = useCart();

  return (
    <div className="sticky top-24 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] p-6">
      <h3 className="font-display text-base font-medium tracking-tight">{title}</h3>

      {count === 0 ? (
        <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
          Elige un plan o los servicios que quieres sumar a tu propuesta.
        </p>
      ) : (
        <ul data-lenis-prevent className="mt-4 max-h-64 space-y-2 overflow-y-auto border-t border-[var(--color-line)] pt-4 text-xs">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between gap-2 overflow-hidden"
              >
                <span className="truncate text-[var(--color-ink-soft)]">{item.title}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-medium">{item.price === undefined ? "A cotizar" : formatPrice({ ...item, price: item.price })}</span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Quitar ${item.title}`}
                    data-cursor="expand"
                    className="grid h-4 w-4 place-items-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    ×
                  </button>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-4 flex items-baseline justify-between border-t border-[var(--color-line)] pt-4">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-soft)]">Total</span>
        <motion.span
          key={total}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-xl font-medium tracking-tight"
        >
          {currency.format(total)}
        </motion.span>
      </div>
      <p className="mt-2 text-[0.7rem] text-[var(--color-ink-soft)]">Valores en dólares (USD) + IVA.</p>
      {hasQuote && <p className="mt-1 text-[0.7rem] text-[var(--color-ink-soft)]">Plan por cotizar, no incluido en el total.</p>}

      <button
        type="button"
        disabled={count === 0}
        onClick={() => setOpen(true)}
        data-cursor="expand"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-bg)] transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:bg-[var(--color-line)] disabled:text-[var(--color-ink-soft)]"
      >
        Ver carrito y finalizar <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
