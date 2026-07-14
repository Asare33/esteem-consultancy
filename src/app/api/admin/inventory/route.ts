import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";
import type { AppDb } from "@/lib/sql-db";

export const runtime = "nodejs";

const itemSchema = z.object({
  itemCode: z.string().trim().min(2).max(40).optional(),
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().max(1000).optional().nullable(),
  // Allow HTTPS URLs or embedded data URLs from inventory uploads (~5MB image ceiling)
  image: z.string().max(7_000_000).optional().nullable(),
  totalStock: z.number().int().min(0),
  rentalPriceGhs: z.number().min(0),
  maintenanceStatus: z.enum(["ok", "maintenance", "retired"]).default("ok"),
});

async function nextItemCode(db: AppDb): Promise<string> {
  const row = (await db
    .prepare(
      `SELECT item_code FROM inventory_items
       WHERE item_code LIKE 'INV-%'
       ORDER BY id DESC LIMIT 1`
    )
    .get()) as { item_code: string } | undefined;

  if (!row?.item_code) return "INV-0001";
  const num = parseInt(row.item_code.replace(/\D/g, ""), 10);
  const next = Number.isFinite(num) ? num + 1 : Date.now() % 10000;
  return `INV-${String(next).padStart(4, "0")}`;
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request, "inventory.manage");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();

  let sql = `SELECT id, item_code, category, name, description, image, total_stock, reserved_stock,
                    available_stock, rental_price_ghs, maintenance_status, active, updated_at
             FROM inventory_items WHERE active = 1`;
  const params: string[] = [];

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (q) {
    sql += " AND (name LIKE ? OR item_code LIKE ? OR category LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  sql += " ORDER BY name ASC";
  const items = await (await getDb()).prepare(sql).all(...params);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request, "inventory.manage");
  if (error) return error;

  try {
    const data = itemSchema.parse(await request.json());
    const db = await getDb();
    const itemCode = (data.itemCode?.toUpperCase() || (await nextItemCode(db))).trim();

    const exists = await db.prepare("SELECT id FROM inventory_items WHERE item_code = ?").get(itemCode);
    if (exists) {
      return NextResponse.json({ error: "Item code already exists" }, { status: 400 });
    }

    const available = data.totalStock;
    const result = await db
      .prepare(
        `INSERT INTO inventory_items (
           item_code, category, name, description, image, total_stock, reserved_stock,
           available_stock, rental_price_ghs, maintenance_status, active
         ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 1)`
      )
      .run(
        itemCode,
        data.category,
        data.name,
        data.description ?? null,
        data.image ?? null,
        data.totalStock,
        available,
        data.rentalPriceGhs,
        data.maintenanceStatus
      );

    const id = Number(result.lastInsertRowid);
    await logActivity("create", "inventory_item", id, `${itemCode} ${data.name}`);

    await db
      .prepare(
        `INSERT INTO inventory_transactions (inventory_item_id, rental_order_id, type, quantity, note)
       VALUES (?, NULL, 'receive', ?, ?)`
      )
      .run(id, data.totalStock, "Initial stock on create");

    return NextResponse.json({ ok: true, id, itemCode }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unable to create inventory item" }, { status: 500 });
  }
}
