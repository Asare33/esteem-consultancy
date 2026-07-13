import type { MetadataRoute } from "next";
import { getAllServiceSlugs } from "@/data/services";
import { getAllBlogSlugs } from "@/data/blog";
import { siteInfo } from "@/data/site";

const baseUrl = siteInfo.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "", "/about", "/services", "/portfolio", "/gallery", "/news", "/testimonials",
    "/blog", "/contact", "/faq", "/book-consultation", "/request-quote",
    "/services/funeral-planning", "/services/equipment-rentals",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...getAllServiceSlugs().map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getAllBlogSlugs().map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
