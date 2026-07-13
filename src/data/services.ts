export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export interface ServiceDivision {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  offerings: ServiceOffering[];
}

export const serviceDivisions: ServiceDivision[] = [
  {
    id: "event-management",
    slug: "event-management",
    title: "Event Management",
    shortDescription:
      "End-to-end weddings, funerals, corporate programmes, décor, catering, and media coverage.",
    description:
      "Our flagship division delivers complete event planning and execution across Ghana—with equipment rentals, logistics, and on-site coordination under one trusted team.",
    icon: "CalendarDays",
    image: "https://images.unsplash.com/photo-1727023663928-1772e2c7e679?w=1200&q=80&auto=format&fit=crop",
    offerings: [
      {
        id: "wedding-planning",
        title: "Wedding Planning",
        description: "Full planning and coordination for traditional and white weddings.",
        features: [
          "Full wedding planning",
          "Wedding coordination",
          "Reception setup",
          "Bridal support",
          "Venue management",
        ],
      },
      {
        id: "funeral-planning",
        title: "Funeral Planning & Management",
        description: "Compassionate funeral and memorial coordination.",
        features: [
          "Funeral coordination",
          "Memorial services",
          "Seating arrangements",
          "Canopies and tents",
          "Public address systems",
          "Funeral logistics",
        ],
      },
      {
        id: "corporate-events",
        title: "Corporate Events",
        description: "Professional conferences, launches, and formal programmes.",
        features: [
          "Conferences",
          "Seminars",
          "Product launches",
          "Annual General Meetings",
          "Awards nights",
          "Business meetings",
        ],
      },
      {
        id: "birthday-events",
        title: "Birthday Events",
        description: "Memorable birthday celebrations for all ages.",
        features: [
          "Children's birthdays",
          "Adult birthdays",
          "Surprise parties",
          "Anniversary celebrations",
        ],
      },
      {
        id: "decor-services",
        title: "Décor Services",
        description: "Creative styling that elevates every venue.",
        features: [
          "Event decoration",
          "Floral arrangements",
          "Stage decoration",
          "Balloon decoration",
          "Table settings",
          "Backdrops",
        ],
      },
      {
        id: "catering-services",
        title: "Catering Services",
        description: "Reliable catering for indoor and outdoor programmes.",
        features: [
          "Food preparation",
          "Buffet service",
          "Drinks",
          "Waiter services",
          "Outdoor catering",
        ],
      },
      {
        id: "photography-videography",
        title: "Photography & Videography",
        description: "Capture and deliver premium media packages.",
        features: [
          "Event photography",
          "Event videography",
          "Drone coverage",
          "Live streaming",
          "Photo albums",
          "Video editing",
        ],
      },
    ],
  },
  {
    id: "strategic-communications",
    slug: "strategic-communications",
    title: "Strategic Communication",
    shortDescription: "PR, media, branding, and digital campaigns that build trust.",
    description:
      "We help organisations communicate with clarity—through PR, media relations, social media, crisis communication, and brand consultancy.",
    icon: "Megaphone",
    image: "https://images.unsplash.com/photo-1568232033336-8bbd9ff19a9a?w=1200&q=80&auto=format&fit=crop",
    offerings: [
      {
        id: "strategic-comms",
        title: "Strategic Communication Services",
        description: "Integrated communication programmes for brands and institutions.",
        features: [
          "Public Relations",
          "Media Relations",
          "Corporate Communication",
          "Brand Communication",
          "Event Publicity",
          "Press Conferences",
          "Crisis Communication",
          "Speech Writing",
          "Corporate Branding",
          "Social Media Management",
          "Digital Marketing Campaigns",
          "Communication Consultancy",
        ],
      },
    ],
  },
  {
    id: "training",
    slug: "training",
    title: "Training",
    shortDescription: "Capability building for teams, leaders, and frontline staff.",
    description:
      "Practical training programmes that develop professionalism, communication, leadership, and organisational capacity.",
    icon: "GraduationCap",
    image: "https://images.unsplash.com/photo-1660675134044-6f1990caba94?w=1200&q=80&auto=format&fit=crop",
    offerings: [
      {
        id: "training-programmes",
        title: "Professional Training Programmes",
        description: "Workshops and capacity-building programmes for organisations.",
        features: [
          "Event Management Training",
          "Customer Service Training",
          "Leadership Development",
          "Communication Skills",
          "Corporate Etiquette",
          "Public Speaking",
          "Digital Marketing Training",
          "ICT Training",
          "Team Building Workshops",
          "Professional Development",
          "Organizational Capacity Building",
        ],
      },
    ],
  },
];

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceSubArea {
  id: string;
  title: string;
  description: string;
  href: string;
  highlights?: string[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  features: ServiceFeature[];
  highlights: string[];
  subAreas?: ServiceSubArea[];
  offerings?: ServiceOffering[];
}

/** Compatibility layer for existing forms / previews that still map over services[]. */
export const services: Service[] = serviceDivisions.map((d) => ({
  id: d.id,
  slug: d.slug,
  title: d.title,
  shortDescription: d.shortDescription,
  description: d.description,
  icon: d.icon,
  image: d.image,
  offerings: d.offerings,
  features: d.offerings.flatMap((o) =>
    o.features.slice(0, 4).map((f) => ({ title: f, description: o.title }))
  ),
  highlights: d.offerings.flatMap((o) => o.features).slice(0, 6),
  subAreas:
    d.slug === "event-management"
      ? [
          {
            id: "equipment-rentals",
            title: "Premium Equipment Rentals",
            description: "Browse chairs, tents, PA, lighting, and more.",
            href: "/services/equipment-rentals",
            highlights: ["Chairs", "Tents", "PA Systems", "Lighting"],
          },
          {
            id: "funeral-coordination",
            title: "Funeral Coordination",
            description: "Full funeral and memorial logistics support.",
            href: "/services/funeral-planning",
            highlights: ["Coordination", "Seating", "Logistics"],
          },
          {
            id: "event-planning",
            title: "Event Planning",
            description: "Weddings, corporate, birthdays, décor and catering.",
            href: "/services/event-management#offerings",
            highlights: ["Weddings", "Corporate", "Décor"],
          },
        ]
      : undefined,
}));

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getServiceDivisionBySlug(slug: string) {
  return serviceDivisions.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
