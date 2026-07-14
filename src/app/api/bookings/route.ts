import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateReference, getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const publicBookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  event_type: z.string().min(1),
  event_date: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  reference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = publicBookingSchema.parse(await request.json());
    const reference = body.reference ?? generateReference("BK");
    const db = await getDb();

    const result = await db
      .prepare(
        `INSERT INTO bookings (reference, name, email, phone, event_type, event_date, location, message, status, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
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
        body.source ?? "website"
      );

    await logActivity("create", "booking", Number(result.lastInsertRowid), `Website: ${reference}`);
    return NextResponse.json({ ok: true, reference, id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }
}
