"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, Globe, Users, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { footerNavigation } from "@/data/navigation";
import { siteInfo } from "@/data/site";
import { submitForm } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socialIcons = {
  facebook: Share2,
  instagram: Globe,
  linkedin: Users,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      const result = await submitForm("newsletter", { email: newsletterEmail });
      setNewsletterStatus(
        result.demo
          ? `Subscribed (demo). Ref: ${result.reference}`
          : "Thank you for subscribing!"
      );
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="border-t border-border bg-gray text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo textVariant="onDark" href="/" imageClassName="h-16 w-auto max-w-[200px] rounded-none" />
            <p className="text-sm text-white/70">{siteInfo.description.slice(0, 160)}…</p>
            <div className="flex gap-3">
              {siteInfo.social.map((s) => {
                const Icon = socialIcons[s.platform as keyof typeof socialIcons];
                if (!Icon) return null;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-green"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerNavigation.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 font-display text-lg font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-white/70">
              Insights on events, leadership, and professional excellence.
            </p>
            <form className="flex gap-2" onSubmit={handleNewsletter}>
              <Input
                type="email"
                placeholder="Your email"
                aria-label="Email for newsletter"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
              />
              <Button type="submit" variant="secondary" size="sm">
                Join
              </Button>
            </form>
            {newsletterStatus && <p className="mt-2 text-xs text-white/70">{newsletterStatus}</p>}
            <a
              href="/api/company-profile"
              download
              className="mt-4 inline-flex text-sm font-semibold text-green hover:underline"
            >
              Download Company Profile
            </a>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green" /> {siteInfo.contact.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green" /> {siteInfo.contact.email}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                {siteInfo.contact.address}, {siteInfo.contact.city}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row">
          <p>© {year} {siteInfo.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
