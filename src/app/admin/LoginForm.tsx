"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium">
        Contraseña
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-3 text-base outline-none focus:border-[var(--color-ink)]"
        />
      </label>
      {state?.error && <p className="text-sm text-[#7d1a1f]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-bg)] disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
