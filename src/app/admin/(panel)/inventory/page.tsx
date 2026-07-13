"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { equipmentCategories } from "@/data/equipment";

interface InventoryItem {
  id: number;
  item_code: string;
  category: string;
  name: string;
  description: string | null;
  image: string | null;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  rental_price_ghs: number;
  maintenance_status: string;
}

const emptyForm = {
  itemCode: "",
  name: "",
  category: "tables",
  description: "",
  image: "",
  totalStock: "0",
  rentalPriceGhs: "0",
  maintenanceStatus: "ok",
};

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const res = await fetch(`/api/admin/inventory?${params}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, [q, category]);

  useEffect(() => {
    load();
  }, [load]);

  const categoryOptions = useMemo(() => {
    const fromData = Array.from(new Set(items.map((i) => i.category)));
    const known = equipmentCategories.map((c) => c.id);
    return Array.from(new Set([...known, ...fromData])).sort();
  }, [items]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setForm({
      itemCode: item.item_code,
      name: item.name,
      category: item.category,
      description: item.description ?? "",
      image: item.image ?? "",
      totalStock: String(item.total_stock),
      rentalPriceGhs: String(item.rental_price_ghs),
      maintenanceStatus: item.maintenance_status || "ok",
    });
    setError("");
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    const payload = {
      itemCode: form.itemCode.trim() || undefined,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      totalStock: Number(form.totalStock) || 0,
      rentalPriceGhs: Number(form.rentalPriceGhs) || 0,
      maintenanceStatus: form.maintenanceStatus as "ok" | "maintenance" | "retired",
    };

    const res = editingId
      ? await fetch(`/api/admin/inventory/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Unable to save inventory item");
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    load();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "inventory");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "Unable to upload image");
      return;
    }
    if (data.path) setForm((prev) => ({ ...prev, image: data.path }));
  };

  const remove = async (item: InventoryItem) => {
    if (!confirm(`Remove "${item.name}" from inventory?`)) return;
    const res = await fetch(`/api/admin/inventory/${item.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Unable to remove item");
      return;
    }
    load();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">Add, update, and remove rental stock items.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search code, name, category..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
        >
          <option value="">All categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c.replaceAll("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">
            {editingId ? "Update Inventory Item" : "Add New Inventory Item"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Item code (auto if blank)"
              value={form.itemCode}
              onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
            />
            <Input
              placeholder="Item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Image URL (optional)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
            >
              {equipmentCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              {!equipmentCategories.some((c) => c.id === form.category) && form.category && (
                <option value={form.category}>{form.category}</option>
              )}
            </select>
            <select
              value={form.maintenanceStatus}
              onChange={(e) => setForm({ ...form, maintenanceStatus: e.target.value })}
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
            >
              <option value="ok">Ok</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
            <Input
              type="number"
              min={0}
              placeholder="Total stock"
              value={form.totalStock}
              onChange={(e) => setForm({ ...form, totalStock: e.target.value })}
            />
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Price per day (GHS)"
              value={form.rentalPriceGhs}
              onChange={(e) => setForm({ ...form, rentalPriceGhs: e.target.value })}
            />
            <div className="sm:col-span-2 rounded-xl border border-slate-200 p-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                />
                {uploading && <span className="text-sm text-slate-500">Uploading...</span>}
                {form.image && (
                  <div className="relative h-14 w-20 overflow-hidden rounded-md border border-slate-200">
                    <Image src={form.image} alt="Inventory preview" fill className="object-cover" sizes="80px" />
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Textarea
                placeholder="Description (optional)"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex gap-2">
            <Button onClick={save} disabled={saving || !form.name.trim()}>
              {saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Item</th>
                <th className="p-4">Image</th>
                <th className="p-4">Category</th>
                <th className="p-4">Total</th>
                <th className="p-4">Reserved</th>
                <th className="p-4">Available</th>
                <th className="p-4">Price/Day</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Loading inventory...
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    No inventory items found.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="p-4 font-mono text-xs">{item.item_code}</td>
                  <td className="p-4 font-medium text-slate-800">{item.name}</td>
                  <td className="p-4">
                    {item.image ? (
                      <div className="relative h-10 w-14 overflow-hidden rounded-md border border-slate-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No image</span>
                    )}
                  </td>
                  <td className="p-4 capitalize">{item.category.replaceAll("-", " ")}</td>
                  <td className="p-4">{item.total_stock}</td>
                  <td className="p-4">{item.reserved_stock}</td>
                  <td className="p-4">
                    <span className={item.available_stock < 10 ? "font-semibold text-amber-700" : ""}>
                      {item.available_stock}
                    </span>
                  </td>
                  <td className="p-4">GH₵{item.rental_price_ghs}</td>
                  <td className="p-4">
                    <Badge className="capitalize">{item.maintenance_status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(item)} aria-label="Edit item">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => remove(item)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
