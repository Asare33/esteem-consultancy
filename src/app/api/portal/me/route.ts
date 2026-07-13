import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerToken } from "@/lib/customer-auth";
import { CUSTOMER_COOKIE } from "@/lib/auth-constants";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

async function requireCustomer(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_COOKIE)?.value;
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  const session = await verifyCustomerToken(token);
  if (!session) return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }), session: null };
  return { error: null, session };
}

export async function GET(request: NextRequest) {
  const { error, session } = await requireCustomer(request);
  if (error || !session) return error;

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "overview";

  if (type === "me") {
    return NextResponse.json({ customer: session });
  }

  const rentals = db
    .prepare(
      `SELECT id, rental_number, event_name, venue, pickup_date, return_date, status,
              payment_status, grand_total_ghs, amount_paid_ghs, balance_ghs, created_at
       FROM rental_orders
       WHERE customer_id = ? OR lower(customer_email) = lower(?)
       ORDER BY created_at DESC LIMIT 50`
    )
    .all(session.id, session.email);

  const bookings = db
    .prepare(
      `SELECT id, reference, event_type, event_date, location, status, created_at
       FROM bookings
       WHERE lower(email) = lower(?)
       ORDER BY created_at DESC LIMIT 50`
    )
    .all(session.email);

  const payments = db
    .prepare(
      `SELECT p.id, p.amount_ghs, p.method, p.reference, p.paid_at, o.rental_number
       FROM rental_payments p
       JOIN rental_orders o ON o.id = p.rental_order_id
       WHERE o.customer_id = ? OR lower(o.customer_email) = lower(?)
       ORDER BY p.paid_at DESC LIMIT 50`
    )
    .all(session.id, session.email);

  const notifications = db
    .prepare(
      `SELECT id, title, body, link, is_read, created_at
       FROM notifications
       WHERE audience = 'customer' OR audience = ?
       ORDER BY created_at DESC LIMIT 30`
    )
    .all(`customer:${session.id}`);

  return NextResponse.json({ rentals, bookings, payments, notifications });
}
