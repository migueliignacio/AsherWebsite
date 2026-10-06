"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { brand } from "@/data/asher";

interface LeadModalContextValue {
  /** `carrito`: the cart's tokens when the modal finalizes an order (priced server-side). */
  openModal: (origen?: string, mensaje?: string, carrito?: string[]) => void;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

/** Botones "Reservar consultoría" en Navbar/Hero/Contact llaman a esto. */
export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal debe usarse dentro de <LeadModalProvider>");
  return ctx;
}

const CAMPOS_INIT = { nombre: "", celular: "", correo: "", mensaje: "", consentimiento: false };

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [origen, setOrigen] = useState<string | undefined>(undefined);
  const [carrito, setCarrito] = useState<string[] | undefined>(undefined);
  const [campos, setCampos] = useState(CAMPOS_INIT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const openModal = useCallback((o?: string, mensaje?: string, items?: string[]) => {
    setCampos({ ...CAMPOS_INIT, mensaje: mensaje ?? "" });
    setCarrito(items?.length ? items : undefined);
    setErrors({});
    setEnviado(false);
    setOrigen(o);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const set = (key: keyof typeof CAMPOS_INIT, value: string | boolean) => {
    setCampos((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (campos.nombre.trim().length < 2) nextErrors.nombre = "Cuéntanos tu nombre.";
    if (campos.celular.trim().length < 7) nextErrors.celular = "Un celular o WhatsApp válido.";
    if (!campos.consentimiento) nextErrors.consentimiento = "Necesitamos tu autorización para contactarte.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: campos.nombre,
          celular: campos.celular,
          correo: campos.correo,
          mensaje: campos.mensaje,
          seccion_origen: origen,
          ...(carrito ? { carrito } : {}),
        }),
      });
      setEnviado(true);
    } catch {
      // El registro no debe bloquear al usuario si el correo falla en enviarse.
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ openModal }), [openModal]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-[var(--color-ink)]/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-1/2 z-[200] -translate-y-1/2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 md:p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Regístrate con ASHER"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    {brand.name}
                  </p>
                  <h3 className="font-display mt-1 text-lg font-medium leading-tight">
                    Cuéntanos un poco sobre ti
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                    En segundos te conectamos con nuestro equipo.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Cerrar"
                  className="rounded-full p-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-ink)]/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {enviado ? (
                <div className="py-6 text-center">
                  <p className="font-display text-xl font-medium">¡Listo!</p>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Recibimos tus datos — nuestro equipo te contacta muy pronto.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-medium uppercase tracking-[0.08em]"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre *"
                      value={campos.nombre}
                      onChange={(e) => set("nombre", e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none placeholder:opacity-50"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: errors.nombre ? "#e05a5a" : "var(--color-line)",
                      }}
                    />
                    {errors.nombre && <p className="mt-1 text-[10px] text-red-500">{errors.nombre}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Celular / WhatsApp *"
                      value={campos.celular}
                      onChange={(e) => set("celular", e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none placeholder:opacity-50"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: errors.celular ? "#e05a5a" : "var(--color-line)",
                      }}
                    />
                    {errors.celular && <p className="mt-1 text-[10px] text-red-500">{errors.celular}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Correo electrónico (opcional)"
                      value={campos.correo}
                      onChange={(e) => set("correo", e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none placeholder:opacity-50"
                      style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}
                    />
                  </div>

                  <textarea
                    placeholder="¿Algo que quieras contarnos? (opcional)"
                    value={campos.mensaje}
                    onChange={(e) => set("mensaje", e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none placeholder:opacity-50"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}
                  />

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={campos.consentimiento}
                      onChange={(e) => set("consentimiento", e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--color-ink)]"
                    />
                    <span className="text-[11px] leading-tight text-[var(--color-ink-soft)]">
                      Acepto que {brand.name} use mis datos para contactarme y dar seguimiento a mi solicitud.
                    </span>
                  </label>
                  {errors.consentimiento && (
                    <p className="text-[10px] text-red-500">{errors.consentimiento}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-[var(--color-bg)] transition-opacity disabled:opacity-60"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Enviando…" : "Registrarme"}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LeadModalContext.Provider>
  );
}
