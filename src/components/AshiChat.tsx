"use client";

import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: "¡Hola! Soy ASHI, la asistente de ASHER. Pregúntame por nuestros servicios, precios o cómo podemos ayudar a tu marca.",
};

const SUGGESTIONS = ["¿Qué servicios ofrecen?", "¿Cuánto cuesta registrar mi marca?", "Quiero una página web"];

/** Renders **bold**, links and site paths (/servicios/...) inside a reply. */
function renderText(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/\S+|\/[a-z][\w\-/#]*)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^(https?:\/\/|\/[a-z])/.test(part)) {
      const href = part.replace(/[).,;:]+$/, "");
      const trailing = part.slice(href.length);
      return (
        <Fragment key={i}>
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline underline-offset-2">
            {href}
          </a>
          {trailing}
        </Fragment>
      );
    }
    return <Fragment key={i}>{part.replace(/\*\*/g, "")}</Fragment>;
  });
}

/** Floating ASHI assistant (bottom-left; the impact badge owns bottom-right). */
export default function AshiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 1000);
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ashi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is UI only; the API gets the real conversation.
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "No pude conectarme. Escríbenos por WhatsApp al +593 99 219 8798." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Chat con ASHI"
            className="fixed bottom-20 left-4 right-4 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg)] shadow-[0_20px_60px_-15px_rgba(11,25,86,0.35)] sm:left-6 sm:right-auto sm:w-[380px] md:bottom-24"
          >
            <div className="flex items-center justify-between bg-[var(--color-ink)] px-5 py-4 text-white">
              <div>
                <p className="font-display text-lg font-medium tracking-tight">ASHI</p>
                <p className="text-xs text-white/70">Asistente de ASHER</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                data-cursor="expand"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={listRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-[var(--color-ink)] text-white"
                        : "rounded-bl-md bg-[var(--color-surface)] text-[var(--color-ink)]"
                    }`}
                  >
                    {m.role === "assistant" ? renderText(m.content) : m.content}
                  </p>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <p className="rounded-2xl rounded-bl-md bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink-soft)]">
                    ASHI está escribiendo…
                  </p>
                </div>
              )}
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      data-cursor="expand"
                      className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-[var(--color-line)] p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                placeholder="Escribe tu pregunta…"
                aria-label="Mensaje para ASHI"
                className="min-w-0 flex-1 rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                data-cursor="expand"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-ink)] text-white disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="px-4 pb-3 text-center text-[0.65rem] text-[var(--color-ink-soft)]">
              ASHI es una IA y puede equivocarse. Para casos concretos, escríbenos.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Cerrar chat con ASHI" : "Abrir chat con ASHI"}
        data-cursor="expand"
        className="fixed bottom-4 left-4 z-50 flex h-12 items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 text-white shadow-[0_10px_30px_-10px_rgba(11,25,86,0.6)] transition-transform duration-300 hover:-translate-y-0.5 md:bottom-6 md:left-6"
      >
        <span className="h-2 w-2 rounded-full bg-[#8fb0e3]" aria-hidden="true" />
        <span className="font-[family-name:var(--font-body)] text-sm font-medium uppercase tracking-[0.2em]">Ashi</span>
      </button>
    </>
  );
}
