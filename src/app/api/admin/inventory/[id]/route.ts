import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

interface Props {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  itemCode: z.string().trim().min(2).max(40).optional(),
  name: z.string().trim().min(2).max(160).optional(),
  category: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  image: z.string().trim().max(500).optional().nullable(),
  totalStock: z.number().int().min(0).optional(),
  rentalPriceGhs: z.number().min(0).optional(),
  maintenanceStatus: z.enum(["ok", "maintenance", "retired"]).optional(),
  active: z.number().int().min(0).max(1).optional(),
});

export async function PUT(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(request, "inventory.manage");
  if (error) return error;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const data = updateSchema.parse(await request.json());
    const db = getDb();

    const existing = db.prepare("SELECT * FROM inventory_items WHERE id = ?").get(id) as
      | {
          id: number;
          item_code: string;
          name: string;
          category: string;
          description: string | null;
          image: string | null;
          total_stock: number;
          reserved_stock: number;
          available_stock: number;
          rental_price_ghs: number;
          maintenance_status: string;
          active: number;
        }
      | undefined;

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const nextCode = data.itemCode?.toUpperCase().trim() ?? existing.item_code;
    if (nextCode !== existing.item_code) {
      const clash = db
        .prepare("SELECT id FROM inventory_items WHERE item_code = ? AND id != ?")
        .get(nextCode, id);
      if (clash) {
        return NextResponse.json({ error: "Item code already exists" }, { status: 400 });
      }
    }

    const nextTotal = data.totalStock ?? existing.total_stock;
    if (nextTotal < existing.reserved_stock) {
      return NextResponse.json(
        {
          error: `Total stock cannot be less than reserved stock (${existing.reserved_stock})`,
        },
        { status: 400 }
      );
    }

    const nextAvailable = nextTotal - existing.reserved_stock;
    const stockDelta = nextTotal - existing.total_stock;

    db.prepare(
      `UPDATE inventory_items
       SET item_code = ?,
           name = ?,
           category = ?,
           description = ?,
           image = ?,
           total_stock = ?,
           available_stock = ?,
           rental_price_ghs = ?,
           maintenance_status = ?,
           active = ?,
           updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      nextCode,
      data.name ?? existing.name,
      data.category ?? existing.category,
      data.description === undefined ? existing.description : data.description,
      data.image === undefined ? existing.image : data.image,
      nextTotal,
      nextAvailable,
      data.rentalPriceGhs ?? existing.rental_price_ghs,
      data.maintenanceStatus ?? existing.maintenance_status,
      data.active ?? existing.active,
      id
    );

    if (stockDelta !== 0) {
      db.prepare(
        `INSERT INTO inventory_transactions (inventory_item_id, rental_order_id, type, quantity, note)
         VALUES (?, NULL, ?, ?, ?)`
      ).run(
        id,
        stockDelta > 0 ? "adjust_in" : "adjust_out",
        Math.abs(stockDelta),
        "Stock adjustment from inventory edit"
      );
    }

    logActivity("update", "inventory_item", id, nextCode);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unable to update inventory item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(request, "inventory.manage");
  if (error) return error;

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = getDb();
  const existing = db.prepare("SELECT id, item_code, reserved_stock FROM inventory_items WHERE id = ?").get(id) as
    | { id: number; item_code: string; reserved_stock: number }
    | undefined;

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.reserved_stock > 0) {
    return NextResponse.json(
      { error: "Cannot remove item while stock is reserved on active rentals" },
      { status: 400 }
    );
  }

  // Soft delete so historical rental lines keep referential integrity
  db.prepare(
    `UPDATE inventory_items
     SET active = 0, available_stock = 0, updated_at = datetime('now')
     WHERE id = ?`
  ).run(id);

  logActivity("delete", "inventory_item", id, existing.item_code);
  return NextResponse.json({ ok: true });
}
