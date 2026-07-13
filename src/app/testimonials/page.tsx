"use client";

import { Star, Quote } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { testimonials, testimonialStats } from "@/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="What Our Clients Say"
        description="Real stories from families and organisations we've had the privilege to serve."
      />

      <section className="border-b border-border bg-muted py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-4 text-center">
          <div>
            <p className="font-display text-3xl font-bold text-green">{testimonialStats.averageRating}</p>
            <p className="text-sm text-gray-muted">Average Rating</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-green">{testimonialStats.totalReviews}+</p>
            <p className="text-sm text-gray-muted">Reviews</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-green">{testimonialStats.recommendPercentage}%</p>
            <p className="text-sm text-gray-muted">Would Recommend</p>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-green/30" />
                  <p className="mt-3 text-sm text-gray-muted leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-green text-green" />
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-semibold text-gray">{t.name}</p>
                    <p className="text-sm text-gray-muted">{t.role}{t.organisation ? `, ${t.organisation}` : ""}</p>
                    <p className="text-xs text-green">{t.service} · {t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
