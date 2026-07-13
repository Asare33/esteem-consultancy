"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000 }),
  ]);

  return (
    <section className="py-20 lg:py-28" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green">Testimonials</p>
          <h2 id="testimonials-heading" className="mt-2 font-display text-3xl font-bold text-gray md:text-4xl">
            Trusted by Families &amp; Organisations
          </h2>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {testimonials.slice(0, 6).map((t) => (
              <Card key={t.id} className="min-w-0 flex-[0_0_100%] border-0 shadow-lg md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-green/30" />
                  <p className="mt-4 text-gray-muted leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-green text-green" />
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-semibold text-gray">{t.name}</p>
                    <p className="text-sm text-gray-muted">
                      {t.role}{t.organisation ? `, ${t.organisation}` : ""}
                    </p>
                    <p className="text-xs text-green">{t.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
