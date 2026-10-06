"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession, passwordMatches } from "@/lib/admin-session";

export type LoginState = { error?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    // Slows down guessing; the message never says which part was wrong.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "Contraseña incorrecta." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin");
}
