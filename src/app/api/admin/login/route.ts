import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateAdmin, createToken, setSessionCookie } from "@/lib/auth";
import { logActivity } from "@/lib/db";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const admin = authenticateAdmin(body.email, body.password);

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken(admin);
    await setSessionCookie(token);
    logActivity("login", "admin", admin.id, admin.email);

    return NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
