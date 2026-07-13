import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  event_type: z.string().min(1).optional(),
  event_date: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  status: z.enum(["pending", "approved", "completed", "cancelled"]).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request, "bookings.manage");
  if (error) return error;

  const { id } = await params;
  const bookingId = parseInt(id, 10);
  if (isNaN(bookingId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = updateSchema.parse(await request.json());
    const db = getDb();
    const existing = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    fields.push("updated_at = datetime('now')");
    values.push(bookingId);

    db.prepare(`UPDATE bookings SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    logActivity("update", "booking", bookingId, JSON.stringify(body));

    const updated = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
    return NextResponse.json({ ok: true, booking: updated });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request, "bookings.manage");
  if (error) return error;

  const { id } = await params;
  const bookingId = parseInt(id, 10);
  getDb().prepare("DELETE FROM bookings WHERE id = ?").run(bookingId);
  logActivity("delete", "booking", bookingId);

  return NextResponse.json({ ok: true });
}
