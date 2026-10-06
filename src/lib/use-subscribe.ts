"use client";

import { useState, type FormEvent } from "react";

export type SubscribeStatus = "idle" | "sending" | "done" | "error";

/**
 * Newsletter sign-up for any email-only form: posts to /api/notify (saved in
 * Supabase + emailed to the team). The form needs an input named "email".
 */
export function useSubscribe(origen: string) {
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correo = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!correo) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "newsletter", correo, seccion_origen: origen }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return { status, onSubmit };
}
