"use client";

import { serviceAddons, serviceOrder } from "@/data/service-addons";
import { CatalogGrid } from "./CatalogGrid";
import CartSummary from "./CartSummary";
import TextBlockAnimation from "@/components/ui/text-block-animation";

// One block per service; a sectioned service (Legal) gets one block per area.
const groups = serviceOrder.flatMap((slug) => {
  const service = serviceAddons[slug];
  if (!service.sections) {
    return [{ id: slug, label: service.label, items: service.items, accent: service.accent, onAccent: service.onAccent, note: service.note }];
  }
  return service.sections.map((section) => ({
    id: section.id,
    label: `${service.label} · ${section.label}`,
    items: section.items,
    accent: section.accent,
    onAccent: section.onAccent,
    note: section.note,
  }));
});

export default function CustomPlan() {
  return (
    <section
      id="plan-personalizado"
      className="border-t border-[var(--color-line)] px-5 py-28 md:px-10 md:py-40"
    >
      <TextBlockAnimation blockColor="#8fb0e3" duration={0.5} className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          06 — Plan personalizado
        </p>
      </TextBlockAnimation>

      <TextBlockAnimation blockColor="#0b1956" delay={0.1} className="mb-6">
        <h2 className="font-display max-w-3xl text-balance text-4xl font-medium leading-[0.95] tracking-tight md:text-7xl">
          Arma tu propio pack
        </h2>
      </TextBlockAnimation>
      <TextBlockAnimation blockColor="#520000" duration={0.5} className="mb-16 md:mb-24">
        <p className="max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
          El mismo catálogo de cada servicio, en un solo lugar. Súmalo a un plan o elige solo lo que necesitas.
        </p>
      </TextBlockAnimation>

      <div className="grid gap-10 md:grid-cols-3 md:gap-16">
        <div className="space-y-8 md:col-span-2">
          {groups.map((group) => (
            <div key={group.id} data-reveal>
              <h3 className="font-display mb-3 text-sm font-medium uppercase tracking-tight md:text-base">
                {group.label}
              </h3>
              <CatalogGrid items={group.items} accent={group.accent} onAccent={group.onAccent} />
              {group.note && (
                <p className="mt-3 text-[0.7rem] leading-relaxed text-[var(--color-ink-soft)]">{group.note}</p>
              )}
            </div>
          ))}
        </div>

        <div data-reveal className="md:col-span-1">
          <CartSummary title="Tu pack" />
        </div>
      </div>
    </section>
  );
}
