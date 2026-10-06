import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Server-only session for the private /admin page (see app/admin/). A
 * single shared password (ADMIN_PASSWORD) unlocks an 8-hour session stored
 * in an httpOnly cookie signed with ADMIN_SESSION_SECRET — the browser can
 * neither read nor forge it. With either env var missing, nobody gets in.
 */

export const ADMIN_COOKIE = "asher_admin";
const SESSION_SECONDS = 8 * 60 * 60;

function secret(): string | null {
  const value = process.env.ADMIN_SESSION_SECRET;
  return value && value.length >= 32 ? value : null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Constant-time string comparison (hashing first so lengths always match). */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !secret()) return false;
  return safeEqual(candidate, expected);
}

export async function createAdminSession() {
  const key = secret();
  if (!key) return;
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expires);
  (await cookies()).set(ADMIN_COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
}

export async function deleteAdminSession() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}

export async function hasAdminSession(): Promise<boolean> {
  const key = secret();
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!key || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, key))) return false;
  return Number(payload) > Math.floor(Date.now() / 1000);
}
