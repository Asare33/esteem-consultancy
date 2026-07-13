import { ghanaImage } from "@/data/ghana-images";

export type BlogCategory =
  | "event-tips"
  | "funeral-guides"
  | "business"
  | "weddings"
  | "company-news";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: BlogCategory;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  image: string;
  tags: string[];
  featured?: boolean;
}

export const blogCategories: { id: BlogCategory; label: string }[] = [
  { id: "event-tips", label: "Event Tips" },
  { id: "funeral-guides", label: "Funeral Guides" },
  { id: "business", label: "Business" },
  { id: "weddings", label: "Weddings" },
  { id: "company-news", label: "Company News" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "how-to-plan-corporate-agm-ghana",
    title: "How to Plan a Successful Corporate AGM in Ghana",
    excerpt:
      "Annual general meetings require more than a venue booking. Learn the essential checklist—from shareholder communications and quorum requirements to AV setup and protocol seating.",
    category: "event-tips",
    author: "Daniel Owusu",
    authorRole: "Head of Corporate Events",
    publishedAt: "2026-05-20",
    readTimeMinutes: 8,
    image: ghanaImage("accraOffice", 1200),
    tags: ["AGM", "Corporate Events", "Planning Checklist"],
    featured: true,
  },
  {
    id: "blog-2",
    slug: "funeral-planning-first-48-hours",
    title: "Funeral Planning: What to Do in the First 48 Hours",
    excerpt:
      "In the immediate aftermath of a loss, decisions can feel overwhelming. This guide outlines the first steps—notifications, morgue arrangements, and how a funeral coordinator can help.",
    category: "funeral-guides",
    author: "Grace Adom",
    authorRole: "Funeral Services Director",
    publishedAt: "2026-04-15",
    readTimeMinutes: 6,
    image: ghanaImage("kwameNkrumahStatue", 1200),
    tags: ["Funeral Planning", "Family Support", "Ghana"],
    featured: true,
  },
  {
    id: "blog-3",
    slug: "choosing-right-event-equipment-rental",
    title: "Choosing the Right Event Equipment for Your Guest Count",
    excerpt:
      "Undersized tents and underpowered sound systems can derail an otherwise perfect event. We break down how to match equipment to venue size, programme type, and power requirements.",
    category: "event-tips",
    author: "Michael Tetteh",
    authorRole: "Equipment & Logistics Manager",
    publishedAt: "2026-03-28",
    readTimeMinutes: 7,
    image: ghanaImage("accraBeachTents", 1200),
    tags: ["Equipment Rental", "Tents", "Sound Systems"],
  },
  {
    id: "blog-4",
    slug: "wedding-budget-allocation-guide",
    title: "A Practical Wedding Budget Allocation Guide for Ghanaian Couples",
    excerpt:
      "From engagement ceremonies to reception entertainment, wedding costs add up quickly. Here is a sensible framework for allocating your budget across vendors and priorities.",
    category: "weddings",
    author: "Efua Nyarko",
    authorRole: "Senior Wedding Planner",
    publishedAt: "2026-02-10",
    readTimeMinutes: 9,
    image: ghanaImage("traditionalQueen", 1200),
    tags: ["Wedding Budget", "Planning Tips", "Traditional Ceremony"],
  },
  {
    id: "blog-5",
    slug: "building-event-protocol-team",
    title: "Why Every Major Event Needs a Dedicated Protocol Team",
    excerpt:
      "VIP guests notice the details—arrival sequence, seating precedence, and responsiveness. Discover how professional protocol staff protect your organisation's reputation at high-profile events.",
    category: "business",
    author: "Daniel Owusu",
    authorRole: "Head of Corporate Events",
    publishedAt: "2026-01-22",
    readTimeMinutes: 5,
    image: ghanaImage("independenceSquare", 1200),
    tags: ["Protocol", "VIP Management", "Corporate"],
  },
  {
    id: "blog-6",
    slug: "esteem-expands-regional-equipment-fleet",
    title: "Esteem Expands Regional Equipment Fleet to Serve Ashanti & Eastern Regions",
    excerpt:
      "We are pleased to announce new warehouse capacity in Kumasi and expanded delivery routes, bringing our full rental catalogue closer to clients outside Greater Accra.",
    category: "company-news",
    author: "Esteem Management Team",
    authorRole: "Company Announcement",
    publishedAt: "2025-12-05",
    readTimeMinutes: 3,
    image: ghanaImage("accraAerial", 1200),
    tags: ["Company News", "Expansion", "Equipment Rental"],
    featured: true,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
