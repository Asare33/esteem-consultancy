import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const paymentSchema = z.object({
  rentalOrderId: z.number().int().positive(),
  amountGhs: z.number().positive(),
  method: z.enum(["cash", "momo", "bank", "card", "cheque"]).default("cash"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request, "payments.manage");
  if (error) return error;

  try {
    const data = paymentSchema.parse(await request.json());
    const db = await getDb();

    const order = (await db
      .prepare("SELECT * FROM rental_orders WHERE id = ?")
      .get(data.rentalOrderId)) as
      | {
          id: number;
          rental_number: string;
          grand_total_ghs: number;
          amount_paid_ghs: number;
          customer_id: number | null;
        }
      | undefined;

    if (!order) return NextResponse.json({ error: "Rental order not found" }, { status: 404 });

    const nextPaid = Number(order.amount_paid_ghs) + data.amountGhs;
    const balance = Math.max(0, Number(order.grand_total_ghs) - nextPaid);
    const paymentStatus =
      balance <= 0 ? "paid" : nextPaid > 0 ? "partial" : "unpaid";

    await db.transaction(async (tx) => {
      await tx
        .prepare(
          `INSERT INTO rental_payments (rental_order_id, amount_ghs, method, reference, notes)
         VALUES (?, ?, ?, ?, ?)`
        )
        .run(
          data.rentalOrderId,
          data.amountGhs,
          data.method,
          data.reference ?? null,
          data.notes ?? null
        );

      await tx
        .prepare(
          `UPDATE rental_orders
         SET amount_paid_ghs = ?, balance_ghs = ?, payment_status = ?, updated_at = datetime('now')
         WHERE id = ?`
        )
        .run(nextPaid, balance, paymentStatus, data.rentalOrderId);

      await tx
        .prepare(
          `INSERT INTO notifications (audience, title, body, link) VALUES (?, ?, ?, ?)`
        )
        .run(
          order.customer_id ? `customer:${order.customer_id}` : "customer",
          "Payment received",
          `Payment of GH₵${data.amountGhs.toLocaleString()} recorded for ${order.rental_number}`,
          "/portal/payments"
        );
    });

    await logActivity("payment", "rental_order", order.id, `${order.rental_number} +${data.amountGhs}`);

    return NextResponse.json({
      ok: true,
      amountPaidGhs: nextPaid,
      balanceGhs: balance,
      paymentStatus,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to record payment" }, { status: 500 });
  }
}
