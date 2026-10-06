import type { Metadata } from "next";
import { hasAdminSession, isAdminConfigured } from "@/lib/admin-session";
import { getSupabase } from "@/lib/supabase-server";
import LoginForm from "./LoginForm";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Registros — ASHER",
  robots: { index: false, follow: false },
};

interface Lead {
  id: string;
  created_at: string;
  tipo: "contacto" | "diagnostico";
  nombre: string | null;
  celular: string | null;
  correo: string | null;
  mensaje: string | null;
  seccion_origen: string | null;
  respuestas: { pregunta: string; respuesta: string }[] | null;
}

function fecha(iso: string) {
  return new Date(iso).toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Private list of every lead the site has saved (lead modal, cart checkout
 * and the diagnóstico — see /api/notify). Rows are read server-side with the
 * service-role key, only after the admin session check passes.
 */
export default async function AdminPage() {
  if (!(await hasAdminSession())) {
    return (
      <section className="px-5 py-32 md:px-10">
        <h1 className="font-display text-center text-3xl font-medium tracking-tight md:text-5xl">Registros</h1>
        <p className="mt-3 text-center text-sm text-[var(--color-ink-soft)]">Área privada de ASHER.</p>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mx-auto mt-10 max-w-sm text-center text-sm text-[#7d1a1f]">
            El acceso aún no está configurado (faltan ADMIN_PASSWORD y ADMIN_SESSION_SECRET en Vercel).
          </p>
        )}
      </section>
    );
  }

  const supabase = getSupabase();
  const { data, error } = supabase
    ? await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500)
    : { data: null, error: { message: "Supabase no está configurado." } };
  const leads = (data ?? []) as Lead[];

  return (
    <section className="px-5 py-28 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-line)] pb-6">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-5xl">Registros</h1>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              {leads.length} {leads.length === 1 ? "registro" : "registros"}, del más reciente al más antiguo.
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        {error && <p className="mt-6 text-sm text-[#7d1a1f]">No se pudieron cargar los registros: {error.message}</p>}
        {!error && leads.length === 0 && (
          <p className="mt-6 text-sm text-[var(--color-ink-soft)]">Todavía no hay registros.</p>
        )}

        <ul className="mt-6 space-y-4">
          {leads.map((lead) => {
            const phone = (lead.celular ?? "").replace(/[^0-9]/g, "");
            return (
              <li key={lead.id} className="rounded-2xl border border-[var(--color-line)] p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em]"
                    style={{
                      background: lead.tipo === "diagnostico" ? "#8fb0e3" : "#0b1956",
                      color: lead.tipo === "diagnostico" ? "#0b1956" : "#ffffff",
                    }}
                  >
                    {lead.tipo === "diagnostico" ? "Diagnóstico" : "Contacto"}
                  </span>
                  <span className="text-xs text-[var(--color-ink-soft)]">{fecha(lead.created_at)}</span>
                </div>

                <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[var(--color-ink-soft)]">{lead.tipo === "diagnostico" ? "Negocio" : "Nombre"}</dt>
                    <dd className="font-medium">{lead.nombre || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--color-ink-soft)]">Celular / contacto</dt>
                    <dd className="font-medium">
                      {lead.celular || "—"}
                      {phone.length >= 7 && (
                        <a
                          href={`https://wa.me/${phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-xs underline underline-offset-4"
                        >
                          WhatsApp
                        </a>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--color-ink-soft)]">Correo</dt>
                    <dd className="font-medium break-all">
                      {lead.correo ? <a href={`mailto:${lead.correo}`} className="underline underline-offset-4">{lead.correo}</a> : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--color-ink-soft)]">Origen</dt>
                    <dd className="font-medium">{lead.seccion_origen || "—"}</dd>
                  </div>
                </dl>

                {lead.mensaje && (
                  <div className="mt-4">
                    <p className="text-xs text-[var(--color-ink-soft)]">Mensaje</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{lead.mensaje}</p>
                  </div>
                )}

                {lead.respuestas && lead.respuestas.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-[var(--color-ink-soft)]">Respuestas</p>
                    {lead.respuestas.map((r, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-[var(--color-ink-soft)]">{r.pregunta}: </span>
                        <span className="font-medium">{r.respuesta}</span>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
