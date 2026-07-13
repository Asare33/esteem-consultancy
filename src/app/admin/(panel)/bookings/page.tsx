"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Booking {
  id: number;
  reference: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  location: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const statuses = ["pending", "approved", "completed", "cancelled"];
const eventTypes = [
  "Event Management",
  "Strategic Communication",
  "Training",
  "Equipment Rentals",
  "General Consultation",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [newBooking, setNewBooking] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "General Consultation",
    event_date: "",
    location: "",
    message: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterType) params.set("event_type", filterType);
    if (q.trim()) params.set("q", q.trim());
    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }, [filterStatus, filterType, q]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: number, status: string) => {
    setSaving(true);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const removeBooking = async (id: number) => {
    if (!confirm("Delete this booking permanently?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setSaving(false);
    if (!res.ok) return;
    if (selected?.id === id) setSelected(null);
    load();
  };

  const createBooking = async () => {
    setSaving(true);
    setFormError("");
    const payload = {
      ...newBooking,
      name: newBooking.name.trim(),
      email: newBooking.email.trim(),
      phone: newBooking.phone.trim(),
      event_type: newBooking.event_type.trim(),
      event_date: newBooking.event_date || undefined,
      location: newBooking.location.trim() || undefined,
      message: newBooking.message.trim() || undefined,
      source: "admin",
    };
    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(data.error ?? "Unable to create booking");
      return;
    }
    setShowForm(false);
    setNewBooking({
      name: "",
      email: "",
      phone: "",
      event_type: "General Consultation",
      event_date: "",
      location: "",
      message: "",
    });
    load();
  };

  const statusVariant = (status: string): "default" | "success" | "warning" | "outline" => {
    if (status === "approved" || status === "completed") return "success";
    if (status === "pending") return "warning";
    return "outline";
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500">Manage event and consultation bookings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Search name, ref, email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            placeholder="Filter by event type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close Form" : "New Booking"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Create Booking</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Customer name"
              value={newBooking.name}
              onChange={(e) => setNewBooking((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              type="email"
              placeholder="Customer email"
              value={newBooking.email}
              onChange={(e) => setNewBooking((p) => ({ ...p, email: e.target.value }))}
            />
            <Input
              placeholder="Customer phone"
              value={newBooking.phone}
              onChange={(e) => setNewBooking((p) => ({ ...p, phone: e.target.value }))}
            />
            <select
              value={newBooking.event_type}
              onChange={(e) => setNewBooking((p) => ({ ...p, event_type: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Input
              type="date"
              value={newBooking.event_date}
              onChange={(e) => setNewBooking((p) => ({ ...p, event_date: e.target.value }))}
            />
            <Input
              placeholder="Location"
              value={newBooking.location}
              onChange={(e) => setNewBooking((p) => ({ ...p, location: e.target.value }))}
            />
            <div className="sm:col-span-2">
              <Textarea
                rows={3}
                placeholder="Booking notes / message"
                value={newBooking.message}
                onChange={(e) => setNewBooking((p) => ({ ...p, message: e.target.value }))}
              />
            </div>
          </div>
          {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={createBooking}
              disabled={saving || !newBooking.name.trim() || !newBooking.email.trim() || !newBooking.phone.trim()}
            >
              {saving ? "Saving..." : "Create Booking"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Event</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading bookings...
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelected(b)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-mono text-xs">{b.reference}</td>
                  <td className="p-4">{b.name}</td>
                  <td className="p-4">{b.event_type}</td>
                  <td className="p-4">
                    <Badge variant={statusVariant(b.status)} className="capitalize">
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {!loading && bookings.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {selected ? (
            <>
              <h2 className="font-semibold text-slate-900">{selected.name}</h2>
              <p className="text-xs text-slate-500">{selected.reference}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-slate-400">Email</dt><dd>{selected.email}</dd></div>
                <div><dt className="text-slate-400">Phone</dt><dd>{selected.phone}</dd></div>
                <div><dt className="text-slate-400">Event Type</dt><dd>{selected.event_type}</dd></div>
                <div><dt className="text-slate-400">Date</dt><dd>{selected.event_date ?? "—"}</dd></div>
                <div><dt className="text-slate-400">Location</dt><dd>{selected.location ?? "—"}</dd></div>
                <div><dt className="text-slate-400">Message</dt><dd className="text-slate-600">{selected.message ?? "—"}</dd></div>
                <div><dt className="text-slate-400">Created</dt><dd>{new Date(selected.created_at).toLocaleString()}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? "default" : "outline"}
                    disabled={saving}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {s}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  disabled={saving}
                  onClick={() => removeBooking(selected.id)}
                >
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">Select a booking to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
