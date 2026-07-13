"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const clients = [
  "Meridian Financial",
  "Ghana Health Service",
  "Accra City Church",
  "Volta River Authority",
  "Lincoln Community School",
  "Golden Tulip Hotels",
  "Ecobank Ghana",
  "Ashesi University",
];

export function ClientLogos() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3000 }),
  ]);

  return (
    <section className="border-y border-border bg-muted py-12" aria-label="Client logos">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-gray-muted">
          Trusted by Leading Organisations
        </p>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-8">
            {clients.map((name) => (
              <div
                key={name}
                className="flex min-w-0 flex-[0_0_200px] items-center justify-center rounded-xl bg-background px-6 py-4 shadow-sm"
              >
                <span className="text-center text-sm font-semibold text-gray-muted">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
