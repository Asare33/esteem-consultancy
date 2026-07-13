"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PortalData = {
  rentals: Array<{
    id: number;
    rental_number: string;
    event_name: string | null;
    venue: string | null;
    pickup_date: string | null;
    return_date: string | null;
    status: string;
    payment_status: string;
    grand_total_ghs: number;
    amount_paid_ghs: number;
    balance_ghs: number;
    created_at: string;
  }>;
  bookings: Array<{
    id: number;
    reference: string;
    event_type: string;
    event_date: string | null;
    location: string | null;
    status: string;
    created_at: string;
  }>;
  payments: Array<{
    id: number;
    amount_ghs: number;
    method: string;
    reference: string | null;
    paid_at: string;
    rental_number: string;
  }>;
  notifications: Array<{
    id: number;
    title: string;
    body: string | null;
    created_at: string;
  }>;
};

function money(n: number) {
  return `GH₵${Number(n || 0).toLocaleString()}`;
}

export default function PortalSectionClientPage({
  section,
}: {
  section: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<PortalData | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/portal/me?type=me").then((r) => r.json()),
      fetch("/api/portal/me").then((r) => r.json()),
    ])
      .then(([me, overview]) => {
        if (me.error) {
          router.push("/portal/login");
          return;
        }
        setName(me.customer?.name ?? "");
        setData(overview);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  };

  const titleMap: Record<string, string> = {
    profile: "My Profile",
    rentals: "Rental History",
    bookings: "Booking History",
    payments: "Invoices & Payments",
    documents: "Documents",
    notifications: "Notifications",
  };

  return (
    <>
      <PageHeader
        eyebrow="Customer Portal"
        title={titleMap[section] ?? "Portal"}
        description={name ? `Signed in as ${name}` : "Your account workspace"}
      />
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/portal">Portal Home</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/portal/rentals">Rentals</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/portal/bookings">Bookings</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/portal/payments">Payments</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/portal/notifications">Notifications</Link></Button>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>

          {loading && <p className="text-gray-muted">Loading...</p>}

          {!loading && section === "profile" && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray">{name}</h2>
                <p className="mt-2 text-sm text-gray-muted">
                  Your profile is linked to rental and booking records by email. Complete more details from support if needed.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && section === "rentals" && (
            <div className="space-y-3">
              {(data?.rentals ?? []).length === 0 && (
                <p className="text-gray-muted">No rental orders yet. <Link className="text-green font-semibold" href="/services/equipment-rentals">Browse rentals</Link></p>
              )}
              {(data?.rentals ?? []).map((r) => (
                <Card key={r.id} className="border-0 shadow-md">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-mono text-xs text-green">{r.rental_number}</p>
                      <p className="font-semibold text-gray">{r.event_name || "Equipment Rental"}</p>
                      <p className="text-sm text-gray-muted">{r.venue || "—"} · Pickup {r.pickup_date || "TBD"}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="capitalize">{r.status.replaceAll("_", " ")}</Badge>
                      <p className="mt-2 text-sm font-semibold">{money(r.grand_total_ghs)}</p>
                      <p className="text-xs text-gray-muted">Balance {money(r.balance_ghs)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && section === "bookings" && (
            <div className="space-y-3">
              {(data?.bookings ?? []).length === 0 && <p className="text-gray-muted">No bookings found for this account.</p>}
              {(data?.bookings ?? []).map((b) => (
                <Card key={b.id} className="border-0 shadow-md">
                  <CardContent className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-mono text-xs text-green">{b.reference}</p>
                      <p className="font-semibold text-gray">{b.event_type}</p>
                      <p className="text-sm text-gray-muted">{b.location || "—"} · {b.event_date || "Date TBD"}</p>
                    </div>
                    <Badge className="capitalize">{b.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && section === "payments" && (
            <div className="space-y-3">
              {(data?.payments ?? []).length === 0 && <p className="text-gray-muted">No payments recorded yet.</p>}
              {(data?.payments ?? []).map((p) => (
                <Card key={p.id} className="border-0 shadow-md">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-semibold text-gray">{money(p.amount_ghs)}</p>
                      <p className="text-sm text-gray-muted">{p.rental_number} · {p.method}</p>
                    </div>
                    <p className="text-xs text-gray-muted">{new Date(p.paid_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && section === "notifications" && (
            <div className="space-y-3">
              {(data?.notifications ?? []).length === 0 && <p className="text-gray-muted">No notifications yet.</p>}
              {(data?.notifications ?? []).map((n) => (
                <Card key={n.id} className="border-0 shadow-md">
                  <CardContent className="p-5">
                    <p className="font-semibold text-gray">{n.title}</p>
                    <p className="mt-1 text-sm text-gray-muted">{n.body}</p>
                    <p className="mt-2 text-xs text-gray-muted">{new Date(n.created_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && section === "documents" && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-sm text-gray-muted">
                Agreements and invoice PDFs will appear here as finance documents are generated from admin actions.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
