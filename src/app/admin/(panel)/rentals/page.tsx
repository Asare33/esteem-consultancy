"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Package,
  RotateCcw,
  Search,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RentalOrder {
  id: number;
  rental_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  event_name: string | null;
  event_type: string | null;
  venue: string | null;
  pickup_date: string | null;
  return_date: string | null;
  status: string;
  payment_status: string;
  subtotal_ghs: number;
  discount_ghs: number;
  transport_ghs: number;
  vat_ghs: number;
  grand_total_ghs: number;
  amount_paid_ghs: number;
  balance_ghs: number;
  notes: string | null;
  created_at: string;
}

interface RentalItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price_ghs: number;
  days: number;
  line_total_ghs: number;
  qty_returned: number;
  return_status: string;
}

const STATUS_FLOW = [
  "pending_approval",
  "approved",
  "preparing",
  "picked_up",
  "in_use",
  "partially_returned",
  "returned",
  "completed",
  "rejected",
  "cancelled",
] as const;

function money(value: number) {
  return `GH₵${Number(value || 0).toLocaleString()}`;
}

function statusTone(status: string) {
  if (status.includes("pending") || status === "draft") return "bg-amber-100 text-amber-800";
  if (status === "approved" || status === "completed") return "bg-emerald-100 text-emerald-800";
  if (status === "returned" || status === "partially_returned") return "bg-blue-100 text-blue-800";
  if (status === "rejected" || status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export default function AdminRentalsPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<{ order: RentalOrder; items: RentalItem[] } | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [returnDraft, setReturnDraft] = useState<Record<number, string>>({});
  const [returnStatusDraft, setReturnStatusDraft] = useState<Record<number, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/rental-orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedId) {
      setDetails(null);
      return;
    }
    fetch(`/api/admin/rental-orders/${selectedId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) {
          setDetails({ order: data.order, items: data.items ?? [] });
          const draft: Record<number, string> = {};
          for (const item of data.items ?? []) {
            draft[item.id] = String(item.qty_returned ?? 0);
          }
          setReturnDraft(draft);
          const statusDraft: Record<number, string> = {};
          for (const item of data.items ?? []) {
            statusDraft[item.id] = item.return_status || "returned";
          }
          setReturnStatusDraft(statusDraft);
          setPaymentAmount("");
        }
      });
  }, [selectedId]);

  const refreshSelected = async (id: number) => {
    const refreshed = await fetch(`/api/admin/rental-orders/${id}`);
    const data = await refreshed.json();
    if (data.order) {
      setDetails({ order: data.order, items: data.items ?? [] });
      const draft: Record<number, string> = {};
      for (const item of data.items ?? []) {
        draft[item.id] = String(item.qty_returned ?? 0);
      }
      setReturnDraft(draft);
      const statusDraft: Record<number, string> = {};
      for (const item of data.items ?? []) {
        statusDraft[item.id] = item.return_status || "returned";
      }
      setReturnStatusDraft(statusDraft);
    }
  };

  const kpis = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending_approval").length;
    const approved = orders.filter((o) => o.status === "approved" || o.status === "preparing" || o.status === "picked_up" || o.status === "in_use").length;
    const returned = orders.filter((o) => o.status === "returned" || o.status === "completed").length;
    return { total, pending, approved, returned };
  }, [orders]);

  const updateStatus = async (next: string) => {
    if (!selectedId) return;
    setUpdating(true);
    const res = await fetch("/api/admin/rental-orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, status: next }),
    });
    setUpdating(false);
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? "Unable to update status");
      return;
    }
    await load();
    await refreshSelected(selectedId);
  };

  const recordPayment = async () => {
    if (!selectedId) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount");
      return;
    }
    setUpdating(true);
    const res = await fetch("/api/admin/rental-orders/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rentalOrderId: selectedId,
        amountGhs: amount,
        method: paymentMethod,
      }),
    });
    setUpdating(false);
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? "Unable to record payment");
      return;
    }
    setPaymentAmount("");
    await load();
    await refreshSelected(selectedId);
  };

  const submitPartialReturn = async () => {
    if (!selectedId || !details) return;
    setUpdating(true);
    const res = await fetch("/api/admin/rental-orders/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rentalOrderId: selectedId,
        items: details.items.map((item) => ({
          itemId: item.id,
          qtyReturned: Number(returnDraft[item.id] ?? item.qty_returned ?? 0),
          status: returnStatusDraft[item.id] || "returned",
        })),
      }),
    });
    setUpdating(false);
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? "Unable to process return");
      return;
    }
    await load();
    await refreshSelected(selectedId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Rentals Management</h1>
          <p className="text-slate-500">
            Track equipment rentals, approvals, returns, invoices and payments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search rentals..."
              className="w-56 pl-9"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Rentals" value={kpis.total} hint="All rental orders" icon={Package} />
        <KpiCard title="Pending Approval" value={kpis.pending} hint="Awaiting review" icon={Clock3} tone="amber" />
        <KpiCard title="Approved / Active" value={kpis.approved} hint="In progress" icon={CheckCircle2} tone="green" />
        <KpiCard title="Returned" value={kpis.returned} hint="Closed rentals" icon={RotateCcw} tone="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4">Rental #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Event</th>
                <th className="p-4">Pickup</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading rental orders...
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No rental orders yet. Customer cart submissions will appear here.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={cn(
                    "cursor-pointer border-t border-slate-100 transition hover:bg-slate-50",
                    selectedId === order.id && "bg-emerald-50/60"
                  )}
                >
                  <td className="p-4 font-mono text-xs font-semibold text-slate-800">
                    {order.rental_number}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{order.customer_phone}</p>
                  </td>
                  <td className="p-4">{order.event_name || order.event_type || "—"}</td>
                  <td className="p-4 text-xs">{order.pickup_date || "—"}</td>
                  <td className="p-4 capitalize">{order.payment_status}</td>
                  <td className="p-4">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-semibold capitalize", statusTone(order.status))}>
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{money(order.grand_total_ghs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          {!details ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-sm text-slate-400">
              <Package className="mb-3 h-8 w-8" />
              Select a rental order to view details, finances, and actions.
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  {details.order.rental_number}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-slate-900">
                  {details.order.customer_name}
                </h2>
                <p className="text-sm text-slate-500">
                  {details.order.customer_phone}
                  {details.order.customer_email ? ` · ${details.order.customer_email}` : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Venue" value={details.order.venue || "—"} />
                <Info label="Event" value={details.order.event_name || details.order.event_type || "—"} />
                <Info label="Pickup" value={details.order.pickup_date || "—"} />
                <Info label="Return" value={details.order.return_date || "—"} />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">Items</h3>
                <ul className="space-y-2">
                  {details.items.map((item) => (
                    <li key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-slate-800">{item.item_name}</p>
                        <span className="font-semibold">{money(item.line_total_ghs)}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity} × {money(item.unit_price_ghs)} × {item.days} day
                        {item.days > 1 ? "s" : ""} · Returned {item.qty_returned}/{item.quantity}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="text-xs text-slate-500">Return qty</label>
                        <Input
                          type="number"
                          min={0}
                          max={item.quantity}
                          className="h-8 w-20"
                          value={returnDraft[item.id] ?? String(item.qty_returned ?? 0)}
                          onChange={(e) =>
                            setReturnDraft((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                        />
                        <select
                          className="h-8 rounded-lg border border-slate-200 px-2 text-xs"
                          value={returnStatusDraft[item.id] || "returned"}
                          onChange={(e) =>
                            setReturnStatusDraft((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                        >
                          <option value="returned">Returned</option>
                          <option value="damaged">Damaged</option>
                          <option value="missing">Missing</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
                  disabled={updating}
                  onClick={submitPartialReturn}
                >
                  Submit Partial / Full Return
                </Button>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 text-sm">
                <Row label="Subtotal" value={money(details.order.subtotal_ghs)} />
                <Row label="Transport" value={money(details.order.transport_ghs)} />
                <Row label="Discount" value={money(details.order.discount_ghs)} />
                <Row label="VAT" value={money(details.order.vat_ghs)} />
                <Row label="Grand Total" value={money(details.order.grand_total_ghs)} strong />
                <Row label="Amount Paid" value={money(details.order.amount_paid_ghs)} />
                <Row label="Balance" value={money(details.order.balance_ghs)} strong />
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="mb-2 text-sm font-semibold text-slate-800">Record Payment</h3>
                <div className="flex flex-wrap gap-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Amount (GHS)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="h-9 w-32"
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 px-3 text-sm"
                  >
                    <option value="momo">MoMo</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                  </select>
                  <Button size="sm" disabled={updating} onClick={recordPayment}>
                    Save Payment
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/rentals/${details.order.id}/invoice`} target="_blank">
                    Open Invoice
                  </Link>
                </Button>
                <Button size="sm" disabled={updating} onClick={() => updateStatus("approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" disabled={updating} onClick={() => updateStatus("rejected")}>
                  Reject
                </Button>
                <Button size="sm" variant="outline" disabled={updating} onClick={() => updateStatus("picked_up")}>
                  Mark Picked Up
                </Button>
                <Button size="sm" variant="outline" disabled={updating} onClick={() => updateStatus("returned")}>
                  Mark Returned
                </Button>
                <Button size="sm" variant="outline" disabled={updating} onClick={() => updateStatus("completed")}>
                  Complete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "slate",
}: {
  title: string;
  value: number;
  hint: string;
  icon: typeof Package;
  tone?: "slate" | "amber" | "green" | "blue";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 font-display text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" /> {hint}
          </p>
        </div>
        <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-700"}>{value}</span>
    </div>
  );
}
