"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { heroSlides } from "@/data/hero-slides";
import { Button } from "@/components/ui/button";

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slide = heroSlides[selectedIndex];

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden" aria-label="Hero">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={slide.id === "hero-1"}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-white"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-green/90">
              {slide.eyebrow ?? "Esteem Management Consultancy"}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              <span className={slide.highlightTitle ? "text-green/90" : undefined}>{slide.title}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">{slide.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              {slide.showAllCtas ? (
                <>
                  <Button asChild size="lg">
                    <Link href="/book-consultation">Request Service</Link>
                  </Button>
                  <Button asChild variant="white" size="lg">
                    <Link href="/services/equipment-rentals">Explore Rentals</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-gray"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </>
              ) : (
                slide.ctaLabel &&
                slide.ctaHref && (
                  <Button asChild size="lg">
                    <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                  </Button>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 hidden gap-2 md:flex">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === selectedIndex ? "w-8 bg-green" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
