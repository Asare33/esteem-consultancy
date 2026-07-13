"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { portfolioItems, portfolioCategories, type PortfolioCategory } from "@/data/portfolio";

export default function PortfolioPage() {
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all");
  const filtered =
    filter === "all" ? portfolioItems : portfolioItems.filter((p) => p.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Our Work"
        description="A showcase of corporate events, weddings, funerals, training programmes, and more."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 flex flex-wrap gap-2">
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label="All" />
            {portfolioCategories.map((c) => (
              <FilterBtn key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.label} />
            ))}
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-lg"
              >
                <div className="group relative">
                  <Image src={item.image} alt={item.title} width={600} height={400} className="w-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 p-4 opacity-0 transition group-hover:opacity-100">
                    <p className="text-xs uppercase text-green">{item.category}</p>
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/80">{item.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "gradient-brand text-white" : "bg-muted text-gray hover:bg-green/10"}`}
    >
      {label}
    </button>
  );
}
