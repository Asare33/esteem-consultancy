import { HeroCarousel } from "@/components/sections/hero-carousel";
import { ClientLogos } from "@/components/sections/client-logos";
import { AboutPreview } from "@/components/sections/about-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { StatsSection } from "@/components/sections/stats-section";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { FaqPreview } from "@/components/sections/faq-preview";
import { BlogPreview } from "@/components/sections/blog-preview";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ClientLogos />
      <AboutPreview />
      <ServicesPreview />
      <StatsSection />
      <PortfolioPreview />
      <TestimonialsCarousel />
      <BlogPreview />
      <FaqPreview />
      <CtaSection />
    </>
  );
}
