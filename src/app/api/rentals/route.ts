import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateReference, getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const publicRentalSchema = z.object({
  customer_name: z.string().min(2),
  contact: z.string().min(6),
  email: z.string().email().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().int().min(1),
      durationDays: z.number().int().min(1).optional(),
    })
  ).optional(),
  item_rented: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
  date_out: z.string().optional(),
  return_date: z.string().optional(),
  notes: z.string().optional(),
  reference: z.string().optional(),
  deliveryLocation: z.string().optional(),
  pickup: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = publicRentalSchema.parse(await request.json());
    const db = getDb();
    const reference = body.reference ?? generateReference("RN");
    const inserted: number[] = [];

    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        const notes = [
          body.notes,
          body.deliveryLocation ? `Delivery: ${body.deliveryLocation}` : null,
          body.pickup ? "Self pickup requested" : null,
          item.durationDays ? `Duration: ${item.durationDays} days` : null,
        ]
          .filter(Boolean)
          .join(". ");

        const result = db
          .prepare(
            `INSERT INTO rentals (reference, customer_name, contact, email, item_rented, quantity, date_out, return_date, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
          )
          .run(
            `${reference}-${item.name.slice(0, 10)}`,
            body.customer_name,
            body.contact,
            body.email ?? null,
            item.name,
            item.quantity,
            body.date_out ?? null,
            body.return_date ?? null,
            notes || null
          );
        inserted.push(Number(result.lastInsertRowid));
      }
    } else {
      const itemName = body.item_rented ?? "General rental request";
      const result = db
        .prepare(
          `INSERT INTO rentals (reference, customer_name, contact, email, item_rented, quantity, date_out, return_date, status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
        )
        .run(
          reference,
          body.customer_name,
          body.contact,
          body.email ?? null,
          itemName,
          body.quantity ?? 1,
          body.date_out ?? null,
          body.return_date ?? null,
          body.notes ?? null
        );
      inserted.push(Number(result.lastInsertRowid));
    }

    logActivity("create", "rental", inserted[0], `Website: ${reference}`);
    return NextResponse.json({ ok: true, reference, ids: inserted }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid rental data" }, { status: 400 });
  }
}
