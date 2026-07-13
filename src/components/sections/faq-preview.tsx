"use client";

import Link from "next/link";
import { faqItems } from "@/data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function FaqPreview() {
  const items = faqItems.slice(0, 5);

  return (
    <section className="bg-muted py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green">FAQ</p>
          <h2 id="faq-heading" className="mt-2 font-display text-3xl font-bold text-gray">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="rounded-2xl border bg-background px-4 shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-muted">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/faq">View All FAQs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
