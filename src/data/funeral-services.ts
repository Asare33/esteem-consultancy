export interface FuneralServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  highlighted?: boolean;
}

export const funeralServiceCards: FuneralServiceCard[] = [
  {
    id: "complete-funeral-coordination",
    title: "Complete Funeral Coordination",
    description:
      "A dedicated funeral coordinator manages every aspect of the service on your family's behalf—from first call through burial or cremation and reception.",
    icon: "ClipboardList",
    features: [
      "Single point of contact for the family",
      "Timeline and vendor coordination",
      "Budget guidance and transparent costing",
      "24-hour emergency response line",
    ],
    highlighted: true,
  },
  {
    id: "casket-coffin-supply",
    title: "Casket & Coffin Supply",
    description:
      "We source and deliver quality caskets and coffins in a range of styles and finishes, aligned with family preference, faith tradition, and budget.",
    icon: "Box",
    features: [
      "Local and imported options",
      "Custom lining and nameplate engraving",
      "Viewing and selection assistance",
      "Timely delivery to morgue or residence",
    ],
  },
  {
    id: "hearse-transport",
    title: "Hearse & Funeral Transport",
    description:
      "Dignified hearse services and coordinated family transport ensure every procession is conducted with respect, punctuality, and proper protocol.",
    icon: "Car",
    features: [
      "Premium hearse fleet",
      "Family bus and limousine hire",
      "Route planning and police liaison where required",
      "Out-of-town and inter-city coverage",
    ],
  },
  {
    id: "church-memorial-services",
    title: "Church & Memorial Services",
    description:
      "We arrange church bookings, clergy coordination, funeral programmes, hymnals, and audiovisual support for worship services and memorial gatherings.",
    icon: "Church",
    features: [
      "Church and chapel reservations",
      "Order-of-service design and printing",
      "Sound system and live streaming setup",
      "Usher and protocol support",
    ],
  },
  {
    id: "grave-cemetery-arrangements",
    title: "Grave & Cemetery Arrangements",
    description:
      "From cemetery plot identification to grave digging, lining, and tombstone referrals, we handle ground preparations with care and compliance.",
    icon: "Landmark",
    features: [
      "Cemetery and burial ground liaison",
      "Grave digging and preparation",
      "Vault and lining coordination",
      "Tombstone and monument referrals",
    ],
  },
  {
    id: "funeral-announcements",
    title: "Funeral Announcements & Programmes",
    description:
      "Professionally designed funeral announcements, posters, and printed programmes distributed through traditional and digital channels.",
    icon: "Newspaper",
    features: [
      "Radio and television announcement placement",
      "Social media and WhatsApp graphics",
      "Printed posters and handbills",
      "Biography and tribute booklet design",
    ],
  },
  {
    id: "catering-refreshments",
    title: "Catering & Refreshments",
    description:
      "Thoughtfully planned catering for pre-burial gatherings, post-service receptions, and one-week observances—scaled to your guest list.",
    icon: "UtensilsCrossed",
    features: [
      "Buffet and plated service options",
      "Local and continental menus",
      "Beverage and water station setup",
      "Tableware, linens, and service staff",
    ],
  },
  {
    id: "floral-wreath-arrangements",
    title: "Floral & Wreath Arrangements",
    description:
      "Fresh floral tributes, wreaths, and sanctuary arrangements prepared to honour the deceased and complement the service setting.",
    icon: "Flower2",
    features: [
      "Casket sprays and standing wreaths",
      "Church altar and podium flowers",
      "Family tribute bouquets",
      "Same-day rush orders where possible",
    ],
  },
  {
    id: "repatriation-assistance",
    title: "Repatriation Assistance",
    description:
      "Comprehensive support for families repatriating loved ones within Ghana or internationally, including documentation and airline coordination.",
    icon: "Plane",
    features: [
      "Embassy and consulate documentation guidance",
      "Airline and cargo booking support",
      "Receiving arrangements at destination",
      "Cross-border logistics management",
    ],
  },
  {
    id: "memorial-anniversaries",
    title: "Memorial & Anniversary Services",
    description:
      "Planning and coordination for one-week, forty-day, one-year, and subsequent memorial services that bring family and community together.",
    icon: "CalendarHeart",
    features: [
      "Venue and programme planning",
      "Tribute video and photo montages",
      "Guest invitations and seating",
      "Equipment and catering packages",
    ],
  },
];

export const funeralServiceIntro = {
  title: "Compassionate Funeral Services",
  subtitle: "Guiding families with dignity, respect, and unwavering support",
  description:
    "When you entrust Esteem with a funeral arrangement, you receive more than logistics—you receive a caring partner who understands Ghanaian traditions, Christian rites, and the quiet details that bring comfort during difficult days. Our team is available around the clock to respond when you need us most.",
};
