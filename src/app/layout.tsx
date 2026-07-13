import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/layout/site-shell";
import { siteInfo } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: `${siteInfo.name} | Events, Funerals & Corporate Services`,
    template: `%s | ${siteInfo.name}`,
  },
  description: siteInfo.description,
  keywords: [
    "event management Ghana",
    "funeral planning Accra",
    "equipment rental",
    "corporate training",
    "social media management",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: siteInfo.name,
    title: siteInfo.name,
    description: siteInfo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteInfo.name,
    description: siteInfo.tagline,
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteInfo.name,
  url: siteInfo.url,
  logo: siteInfo.logo.src.startsWith("http") ? siteInfo.logo.src : `${siteInfo.url}${siteInfo.logo.src}`,
  description: siteInfo.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteInfo.contact.address,
    addressLocality: siteInfo.contact.city,
    addressRegion: siteInfo.contact.region,
    addressCountry: siteInfo.contact.country,
  },
  telephone: siteInfo.contact.phone,
  email: siteInfo.contact.email,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
