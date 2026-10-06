import { NextRequest, NextResponse } from "next/server";
import { ashiSystemPrompt } from "@/lib/ashi-knowledge";

/**
 * ASHI, the site assistant (widget: components/AshiChat.tsx). Proxies the
 * conversation to Google's Gemini API server-side, so GEMINI_API_KEY never
 * reaches the browser. The system prompt (lib/ashi-knowledge.ts) keeps it
 * to ASHER topics only.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const FALLBACK =
  "Ahora mismo no puedo responder. Escríbenos por WhatsApp al +593 99 219 8798 y te atendemos enseguida.";

// Best-effort per-IP limit (per server instance): 20 messages / 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

/** GEMINI_MODEL first (if set), then free models from newest/fastest to most available. */
function modelChain(): string[] {
  const chain = [
    process.env.GEMINI_MODEL,
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
  ];
  return [...new Set(chain.filter((m): m is string => Boolean(m)))];
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-MAX_MESSAGES).map((m) => ({
    role: (m as ChatMessage)?.role === "assistant" ? "assistant" : "user",
    content: String((m as ChatMessage)?.content ?? "").slice(0, MAX_CHARS).trim(),
  })) as ChatMessage[];
  if (messages.at(-1)?.role !== "user" || !messages.at(-1)?.content) return null;
  return messages.filter((m) => m.content);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ reply: "Has enviado muchos mensajes seguidos. Espera unos minutos o escríbenos por WhatsApp al +593 99 219 8798." }, { status: 429 });
  }

  const messages = parseMessages(await req.json().catch(() => null));
  if (!messages) return NextResponse.json({ reply: "No entendí tu mensaje, ¿puedes escribirlo de nuevo?" }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ reply: FALLBACK, error: "missing_api_key" });

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: ashiSystemPrompt() }] },
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
  });

  // Gemini's free tier regularly answers 503 "high demand" for a given model,
  // sometimes for long stretches. Walk a chain of free models instead of
  // waiting: the first one that answers wins. A model that doesn't exist for
  // this key (404) or is out of quota (429) is simply skipped too.
  const deadline = Date.now() + 25000;
  let lastError = "request_failed";
  for (const model of modelChain()) {
    const remaining = deadline - Date.now();
    if (remaining < 2000) break;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body,
          signal: AbortSignal.timeout(Math.min(12000, remaining)),
        }
      );
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("ASHI Gemini error", model, response.status, detail.slice(0, 200));
        lastError = `gemini_${response.status}`;
        // A bad key or request won't get better with another model.
        if (response.status === 400 || response.status === 401 || response.status === 403) break;
        continue;
      }
      const data = await response.json();
      const reply: string = (data?.candidates?.[0]?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim();
      if (reply) return NextResponse.json({ reply });
      lastError = "empty_reply";
    } catch (error) {
      console.error("ASHI request failed", model, error instanceof Error ? error.name : error);
      lastError = "request_failed";
    }
  }
  return NextResponse.json({ reply: FALLBACK, error: lastError });
}
