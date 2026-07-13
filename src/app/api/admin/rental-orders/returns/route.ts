import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const returnItemSchema = z.object({
  itemId: z.number().int().positive(),
  qtyReturned: z.number().int().nonnegative(),
  status: z.enum(["returned", "missing", "damaged", "lost"]).default("returned"),
});

const schema = z.object({
  rentalOrderId: z.number().int().positive(),
  items: z.array(returnItemSchema).min(1),
});

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request, "rentals.manage");
  if (error) return error;

  try {
    const data = schema.parse(await request.json());
    const db = getDb();

    const order = db.prepare("SELECT * FROM rental_orders WHERE id = ?").get(data.rentalOrderId) as
      | { id: number; rental_number: string }
      | undefined;
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const tx = db.transaction(() => {
      for (const line of data.items) {
        const item = db
          .prepare("SELECT * FROM rental_order_items WHERE id = ? AND rental_order_id = ?")
          .get(line.itemId, data.rentalOrderId) as
          | {
              id: number;
              inventory_item_id: number | null;
              quantity: number;
              qty_returned: number;
            }
          | undefined;
        if (!item) throw new Error(`Item ${line.itemId} not found on order`);

        const nextReturned = Math.min(item.quantity, line.qtyReturned);
        const previouslyReturned = item.qty_returned || 0;
        const newlyReturned = Math.max(0, nextReturned - previouslyReturned);

        db.prepare(
          `UPDATE rental_order_items
           SET qty_returned = ?, return_status = ?
           WHERE id = ?`
        ).run(nextReturned, line.status, item.id);

        if (item.inventory_item_id && newlyReturned > 0 && line.status === "returned") {
          db.prepare(
            `UPDATE inventory_items
             SET available_stock = available_stock + ?,
                 reserved_stock = MAX(reserved_stock - ?, 0),
                 updated_at = datetime('now')
             WHERE id = ?`
          ).run(newlyReturned, newlyReturned, item.inventory_item_id);

          db.prepare(
            `INSERT INTO inventory_transactions (inventory_item_id, rental_order_id, type, quantity, note)
             VALUES (?, ?, 'return', ?, ?)`
          ).run(
            item.inventory_item_id,
            data.rentalOrderId,
            newlyReturned,
            `Partial/full return ${order.rental_number}`
          );
        }

        if (item.inventory_item_id && newlyReturned > 0 && (line.status === "missing" || line.status === "lost" || line.status === "damaged")) {
          // Keep reserved reduced but do not restore available stock for missing/lost/damaged
          db.prepare(
            `UPDATE inventory_items
             SET reserved_stock = MAX(reserved_stock - ?, 0),
                 total_stock = MAX(total_stock - ?, 0),
                 updated_at = datetime('now')
             WHERE id = ?`
          ).run(newlyReturned, newlyReturned, item.inventory_item_id);

          db.prepare(
            `INSERT INTO inventory_transactions (inventory_item_id, rental_order_id, type, quantity, note)
             VALUES (?, ?, ?, ?, ?)`
          ).run(
            item.inventory_item_id,
            data.rentalOrderId,
            line.status,
            newlyReturned,
            `${line.status} on ${order.rental_number}`
          );
        }
      }

      const summary = db
        .prepare(
          `SELECT
             SUM(quantity) as qty_out,
             SUM(qty_returned) as qty_back
           FROM rental_order_items WHERE rental_order_id = ?`
        )
        .get(data.rentalOrderId) as { qty_out: number; qty_back: number };

      let status = "partially_returned";
      if (Number(summary.qty_back) >= Number(summary.qty_out)) status = "returned";

      db.prepare(
        `UPDATE rental_orders SET status = ?, updated_at = datetime('now') WHERE id = ?`
      ).run(status, data.rentalOrderId);

      return status;
    });

    const status = tx();
    logActivity("return", "rental_order", order.id, `${order.rental_number} -> ${status}`);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process return" },
      { status: 400 }
    );
  }
}
