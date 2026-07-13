import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteInfo } from "@/data/site";
import { faqItems, faqCategories } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${siteInfo.name} services, bookings, and rentals.`,
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Find answers to common questions about our services, bookings, and policies."
      />
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {faqCategories.map((cat) => {
            const items = faqItems.filter((f) => f.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id} className="mb-12">
                <h2 className="mb-2 font-display text-2xl font-bold text-gray">{cat.title}</h2>
                <p className="mb-6 text-sm text-gray-muted">{cat.description}</p>
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
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
