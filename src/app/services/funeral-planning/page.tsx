import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList, Box, Car, Building2, Landmark, Newspaper, UtensilsCrossed, Flower2, Plane, CalendarHeart,
  Shield, Heart, CheckCircle, type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CtaSection } from "@/components/sections/cta-section";
import { funeralServiceCards, funeralServiceIntro } from "@/data/funeral-services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Funeral Planning & Management",
  description:
    "Compassionate, dignified funeral planning and coordination services in Ghana. Honouring lives with excellence and care.",
};

const iconMap: Record<string, LucideIcon> = {
  ClipboardList, Box, Car, Church: Building2, Landmark, Newspaper, UtensilsCrossed, Flower2, Plane, CalendarHeart, Shield, Heart,
};

const whyChoose = [
  { title: "Compassion", description: "We understand grief and serve with empathy at every step." },
  { title: "Professional Coordination", description: "Experienced coordinators manage all vendors and timelines." },
  { title: "Customized Packages", description: "Flexible packages tailored to your family's wishes and budget." },
  { title: "Reliable Execution", description: "Dependable delivery—from vigil to burial and reception." },
];

export default function FuneralPlanningPage() {
  return (
    <>
      <PageHeader
        eyebrow="Event Management"
        title="Honouring Lives with Dignity, Excellence & Compassion"
        description={funeralServiceIntro.description}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="mx-auto max-w-3xl text-center text-gray-muted leading-relaxed">
            At Esteem Management Consultancy, we understand that saying goodbye to a loved one is one of
            life&apos;s most emotional moments. Our dedicated team provides compassionate and professional
            funeral planning, coordination, and logistics services that allow families to focus on
            celebrating the life of their loved one while we manage every detail with dignity and excellence.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {funeralServiceCards.map((card) => {
              const Icon = iconMap[card.icon] ?? Heart;
              return (
                <Card
                  key={card.id}
                  className={`border-0 shadow-lg transition hover:shadow-xl ${card.highlighted ? "ring-2 ring-green" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10 text-purple">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-gray">{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-muted">{card.description}</p>
                    <ul className="mt-4 space-y-2">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-muted">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold text-gray">Why Families Choose Us</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => (
              <div key={item.title} className="rounded-2xl bg-background p-6 text-center shadow-sm">
                <h3 className="font-semibold text-green">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-muted">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg"><Link href="/book-consultation">Request Consultation</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/request-quote">Get a Quote</Link></Button>
          </div>
        </div>
      </section>

      <CtaSection
        title="We're Here When You Need Us Most"
        description="Our 24-hour emergency line ensures support is always available during life's most difficult moments."
      />
    </>
  );
}
