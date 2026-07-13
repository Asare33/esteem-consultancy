"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Megaphone,
  GraduationCap,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/data/services";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  Megaphone,
  GraduationCap,
};

export function ServicesPreview() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green">What We Do</p>
          <h2 id="services-heading" className="mt-2 font-display text-3xl font-bold text-gray md:text-4xl">
            Comprehensive Services for Every Need
          </h2>
          <p className="mt-4 text-gray-muted">
            Event management, strategic communications, and training—delivered with professionalism and care.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? CalendarDays;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Card className="group h-full overflow-hidden border-0 shadow-lg transition-shadow hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-green">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold text-gray">{service.title}</h3>
                    <p className="mt-2 text-sm text-gray-muted">{service.shortDescription}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green hover:gap-2 transition-all"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
