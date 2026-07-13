import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Request Received",
  description: "Your request has been submitted successfully.",
};

interface Props {
  searchParams: Promise<{ type?: string; ref?: string; demo?: string }>;
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { type, ref, demo } = await searchParams;
  const isConsultation = type === "consultation";
  const reference = ref ?? "EMC-PENDING";

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-32">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
          <CheckCircle className="h-10 w-10 text-green" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-gray">
          {isConsultation ? "Consultation Requested!" : "Quote Request Received!"}
        </h1>
        <p className="mt-4 text-gray-muted">
          Thank you for choosing Esteem Management Consultancy. Our team will review your request
          and respond within 24–48 hours.
        </p>
        <p className="mt-2 text-sm font-semibold text-green">Reference: {reference}</p>
        {demo === "1" && (
          <p className="mt-2 text-xs text-gray-muted">
            Demo mode — submission saved locally. Add Formspree URLs to <code>.env.local</code> for live delivery.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild><Link href="/">Back to Home</Link></Button>
          <Button asChild variant="outline"><Link href="/services">Explore Services</Link></Button>
        </div>
      </div>
    </section>
  );
}
