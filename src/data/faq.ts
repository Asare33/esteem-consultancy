export type FaqCategory =
  | "general"
  | "events"
  | "funerals"
  | "equipment"
  | "billing";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export interface FaqCategoryGroup {
  id: FaqCategory;
  title: string;
  description: string;
}

export const faqCategories: FaqCategoryGroup[] = [
  {
    id: "general",
    title: "General",
    description: "About Esteem Management Consultancy and how we work with clients.",
  },
  {
    id: "events",
    title: "Events & Weddings",
    description: "Planning timelines, bookings, and what to expect on event day.",
  },
  {
    id: "funerals",
    title: "Funeral Services",
    description: "Compassionate guidance for families arranging funeral rites.",
  },
  {
    id: "equipment",
    title: "Equipment Rental",
    description: "Hiring, delivery, setup, and availability for rental items.",
  },
  {
    id: "billing",
    title: "Billing & Policies",
    description: "Payments, deposits, cancellations, and service agreements.",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "faq-general-1",
    category: "general",
    question: "What services does Esteem Management Consultancy provide?",
    answer:
      "We offer three core services: Event Management, Strategic Communications, and Training. Event Management covers event planning, funeral and memorial coordination, and equipment rentals. Many clients engage us for multiple areas within a single programme.",
  },
  {
    id: "faq-general-2",
    category: "general",
    question: "Which areas do you serve?",
    answer:
      "Our headquarters is in Accra, and we regularly serve Greater Accra, Ashanti, Eastern, Central, and Volta regions. Out-of-region and international repatriation projects are handled on a case-by-case basis—contact us to confirm coverage for your location.",
  },
  {
    id: "faq-general-3",
    category: "general",
    question: "How do I request a quote?",
    answer:
      "Complete the contact form on our website, email info@esteemconsultancygh.com, or call our office during business hours. For urgent funeral enquiries, our emergency line is available 24 hours a day, seven days a week.",
  },
  {
    id: "faq-events-1",
    category: "events",
    question: "How far in advance should I book an event planner?",
    answer:
      "For corporate conferences and large weddings, we recommend booking 3–6 months ahead. Smaller social events may be confirmed with 4–8 weeks' notice. Peak season dates fill quickly, so early enquiry improves venue and vendor availability.",
  },
  {
    id: "faq-events-2",
    category: "events",
    question: "Do you handle vendor sourcing and contracts?",
    answer:
      "Yes. Our event managers identify suitable vendors, obtain quotes, coordinate contracts, and manage communications on your behalf. You retain final approval on all major selections and expenditures.",
  },
  {
    id: "faq-events-3",
    category: "events",
    question: "Can you manage both traditional and white wedding ceremonies?",
    answer:
      "Absolutely. We have extensive experience coordinating Ghanaian traditional rites alongside contemporary white wedding celebrations, including multi-city programmes involving separate venues and guest logistics.",
  },
  {
    id: "faq-funerals-1",
    category: "funerals",
    question: "What should I do when a loved one passes away?",
    answer:
      "Contact our funeral team immediately—we will guide you through morgue arrangements, family notifications, church or venue booking, and announcement preparation. Having one coordinator reduces stress and ensures nothing important is overlooked.",
  },
  {
    id: "faq-funerals-2",
    category: "funerals",
    question: "Do you assist with repatriation from abroad?",
    answer:
      "Yes. We support families repatriating remains from international locations, including documentation guidance, airline coordination, and receiving arrangements in Ghana. Timelines depend on embassy and airline requirements.",
  },
  {
    id: "faq-funerals-3",
    category: "funerals",
    question: "Can you arrange one-week, forty-day, and anniversary memorials?",
    answer:
      "We plan and coordinate memorial observances at every stage—one-week gatherings, forty-day services, one-year anniversaries, and subsequent commemorations—with appropriate venues, programmes, catering, and equipment.",
  },
  {
    id: "faq-equipment-1",
    category: "equipment",
    question: "How do I check equipment availability?",
    answer:
      "Browse our online catalogue for current availability status, then submit a rental enquiry with your event date, location, and item list. Our logistics team confirms availability and provides a formal quotation within one business day.",
  },
  {
    id: "faq-equipment-2",
    category: "equipment",
    question: "Do you deliver and set up rental equipment?",
    answer:
      "Yes. Delivery, installation, and post-event collection are included in our standard rental packages for most items. Setup times are scheduled to ensure your venue is ready well before guests arrive.",
  },
  {
    id: "faq-equipment-3",
    category: "equipment",
    question: "What happens if equipment is damaged during my event?",
    answer:
      "Clients are responsible for equipment while it is on hire. Minor wear is expected; however, damage beyond normal use may incur repair or replacement charges as outlined in your rental agreement. We recommend assigning a site contact to oversee equipment during your programme.",
  },
  {
    id: "faq-billing-1",
    category: "billing",
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, mobile money, and certified cheque. Corporate clients may request invoicing with agreed payment terms. A deposit is required to confirm most bookings.",
  },
  {
    id: "faq-billing-2",
    category: "billing",
    question: "How much deposit is required to secure a booking?",
    answer:
      "Event and funeral packages typically require a 50% deposit to confirm services, with the balance due before or on the event date as specified in your contract. Equipment rentals may require a smaller deposit depending on order value and duration.",
  },
  {
    id: "faq-billing-3",
    category: "billing",
    question: "What is your cancellation policy?",
    answer:
      "Cancellation terms vary by service type and how close to the event date notice is given. Deposits may be partially or fully non-refundable depending on vendor commitments already made on your behalf. Full policy details are provided in every service agreement before you sign.",
  },
];

export function getFaqByCategory(category: FaqCategory): FaqItem[] {
  return faqItems.filter((item) => item.category === category);
}

export function getFaqById(id: string): FaqItem | undefined {
  return faqItems.find((item) => item.id === id);
}
