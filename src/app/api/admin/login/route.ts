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
    const admin = await authenticateAdmin(body.email, body.password);

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken(admin);
    await setSessionCookie(token);

    try {
      await logActivity("login", "admin", admin.id, admin.email);
    } catch (error) {
      console.error("Failed to log admin login activity:", error);
    }

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
    }
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again." },
      { status: 500 }
    );
  }
}
