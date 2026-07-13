import { rentalImages } from "./rental-images";

export type EquipmentCategory =
  | "flooring"
  | "staging"
  | "tables"
  | "seating"
  | "linens"
  | "decor"
  | "tents-canopies"
  | "catering";

export type AvailabilityStatus = "available" | "limited" | "reserved";

export interface EquipmentCategoryInfo {
  id: EquipmentCategory;
  name: string;
  description: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  image: string;
  capacity?: string;
  dimensions?: string;
  availability: AvailabilityStatus;
  dailyRateGhs: number;
  features: string[];
}

export const equipmentCategories: EquipmentCategoryInfo[] = [
  {
    id: "flooring",
    name: "Flooring",
    description: "Dance floors and artificial grass carpets for indoor and outdoor venues.",
  },
  {
    id: "staging",
    name: "Staging & Backdrops",
    description: "Modular stages and backdrop boards for programmes and photo moments.",
  },
  {
    id: "tables",
    name: "Tables",
    description: "Wooden, glass, and plastic tables for banquets, buffets, and receptions.",
  },
  {
    id: "seating",
    name: "Chairs",
    description: "Comfortable seating options for weddings, funerals, and corporate events.",
  },
  {
    id: "linens",
    name: "Linens",
    description: "Table cloths and hand napkins to finish your dining setup.",
  },
  {
    id: "decor",
    name: "Decor",
    description: "Centrepieces and decorative accents for elegant table presentation.",
  },
  {
    id: "tents-canopies",
    name: "Canopies",
    description: "Weather-ready canopies and marquees for outdoor celebrations.",
  },
  {
    id: "catering",
    name: "Catering Equipment",
    description: "Chafing dishes and catering service essentials for buffet lines.",
  },
];

export const equipmentItems: EquipmentItem[] = [
  {
    id: "dancing-floor-boards",
    name: "Dancing Floor Boards",
    category: "flooring",
    description:
      "Interlocking wooden dance floor boards for receptions, parties, and outdoor celebrations.",
    image: rentalImages.dancingFloor,
    capacity: "Modular panels — expand to venue size",
    dimensions: "Custom layout",
    availability: "available",
    dailyRateGhs: 1200,
    features: ["Interlocking boards", "Anti-slip surface", "Setup & breakdown"],
  },
  {
    id: "backdrop-boards",
    name: "Backdrop Boards",
    category: "staging",
    description:
      "Freestanding backdrop boards for photo walls, ceremonies, and stage dressing.",
    image: rentalImages.backdropBoards,
    capacity: "Photo / ceremony backdrop",
    dimensions: "Modular panels",
    availability: "available",
    dailyRateGhs: 650,
    features: ["Fabric or panel options", "Freestanding frames", "Branding-ready"],
  },
  {
    id: "tables-wooden",
    name: "Wooden Tables",
    category: "tables",
    description: "Solid wooden banquet and dining tables for formal and rustic event setups.",
    image: rentalImages.tablesWooden,
    capacity: "6–10 guests per table",
    availability: "available",
    dailyRateGhs: 90,
    features: ["Sturdy frame", "Indoor/outdoor use", "Linen compatible"],
  },
  {
    id: "tables-glass",
    name: "Glass Tables",
    category: "tables",
    description: "Elegant glass-top tables for VIP lounges, cocktail areas, and premium dining.",
    image: rentalImages.tablesGlass,
    capacity: "4–8 guests per table",
    availability: "limited",
    dailyRateGhs: 150,
    features: ["Premium finish", "Cocktail & dining sizes", "Careful delivery"],
  },
  {
    id: "tables-plastic",
    name: "Plastic Tables",
    category: "tables",
    description: "Durable plastic folding tables for buffets, registration, and high-volume seating.",
    image: rentalImages.tablesPlastic,
    capacity: "6–8 guests or buffet service",
    dimensions: "6 ft standard",
    availability: "available",
    dailyRateGhs: 45,
    features: ["Lightweight", "Stackable", "Easy clean"],
  },
  {
    id: "chairs",
    name: "Chairs",
    category: "seating",
    description: "Event chairs for weddings, funerals, conferences, and community programmes.",
    image: rentalImages.chairs,
    capacity: "Per chair",
    availability: "available",
    dailyRateGhs: 10,
    features: ["High-volume stock", "Stackable", "Optional cushions"],
  },
  {
    id: "table-cloth",
    name: "Table Cloth",
    category: "linens",
    description: "Clean, pressed table cloths in popular event colours for round and rectangular tables.",
    image: rentalImages.tableCloth,
    capacity: "Fits standard banquet tables",
    availability: "available",
    dailyRateGhs: 25,
    features: ["Multiple colours", "Pressed & packed", "Round & rectangular"],
  },
  {
    id: "hand-napkins",
    name: "Hand Napkins",
    category: "linens",
    description: "Cloth hand napkins for formal dining, buffets, and VIP guest tables.",
    image: rentalImages.handNapkins,
    capacity: "Per napkin",
    availability: "available",
    dailyRateGhs: 3,
    features: ["Cloth finish", "Colour options", "Bulk hire"],
  },
  {
    id: "centrepieces",
    name: "Centrepieces",
    category: "decor",
    description: "Decorative centrepieces to elevate banquet and ceremony table presentation.",
    image: rentalImages.centrepieces,
    capacity: "Per table",
    availability: "available",
    dailyRateGhs: 80,
    features: ["Floral & modern styles", "Height options", "Setup assistance"],
  },
  {
    id: "stage",
    name: "Stage",
    category: "staging",
    description: "Modular stage platforms with skirting for speeches, performances, and ceremonies.",
    image: rentalImages.stage,
    capacity: "Panel discussion or performance",
    dimensions: "Customisable footprint",
    availability: "available",
    dailyRateGhs: 2200,
    features: ["Modular decks", "Skirting available", "Stairs & rails optional"],
  },
  {
    id: "artificial-grass-carpet",
    name: "Artificial Grass Carpet",
    category: "flooring",
    description: "Soft artificial grass carpet for outdoor aisles, photo zones, and garden events.",
    image: rentalImages.artificialGrass,
    capacity: "Roll-out coverage by sq. metre",
    availability: "available",
    dailyRateGhs: 35,
    features: ["Outdoor ready", "Non-slip underlay option", "Clean edges"],
  },
  {
    id: "canopies",
    name: "Canopies",
    category: "tents-canopies",
    description: "Event canopies for outdoor shade, receptions, registration, and catering stations.",
    image: rentalImages.canopies,
    capacity: "Shade for guests & stations",
    availability: "available",
    dailyRateGhs: 450,
    features: ["Multiple sizes", "Sidewalls optional", "Setup included"],
  },
  {
    id: "chafing-dish",
    name: "Chafing Dish",
    category: "catering",
    description: "Stainless steel chafing dishes for hot buffet service at receptions and funerals.",
    image: rentalImages.chafingDish,
    capacity: "Per dish — buffet service",
    availability: "available",
    dailyRateGhs: 70,
    features: ["Fuel holders", "Serving utensils optional", "Food-safe steel"],
  },
  {
    id: "catering",
    name: "Catering Equipment Set",
    category: "catering",
    description:
      "Catering equipment package for buffet lines — serving ware, warmers, and station essentials.",
    image: rentalImages.catering,
    capacity: "Buffet service for events",
    availability: "available",
    dailyRateGhs: 500,
    features: ["Buffet-ready kit", "Flexible package sizes", "Delivery available"],
  },
];

export function getEquipmentByCategory(category: EquipmentCategory): EquipmentItem[] {
  return equipmentItems.filter((item) => item.category === category);
}

export function getEquipmentById(id: string): EquipmentItem | undefined {
  return equipmentItems.find((item) => item.id === id);
}
