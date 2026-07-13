"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, ImageIcon, Newspaper, Package, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";

interface DashboardData {
  stats: {
    totalBookings: number;
    totalRentals: number;
    totalPhotos: number;
    publishedNews: number;
    pendingBookings: number;
    pendingRentals: number;
    rentalOrders: number;
    pendingOrders: number;
    approvedOrders: number;
    returnedOrders: number;
    customers: number;
    inventoryItems: number;
    revenueThisMonth: number;
    outstandingPayments: number;
  };
  recentActivity: { id: number; action: string; entity_type: string; details: string | null; created_at: string }[];
  recentBookings: { id: number; reference: string; name: string; event_type: string; status: string; created_at: string }[];
  recentRentals: {
    id: number;
    reference: string;
    customer_name: string;
    item_rented: string;
    quantity: number;
    status: string;
    created_at: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load dashboard");
      setData(await res.json());
    } catch {
      setError("Unable to load dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Unable to load dashboard data."}
        <div className="mt-4">
          <Button size="sm" variant="outline" onClick={loadDashboard}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your business operations</p>
        </div>
        <Button variant="outline" onClick={loadDashboard}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Rental Orders"
          value={data.stats.rentalOrders}
          hint={`${data.stats.pendingOrders} pending approval`}
          icon={Package}
        />
        <StatCard
          label="Revenue This Month"
          value={`GH₵${Number(data.stats.revenueThisMonth || 0).toLocaleString()}`}
          hint={`Outstanding GH₵${Number(data.stats.outstandingPayments || 0).toLocaleString()}`}
          icon={CalendarCheck2}
        />
        <StatCard label="Customers" value={data.stats.customers} hint={`${data.stats.inventoryItems} inventory SKUs`} icon={ImageIcon} />
        <StatCard
          label="Bookings"
          value={data.stats.totalBookings}
          hint={`${data.stats.pendingBookings} pending`}
          icon={Newspaper}
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Approved Rentals" value={data.stats.approvedOrders} hint="Active / in progress" />
        <StatCard label="Returned Rentals" value={data.stats.returnedOrders} hint="Closed cycles" />
        <StatCard label="Gallery Photos" value={data.stats.totalPhotos} />
        <StatCard label="Published News" value={data.stats.publishedNews} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickActionCard
          title="Review Pending Bookings"
          description={`${data.stats.pendingBookings} awaiting response`}
          href="/admin/bookings?status=pending"
        />
        <QuickActionCard
          title="Review Pending Rentals"
          description={`${data.stats.pendingRentals} awaiting response`}
          href="/admin/rentals?status=pending"
        />
        <QuickActionCard
          title="Manage Gallery"
          description="Upload, organize and remove photos"
          href="/admin/gallery"
        />
        <QuickActionCard
          title="Publish News Update"
          description="Create announcements for the website"
          href="/admin/news"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Recent Activity</h2>
          <ul className="space-y-3">
            {data.recentActivity.length === 0 && (
              <li className="text-sm text-slate-400">No activity yet</li>
            )}
            {data.recentActivity.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0">
                <div>
                  <span className="font-medium capitalize text-slate-800">{a.action}</span>
                  <span className="text-slate-500"> · {a.entity_type}</span>
                  {a.details && <p className="text-xs text-slate-400">{a.details}</p>}
                </div>
                <time className="shrink-0 text-xs text-slate-400">
                  {new Date(a.created_at).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Recent Bookings</h2>
          <ul className="space-y-3">
            {data.recentBookings.length === 0 && (
              <li className="text-sm text-slate-400">No bookings yet</li>
            )}
            {data.recentBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm last:border-0">
                <div>
                  <p className="font-medium text-slate-800">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.event_type} · {b.reference}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                  b.status === "pending" ? "bg-amber-100 text-amber-800" :
                  b.status === "approved" ? "bg-green/10 text-green" :
                  b.status === "completed" ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-700"
                }`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Recent Rentals</h2>
          <ul className="space-y-3">
            {data.recentRentals.length === 0 && (
              <li className="text-sm text-slate-400">No rentals yet</li>
            )}
            {data.recentRentals.map((r) => (
              <li key={r.id} className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm last:border-0">
                <div>
                  <p className="font-medium text-slate-800">{r.customer_name}</p>
                  <p className="text-xs text-slate-500">{r.item_rented} x{r.quantity} · {r.reference}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                  r.status === "pending" ? "bg-amber-100 text-amber-800" :
                  r.status === "approved" ? "bg-green/10 text-green" :
                  r.status === "returned" ? "bg-blue-100 text-blue-800" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green/30 hover:shadow-md"
    >
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green">
        Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
