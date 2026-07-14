import { heroBackgrounds } from "@/data/ghana-images";

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  highlightTitle?: boolean;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  showAllCtas?: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    image: heroBackgrounds.corporate,
    alt: "Corporate event venue in Accra, Ghana",
    title: "Empowering Organizations.",
    subtitle:
      "Strategic support that helps businesses, institutions, and families across Ghana operate with confidence and clarity.",
    ctaLabel: "Request Consultation",
    ctaHref: "/book-consultation",
  },
  {
    id: "hero-2",
    image: heroBackgrounds.celebration,
    alt: "Ghanaian celebration in traditional dress, Accra",
    title: "Creating Memorable Experiences.",
    subtitle:
      "From corporate conferences in Accra to traditional weddings and community gatherings, we craft moments that matter.",
    ctaLabel: "Explore Services",
    ctaHref: "/services",
  },
  {
    id: "hero-3",
    image: heroBackgrounds.outdoor,
    alt: "Outdoor event tents along the Accra coastline, Ghana",
    title: "Delivering Excellence.",
    highlightTitle: true,
    subtitle:
      "Fourteen years of precision planning, transparent communication, and service that exceeds expectations across Ghana.",
    ctaLabel: "Get a Quote",
    ctaHref: "/request-quote",
  },
  {
    id: "hero-4",
    image: "/hero/partner-excellence.png",
    alt: "Elegant cocktail reception setup with black linens and floral centrepieces",
    title: "Your Partner in Excellence",
    subtitle:
      "At Esteem Management Consultancy, we provide professional Event Management, Strategic Communications, and Training services designed to help organizations, businesses, institutions, and families across Ghana achieve excellence.",
    showAllCtas: true,
  },
];
