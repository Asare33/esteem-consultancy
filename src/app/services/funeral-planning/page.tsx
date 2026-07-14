import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Moon,
  Building2,
  Tent,
  Users,
  Music,
  Newspaper,
  UtensilsCrossed,
  Truck,
  CheckCircle,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CtaSection } from "@/components/sections/cta-section";
import { funeralServiceCards, funeralServiceIntro } from "@/data/funeral-services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Funeral Planning & Management",
  description:
    "Compassionate funeral planning and coordination in Ghana—condolence books, vigils, church services, receptions, ushers, catering, and logistics.",
};

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Moon,
  Building2,
  Tent,
  Users,
  Music,
  Newspaper,
  UtensilsCrossed,
  Truck,
  Heart,
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
        eyebrow="Event Management · Funeral Planning"
        title={funeralServiceIntro.subtitle}
        description={funeralServiceIntro.description}
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green">
              {funeralServiceIntro.title}
            </p>
            <p className="mt-4 text-gray-muted leading-relaxed">{funeralServiceIntro.supportLine}</p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {funeralServiceCards.map((card) => {
              const Icon = iconMap[card.icon] ?? Heart;
              return (
                <Card
                  key={card.id}
                  className={`overflow-hidden border-0 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                    card.highlighted ? "ring-2 ring-green" : ""
                  }`}
                >
                  <div className="relative h-48">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-purple">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold text-gray">{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-muted leading-relaxed">{card.description}</p>
                    <ul className="mt-4 space-y-2">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-muted">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                          {f}
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
            <Button asChild size="lg">
              <Link href="/book-consultation">Request Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/request-quote">Get a Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services/event-management">Back to Event Management</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaSection
        title="We're Here When You Need Us Most"
        description="From the Book of Condolences to final rites, our team manages every detail with dignity and care."
      />
    </>
  );
}
