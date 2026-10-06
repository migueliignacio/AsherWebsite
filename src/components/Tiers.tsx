"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { plans, planAreas, areaCatalog, type Plan, type PlanItem } from "@/data/plans";
import { planId } from "@/data/catalog";
import { serviceAddons, type ServiceAddon } from "@/data/service-addons";
import { currency, formatPrice } from "@/lib/currency";
import { useCart } from "./CartProvider";
import TextBlockAnimation from "@/components/ui/text-block-animation";

/** Catalog services a removed plan item could be swapped for: same area, similar price. */
function swapOptions(item: PlanItem): ServiceAddon[] {
  const { slug, section } = areaCatalog[item.area];
  const service = serviceAddons[slug];
  const pool = section ? service.sections?.find((s) => s.id === section)?.items ?? [] : service.items;
  const range = Math.max(25, item.price * 0.4);
  return pool
    .filter((s) => Math.abs(s.price - item.price) <= range)
    .sort((a, b) => Math.abs(a.price - item.price) - Math.abs(b.price - item.price))
    .slice(0, 3);
}

function PlanCustomizer({ plan }: { plan: Plan }) {
  const { isRemoved, togglePlanItem, has, toggle, items, setOpen } = useCart();
  const cartLine = items.find((i) => i.id === planId(plan.id));
  const price = cartLine?.price ?? plan.price ?? 0;
  const removedCount = plan.items.filter((i) => isRemoved(i.id)).length;

  return (
    <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-line)] pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">Personaliza tu plan</p>
          <h3 className="font-display mt-2 text-2xl font-medium tracking-tight md:text-4xl">{plan.name}</h3>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-ink-soft)]">
            Desmarca lo que no necesitas y el precio baja solo. Si quitas algo, te sugerimos servicios de precio parecido para cambiarlo.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-ink-soft)]">Precio del plan</p>
          <p className="font-display text-3xl font-medium tracking-tight">{currency.format(price)}</p>
          {removedCount > 0 && plan.price !== undefined && (
            <p className="text-xs text-[var(--color-ink-soft)] line-through">{currency.format(plan.price)}</p>
          )}
          <p className="text-xs text-[var(--color-ink-soft)]">+ IVA</p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {planAreas.map((area) => {
          const areaItems = plan.items.filter((i) => i.area === area);
          if (!areaItems.length) return null;
          return (
            <div key={area}>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">{area}</p>
              <ul className="space-y-2">
                {areaItems.map((item) => {
                  const removed = isRemoved(item.id);
                  return (
                    <li key={item.id} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)]">
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm" data-cursor="expand">
                        <input
                          type="checkbox"
                          checked={!removed}
                          onChange={() => togglePlanItem(item.id)}
                          className="h-4 w-4 shrink-0 accent-[#0b1956]"
                        />
                        <span className={`flex-1 ${removed ? "text-[var(--color-ink-soft)] line-through" : ""}`}>{item.title}</span>
                        <span className="shrink-0 text-xs text-[var(--color-ink-soft)]">
                          {item.price ? currency.format(item.price) : "Incluido"}
                        </span>
                      </label>
                      {removed && (
                        <div className="border-t border-[var(--color-line)] px-4 py-3">
                          <p className="mb-2 text-xs text-[var(--color-ink-soft)]">¿Lo cambias por otro de precio parecido?</p>
                          <div className="flex flex-wrap gap-2">
                            {swapOptions(item).map((option) => {
                              const added = has(option.id);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => toggle(option.id)}
                                  aria-pressed={added}
                                  data-cursor="expand"
                                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                    added
                                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                      : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                                  }`}
                                >
                                  {added ? "✓ " : "+ "}
                                  {option.title} · {formatPrice(option)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--color-ink-soft)]">
          ¿Quieres sumar algo más? Agrégalo desde{" "}
          <a href="#plan-personalizado" className="underline underline-offset-4">
            el catálogo completo
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            if (!has(planId(plan.id))) toggle(planId(plan.id));
            setOpen(true);
          }}
          data-cursor="expand"
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-medium uppercase tracking-[0.1em] text-white transition-transform duration-300 hover:-translate-y-0.5"
        >
          Añadir al carrito · {currency.format(price)}
        </button>
      </div>
    </div>
  );
}

export default function Tiers() {
  const { has, toggle, items } = useCart();
  const [customizing, setCustomizing] = useState<string | null>(null);
  const editing = plans.find((p) => p.id === customizing);

  return (
    <section id="planes" className="border-t border-[var(--color-line)] px-5 py-28 md:px-10 md:py-40">
      <TextBlockAnimation blockColor="#8fb0e3" duration={0.5} className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">05 — Planes</p>
      </TextBlockAnimation>

      <TextBlockAnimation blockColor="#520000" delay={0.1} className="mb-16 md:mb-24">
        <h2 className="font-display max-w-3xl text-balance text-4xl font-medium leading-[0.95] tracking-tight md:text-7xl">
          Un nivel para cada etapa
        </h2>
      </TextBlockAnimation>

      <div className="grid gap-6 md:grid-cols-3 md:gap-5">
        {plans.map((plan) => {
          const id = planId(plan.id);
          const inCart = has(id);
          const cartLine = items.find((i) => i.id === id);
          const price = cartLine?.price ?? plan.price;
          const dark = plan.featured;
          return (
            <article
              key={plan.id}
              data-reveal
              className={`flex flex-col rounded-3xl p-8 md:p-10 ${
                dark ? "bg-[var(--color-violet)] text-[var(--color-bg)]" : "border border-[var(--color-line)] bg-[var(--color-bg)]"
              }`}
            >
              {dark && (
                <span className="mb-5 self-start rounded-full bg-[var(--color-bg)]/15 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.12em]">
                  Más popular
                </span>
              )}
              <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">{plan.name}</h3>
              <p className="font-display mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                {price === undefined ? "A cotizar" : currency.format(price)}
                {price !== undefined && <span className="ml-1 text-sm font-normal opacity-70">+ IVA</span>}
              </p>
              {cartLine?.removed?.length ? (
                <p className="mt-1 text-xs opacity-70">Personalizado: sin {cartLine.removed.length} servicio(s)</p>
              ) : null}
              <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-[var(--color-bg)]/70" : "text-[var(--color-ink-soft)]"}`}>
                {plan.audience}
              </p>

              <ul
                className={`mt-8 flex-1 space-y-3 border-t pt-8 text-sm leading-relaxed ${
                  dark ? "border-[var(--color-bg)]/20 text-[var(--color-bg)]/85" : "border-[var(--color-line)] text-[var(--color-ink-soft)]"
                }`}
              >
                {planAreas.map((area) => {
                  const areaItems = plan.items.filter((i) => i.area === area);
                  if (!areaItems.length) return null;
                  return (
                    <li key={area}>
                      <span className="font-medium">{area}:</span> {areaItems.map((i) => i.title).join(", ")}.
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10 flex flex-col items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  aria-pressed={inCart}
                  data-cursor="expand"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-xs font-medium uppercase tracking-[0.1em] transition-transform duration-300 hover:-translate-y-0.5 ${
                    inCart
                      ? dark
                        ? "border border-[var(--color-bg)] text-[var(--color-bg)]"
                        : "border border-[var(--color-ink)] text-[var(--color-ink)]"
                      : dark
                        ? "bg-[var(--color-bg)] text-[var(--color-violet)]"
                        : "bg-[var(--color-ink)] text-[var(--color-bg)]"
                  }`}
                >
                  {inCart ? "En tu carrito ✓" : plan.price === undefined ? "Solicitar cotización +" : "Añadir al carrito +"}
                </button>
                {plan.price !== undefined && (
                  <button
                    type="button"
                    onClick={() => setCustomizing(customizing === plan.id ? null : plan.id)}
                    aria-expanded={customizing === plan.id}
                    data-cursor="expand"
                    className="text-xs uppercase tracking-[0.1em] underline underline-offset-4 opacity-80 hover:opacity-100"
                  >
                    {customizing === plan.id ? "Cerrar personalización" : "Personalizar plan"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            key={editing.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-8">
              <PlanCustomizer plan={editing} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
