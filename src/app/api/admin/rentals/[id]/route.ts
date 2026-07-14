import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const updateSchema = z.object({
  customer_name: z.string().min(2).optional(),
  contact: z.string().min(6).optional(),
  email: z.string().email().nullable().optional(),
  item_rented: z.string().min(1).optional(),
  quantity: z.number().int().min(1).optional(),
  date_out: z.string().nullable().optional(),
  return_date: z.string().nullable().optional(),
  status: z.enum(["pending", "approved", "rejected", "out", "returned", "cancelled"]).optional(),
  notes: z.string().nullable().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const rentalId = parseInt(id, 10);

  try {
    const body = updateSchema.parse(await request.json());
    const db = await getDb();
    const existing = await db.prepare("SELECT * FROM rentals WHERE id = ?").get(rentalId);
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
    values.push(rentalId);

    await db.prepare(`UPDATE rentals SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    await logActivity("update", "rental", rentalId, JSON.stringify(body));

    const updated = await db.prepare("SELECT * FROM rentals WHERE id = ?").get(rentalId);
    return NextResponse.json({ ok: true, rental: updated });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const rentalId = parseInt(id, 10);
  await (await getDb()).prepare("DELETE FROM rentals WHERE id = ?").run(rentalId);
  await logActivity("delete", "rental", rentalId);

  return NextResponse.json({ ok: true });
}
