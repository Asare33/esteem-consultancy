/**
 * Enterprise platform schema extensions.
 * Additive migrations on top of the existing esteem.db tables.
 * Keeps prior bookings/rentals/news/gallery intact.
 */
import type Database from "better-sqlite3";
import { equipmentItems } from "@/data/equipment";

export function applyEnterpriseSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS staff_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role_key TEXT NOT NULL DEFAULT 'administrator',
      phone TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (role_key) REFERENCES roles(key)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      phone TEXT,
      password_hash TEXT,
      full_name TEXT NOT NULL,
      company TEXT,
      address TEXT,
      city TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_code TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      total_stock INTEGER NOT NULL DEFAULT 0,
      reserved_stock INTEGER NOT NULL DEFAULT 0,
      available_stock INTEGER NOT NULL DEFAULT 0,
      rental_price_ghs REAL NOT NULL DEFAULT 0,
      maintenance_status TEXT NOT NULL DEFAULT 'ok',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rental_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      event_name TEXT,
      event_type TEXT,
      venue TEXT,
      pickup_date TEXT,
      return_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending_approval',
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      subtotal_ghs REAL NOT NULL DEFAULT 0,
      discount_ghs REAL NOT NULL DEFAULT 0,
      transport_ghs REAL NOT NULL DEFAULT 0,
      vat_ghs REAL NOT NULL DEFAULT 0,
      grand_total_ghs REAL NOT NULL DEFAULT 0,
      amount_paid_ghs REAL NOT NULL DEFAULT 0,
      balance_ghs REAL NOT NULL DEFAULT 0,
      notes TEXT,
      source TEXT DEFAULT 'website',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS rental_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_order_id INTEGER NOT NULL,
      inventory_item_id INTEGER,
      item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price_ghs REAL NOT NULL DEFAULT 0,
      days INTEGER NOT NULL DEFAULT 1,
      line_total_ghs REAL NOT NULL DEFAULT 0,
      qty_out INTEGER NOT NULL DEFAULT 0,
      qty_returned INTEGER NOT NULL DEFAULT 0,
      return_status TEXT NOT NULL DEFAULT 'pending',
      FOREIGN KEY (rental_order_id) REFERENCES rental_orders(id) ON DELETE CASCADE,
      FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
    );

    CREATE TABLE IF NOT EXISTS rental_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_order_id INTEGER NOT NULL,
      amount_ghs REAL NOT NULL,
      method TEXT NOT NULL DEFAULT 'cash',
      reference TEXT,
      notes TEXT,
      paid_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (rental_order_id) REFERENCES rental_orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inventory_item_id INTEGER NOT NULL,
      rental_order_id INTEGER,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
      FOREIGN KEY (rental_order_id) REFERENCES rental_orders(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      audience TEXT NOT NULL DEFAULT 'admin',
      title TEXT NOT NULL,
      body TEXT,
      link TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedRoles(database);
  seedInventory(database);
}

function seedRoles(database: Database.Database) {
  const count = database.prepare("SELECT COUNT(*) as c FROM roles").get() as { c: number };
  if (count.c > 0) return;

  const roles = [
    ["super_admin", "Super Admin", "Full system access"],
    ["administrator", "Administrator", "Operations and content"],
    ["rental_manager", "Rental Manager", "Rentals and inventory"],
    ["inventory_officer", "Inventory Officer", "Stock and returns"],
    ["finance_officer", "Finance Officer", "Payments and invoices"],
    ["customer_service", "Customer Service", "Bookings and support"],
    ["event_coordinator", "Event Coordinator", "Event delivery"],
  ] as const;

  const insert = database.prepare("INSERT INTO roles (key, name, description) VALUES (?, ?, ?)");
  for (const [key, name, description] of roles) insert.run(key, name, description);
}

function seedInventory(database: Database.Database) {
  const find = database.prepare(
    `SELECT id FROM inventory_items WHERE item_code = ? OR lower(name) = lower(?) LIMIT 1`
  );
  const insert = database.prepare(`
    INSERT INTO inventory_items (
      item_code, category, name, description, image,
      total_stock, reserved_stock, available_stock, rental_price_ghs, active
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 1)
  `);

  // Only insert missing catalogue items — never overwrite admin edits (esp. images).
  for (const item of equipmentItems) {
    const code = `INV-${item.id.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 28)}`;
    const existing = find.get(code, item.name) as { id: number } | undefined;
    if (existing) continue;

    const total = item.availability === "reserved" ? 0 : item.availability === "limited" ? 25 : 100;
    insert.run(
      code,
      item.category,
      item.name,
      item.description,
      item.image,
      total,
      total,
      item.dailyRateGhs
    );
  }
}

export function generateRentalNumber(database: Database.Database): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const prefix = `RENT-${y}${m}${d}`;
  const row = database
    .prepare("SELECT COUNT(*) as c FROM rental_orders WHERE rental_number LIKE ?")
    .get(`${prefix}-%`) as { c: number };
  return `${prefix}-${String(row.c + 1).padStart(4, "0")}`;
}
