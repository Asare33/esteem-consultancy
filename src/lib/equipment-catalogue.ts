import {
  equipmentItems,
  type AvailabilityStatus,
  type EquipmentCategory,
  type EquipmentItem,
} from "@/data/equipment";

export type InventoryCatalogueRow = {
  id: number;
  item_code: string;
  category: string;
  name: string;
  description: string | null;
  image: string | null;
  available_stock: number;
  rental_price_ghs: number;
  maintenance_status: string;
};

/** Live catalogue override set by the equipment rentals page after fetching inventory. */
let liveCatalogue: EquipmentItem[] | null = null;

export function setLiveCatalogue(items: EquipmentItem[]) {
  liveCatalogue = items;
}

export function getCatalogue(): EquipmentItem[] {
  return liveCatalogue ?? equipmentItems;
}

export function equipmentIdFromItemCode(itemCode: string): string {
  return itemCode.replace(/^INV-/i, "").toLowerCase();
}

export function mapInventoryToEquipment(row: InventoryCatalogueRow): EquipmentItem {
  const id = equipmentIdFromItemCode(row.item_code);
  const fallback = equipmentItems.find(
    (item) => item.id === id || item.name.toLowerCase() === row.name.toLowerCase()
  );

  let availability: AvailabilityStatus = "available";
  if (row.maintenance_status === "retired" || row.available_stock <= 0) {
    availability = "reserved";
  } else if (row.available_stock <= 25) {
    availability = "limited";
  }

  return {
    id: fallback?.id ?? id,
    name: row.name,
    category: (row.category as EquipmentCategory) || fallback?.category || "tables",
    description: row.description || fallback?.description || "",
    image: row.image || fallback?.image || "",
    capacity: fallback?.capacity,
    dimensions: fallback?.dimensions,
    availability,
    dailyRateGhs: row.rental_price_ghs,
    features: fallback?.features ?? [],
  };
}
