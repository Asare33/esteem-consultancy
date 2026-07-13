import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME, type AdminSession } from "@/lib/auth";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { hasPermission, type Permission } from "@/lib/permissions";

export async function requireAdmin(
  request: NextRequest,
  permission?: Permission
): Promise<{ error: NextResponse | null; session: AdminSession | null }> {
  const token =
    request.cookies.get(ADMIN_COOKIE)?.value ??
    request.cookies.get(COOKIE_NAME)?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }

  const session = await verifyToken(token);
  if (!session) {
    return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }), session: null };
  }

  if (permission && !hasPermission(session.roleKey, permission)) {
    return {
      error: NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 }),
      session,
    };
  }

  return { error: null, session };
}
