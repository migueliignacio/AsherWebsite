"use client";

import { ShoppingBag, X } from "lucide-react";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cartMessage, useCart } from "./CartProvider";
import { useLeadModal } from "./LeadModalProvider";
import { currency, formatPrice } from "@/lib/currency";

export default function CartDrawer() {
  const { items, count, total, hasQuote, remove, clear, isOpen, setOpen } = useCart();
  const { openModal } = useLeadModal();

  const plans = items.filter((i) => i.kind === "plan");
  const services = items.filter((i) => i.kind === "service");

  const checkout = () => {
    setOpen(false);
    openModal("carrito", cartMessage(items, total, hasQuote));
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
            Tu carrito ({count})
          </DrawerTitle>
          <DrawerDescription>Revisa lo que elegiste antes de finalizar.</DrawerDescription>
        </DrawerHeader>

        <DrawerBody data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto">
          {count === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[var(--color-line)]" strokeWidth={1.2} />
              <p className="text-sm text-[var(--color-ink-soft)]">Tu carrito está vacío.</p>
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                Añade un plan o servicios desde Planes o desde cada servicio.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.length > 0 && <CartGroup title="Plan" entries={plans} onRemove={remove} />}
              {services.length > 0 && <CartGroup title="Servicios adicionales" entries={services} onRemove={remove} />}
              <button
                type="button"
                onClick={clear}
                data-cursor="expand"
                className="text-xs uppercase tracking-[0.1em] text-[var(--color-ink-soft)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-soft)]">
              Total
            </span>
            <span className="font-display text-xl font-medium tracking-tight">{currency.format(total)}</span>
          </div>
          <p className="mb-2 text-xs text-[var(--color-ink-soft)]">Valores en dólares (USD) + IVA.</p>
          {hasQuote && (
            <p className="mb-2 text-xs text-[var(--color-ink-soft)]">
              El plan se cotiza contigo: el total no lo incluye todavía.
            </p>
          )}
          <button
            type="button"
            disabled={count === 0}
            onClick={checkout}
            data-cursor="expand"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-bg)] transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:bg-[var(--color-line)] disabled:text-[var(--color-ink-soft)]"
          >
            Finalizar pedido <span aria-hidden="true">→</span>
          </button>
          <DrawerClose asChild>
            <button
              type="button"
              data-cursor="expand"
              className="flex w-full items-center justify-center rounded-full border border-[var(--color-ink)]/20 px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-ink-soft)] transition-colors duration-300 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              Seguir eligiendo
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CartGroup({
  title,
  entries,
  onRemove,
}: {
  title: string;
  entries: { id: string; title: string; price?: number; unit?: string; priceFrom?: boolean; area: string }[];
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">{title}</p>
      <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="min-w-0">
              <span className="block truncate font-medium">{e.title}</span>
              <span className="block text-xs text-[var(--color-ink-soft)]">{e.area}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="text-right font-medium">{e.price === undefined ? "A cotizar" : formatPrice({ ...e, price: e.price })}</span>
              <button
                type="button"
                onClick={() => onRemove(e.id)}
                aria-label={`Quitar ${e.title}`}
                data-cursor="expand"
                className="grid h-6 w-6 place-items-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
