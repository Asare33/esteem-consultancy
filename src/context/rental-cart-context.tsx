"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { equipmentItems, type EquipmentItem } from "@/data/equipment";

export interface CartItem {
  item: EquipmentItem;
  quantity: number;
  durationDays: number;
}

interface StoredCartItem {
  itemId: string;
  quantity: number;
  durationDays: number;
}

interface RentalCartContextValue {
  items: CartItem[];
  deliveryLocation: string;
  pickup: boolean;
  setDeliveryLocation: (value: string) => void;
  setPickup: (value: boolean) => void;
  addItem: (item: EquipmentItem, quantity?: number, durationDays?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateDuration: (id: string, days: number) => void;
  clearCart: () => void;
  totalItems: number;
  itemsSubtotal: number;
  deliveryEstimate: number;
  deliveryBandLabel: string;
  totalEstimate: number;
}

const CART_STORAGE_KEY = "esteem-rental-cart-v1";
const CART_META_KEY = "esteem-rental-cart-meta-v1";

const RentalCartContext = createContext<RentalCartContextValue | null>(null);

const ACCRA_KEYWORDS = [
  "accra",
  "tema",
  "spintex",
  "east legon",
  "osu",
  "airport",
  "madina",
  "adenta",
  "kasoa",
  "achimota",
  "dansoman",
];

function getDeliveryPricing(location: string, pickup: boolean): { fee: number; label: string } {
  if (pickup) return { fee: 0, label: "Self pickup" };
  const normalized = location.trim().toLowerCase();
  if (!normalized) return { fee: 0, label: "Delivery not set" };

  const isAccraMetro = ACCRA_KEYWORDS.some((keyword) => normalized.includes(keyword));
  if (isAccraMetro) return { fee: 120, label: "Accra/Tema delivery estimate" };
  return { fee: 300, label: "Outside Accra delivery estimate" };
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY) ?? sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const stored = JSON.parse(raw) as StoredCartItem[];
    return stored
      .map((entry) => {
        const item = equipmentItems.find((e) => e.id === entry.itemId);
        if (!item) return null;
        return { item, quantity: entry.quantity, durationDays: entry.durationDays };
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

function loadMeta(): { deliveryLocation: string; pickup: boolean } {
  if (typeof window === "undefined") return { deliveryLocation: "", pickup: false };
  try {
    const raw = localStorage.getItem(CART_META_KEY) ?? sessionStorage.getItem(CART_META_KEY);
    if (!raw) return { deliveryLocation: "", pickup: false };
    return JSON.parse(raw) as { deliveryLocation: string; pickup: boolean };
  } catch {
    return { deliveryLocation: "", pickup: false };
  }
}

export function RentalCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickup, setPickup] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    const meta = loadMeta();
    setDeliveryLocation(meta.deliveryLocation);
    setPickup(meta.pickup);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const stored: StoredCartItem[] = items.map((c) => ({
      itemId: c.item.id,
      quantity: c.quantity,
      durationDays: c.durationDays,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    // Keep session storage in sync for backward compatibility.
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify({ deliveryLocation, pickup });
    localStorage.setItem(CART_META_KEY, serialized);
    sessionStorage.setItem(CART_META_KEY, serialized);
  }, [deliveryLocation, pickup, hydrated]);

  const value = useMemo<RentalCartContextValue>(() => {
    const itemsSubtotal = items.reduce((sum, c) => sum + c.item.dailyRateGhs * c.quantity * c.durationDays, 0);
    const deliveryPricing = getDeliveryPricing(deliveryLocation, pickup);
    const deliveryEstimate = deliveryPricing.fee;
    const totalEstimate = itemsSubtotal + deliveryEstimate;

    return {
      items,
      deliveryLocation,
      pickup,
      setDeliveryLocation,
      setPickup,
      addItem: (item, quantity = 1, durationDays) => {
        setItems((prev) => {
          const existing = prev.find((c) => c.item.id === item.id);
          if (existing) {
            return prev.map((c) =>
              c.item.id === item.id
                ? {
                    ...c,
                    quantity: c.quantity + quantity,
                    // Keep current rental duration unless a specific value is supplied.
                    durationDays: durationDays ?? c.durationDays,
                  }
                : c
            );
          }
          return [...prev, { item, quantity, durationDays: durationDays ?? 1 }];
        });
      },
      removeItem: (id) => setItems((prev) => prev.filter((c) => c.item.id !== id)),
      updateQuantity: (id, quantity) =>
        setItems((prev) =>
          prev.map((c) => (c.item.id === id ? { ...c, quantity: Math.max(1, quantity) } : c))
        ),
      updateDuration: (id, days) =>
        setItems((prev) =>
          prev.map((c) => (c.item.id === id ? { ...c, durationDays: Math.max(1, days) } : c))
        ),
      clearCart: () => setItems([]),
      totalItems: items.reduce((sum, c) => sum + c.quantity, 0),
      itemsSubtotal,
      deliveryEstimate,
      deliveryBandLabel: deliveryPricing.label,
      totalEstimate,
    };
  }, [items, deliveryLocation, pickup]);

  return <RentalCartContext.Provider value={value}>{children}</RentalCartContext.Provider>;
}

export function useRentalCart() {
  const ctx = useContext(RentalCartContext);
  if (!ctx) throw new Error("useRentalCart must be used within RentalCartProvider");
  return ctx;
}
