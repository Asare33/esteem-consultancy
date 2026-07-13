"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { siteInfo } from "@/data/site";

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
}

interface RentalPayment {
  id: number;
  amount_ghs: number;
  method: string;
  reference: string | null;
  paid_at: string;
}

function money(value: number) {
  return `GH₵${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RentalInvoicePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [items, setItems] = useState<RentalItem[]>([]);
  const [payments, setPayments] = useState<RentalPayment[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/rental-orders/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.order) throw new Error(data.error || "Unable to load invoice");
        setOrder(data.order);
        setItems(data.items ?? []);
        setPayments(data.payments ?? []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load invoice");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const totals = useMemo(() => {
    if (!order) return null;
    return {
      subtotal: order.subtotal_ghs,
      transport: order.transport_ghs,
      discount: order.discount_ghs,
      vat: order.vat_ghs,
      grand: order.grand_total_ghs,
      paid: order.amount_paid_ghs,
      balance: order.balance_ghs,
    };
  }, [order]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading invoice...</div>;
  }

  if (error || !order) {
    return <div className="p-8 text-sm text-red-600">{error || "Invoice not found"}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/admin/rentals" className="text-sm font-medium text-green hover:underline">
          ← Back to Rentals
        </Link>
        <Button onClick={() => window.print()}>Print Invoice</Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="mb-6 h-1 rounded-full bg-gradient-to-r from-green via-purple to-green print:hidden" />
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <Image
              src={siteInfo.logo.src}
              alt={siteInfo.logo.alt}
              width={64}
              height={64}
              className="h-16 w-16 rounded-md border border-slate-200 bg-white object-contain p-1"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{siteInfo.legalName}</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Official Rental Invoice</p>
              <p className="mt-1 text-sm text-slate-600">{siteInfo.contact.address}, {siteInfo.contact.city}</p>
              <p className="text-sm text-slate-600">{siteInfo.contact.phone} · {siteInfo.contact.email}</p>
            </div>
          </div>
          <div className="min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-right">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Invoice No.</p>
            <p className="font-mono text-sm font-semibold text-slate-900">{order.rental_number}</p>
            <p className="mt-2 text-sm text-slate-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="text-sm text-slate-600 capitalize">Order Status: {order.status.replaceAll("_", " ")}</p>
            <p className="text-sm text-slate-600 capitalize">Payment: {order.payment_status.replaceAll("_", " ")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Bill To</p>
            <p className="mt-1 font-semibold text-slate-900">{order.customer_name}</p>
            <p className="text-sm text-slate-600">{order.customer_phone}</p>
            {order.customer_email && <p className="text-sm text-slate-600">{order.customer_email}</p>}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left md:text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Event Details</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{order.event_name || order.event_type || "Equipment Rental"}</p>
            <p className="text-sm text-slate-600">{order.venue || "Venue: TBC"}</p>
            <p className="text-sm text-slate-600">Pickup: {order.pickup_date || "TBC"}</p>
            <p className="text-sm text-slate-600">Return: {order.return_date || "TBC"}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Days</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/40">
                  <td className="p-3">{item.item_name}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">{item.days}</td>
                  <td className="p-3 text-right">{money(item.unit_price_ghs)}</td>
                  <td className="p-3 text-right font-semibold">{money(item.line_total_ghs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totals && (
          <div className="mt-5 flex justify-end">
            <div className="w-full max-w-sm space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <TotalRow label="Subtotal" value={money(totals.subtotal)} />
              <TotalRow label="Transport" value={money(totals.transport)} />
              <TotalRow label="Discount" value={money(totals.discount)} />
              <TotalRow label="VAT" value={money(totals.vat)} />
              <div className="border-t border-slate-200 pt-2">
                <TotalRow label="Grand Total" value={money(totals.grand)} strong />
              </div>
              <TotalRow label="Amount Paid" value={money(totals.paid)} />
              <div className="rounded-lg bg-white p-2">
                <TotalRow label="Balance Due" value={money(totals.balance)} strong />
              </div>
            </div>
          </div>
        )}

        {payments.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Payments</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {payments.map((payment) => (
                <li key={payment.id}>
                  {new Date(payment.paid_at).toLocaleString()} · {payment.method.toUpperCase()} · {money(payment.amount_ghs)}
                  {payment.reference ? ` · Ref: ${payment.reference}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.notes && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Notes</p>
            <p className="mt-1">{order.notes}</p>
          </div>
        )}

        <div className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          Thank you for choosing {siteInfo.name}. For enquiries, contact {siteInfo.contact.phone}.
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-600"}>{label}</span>
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-700"}>{value}</span>
    </div>
  );
}
