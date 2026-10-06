import { NextRequest, NextResponse } from "next/server";
import { brand } from "@/data/asher";
import { getSupabase } from "@/lib/supabase-server";
import { cartItems, cartTotal, orderLines, orderText, type CartItem } from "@/lib/order";
import { currency } from "@/lib/currency";

/**
 * Runs on every submission from the lead modal ("Cuéntanos un poco sobre
 * ti" — see LeadModalProvider.tsx), the 3-step diagnóstico (see
 * DiagnosticoQuiz.tsx), cart checkouts (an order, priced here from the
 * cart's ids — see lib/order.ts) and newsletter sign-ups: emails the team,
 * saves a row in Supabase (see supabase/schema.sql) and sends a WhatsApp alert.
 *
 * All three are independent and best-effort — missing env vars just skip
 * that channel; the visitor's submission is never blocked by one failing.
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
function buildLeadHtml(data: Record<string, unknown>, order: CartItem[]): string {
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

  const total = `${currency.format(cartTotal(order))} + IVA${order.some((i) => i.price === undefined) ? " (+ plan a cotizar)" : ""}`;
  const pedido = order.length
    ? `
        <tr>
          <td style="padding:8px 32px 0;">
            <p style="margin:0 0 12px;color:#d8cbb8;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Pedido</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1d63;border:1px solid #26346f;border-radius:10px;">
              ${orderLines(order)
                .map((line) => `<tr><td style="padding:12px 16px;border-bottom:1px solid #26346f;color:#f7f4ed;font-size:14px;">${esc(line)}</td></tr>`)
                .join("")}
              <tr><td style="padding:14px 16px;color:#d8cbb8;font-size:16px;font-weight:700;">Total: ${esc(total)}</td></tr>
            </table>
          </td>
        </tr>`
    : "";

  return emailShell(order.length ? "🛒 Nuevo pedido" : "🆕 Nuevo registro", rows, pedido + mensaje + whatsapp);
}

/** "Mantente cerca" (footer) and the /insights newsletter. */
function buildNewsletterHtml(data: Record<string, unknown>): string {
  const rows =
    row("Correo electrónico", String(data.correo ?? ""), { accent: true }) +
    row("Sección de origen", String(data.seccion_origen ?? ""));
  return emailShell("📬 Nueva suscripción", rows, "");
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

type Kind = "contacto" | "pedido" | "diagnostico" | "newsletter";

const isEmail = (value: unknown): value is string => typeof value === "string" && /^\S+@\S+\.\S+$/.test(value);

async function sendEmail(data: Record<string, unknown>, kind: Kind, order: CartItem[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "missing_api_key" };

  const subject = {
    diagnostico: `📋 Diagnóstico: ${data.nombre_negocio ?? "Sin nombre"}`,
    pedido: `🛒 Nuevo pedido: ${data.nombre ?? "Sin nombre"} — ${currency.format(cartTotal(order))} + IVA`,
    newsletter: `📬 Nueva suscripción: ${data.correo ?? ""}`,
    contacto: `🆕 Nuevo registro: ${data.nombre ?? "Sin nombre"}`,
  }[kind];
  const html =
    kind === "diagnostico" ? buildDiagnosticoHtml(data) : kind === "newsletter" ? buildNewsletterHtml(data) : buildLeadHtml(data, order);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Resend's onboarding@resend.dev sender only delivers to the Resend
      // account owner; RESEND_FROM (e.g. "ASHER <notificaciones@asherconsulting.ec>")
      // uses the verified domain so every recipient gets it.
      from: process.env.RESEND_FROM || `${brand.name} <onboarding@resend.dev>`,
      to: brand.notifyEmails,
      // "Reply" in the inbox answers the person who registered, when they left an email.
      ...(isEmail(data.correo) ? { reply_to: data.correo } : {}),
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { sent: false, reason: `resend_${response.status}: ${body}` };
  }
  return { sent: true };
}

/** Plain-text summary for WhatsApp (WhatsApp formatting: *bold*). */
function buildWhatsappText(data: Record<string, unknown>, kind: Kind, order: CartItem[]): string {
  let lines: string[];
  if (kind === "diagnostico") {
    lines = [
      "*📋 Nuevo diagnóstico — ASHER*",
      `*Negocio:* ${data.nombre_negocio ?? "—"}`,
      `*Contacto:* ${data.contacto ?? "—"}`,
      ...(Array.isArray(data.respuestas)
        ? (data.respuestas as { pregunta: string; respuesta: string }[]).map((r) => `• ${r.pregunta}: ${r.respuesta}`)
        : []),
    ];
  } else if (kind === "newsletter") {
    lines = ["*📬 Nueva suscripción — ASHER*", `*Correo:* ${data.correo ?? "—"}`];
  } else {
    lines = [
      kind === "pedido" ? "*🛒 Nuevo pedido — ASHER*" : "*🆕 Nuevo registro — ASHER*",
      `*Nombre:* ${data.nombre ?? "—"}`,
      `*Celular:* ${data.celular ?? "—"}`,
      `*Correo:* ${data.correo || "—"}`,
      ...(order.length
        ? ["*Pedido:*", ...orderLines(order).map((l) => `• ${l}`), `*Total:* ${currency.format(cartTotal(order))} + IVA`]
        : data.mensaje
          ? [`*Mensaje:* ${data.mensaje}`]
          : []),
    ];
  }
  lines.push(`*Origen:* ${data.seccion_origen ?? "—"}`, fecha());
  return lines.join("\n");
}

/**
 * WhatsApp alert to the team's own number through CallMeBot's free API
 * (the number must first activate it — CALLMEBOT_PHONE + CALLMEBOT_APIKEY).
 */
async function sendWhatsapp(data: Record<string, unknown>, kind: Kind, order: CartItem[]) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apiKey) return { sent: false, reason: "missing_callmebot_config" };

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", buildWhatsappText(data, kind, order));
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const body = await response.text().catch(() => "");
  if (!response.ok || /error|invalid/i.test(body)) {
    return { sent: false, reason: `callmebot_${response.status}: ${body.replace(/<[^>]*>/g, " ").trim().slice(0, 200)}` };
  }
  return { sent: true };
}

async function saveToDatabase(data: Record<string, unknown>, kind: Kind, order: CartItem[]) {
  const supabase = getSupabase();
  if (!supabase) return { saved: false, reason: "missing_supabase_config" };

  // The leads table only knows 'contacto' and 'diagnostico' (see
  // supabase/schema.sql): orders and newsletter sign-ups are 'contacto' rows,
  // told apart by seccion_origen and, for orders, the PEDIDO block.
  const mensaje = order.length ? `PEDIDO\n${orderText(order)}` : typeof data.mensaje === "string" ? data.mensaje : "";

  const { error } = await supabase.from("leads").insert({
    tipo: kind === "diagnostico" ? "diagnostico" : "contacto",
    nombre: kind === "diagnostico" ? data.nombre_negocio : kind === "newsletter" ? "Suscripción" : data.nombre,
    celular: kind === "diagnostico" ? data.contacto : kind === "newsletter" ? null : data.celular,
    correo: kind === "diagnostico" ? null : data.correo || null,
    mensaje: mensaje || null,
    seccion_origen: data.seccion_origen ?? null,
    respuestas: kind === "diagnostico" ? data.respuestas ?? null : null,
  });
  if (error) return { saved: false, reason: error.message };
  return { saved: true };
}

/** Caps every string field so nobody can push huge payloads into the inbox or the table. */
function clean(raw: unknown): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries((raw ?? {}) as Record<string, unknown>)) {
    data[key] = typeof value === "string" ? value.slice(0, 2000) : value;
  }
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const data = clean(await req.json());
    const order = Array.isArray(data.carrito) ? cartItems(data.carrito.slice(0, 100)) : [];
    const kind: Kind =
      data.tipo === "diagnostico" ? "diagnostico" : data.tipo === "newsletter" ? "newsletter" : order.length ? "pedido" : "contacto";

    if (kind === "newsletter" && !isEmail(data.correo)) {
      return NextResponse.json({ ok: false, reason: "invalid_email" }, { status: 400 });
    }

    const [emailResult, dbResult, whatsappResult] = await Promise.allSettled([
      sendEmail(data, kind, order),
      saveToDatabase(data, kind, order),
      sendWhatsapp(data, kind, order),
    ]);

    return NextResponse.json({
      ok: true,
      email: emailResult.status === "fulfilled" ? emailResult.value : { sent: false, reason: "error" },
      database: dbResult.status === "fulfilled" ? dbResult.value : { saved: false, reason: "error" },
      whatsapp: whatsappResult.status === "fulfilled" ? whatsappResult.value : { sent: false, reason: "error" },
    });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
