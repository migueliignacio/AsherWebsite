"use client";

import { cn } from "@/lib/utils";
import { CatalogGrid, type CatalogGridItem } from "@/components/CatalogGrid";
import CartSummary from "@/components/CartSummary";
import TextBlockAnimation from "@/components/ui/text-block-animation";

export interface ServiceCatalogProps {
  eyebrow: string;
  title: string;
  items: CatalogGridItem[];
  accent: string;
  onAccent?: string;
  /** Anchor id, for services with several areas on one page. */
  id?: string;
  description?: string;
  highlights?: string[];
  /** Fine print under the catalog. */
  note?: string;
  className?: string;
}

/** One service area's add-ons, wired to the site-wide cart. */
export function ServiceCatalog({
  eyebrow,
  title,
  items,
  accent,
  onAccent,
  id,
  description,
  highlights,
  note,
  className,
}: ServiceCatalogProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-40 border-t border-[var(--color-line)] px-5 py-20 md:px-10 md:py-28", className)}
    >
      <TextBlockAnimation blockColor={accent} duration={0.5} className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">{eyebrow}</p>
      </TextBlockAnimation>
      <TextBlockAnimation blockColor={accent} delay={0.1} className="mb-6">
        <h2 className="font-display max-w-2xl text-balance text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl">
          {title}
        </h2>
      </TextBlockAnimation>
      {description && (
        <TextBlockAnimation blockColor={accent} duration={0.5} delay={0.2} className="mb-8">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)] md:text-base">{description}</p>
        </TextBlockAnimation>
      )}
      {highlights && highlights.length > 0 && (
        <ul className="mb-12 flex flex-wrap gap-x-8 gap-y-3 text-sm md:mb-16">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {!highlights?.length && <div className="mb-6 md:mb-10" />}

      <div className="grid gap-10 md:grid-cols-3 md:gap-16">
        <div className="md:col-span-2">
          <CatalogGrid items={items} accent={accent} onAccent={onAccent} />
          {note && <p className="mt-6 max-w-2xl text-[0.7rem] leading-relaxed text-[var(--color-ink-soft)]">{note}</p>}
        </div>
        <div className="md:col-span-1">
          <CartSummary />
        </div>
      </div>
    </section>
  );
}
