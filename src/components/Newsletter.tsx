"use client";

import { useSubscribe } from "@/lib/use-subscribe";

export default function Newsletter() {
  const { status, onSubmit } = useSubscribe("Newsletter (/insights)");
  const done = status === "done";

  return (
    <section className="border-y border-[var(--color-line)] px-6 py-24 md:px-10 md:py-32">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <h2 data-reveal className="font-display text-3xl font-medium uppercase tracking-tight md:text-5xl">
            Mantente cerca.
          </h2>
          <p data-reveal className="mt-4 max-w-sm text-[var(--color-ink-soft)]">
            De vez en cuando enviamos ideas sobre marca, crecimiento y blindaje legal.
          </p>
        </div>

        <form
          data-reveal
          onSubmit={onSubmit}
          className="flex items-center gap-4 border-b border-[var(--color-ink)] pb-3 md:col-span-6"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder={done ? "¡Gracias! Ya estás en la lista." : "CORREO ELECTRÓNICO"}
            disabled={done || status === "sending"}
            className="w-full bg-transparent text-sm uppercase tracking-[0.06em] placeholder:text-[var(--color-ink-soft)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={done || status === "sending"}
            data-cursor="expand"
            className="flex shrink-0 items-center gap-2 text-sm font-medium uppercase tracking-[0.08em] disabled:opacity-50"
          >
            {status === "sending" ? "Enviando…" : done ? "Listo ✓" : "Suscribirme"} <span aria-hidden="true">→</span>
          </button>
        </form>
        {status === "error" && (
          <p className="text-sm text-[#7d1a1f] md:col-span-6 md:col-start-7">No pudimos registrarte. Intenta de nuevo.</p>
        )}
      </div>
    </section>
  );
}
