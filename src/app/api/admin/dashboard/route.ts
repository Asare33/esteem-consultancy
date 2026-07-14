import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request, "dashboard.view");
  if (error) return error;

  const db = await getDb();

  const bookings = (await db.prepare("SELECT COUNT(*) as c FROM bookings").get()) as { c: number };
  const rentals = (await db.prepare("SELECT COUNT(*) as c FROM rentals").get()) as { c: number };
  const photos = (await db.prepare("SELECT COUNT(*) as c FROM gallery_images").get()) as {
    c: number;
  };
  const news = (await db
    .prepare("SELECT COUNT(*) as c FROM news_posts WHERE status = 'published'")
    .get()) as { c: number };

  const pendingBookings = (await db
    .prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'")
    .get()) as { c: number };
  const pendingRentals = (await db
    .prepare("SELECT COUNT(*) as c FROM rentals WHERE status = 'pending'")
    .get()) as { c: number };

  const rentalOrders = (await db.prepare("SELECT COUNT(*) as c FROM rental_orders").get()) as {
    c: number;
  };
  const pendingOrders = (await db
    .prepare("SELECT COUNT(*) as c FROM rental_orders WHERE status = 'pending_approval'")
    .get()) as { c: number };
  const approvedOrders = (await db
    .prepare(
      "SELECT COUNT(*) as c FROM rental_orders WHERE status IN ('approved','preparing','picked_up','in_use')"
    )
    .get()) as { c: number };
  const returnedOrders = (await db
    .prepare("SELECT COUNT(*) as c FROM rental_orders WHERE status IN ('returned','completed')")
    .get()) as { c: number };
  const customers = (await db.prepare("SELECT COUNT(*) as c FROM customers").get()) as {
    c: number;
  };
  const inventory = (await db.prepare("SELECT COUNT(*) as c FROM inventory_items").get()) as {
    c: number;
  };
  const revenueMonth = (await db
    .prepare(
      `SELECT COALESCE(SUM(amount_paid_ghs),0) as total FROM rental_orders
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
    )
    .get()) as { total: number };
  const outstanding = (await db
    .prepare("SELECT COALESCE(SUM(balance_ghs),0) as total FROM rental_orders WHERE balance_ghs > 0")
    .get()) as { total: number };

  const recentActivity = await db
    .prepare("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 15")
    .all();

  const recentBookings = await db
    .prepare(
      "SELECT id, reference, name, event_type, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5"
    )
    .all();
  const recentRentals = await db
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
