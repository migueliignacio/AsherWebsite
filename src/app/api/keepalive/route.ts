import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

/**
 * Daily Vercel Cron (see vercel.json): one tiny query so Supabase's free
 * plan doesn't pause the project after a week without activity — a paused
 * project silently drops every lead /api/notify tries to save.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set;
 * other callers are turned away. Never returns any lead data.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: false, reason: "missing_supabase_config" }, { status: 500 });

  const { error } = await supabase.from("leads").select("id", { head: true, count: "exact" });
  if (error) return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
