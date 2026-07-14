import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { equipmentItems } from "@/data/equipment";
import {
  mapInventoryToEquipment,
  type InventoryCatalogueRow,
} from "@/lib/equipment-catalogue";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = (await (await getDb())
      .prepare(
        `SELECT id, item_code, category, name, description, image,
                available_stock, rental_price_ghs, maintenance_status
         FROM inventory_items
         WHERE active = 1 AND maintenance_status != 'retired'
         ORDER BY name ASC`
      )
      .all()) as InventoryCatalogueRow[];

    if (rows.length === 0) {
      return NextResponse.json({ items: equipmentItems, source: "static" });
    }

    const items = rows.map(mapInventoryToEquipment);
    return NextResponse.json({ items, source: "inventory" });
  } catch (error) {
    console.error("Public equipment catalogue error:", error);
    return NextResponse.json({ items: equipmentItems, source: "static" });
  }
}
