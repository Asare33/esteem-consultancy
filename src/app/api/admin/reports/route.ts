import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const raw = value == null ? "" : String(value);
    if (raw.includes(",") || raw.includes('"') || raw.includes("\n")) {
      return `"${raw.replaceAll('"', '""')}"`;
    }
    return raw;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))].join(
    "\n"
  );
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request, "reports.view");
  if (error) return error;

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const report = searchParams.get("report") ?? "rentals";
  const format = searchParams.get("format") ?? "json";

  let rows: Record<string, unknown>[] = [];

  if (report === "rentals") {
    rows = db
      .prepare(
        `SELECT rental_number, customer_name, event_name, venue, pickup_date, return_date,
                status, payment_status, grand_total_ghs, amount_paid_ghs, balance_ghs, created_at
         FROM rental_orders ORDER BY created_at DESC`
      )
      .all() as Record<string, unknown>[];
  } else if (report === "bookings") {
    rows = db
      .prepare(
        `SELECT reference, name, email, phone, event_type, event_date, location, status, source, created_at
         FROM bookings ORDER BY created_at DESC`
      )
      .all() as Record<string, unknown>[];
  } else if (report === "inventory") {
    rows = db
      .prepare(
        `SELECT item_code, name, category, total_stock, reserved_stock, available_stock, rental_price_ghs, maintenance_status
         FROM inventory_items ORDER BY name ASC`
      )
      .all() as Record<string, unknown>[];
  } else if (report === "payments") {
    rows = db
      .prepare(
        `SELECT p.id, o.rental_number, o.customer_name, p.amount_ghs, p.method, p.reference, p.paid_at
         FROM rental_payments p
         JOIN rental_orders o ON o.id = p.rental_order_id
         ORDER BY p.paid_at DESC`
      )
      .all() as Record<string, unknown>[];
  } else if (report === "outstanding") {
    rows = db
      .prepare(
        `SELECT rental_number, customer_name, grand_total_ghs, amount_paid_ghs, balance_ghs, payment_status, status
         FROM rental_orders WHERE balance_ghs > 0 ORDER BY balance_ghs DESC`
      )
      .all() as Record<string, unknown>[];
  } else if (report === "top-items") {
    rows = db
      .prepare(
        `SELECT item_name, SUM(quantity) as total_qty, SUM(line_total_ghs) as revenue
         FROM rental_order_items
         GROUP BY item_name
         ORDER BY total_qty DESC
         LIMIT 20`
      )
      .all() as Record<string, unknown>[];
  } else {
    return NextResponse.json({ error: "Unknown report" }, { status: 400 });
  }

  if (format === "csv") {
    const csv = toCsv(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${report}-report.csv"`,
      },
    });
  }

  return NextResponse.json({ report, count: rows.length, rows });
}
