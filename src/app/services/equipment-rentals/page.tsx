"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useRentalCart } from "@/context/rental-cart-context";
import {
  equipmentItems,
  equipmentCategories,
  type EquipmentCategory,
  type EquipmentItem,
} from "@/data/equipment";
import { setLiveCatalogue } from "@/lib/equipment-catalogue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const availabilityColors = {
  available: "bg-green/10 text-green",
  limited: "bg-yellow-100 text-yellow-800",
  reserved: "bg-red-100 text-red-700",
} as const;

function isLocalImageSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("/api/") || src.startsWith("/uploads/");
}

function EquipmentCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<EquipmentCategory | "all">("all");
  const [catalogue, setCatalogue] = useState<EquipmentItem[]>(equipmentItems);
  const [loading, setLoading] = useState(true);
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateDuration,
    clearCart,
    totalItems,
    itemsSubtotal,
    deliveryEstimate,
    deliveryBandLabel,
    totalEstimate,
    deliveryLocation,
    pickup,
    setDeliveryLocation,
    setPickup,
  } = useRentalCart();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/equipment", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setCatalogue(data.items);
          setLiveCatalogue(data.items);
        }
      } catch {
        // Keep static fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return catalogue.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category, catalogue]);

  return (
    <>
      <PageHeader
        eyebrow="Event Management"
        title="Premium Event Equipment Rentals"
        description="Quality Equipment. Professional Setup. Reliable Delivery."
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-muted" />
              <Input
                placeholder="Search equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                aria-label="Search equipment"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === "all" ? "gradient-brand text-white" : "bg-muted text-gray"}`}
              >
                All
              </button>
              {equipmentCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === cat.id ? "gradient-brand text-white" : "bg-muted text-gray"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {loading ? (
                <p className="py-12 text-center text-gray-muted">Loading equipment...</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {filtered.map((item) => (
                    <EquipmentCard key={item.id} item={item} onAdd={() => addItem(item)} />
                  ))}
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <p className="py-12 text-center text-gray-muted">No equipment matches your search.</p>
              )}
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24 border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <ShoppingCart className="h-5 w-5 text-green" /> Rental Cart
                    </h3>
                    <Badge>{totalItems} items</Badge>
                  </div>

                  {items.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-muted">Your cart is empty. Add items to request a quote.</p>
                  ) : (
                    <ul className="mt-4 max-h-[min(50vh,22rem)] space-y-4 overflow-y-auto overscroll-contain pr-1">
                      {items.map((cart) => (
                        <li key={cart.item.id} className="rounded-xl bg-muted p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray">{cart.item.name}</p>
                            <button onClick={() => removeItem(cart.item.id)} aria-label="Remove item">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateQuantity(cart.item.id, cart.quantity - 1)} aria-label="Decrease quantity">
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center text-sm">{cart.quantity}</span>
                              <button onClick={() => updateQuantity(cart.item.id, cart.quantity + 1)} aria-label="Increase quantity">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <Input
                              type="number"
                              min={1}
                              value={cart.durationDays}
                              onChange={(e) => updateDuration(cart.item.id, parseInt(e.target.value) || 1)}
                              className="h-8 w-20 text-sm"
                              aria-label="Rental duration in days"
                            />
                            <span className="text-xs text-gray-muted">days</span>
                          </div>
                          <p className="mt-2 text-xs font-medium text-gray">
                            Subtotal: GHS {(cart.item.dailyRateGhs * cart.quantity * cart.durationDays).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 rounded-xl bg-muted p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-muted">Items subtotal</span>
                      <span className="font-medium text-gray">GHS {itemsSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-gray-muted">{deliveryBandLabel}</span>
                      <span className="font-medium text-gray">GHS {deliveryEstimate.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm">
                      <span className="text-gray">Estimated total</span>
                      <span className="font-semibold text-gray">GHS {totalEstimate.toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-muted">
                      Delivery estimate applies when self pickup is not selected.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Input
                      placeholder="Delivery location (e.g. East Legon, Accra)"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      aria-label="Delivery location"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-muted">
                      <input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} />
                      Self pickup option
                    </label>
                  </div>

                  <Button asChild className="mt-4 w-full" disabled={items.length === 0}>
                    <Link href="/request-quote">Request Quote</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full"
                    disabled={items.length === 0}
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EquipmentCard({ item, onAdd }: { item: EquipmentItem; onAdd: () => void }) {
  const local = isLocalImageSrc(item.image);

  return (
    <Card className="group overflow-hidden border-0 shadow-lg transition hover:shadow-xl">
      <div className="relative h-44 bg-muted">
        {item.image ? (
          local ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="300px"
            />
          )
        ) : null}
        <Badge className={`absolute right-3 top-3 ${availabilityColors[item.availability]}`}>
          {item.availability}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-muted line-clamp-2">{item.description}</p>
        {item.capacity && <p className="mt-2 text-xs text-green">Capacity: {item.capacity}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-purple">GHS {item.dailyRateGhs}/day</span>
          <Button size="sm" onClick={onAdd}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EquipmentRentalsPage() {
  return <EquipmentCatalog />;
}
