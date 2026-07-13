import { ghanaImage } from "@/data/ghana-images";

export type PortfolioCategory =
  | "corporate"
  | "weddings"
  | "funerals"
  | "conferences"
  | "community";

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  image: string;
  client?: string;
  location: string;
  date: string;
  services: string[];
  featured?: boolean;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
}

export const portfolioCategories: { id: PortfolioCategory; label: string }[] = [
  { id: "corporate", label: "Corporate Events" },
  { id: "weddings", label: "Weddings" },
  { id: "funerals", label: "Funerals" },
  { id: "conferences", label: "Conferences" },
  { id: "community", label: "Community Events" },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "portfolio-1",
    slug: "meridian-financial-agm-2026",
    title: "Meridian Financial Group AGM 2026",
    category: "corporate",
    description:
      "Full event management for a 400-delegate annual general meeting including registration, live voting support, and gala dinner.",
    image: ghanaImage("accraOffice", 900),
    client: "Meridian Financial Group",
    location: "Accra International Conference Centre",
    date: "2026-02-28",
    services: ["Event Management", "Protocol & Hospitality", "Equipment Rental"],
    featured: true,
    aspectRatio: "landscape",
  },
  {
    id: "portfolio-2",
    slug: "darko-osei-wedding-weekend",
    title: "Darko–Osei Wedding Weekend",
    category: "weddings",
    description:
      "Two-day traditional and white wedding celebration across Accra and Kumasi with coordinated décor, transport, and guest logistics.",
    image: ghanaImage("traditionalQueen", 900),
    location: "Accra & Kumasi",
    date: "2025-12-20",
    services: ["Wedding Planning", "Equipment Rental"],
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "portfolio-3",
    slug: "chief-nortey-memorial",
    title: "Chief Nortey Memorial Service",
    category: "funerals",
    description:
      "Complete funeral coordination including church service, burial rites, and one-week observance for a traditional council elder.",
    image: ghanaImage("kwameNkrumahStatue", 900),
    location: "Ga Traditional Area, Accra",
    date: "2025-11-14",
    services: ["Funeral & Memorial Services"],
    aspectRatio: "square",
  },
  {
    id: "portfolio-4",
    slug: "healthbridge-gala-2025",
    title: "HealthBridge Foundation Charity Gala",
    category: "corporate",
    description:
      "Black-tie fundraising gala with auction, live entertainment, and VIP protocol for donors and health sector leaders.",
    image: ghanaImage("independenceSquare", 900),
    client: "HealthBridge Foundation",
    location: "Kempinski Hotel Gold Coast City",
    date: "2025-10-05",
    services: ["Event Management", "Protocol & Hospitality"],
    aspectRatio: "wide",
  },
  {
    id: "portfolio-5",
    slug: "west-africa-tech-summit",
    title: "West Africa Tech Summit 2025",
    category: "conferences",
    description:
      "Three-day technology conference with multiple breakout sessions, exhibition hall, and hybrid live-stream production.",
    image: ghanaImage("accraConvention", 900),
    location: "Labadi Beach Hotel, Accra",
    date: "2025-08-22",
    services: ["Event Management", "Equipment Rental"],
    featured: true,
    aspectRatio: "landscape",
  },
  {
    id: "portfolio-6",
    slug: "grace-covenant-anniversary",
    title: "Grace Covenant Chapel 25th Anniversary Crusade",
    category: "community",
    description:
      "Outdoor crusade for 3,000 attendees with multi-tent layout, concert-grade sound, and generator power distribution.",
    image: ghanaImage("accraBeachTents", 900),
    client: "Grace Covenant Chapel",
    location: "Tema Community Park",
    date: "2026-01-08",
    services: ["Equipment Rental", "Event Management"],
    aspectRatio: "wide",
  },
  {
    id: "portfolio-7",
    slug: "volta-agro-launch",
    title: "Volta Agro Product Launch",
    category: "corporate",
    description:
      "Regional product unveiling with stage design, media wall, and dignitary protocol for government and partner representatives.",
    image: ghanaImage("accraAerial", 900),
    client: "Volta Agro Ltd.",
    location: "Ho Municipal Assembly Hall",
    date: "2026-03-12",
    services: ["Event Management", "Protocol & Hospitality"],
    aspectRatio: "square",
  },
  {
    id: "portfolio-8",
    slug: "adom-festival-2025",
    title: "Adom Community Festival",
    category: "community",
    description:
      "Neighbourhood cultural festival featuring food stalls, live performances, children's activities, and community awards.",
    image: ghanaImage("traditionalDance", 900),
    location: "Osu, Accra",
    date: "2025-07-19",
    services: ["Event Management", "Equipment Rental"],
    aspectRatio: "portrait",
  },
  {
    id: "portfolio-9",
    slug: "asante-repatriation-service",
    title: "Asante Family Repatriation Service",
    category: "funerals",
    description:
      "International repatriation from London with airport reception, morgue coordination, and traditional burial in Ejisu.",
    image: ghanaImage("traditionalDress", 900),
    location: "Kumasi & Accra",
    date: "2025-09-18",
    services: ["Funeral & Memorial Services"],
    aspectRatio: "landscape",
  },
  {
    id: "portfolio-10",
    slug: "women-in-leadership-forum",
    title: "Women in Leadership Forum",
    category: "conferences",
    description:
      "Full-day leadership forum with panel sessions, networking lunch, and workshop breakout rooms for 250 delegates.",
    image: ghanaImage("accraCityscape", 900),
    location: "Mövenpick Ambassador Hotel, Accra",
    date: "2026-05-15",
    services: ["Event Management", "Corporate Consulting"],
    aspectRatio: "portrait",
  },
];

export function getPortfolioByCategory(
  category: PortfolioCategory
): PortfolioItem[] {
  return portfolioItems.filter((item) => item.category === category);
}

export function getPortfolioBySlug(slug: string): PortfolioItem | undefined {
  return portfolioItems.find((item) => item.slug === slug);
}

export function getFeaturedPortfolio(): PortfolioItem[] {
  return portfolioItems.filter((item) => item.featured);
}
