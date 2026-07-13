import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(request, "rentals.manage");
  if (error) return error;

  const { id } = await params;
  const db = getDb();
  const order = db.prepare("SELECT * FROM rental_orders WHERE id = ?").get(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = db
    .prepare("SELECT * FROM rental_order_items WHERE rental_order_id = ? ORDER BY id ASC")
    .all(id);
  const payments = db
    .prepare("SELECT * FROM rental_payments WHERE rental_order_id = ? ORDER BY paid_at DESC")
    .all(id);

  return NextResponse.json({ order, items, payments });
}
