"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { portfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

export function PortfolioPreview() {
  const featured = portfolioItems.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-20 lg:py-28" aria-labelledby="portfolio-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green">Portfolio</p>
            <h2 id="portfolio-heading" className="mt-2 font-display text-3xl font-bold text-gray md:text-4xl">
              Our Work Speaks for Itself
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/portfolio">View Full Portfolio</Link>
          </Button>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-lg"
            >
              <div className="group relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-xs uppercase tracking-wider text-green">{item.category}</p>
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
