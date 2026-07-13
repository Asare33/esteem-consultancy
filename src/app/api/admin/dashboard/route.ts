import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request, "dashboard.view");
  if (error) return error;

  const db = getDb();

  const bookings = db.prepare("SELECT COUNT(*) as c FROM bookings").get() as { c: number };
  const rentals = db.prepare("SELECT COUNT(*) as c FROM rentals").get() as { c: number };
  const photos = db.prepare("SELECT COUNT(*) as c FROM gallery_images").get() as { c: number };
  const news = db.prepare("SELECT COUNT(*) as c FROM news_posts WHERE status = 'published'").get() as { c: number };

  const pendingBookings = db
    .prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'")
    .get() as { c: number };
  const pendingRentals = db
    .prepare("SELECT COUNT(*) as c FROM rentals WHERE status = 'pending'")
    .get() as { c: number };

  const rentalOrders = db.prepare("SELECT COUNT(*) as c FROM rental_orders").get() as { c: number };
  const pendingOrders = db
    .prepare("SELECT COUNT(*) as c FROM rental_orders WHERE status = 'pending_approval'")
    .get() as { c: number };
  const approvedOrders = db
    .prepare(
      "SELECT COUNT(*) as c FROM rental_orders WHERE status IN ('approved','preparing','picked_up','in_use')"
    )
    .get() as { c: number };
  const returnedOrders = db
    .prepare("SELECT COUNT(*) as c FROM rental_orders WHERE status IN ('returned','completed')")
    .get() as { c: number };
  const customers = db.prepare("SELECT COUNT(*) as c FROM customers").get() as { c: number };
  const inventory = db.prepare("SELECT COUNT(*) as c FROM inventory_items").get() as { c: number };
  const revenueMonth = db
    .prepare(
      `SELECT COALESCE(SUM(amount_paid_ghs),0) as total FROM rental_orders
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
    )
    .get() as { total: number };
  const outstanding = db
    .prepare("SELECT COALESCE(SUM(balance_ghs),0) as total FROM rental_orders WHERE balance_ghs > 0")
    .get() as { total: number };

  const recentActivity = db
    .prepare("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 15")
    .all();

  const recentBookings = db
    .prepare("SELECT id, reference, name, event_type, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5")
    .all();
  const recentRentals = db
    .prepare(
      "SELECT id, reference, customer_name, item_rented, quantity, status, created_at FROM rentals ORDER BY created_at DESC LIMIT 5"
    )
    .all();

  return NextResponse.json({
    stats: {
      totalBookings: bookings.c,
      totalRentals: rentals.c,
      totalPhotos: photos.c,
      publishedNews: news.c,
      pendingBookings: pendingBookings.c,
      pendingRentals: pendingRentals.c,
      rentalOrders: rentalOrders.c,
      pendingOrders: pendingOrders.c,
      approvedOrders: approvedOrders.c,
      returnedOrders: returnedOrders.c,
      customers: customers.c,
      inventoryItems: inventory.c,
      revenueThisMonth: revenueMonth.total,
      outstandingPayments: outstanding.total,
    },
    recentActivity,
    recentBookings,
    recentRentals,
  });
}
