import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Megaphone,
  GraduationCap,
  Check,
  ArrowRight,
  ClipboardList,
  Heart,
  Package,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CtaSection } from "@/components/sections/cta-section";
import { getServiceBySlug, getAllServiceSlugs, services, type Service } from "@/data/services";
import { siteInfo } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  Megaphone,
  GraduationCap,
};

const eventPillarIcons: Record<string, LucideIcon> = {
  "event-planning": ClipboardList,
  "funeral-coordination": Heart,
  "equipment-rentals": Package,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.shortDescription,
    openGraph: { title: service.title, description: service.shortDescription, images: [service.image] },
  };
}

function EventManagementPillars({ service }: { service: Service }) {
  if (!service.subAreas) return null;

  return (
    <>
      <div className="mt-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-green">Under Event Management</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-gray md:text-4xl">
          Event Planning, Funeral Coordination &amp; Equipment Rentals
        </h2>
        <p className="mt-3 max-w-3xl text-gray-muted">
          Everything you need for your programme lives here—three specialised areas, one coordinated team.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {service.subAreas.map((area) => {
            const PillarIcon = eventPillarIcons[area.id] ?? CalendarDays;
            const isOnPage = area.href.startsWith("#");
            const card = (
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green">
                    <PillarIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray">{area.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-gray-muted">{area.description}</p>
                  {area.highlights && (
                    <ul className="mt-4 space-y-2">
                      {area.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-muted">
                          <Check className="h-4 w-4 shrink-0 text-green" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isOnPage ? (
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-green">
                      Explore {area.title}{" "}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-green">
                      Detailed below <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </CardContent>
              </Card>
            );

            return isOnPage ? (
              <div key={area.id}>{card}</div>
            ) : (
              <Link key={area.id} href={area.href} className="group block transition hover:-translate-y-1">
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      <div id="event-planning" className="mt-16 scroll-mt-28 rounded-3xl bg-muted p-8 md:p-10">
        <h3 className="font-display text-2xl font-semibold text-gray">Event Planning in Detail</h3>
        <p className="mt-3 max-w-3xl text-gray-muted leading-relaxed">
          {service.features[0]?.description} We manage vendors, timelines, protocol, and on-site supervision so
          your programme runs smoothly from start to finish.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/book-consultation">Plan Your Event</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/portfolio">View Our Work</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = iconMap[service.icon] ?? CalendarDays;
  const otherServices = services.filter((s) => s.slug !== slug);
  const isEventManagement = slug === "event-management";

  return (
    <>
      <PageHeader eyebrow="Services" title={service.title} description={service.shortDescription} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative h-80 overflow-hidden rounded-3xl shadow-xl lg:h-auto">
              <Image src={service.image} alt={service.title} fill className="object-cover" sizes="50vw" priority />
            </div>
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green/10 text-green">
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-gray-muted leading-relaxed">{service.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/book-consultation">Request Consultation</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/request-quote">Get a Quote</Link>
                </Button>
              </div>
            </div>
          </div>

          {isEventManagement ? (
            <EventManagementPillars service={service} />
          ) : null}

          {service.offerings && service.offerings.length > 0 && (
            <div id="offerings" className="mt-16 scroll-mt-28">
              <p className="text-sm font-semibold uppercase tracking-widest text-green">Service Catalogue</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-gray">
                What&apos;s included under {service.title}
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {service.offerings.map((offering) => (
                  <Card key={offering.id} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-display text-xl font-semibold text-gray">{offering.title}</h3>
                      <p className="mt-2 text-sm text-gray-muted">{offering.description}</p>
                      <ul className="mt-4 space-y-2">
                        {offering.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-gray-muted">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!isEventManagement && !service.offerings && (
            <>
              <div className="mt-16 grid gap-6 md:grid-cols-2">
                {service.features.map((f) => (
                  <Card key={f.title} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-display text-lg font-semibold text-gray">{f.title}</h3>
                      <p className="mt-2 text-sm text-gray-muted">{f.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 rounded-2xl bg-muted p-8">
                <h3 className="font-display text-xl font-semibold text-gray">What&apos;s Included</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-gray-muted">
                      <Check className="h-5 w-5 shrink-0 text-green" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 font-display text-2xl font-bold text-gray">Other Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {otherServices.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className="rounded-2xl bg-background p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-gray">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-muted line-clamp-2">{s.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection title={`Ready to get started with ${service.title}?`} />
    </>
  );
}
