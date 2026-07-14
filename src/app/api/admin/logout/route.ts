import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { logActivity } from "@/lib/db";

export const runtime = "nodejs";

export async function POST() {
  const session = await getSession();
  if (session) await logActivity("logout", "admin", session.id);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
