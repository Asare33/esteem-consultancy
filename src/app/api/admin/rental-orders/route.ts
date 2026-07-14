import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request, "rentals.manage");
  if (error) return error;

  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  let sql = "SELECT * FROM rental_orders WHERE 1=1";
  const params: string[] = [];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  if (q) {
    sql += " AND (rental_number LIKE ? OR customer_name LIKE ? OR venue LIKE ? OR event_name LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }

  sql += " ORDER BY created_at DESC LIMIT 200";
  const orders = await db.prepare(sql).all(...params);

  return NextResponse.json({ orders });
}

const statusSchema = z.object({
  status: z.enum([
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "preparing",
    "picked_up",
    "in_use",
    "partially_returned",
    "returned",
    "completed",
    "cancelled",
  ]),
});

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin(request, "rentals.manage");
  if (error) return error;

  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { status } = statusSchema.parse(body);
    const db = await getDb();

    const order = (await db.prepare("SELECT * FROM rental_orders WHERE id = ?").get(id)) as
      | { id: number; rental_number: string; status: string }
      | undefined;
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    try {
      await db.transaction(async (tx) => {
        await tx
          .prepare(
            "UPDATE rental_orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
          )
          .run(status, id);

        if (status === "approved" && order.status !== "approved") {
          const items = (await tx
            .prepare("SELECT * FROM rental_order_items WHERE rental_order_id = ?")
            .all(id)) as {
            inventory_item_id: number | null;
            quantity: number;
          }[];

          for (const item of items) {
            if (!item.inventory_item_id) continue;
            const inv = (await tx
              .prepare("SELECT available_stock, reserved_stock FROM inventory_items WHERE id = ?")
              .get(item.inventory_item_id)) as
              | { available_stock: number; reserved_stock: number }
              | undefined;
            if (!inv) continue;
            if (inv.available_stock < item.quantity) {
              throw new Error(`Insufficient stock for inventory item ${item.inventory_item_id}`);
            }
            await tx
              .prepare(
                `UPDATE inventory_items
             SET available_stock = available_stock - ?,
                 reserved_stock = reserved_stock + ?,
                 updated_at = datetime('now')
             WHERE id = ?`
              )
              .run(item.quantity, item.quantity, item.inventory_item_id);
            await tx
              .prepare(
                `INSERT INTO inventory_transactions (inventory_item_id, rental_order_id, type, quantity, note)
             VALUES (?, ?, 'reserve', ?, ?)`
              )
              .run(item.inventory_item_id, id, item.quantity, `Approved ${order.rental_number}`);
          }
        }

        if ((status === "returned" || status === "completed") && order.status !== "returned") {
          const items = (await tx
            .prepare("SELECT * FROM rental_order_items WHERE rental_order_id = ?")
            .all(id)) as {
            inventory_item_id: number | null;
            quantity: number;
            qty_returned: number;
          }[];

          for (const item of items) {
            if (!item.inventory_item_id) continue;
            const remaining = item.quantity - (item.qty_returned || 0);
            if (remaining <= 0) continue;
            await tx
              .prepare(
                `UPDATE inventory_items
             SET available_stock = available_stock + ?,
                 reserved_stock = MAX(reserved_stock - ?, 0),
                 updated_at = datetime('now')
             WHERE id = ?`
              )
              .run(remaining, remaining, item.inventory_item_id);
            await tx
              .prepare(
                `UPDATE rental_order_items SET qty_returned = quantity, return_status = 'returned' WHERE rental_order_id = ? AND inventory_item_id = ?`
              )
              .run(id, item.inventory_item_id);
            await tx
              .prepare(
                `INSERT INTO inventory_transactions (inventory_item_id, rental_order_id, type, quantity, note)
             VALUES (?, ?, 'return', ?, ?)`
              )
              .run(item.inventory_item_id, id, remaining, `Returned ${order.rental_number}`);
          }
        }
      });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Stock update failed" },
        { status: 400 }
      );
    }

    await logActivity("update_status", "rental_order", id, `${order.rental_number} -> ${status}`);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update rental" }, { status: 500 });
  }
}
