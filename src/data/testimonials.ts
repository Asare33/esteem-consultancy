export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organisation?: string;
  location: string;
  rating: number;
  content: string;
  service: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Mrs. Akosua Mensah",
    role: "Family Representative",
    location: "East Legon, Accra",
    rating: 5,
    content:
      "When we lost our father, Esteem handled everything with such grace and patience. From the church service to the burial and one-week gathering, every detail was managed thoughtfully. We could grieve knowing professionals were in control.",
    service: "Funeral & Memorial Services",
    date: "2025-11-14",
  },
  {
    id: "testimonial-2",
    name: "Kwame Osei-Bonsu",
    role: "Events Manager",
    organisation: "Meridian Financial Group",
    location: "Accra",
    rating: 5,
    content:
      "Esteem coordinated our annual general meeting for 400 shareholders flawlessly. Registration, AV, protocol, and catering all ran on schedule. Our board has already confirmed them for next year's conference.",
    service: "Event Management",
    date: "2026-02-28",
  },
  {
    id: "testimonial-3",
    name: "Abena Darko",
    role: "Bride",
    location: "Kumasi",
    rating: 5,
    content:
      "Our wedding weekend involved both traditional and white wedding ceremonies across two cities. Esteem's team kept vendors aligned, guests informed, and us calm. The day felt magical because nothing was left to chance.",
    service: "Wedding Planning",
    date: "2025-12-20",
  },
  {
    id: "testimonial-4",
    name: "Rev. Emmanuel Addo",
    role: "Senior Pastor",
    organisation: "Grace Covenant Chapel",
    location: "Tema",
    rating: 5,
    content:
      "For our church anniversary crusade, Esteem supplied tents, 800 chairs, sound, and generators. Setup was completed ahead of schedule and their technicians stayed on site throughout. Outstanding service.",
    service: "Equipment Rental",
    date: "2026-01-08",
  },
  {
    id: "testimonial-5",
    name: "Dr. Ama Serwaa",
    role: "Executive Director",
    organisation: "HealthBridge Foundation",
    location: "Accra",
    rating: 4,
    content:
      "We engaged Esteem for a fundraising gala and a follow-up staff retreat. Their consulting team helped us tighten our run-of-show and improve donor experience. Professional, responsive, and genuinely invested in our success.",
    service: "Corporate Consulting",
    date: "2025-10-05",
  },
  {
    id: "testimonial-6",
    name: "Nana Yaw Boateng",
    role: "Family Head",
    location: "Cape Coast",
    rating: 5,
    content:
      "Repatriating our uncle from the UK required careful documentation and coordination. Esteem guided us through every step and ensured a dignified homecoming. We are deeply grateful for their expertise.",
    service: "Funeral & Memorial Services",
    date: "2025-09-18",
  },
  {
    id: "testimonial-7",
    name: "Selasi Agbeko",
    role: "Marketing Director",
    organisation: "Volta Agro Ltd.",
    location: "Ho",
    rating: 5,
    content:
      "Our product launch needed VIP handling for regional ministers and partner executives. Esteem's protocol team managed arrivals, seating, and media moments without a single hitch. Truly world-class hospitality.",
    service: "Protocol & Hospitality",
    date: "2026-03-12",
  },
  {
    id: "testimonial-8",
    name: "Mr. & Mrs. Kofi Annan",
    role: "Clients",
    location: "Spintex, Accra",
    rating: 5,
    content:
      "We rented a marquee, tables, chairs, and a PA system for our mother's eighty-first birthday celebration. Equipment arrived clean and on time, and pickup was seamless. Esteem is now our go-to for every family event.",
    service: "Equipment Rental",
    date: "2026-04-02",
  },
];

export const testimonialStats = {
  averageRating: 4.9,
  totalReviews: 127,
  recommendPercentage: 98,
};
