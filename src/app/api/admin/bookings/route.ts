import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { generateReference, getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_type: z.string().min(1),
  event_date: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(["pending", "approved", "completed", "cancelled"]).optional(),
  source: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request, "bookings.manage");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const eventType = searchParams.get("event_type");
  const date = searchParams.get("date");
  const q = searchParams.get("q")?.trim();

  let query = "SELECT * FROM bookings WHERE 1=1";
  const params: string[] = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  if (eventType) {
    query += " AND event_type LIKE ?";
    params.push(`%${eventType}%`);
  }
  if (date) {
    query += " AND event_date = ?";
    params.push(date);
  }
  if (q) {
    query += " AND (reference LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR location LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }

  query += " ORDER BY created_at DESC LIMIT 300";

  const bookings = await (await getDb()).prepare(query).all(...params);
  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request, "bookings.manage");
  if (error) return error;

  try {
    const body = bookingSchema.parse(await request.json());
    const reference = generateReference("BK");
    const db = await getDb();

    const result = await db
      .prepare(
        `INSERT INTO bookings (reference, name, email, phone, event_type, event_date, location, message, status, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        reference,
        body.name,
        body.email,
        body.phone,
        body.event_type,
        body.event_date ?? null,
        body.location ?? null,
        body.message ?? null,
        body.status ?? "pending",
        body.source ?? "admin"
      );

    await logActivity("create", "booking", Number(result.lastInsertRowid), reference);
    return NextResponse.json({ ok: true, id: result.lastInsertRowid, reference }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }
}
