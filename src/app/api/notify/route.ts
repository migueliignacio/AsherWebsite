import { NextRequest, NextResponse } from "next/server";
import { brand } from "@/data/asher";
import { getSupabase } from "@/lib/supabase-server";

/**
 * Runs on every submission from the lead modal ("Cuéntanos un poco sobre
 * ti" — see LeadModalProvider.tsx) and the 3-step diagnóstico (see
 * DiagnosticoQuiz.tsx): emails the team and saves a row in Supabase (see
 * supabase/schema.sql for the table).
 *
 * Both are independent and best-effort — a missing RESEND_API_KEY or
 * Supabase env vars just skips that half; the visitor's submission is never
 * blocked by either one failing.
 */

function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function fecha(): string {
  return new Date().toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/** Shared card chrome; each notification type only builds its own rows + extra block. */
function emailShell(title: string, rowsHtml: string, extraHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f4ed;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ed;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#0b1956;border-radius:16px;overflow:hidden;">

        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #26346f;">
            <p style="margin:0;color:#d8cbb8;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">${esc(brand.name)}</p>
            <h1 style="margin:8px 0 0;color:#f7f4ed;font-size:22px;font-weight:700;">${title}</h1>
            <p style="margin:6px 0 0;color:rgba(245,243,238,0.45);font-size:13px;">${fecha()} (Ecuador)</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rowsHtml}
            </table>
          </td>
        </tr>

        ${extraHtml}

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string, opts?: { accent?: boolean }): string {
  return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1a2760;">
          <span style="color:rgba(245,243,238,0.45);font-size:12px;">${esc(label)}</span><br>
          <span style="color:${opts?.accent ? "#d8cbb8" : "#f7f4ed"};font-size:16px;font-weight:${opts?.accent ? 700 : 600};">${esc(value) || "—"}</span>
        </td>
      </tr>`;
}

/** Modal "Cuéntanos un poco sobre ti" (Navbar / Hero / Contacto). */
function buildLeadHtml(data: Record<string, unknown>): string {
  const rows =
    row("Nombre", String(data.nombre ?? "")) +
    row("Celular / WhatsApp", String(data.celular ?? ""), { accent: true }) +
    row("Correo electrónico", String(data.correo ?? "") || "No proporcionó") +
    row("Sección de origen", String(data.seccion_origen ?? ""));

  const mensaje = data.mensaje
    ? `
        <tr>
          <td style="padding:8px 32px 0;">
            <p style="margin:0 0 12px;color:#d8cbb8;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Mensaje</p>
            <div style="background:#0f1d63;border:1px solid #26346f;border-radius:10px;padding:16px;">
              <p style="margin:0;color:#f7f4ed;font-size:14px;line-height:1.6;font-style:italic;">"${esc(data.mensaje)}"</p>
            </div>
          </td>
        </tr>`
    : "";

  const whatsapp = `
        <tr>
          <td style="padding:28px 32px;">
            <a href="https://wa.me/${String(data.celular ?? "").replace(/[^0-9]/g, "")}"
               style="display:block;text-align:center;background:linear-gradient(135deg,#520000,#7d1a1f);color:#f7f4ed;font-weight:700;font-size:15px;text-decoration:none;border-radius:50px;padding:16px 24px;">
              📲 Contactar por WhatsApp ahora
            </a>
          </td>
        </tr>`;

  return emailShell("🆕 Nuevo registro", rows, mensaje + whatsapp);
}

/** "Haz tu diagnóstico en 3 pasos" (ver DiagnosticoQuiz.tsx). */
function buildDiagnosticoHtml(data: Record<string, unknown>): string {
  const rows =
    row("Negocio", String(data.nombre_negocio ?? "")) +
    row("Contacto", String(data.contacto ?? ""), { accent: true }) +
    row("Sección de origen", String(data.seccion_origen ?? "Diagnóstico"));

  const respuestas = Array.isArray(data.respuestas) ? (data.respuestas as { pregunta: string; respuesta: string }[]) : [];
  const respuestasHtml = respuestas.length
    ? `
        <tr>
          <td style="padding:8px 32px 0;">
            <p style="margin:0 0 12px;color:#d8cbb8;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Respuestas</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1d63;border:1px solid #26346f;border-radius:10px;">
              ${respuestas
                .map(
                  (r, i) => `
              <tr>
                <td style="padding:14px 16px;${i < respuestas.length - 1 ? "border-bottom:1px solid #26346f;" : ""}">
                  <p style="margin:0 0 4px;color:rgba(245,243,238,0.5);font-size:11px;">${esc(r.pregunta)}</p>
                  <p style="margin:0;color:#f7f4ed;font-size:14px;font-weight:600;">${esc(r.respuesta)}</p>
                </td>
              </tr>`
                )
                .join("")}
            </table>
          </td>
        </tr>`
    : "";

  return emailShell("📋 Nuevo diagnóstico", rows, respuestasHtml);
}

async function sendEmail(data: Record<string, unknown>, isDiagnostico: boolean) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "missing_api_key" };

  const subject = isDiagnostico
    ? `📋 Diagnóstico: ${data.nombre_negocio ?? "Sin nombre"}`
    : `🆕 Nuevo registro: ${data.nombre ?? "Sin nombre"}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Resend's onboarding@resend.dev sender only delivers to the Resend
      // account owner; set RESEND_FROM (e.g. "ASHER <notificaciones@asherconsulting.ec>")
      // once the domain is verified in Resend so every recipient gets it.
      from: process.env.RESEND_FROM || `${brand.name} <onboarding@resend.dev>`,
      to: brand.notifyEmails,
      subject,
      html: isDiagnostico ? buildDiagnosticoHtml(data) : buildLeadHtml(data),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { sent: false, reason: `resend_${response.status}: ${body}` };
  }
  return { sent: true };
}

async function saveToDatabase(data: Record<string, unknown>, isDiagnostico: boolean) {
  const supabase = getSupabase();
  if (!supabase) return { saved: false, reason: "missing_supabase_config" };

  const { error } = await supabase.from("leads").insert({
    tipo: isDiagnostico ? "diagnostico" : "contacto",
    nombre: isDiagnostico ? data.nombre_negocio : data.nombre,
    celular: isDiagnostico ? data.contacto : data.celular,
    correo: isDiagnostico ? null : data.correo || null,
    mensaje: isDiagnostico ? null : data.mensaje || null,
    seccion_origen: data.seccion_origen ?? null,
    respuestas: isDiagnostico ? data.respuestas ?? null : null,
  });
  if (error) return { saved: false, reason: error.message };
  return { saved: true };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const isDiagnostico = data.tipo === "diagnostico";

    const [emailResult, dbResult] = await Promise.allSettled([
      sendEmail(data, isDiagnostico),
      saveToDatabase(data, isDiagnostico),
    ]);

    return NextResponse.json({
      ok: true,
      email: emailResult.status === "fulfilled" ? emailResult.value : { sent: false, reason: "error" },
      database: dbResult.status === "fulfilled" ? dbResult.value : { saved: false, reason: "error" },
    });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
