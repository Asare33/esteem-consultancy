import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaSection({
  title = "Ready to Create Something Exceptional?",
  description = "Whether you're planning a corporate event, honouring a loved one, or building your brand—we're here to help.",
  primaryLabel = "Request Consultation",
  primaryHref = "/book-consultation",
  secondaryLabel = "Get a Quote",
  secondaryHref = "/request-quote",
}: CtaSectionProps) {
  return (
    <section className="py-20" aria-label="Call to action">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-brand px-8 py-16 text-center text-white shadow-2xl md:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/85">{description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild variant="white" size="lg">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
