import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, generateRentalNumber, logActivity } from "@/lib/db";
import { findOrCreateCustomerByContact } from "@/lib/customer-auth";

export const runtime = "nodejs";

const itemSchema = z.object({
  inventoryItemId: z.number().optional(),
  itemName: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceGhs: z.number().nonnegative(),
  days: z.number().int().positive().default(1),
});

const createSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email().optional().or(z.literal("")),
  eventName: z.string().optional(),
  eventType: z.string().optional(),
  venue: z.string().optional(),
  pickupDate: z.string().optional(),
  returnDate: z.string().optional(),
  transportGhs: z.number().nonnegative().default(0),
  discountGhs: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const db = await getDb();

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.unitPriceGhs * item.quantity * item.days,
      0
    );
    const transport = data.transportGhs ?? 0;
    const discount = data.discountGhs ?? 0;
    const vat = 0;
    const grandTotal = Math.max(0, subtotal + transport + vat - discount);

    const rentalNumber = await generateRentalNumber(db);
    const customerId = await findOrCreateCustomerByContact({
      fullName: data.customerName,
      email: data.customerEmail || null,
      phone: data.customerPhone,
    });

    const orderId = await db.transaction(async (tx) => {
      const result = await tx
        .prepare(
          `INSERT INTO rental_orders (
            rental_number, customer_id, customer_name, customer_phone, customer_email,
            event_name, event_type, venue, pickup_date, return_date,
            status, payment_status, subtotal_ghs, discount_ghs, transport_ghs,
            vat_ghs, grand_total_ghs, amount_paid_ghs, balance_ghs, notes, source
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_approval', 'unpaid', ?, ?, ?, ?, ?, 0, ?, ?, 'website')`
        )
        .run(
          rentalNumber,
          customerId,
          data.customerName,
          data.customerPhone,
          data.customerEmail || null,
          data.eventName || null,
          data.eventType || "Equipment Rental",
          data.venue || null,
          data.pickupDate || null,
          data.returnDate || null,
          subtotal,
          discount,
          transport,
          vat,
          grandTotal,
          grandTotal,
          data.notes || null
        );

      const orderId = Number(result.lastInsertRowid);
      const insertItem = tx.prepare(
        `INSERT INTO rental_order_items (
          rental_order_id, inventory_item_id, item_name, quantity,
          unit_price_ghs, days, line_total_ghs, qty_out
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

      for (const item of data.items) {
        const lineTotal = item.unitPriceGhs * item.quantity * item.days;
        await insertItem.run(
          orderId,
          item.inventoryItemId ?? null,
          item.itemName,
          item.quantity,
          item.unitPriceGhs,
          item.days,
          lineTotal,
          item.quantity
        );
      }

      await tx
        .prepare(
          `INSERT INTO notifications (audience, title, body, link) VALUES ('admin', ?, ?, ?)`
        )
        .run(
          "New rental request",
          `${data.customerName} submitted ${rentalNumber}`,
          "/admin/rentals"
        );

      return orderId;
    });

    await logActivity("create", "rental_order", orderId, rentalNumber);

    return NextResponse.json({
      ok: true,
      id: orderId,
      rentalNumber,
      grandTotalGhs: grandTotal,
      status: "pending_approval",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to create rental order" }, { status: 500 });
  }
}
