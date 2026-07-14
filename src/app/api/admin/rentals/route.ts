import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { generateReference, getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const rentalSchema = z.object({
  customer_name: z.string().min(2),
  contact: z.string().min(6),
  email: z.string().email().optional(),
  item_rented: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  date_out: z.string().optional(),
  return_date: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "out", "returned", "cancelled"]).optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const contact = searchParams.get("contact");

  let query = "SELECT * FROM rentals WHERE 1=1";
  const params: string[] = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  if (contact) {
    query += " AND contact LIKE ?";
    params.push(`%${contact}%`);
  }

  query += " ORDER BY created_at DESC";
  const rentals = await (await getDb()).prepare(query).all(...params);
  return NextResponse.json({ rentals });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = rentalSchema.parse(await request.json());
    const reference = generateReference("RN");
    const db = await getDb();

    const result = await db
      .prepare(
        `INSERT INTO rentals (reference, customer_name, contact, email, item_rented, quantity, date_out, return_date, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        reference,
        body.customer_name,
        body.contact,
        body.email ?? null,
        body.item_rented,
        body.quantity,
        body.date_out ?? null,
        body.return_date ?? null,
        body.status ?? "pending",
        body.notes ?? null
      );

    await logActivity("create", "rental", Number(result.lastInsertRowid), reference);
    return NextResponse.json({ ok: true, id: result.lastInsertRowid, reference }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid rental data" }, { status: 400 });
  }
}
