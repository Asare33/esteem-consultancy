import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays, Megaphone, GraduationCap, ArrowRight, Check, type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { services } from "@/data/services";
import { siteInfo } from "@/data/site";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services",
  description: `Explore the full range of services offered by ${siteInfo.name}.`,
};

const iconMap: Record<string, LucideIcon> = {
  CalendarDays, Megaphone, GraduationCap,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Three Core Divisions, One Integrated Platform"
        description="Event Management, Strategic Communication, and Training—with rentals and logistics connected across customer and admin portals."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = iconMap[service.icon] ?? CalendarDays;
              return (
                <Card key={service.id} className="group overflow-hidden border-0 shadow-lg">
                  <div className="relative h-56">
                    <Image src={service.image} alt={service.title} fill className="object-cover transition group-hover:scale-105" sizes="50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-green">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-semibold text-gray">{service.title}</h2>
                    <p className="mt-2 text-gray-muted">
                      {service.id === "event-management"
                        ? service.shortDescription
                        : service.description}
                    </p>
                    {service.subAreas ? (
                      <ul className="mt-4 space-y-2">
                        {service.subAreas.map((area) => (
                          <li key={area.id}>
                            <Link
                              href={
                                service.slug === "event-management"
                                  ? `/services/${service.slug}${area.href}`
                                  : area.href
                              }
                              className="inline-flex items-center gap-1 text-sm font-medium text-gray hover:text-green"
                            >
                              <Check className="h-4 w-4 text-green" />
                              {area.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {service.highlights.map((h) => (
                          <li key={h} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-gray">
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href={`/services/${service.slug}`} className="mt-4 inline-flex items-center gap-1 font-semibold text-green">
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
