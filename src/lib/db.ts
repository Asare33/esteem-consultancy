import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { applyEnterpriseSchema, generateRentalNumber } from "@/lib/schema-enterprise";

const DATA_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "esteem.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  initSchema(db);
  applyEnterpriseSchema(db);
  seedAdmin(db);

  return db;
}

export { generateRentalNumber };

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_date TEXT,
      location TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','completed','cancelled')),
      source TEXT DEFAULT 'website',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      contact TEXT NOT NULL,
      email TEXT,
      item_rented TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      date_out TEXT,
      return_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','out','returned','cancelled')),
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS news_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      alt TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const albumCount = database.prepare("SELECT COUNT(*) as c FROM gallery_albums").get() as { c: number };
  if (albumCount.c === 0) {
    const albums = [
      { name: "Weddings", slug: "weddings" },
      { name: "Funerals", slug: "funerals" },
      { name: "Corporate Events", slug: "corporate" },
      { name: "Parties", slug: "parties" },
    ];
    const insert = database.prepare("INSERT INTO gallery_albums (name, slug) VALUES (?, ?)");
    for (const a of albums) insert.run(a.name, a.slug);
  }
}

function seedAdmin(database: Database.Database) {
  const count = database.prepare("SELECT COUNT(*) as c FROM admins").get() as { c: number };
  if (count.c > 0) return;

  const email = process.env.ADMIN_EMAIL ?? "admin@esteemconsultancygh.com";
  const password = process.env.ADMIN_PASSWORD ?? "esteem2026";
  const hash = bcrypt.hashSync(password, 12);

  database.prepare("INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)").run(
    email,
    hash,
    "Esteem Admin"
  );
}

export function logActivity(
  action: string,
  entityType: string,
  entityId: number | null,
  details?: string
) {
  getDb()
    .prepare("INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)")
    .run(action, entityType, entityId, details ?? null);
}

export function generateReference(prefix: string): string {
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}
