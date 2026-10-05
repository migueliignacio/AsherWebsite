"use client";

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import { useCart } from "./CartProvider";

export interface CatalogGridItem {
  id: string;
  title: string;
  description: string;
  price: number;
  unit?: string;
  priceFrom?: boolean;
  category?: string;
}

/**
 * The one catalog row list used by every /servicios page and by "Arma tu
 * propio pack": click a row to add/remove it from the shared cart, click
 * "Detalles" for its full description. Consecutive items sharing a
 * `category` get a sub-heading.
 */
export function CatalogGrid({ items, accent, onAccent = "var(--color-bg)" }: { items: CatalogGridItem[]; accent: string; onAccent?: string }) {
  const { has, toggle } = useCart();
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="grid items-start gap-2 sm:grid-cols-2">
      {items.map((item, i) => {
        const isSelected = has(item.id);
        const isExpanded = expanded.includes(item.id);
        const startsGroup = item.category && item.category !== items[i - 1]?.category;
        return (
          <Fragment key={item.id}>
            {startsGroup && (
              <p
                className={cn(
                  "flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)] sm:col-span-2",
                  i > 0 && "mt-6"
                )}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} aria-hidden="true" />
                {item.category}
              </p>
            )}
            <div
              className="overflow-hidden rounded-xl border transition-colors duration-300"
              style={{
                borderColor: isSelected ? accent : "var(--color-line)",
                background: isSelected ? accent : "var(--color-bg)",
                color: isSelected ? onAccent : "var(--color-ink)",
              }}
            >
              <div className="flex items-center gap-2 px-2">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={isSelected}
                  data-cursor="expand"
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-between gap-3 py-3 pl-2 text-left",
                    !isSelected && "hover:opacity-70"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[0.55rem]"
                      style={{
                        borderColor: isSelected ? onAccent : "var(--color-line)",
                        background: isSelected ? onAccent : "transparent",
                        color: isSelected ? accent : "transparent",
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-xs font-medium leading-snug">{item.title}</span>
                  </span>
                  <span
                    className="shrink-0 text-right text-xs font-medium tracking-[0.02em]"
                    style={{ color: isSelected ? onAccent : "var(--color-ink-soft)" }}
                  >
                    {formatPrice(item)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleExpanded(item.id)}
                  aria-label={isExpanded ? `Ocultar detalles de ${item.title}` : `Ver detalles de ${item.title}`}
                  aria-expanded={isExpanded}
                  data-cursor="expand"
                  className="flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.08em] transition-colors duration-300"
                  style={{
                    borderColor: isSelected ? `color-mix(in srgb, ${onAccent} 50%, transparent)` : "var(--color-line)",
                    color: isSelected ? onAccent : "var(--color-ink-soft)",
                  }}
                >
                  <span className="hidden sm:inline">Detalles</span>
                  <span aria-hidden="true" className={cn("transition-transform duration-300", isExpanded && "rotate-180")}>
                    ⌄
                  </span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p
                        className="text-xs leading-relaxed"
                        style={{ opacity: isSelected ? 0.85 : 1, color: isSelected ? onAccent : "var(--color-ink-soft)" }}
                      >
                        {item.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        data-cursor="expand"
                        className="mt-3 rounded-full px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.1em] transition-transform duration-300 hover:-translate-y-0.5"
                        style={{
                          background: isSelected ? onAccent : accent,
                          color: isSelected ? accent : onAccent,
                        }}
                      >
                        {isSelected ? "Quitar del carrito" : `Añadir al carrito · ${formatPrice(item)}`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
