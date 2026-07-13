export interface SocialLink {
  platform: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | "whatsapp";
  url: string;
  label: string;
}

export interface ContactInfo {
  address: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  emailSecondary?: string;
  whatsapp: string;
  mapEmbedUrl?: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface StatCounter {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export interface SiteInfo {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  /** Public website domain, e.g. https://esteemconsultancygh.com */
  url: string;
  mission: string;
  vision: string;
  foundedYear: number;
  logoAlt: string;
  logo: {
    /** Path under /public — e.g. /logo.svg or /logo.png */
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  contact: ContactInfo;
  social: SocialLink[];
  stats: StatCounter[];
}

export const siteInfo: SiteInfo = {
  name: "Esteem Management Consultancy",
  legalName: "Esteem Management Consultancy Ltd.",
  tagline: "Excellence in Events, Dignity in Every Detail",
  description:
    "Esteem Management Consultancy is a full-service firm based in Accra, Ghana. We deliver event management, strategic communications, and professional training for organisations that expect precision, professionalism, and care.",
  url: "https://esteemconsultancygh.com",
  mission:
    "To honour every occasion—celebratory or solemn—with meticulous planning, transparent communication, and service that reflects the esteem our clients deserve.",
  vision:
    "To be Ghana's most trusted partner for integrated event management, strategic communications, and professional training, recognised for integrity, reliability, and exceptional client experience.",
  foundedYear: 2012,
  logoAlt: "Esteem Management Consultancy logo",
  logo: {
    src: "/logo.png",
    width: 500,
    height: 500,
    alt: "Esteem Events Management logo",
  },
  contact: {
    address: "14 Independence Avenue, Osu",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    phone: "+233 30 278 9456",
    phoneSecondary: "+233 24 812 3456",
    email: "info@esteemconsultancygh.com",
    emailSecondary: "events@esteemconsultancygh.com",
    whatsapp: "+233248123456",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.789!2d-0.187!3d5.556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzMnMjAuNCJOIDDCsDExJzEzLjIiVw!5e0!3m2!1sen!2sgh!4v1",
    businessHours: {
      weekdays: "Monday – Friday: 8:00 AM – 6:00 PM",
      saturday: "Saturday: 9:00 AM – 4:00 PM",
      sunday: "Sunday: Emergency funeral services only",
    },
  },
  social: [
    {
      platform: "facebook",
      url: "https://facebook.com/esteemconsultancy",
      label: "Follow us on Facebook",
    },
    {
      platform: "instagram",
      url: "https://instagram.com/esteemconsultancy",
      label: "Follow us on Instagram",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/company/esteem-consultancy",
      label: "Connect on LinkedIn",
    },
    {
      platform: "whatsapp",
      url: "https://wa.me/233248123456",
      label: "Chat with us on WhatsApp",
    },
  ],
  stats: [
    {
      id: "events-managed",
      value: 2400,
      suffix: "+",
      label: "Events Successfully Managed",
    },
    {
      id: "years-experience",
      value: 14,
      suffix: "+",
      label: "Years of Professional Experience",
    },
    {
      id: "clients-served",
      value: 850,
      suffix: "+",
      label: "Satisfied Clients & Families",
    },
    {
      id: "equipment-items",
      value: 1200,
      suffix: "+",
      label: "Rental Items in Our Inventory",
    },
  ],
};
