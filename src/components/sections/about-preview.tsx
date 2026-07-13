"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Award, Lightbulb, Users, Heart, Handshake, Star, CheckCircle } from "lucide-react";
import { siteInfo } from "@/data/site";
import { Button } from "@/components/ui/button";

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

export function AboutPreview() {
  return (
    <section className="bg-muted py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-green">About Us</p>
            <h2 id="about-heading" className="mt-2 font-display text-3xl font-bold text-gray md:text-4xl">
              Who We Are
            </h2>
            <p className="mt-4 text-gray-muted leading-relaxed">
              Since {siteInfo.foundedYear}, Esteem Management Consultancy has been Ghana&apos;s trusted partner
              for event management, strategic communications, and professional training. We combine
              strategic expertise with heartfelt service—because every occasion deserves to be handled with
              dignity and distinction.
            </p>
            <div className="mt-6 space-y-4 rounded-2xl bg-background p-6 shadow-sm">
              <div>
                <h3 className="font-semibold text-purple">Our Vision</h3>
                <p className="mt-1 text-sm text-gray-muted">{siteInfo.vision}</p>
              </div>
              <div>
                <h3 className="font-semibold text-green">Our Mission</h3>
                <p className="mt-1 text-sm text-gray-muted">{siteInfo.mission}</p>
              </div>
            </div>
            <Button asChild className="mt-6">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {values.slice(0, 8).map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-background p-4 shadow-sm transition hover:shadow-md"
              >
                <v.icon className="h-6 w-6 text-green" />
                <h4 className="mt-2 text-sm font-semibold text-gray">{v.title}</h4>
                <p className="mt-1 text-xs text-gray-muted line-clamp-2">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
