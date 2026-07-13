import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  Package,
  Receipt,
  UserRound,
  Bell,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Track rentals, bookings, invoices, and notifications with Esteem Events Management.",
};

const portalCards = [
  {
    title: "My Profile",
    description: "Update contact details, company information, and preferences.",
    href: "/portal/profile",
    icon: UserRound,
  },
  {
    title: "Rental History",
    description: "View active and past rental orders, status, and balances.",
    href: "/portal/rentals",
    icon: Package,
  },
  {
    title: "Booking History",
    description: "Track wedding, funeral, corporate, and training bookings.",
    href: "/portal/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Invoices & Receipts",
    description: "Download quotations, invoices, receipts, and payment history.",
    href: "/portal/payments",
    icon: Receipt,
  },
  {
    title: "Documents",
    description: "Access rental agreements and confirmation letters.",
    href: "/portal/documents",
    icon: FileText,
  },
  {
    title: "Notifications",
    description: "Approvals, payment confirmations, pickup and return reminders.",
    href: "/portal/notifications",
    icon: Bell,
  },
];

export default function CustomerPortalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Portal"
        title="Your Esteem Account Workspace"
        description="Track rentals, bookings, payments, and notifications in one place."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-muted/50 p-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray">Welcome to the Customer Portal</h2>
              <p className="mt-2 max-w-2xl text-gray-muted">
                Start a rental request, book an event, or continue managing an existing order. Secure
                account authentication is enabled for production rollout.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/portal/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/portal/register">Create Account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services/equipment-rentals">Explore Rentals</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portalCards.map((card) => (
              <Card key={card.title} className="border-0 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-muted">{card.description}</p>
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green"
                  >
                    Open <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
