import { ghanaImage } from "./ghana-images";

function unsplash(id: string, width = 900): string {
  return `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;
}

export interface FuneralServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  highlighted?: boolean;
}

export const funeralServiceCards: FuneralServiceCard[] = [
  {
    id: "book-of-condolences",
    title: "Opening of Book of Condolences",
    description:
      "Create a welcoming and respectful environment for family, friends, and well-wishers to pay their respects.",
    icon: "BookOpen",
    image: "/funeral/condolence-book.png",
    features: [
      "Elegant condolence table setup",
      "Floral arrangements",
      "Guest registration management",
      "Tribute display arrangements",
    ],
  },
  {
    id: "night-vigil",
    title: "Night Vigil Setup",
    description: "We create serene and comforting spaces for remembrance and reflection.",
    icon: "Moon",
    image: "/funeral/night-vigil-candles.png",
    features: [
      "Canopy and seating arrangements",
      "Stage and backdrop setup",
      "Sound system coordination",
      "Lighting and decorative enhancements",
    ],
  },
  {
    id: "funeral-church",
    title: "Funeral Service (Church Setup)",
    description: "Professional coordination for a seamless church service.",
    icon: "Building2",
    image: "/funeral/funeral-service.png",
    features: [
      "Church décor",
      "Reserved seating arrangements",
      "Family protocol coordination",
      "Ushering services",
      "Service-day management",
    ],
  },
  {
    id: "outdoor-reception",
    title: "Outdoor Funeral Reception Setup",
    description: "Transform outdoor venues into dignified and comfortable gathering spaces.",
    icon: "Tent",
    image: ghanaImage("accraBeachTents", 900),
    features: [
      "Canopies and tents",
      "Tables and chairs",
      "Stage setup",
      "Floral and themed decorations",
      "Public address systems",
    ],
  },
  {
    id: "professional-ushers",
    title: "Professional Ushers",
    description: "Our trained ushers provide courteous and professional guest management.",
    icon: "Users",
    image: unsplash("photo-1511632765486-a01980e01a18"),
    features: [
      "Guest reception",
      "Seating assistance",
      "Protocol services",
      "VIP guest management",
    ],
  },
  {
    id: "musical-cultural",
    title: "Musical & Cultural Services",
    description:
      "Create a reflective atmosphere with live flute performances and celebrate heritage with traditional drumming ensembles.",
    icon: "Music",
    image: ghanaImage("traditionalDance", 900),
    features: [
      "Live flute performance",
      "Traditional drumming",
      "Soothing reflective atmosphere",
      "Cultural celebration of heritage",
    ],
    highlighted: true,
  },
  {
    id: "brochure-printing",
    title: "Funeral Brochure Design & Printing",
    description: "Professional memorial publication services for programmes and tributes.",
    icon: "Newspaper",
    image: unsplash("photo-1544716278-ca5e3f4abd8c"),
    features: [
      "Funeral brochure design",
      "Tribute booklets",
      "Memorial programs",
      "Posters and banners",
      "Thank-you cards",
    ],
  },
  {
    id: "funeral-catering",
    title: "Funeral Catering Services",
    description:
      "Our catering partners provide quality food and refreshments for guests and family members.",
    icon: "UtensilsCrossed",
    image: unsplash("photo-1555244162-803834f70033"),
    features: [
      "Local and continental menus",
      "Beverage service",
      "VIP catering",
      "Family catering packages",
    ],
  },
  {
    id: "funeral-logistics",
    title: "Funeral Logistics Management",
    description: "Comprehensive support for all funeral-related logistics.",
    icon: "Truck",
    image: unsplash("photo-1552664730-d307ca884978"),
    features: [
      "Vendor coordination",
      "Equipment rental",
      "Transportation arrangements",
      "Security coordination",
      "Event supervision",
      "On-site management",
    ],
  },
];

export const funeralServiceIntro = {
  title: "Funeral Planning & Management Services",
  subtitle: "Honouring Lives with Dignity, Excellence and Compassion",
  description:
    "At Esteem Events Management Consultancy, we understand that saying goodbye to a loved one is one of life's most emotional moments. Our dedicated team provides professional funeral planning, coordination, and logistics services to ensure every farewell is organized with dignity, respect, and excellence.",
  supportLine:
    "From the opening of the Book of Condolences to the final funeral rites, we manage every detail so families can focus on celebrating the life and legacy of their loved ones.",
};
