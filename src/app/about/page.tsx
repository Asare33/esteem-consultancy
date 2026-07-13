import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Shield, Award, Lightbulb, Users, Heart, Handshake, Star, CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CtaSection } from "@/components/sections/cta-section";
import { siteInfo } from "@/data/site";
import { ghanaImage } from "@/data/ghana-images";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteInfo.name} — our vision, mission, and core values.`,
};

const values = [
  { icon: Shield, title: "Integrity", description: "Honest communication and ethical practices in every engagement." },
  { icon: Award, title: "Excellence", description: "Uncompromising standards in planning, execution, and delivery." },
  { icon: Lightbulb, title: "Innovation", description: "Creative solutions that elevate every event and experience." },
  { icon: Users, title: "Professionalism", description: "Polished service that reflects your organisation's esteem." },
  { icon: Heart, title: "Compassion", description: "Empathy and care, especially in life's most sensitive moments." },
  { icon: Handshake, title: "Teamwork", description: "Collaborative partnerships with clients, vendors, and communities." },
  { icon: Star, title: "Customer Satisfaction", description: "Your success and peace of mind are our highest priorities." },
  { icon: CheckCircle, title: "Accountability", description: "We take ownership from first consultation to final detail." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Who We Are"
        description="A trusted Ghanaian consultancy delivering excellence in event management, strategic communications, and training since 2012."
        backgroundImage={ghanaImage("independenceSquare", 1920)}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray">Our Story</h2>
              <p className="mt-4 text-gray-muted leading-relaxed">
                Esteem Management Consultancy was founded on a simple belief: every occasion—whether
                a corporate milestone or a family farewell—deserves to be handled with professionalism,
                dignity, and care. Over {new Date().getFullYear() - siteInfo.foundedYear} years, we have
                grown from a small events team into a full-service consultancy trusted by corporations,
                institutions, churches, and families across Ghana.
              </p>
              <p className="mt-4 text-gray-muted leading-relaxed">
                Our integrated approach means you work with one team for events, rentals, communications,
                and training—eliminating coordination headaches and ensuring consistent quality at every touchpoint.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="/api/company-profile" download>Download Company Profile</a>
                </Button>
              </div>
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border-l-4 border-purple bg-muted p-6">
                  <h3 className="font-display text-xl font-semibold text-purple">Our Vision</h3>
                  <p className="mt-2 text-gray-muted">{siteInfo.vision}</p>
                </div>
                <div className="rounded-2xl border-l-4 border-green bg-muted p-6">
                  <h3 className="font-display text-xl font-semibold text-green">Our Mission</h3>
                  <p className="mt-2 text-gray-muted">{siteInfo.mission}</p>
                </div>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl shadow-xl lg:min-h-[560px]">
              <Image
                src={ghanaImage("accraAerial", 1200)}
                alt="Aerial view of Accra, Ghana"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-gray">Core Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-background p-6 shadow-sm transition hover:shadow-md">
                <v.icon className="h-8 w-8 text-green" />
                <h3 className="mt-3 font-semibold text-gray">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-muted">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
