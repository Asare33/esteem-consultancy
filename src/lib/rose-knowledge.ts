import { siteInfo } from "@/data/site";
import { serviceDivisions } from "@/data/services";
import { equipmentCategories } from "@/data/equipment";
import { funeralServiceCards } from "@/data/funeral-services";

export interface RoseQuickPrompt {
  label: string;
  message: string;
}

export const ROSE_QUICK_PROMPTS: RoseQuickPrompt[] = [
  { label: "Our services", message: "What services does Esteem offer?" },
  { label: "Equipment rentals", message: "Tell me about your equipment rentals." },
  { label: "Funeral planning", message: "How can you help with funeral planning?" },
  { label: "Book consultation", message: "How do I book a consultation?" },
  { label: "Contact Rose", message: "How can I contact the team?" },
];

export function buildRoseKnowledge(): string {
  const services = serviceDivisions
    .map(
      (s) =>
        `${s.title}: ${s.shortDescription}. Offerings: ${s.offerings.map((o) => o.title).join(", ")}.`
    )
    .join("\n");

  const equipment = equipmentCategories.map((c) => `${c.name} — ${c.description}`).join("\n");

  const funeral = funeralServiceCards.map((s) => `${s.title}: ${s.description}`).join("\n");

  return `
COMPANY: ${siteInfo.name} (${siteInfo.legalName})
TAGLINE: ${siteInfo.tagline}
ABOUT: ${siteInfo.description}
MISSION: ${siteInfo.mission}
VISION: ${siteInfo.vision}
FOUNDED: ${siteInfo.foundedYear}
WEBSITE: ${siteInfo.url}

LEAD CONSULTANT: ${siteInfo.contact.contactPerson?.name ?? "Rose Abena Peprah, APR"}
ROLE: ${siteInfo.contact.contactPerson?.title ?? "Lead Consultant & Emotional Intelligence Trainer"}

CONTACT
Address: ${siteInfo.contact.address}, ${siteInfo.contact.city}, ${siteInfo.contact.region}, ${siteInfo.contact.country}
Phone: ${siteInfo.contact.phone}
Email: ${siteInfo.contact.email}
WhatsApp: ${siteInfo.contact.whatsapp}
Hours: ${siteInfo.contact.businessHours.weekdays}; ${siteInfo.contact.businessHours.saturday}; ${siteInfo.contact.businessHours.sunday}

MAIN SERVICE DIVISIONS
${services}

FUNERAL PLANNING SERVICES
${funeral}

EQUIPMENT RENTAL CATEGORIES
${equipment}

KEY PAGES
- Services overview: /services
- Event management: /services/event-management
- Funeral planning: /services/funeral-planning
- Equipment rentals: /services/equipment-rentals
- Book consultation: /book-consultation
- Request quote: /request-quote
- Contact: /contact
- Customer portal: /portal

GUIDELINES FOR ROSE
- Be warm, professional, and concise.
- Represent Esteem Management Consultancy in Accra, Ghana.
- For exact pricing, invite the visitor to request a quote or book a consultation.
- For urgent funeral support, mention phone and WhatsApp.
- Do not invent services or prices not listed above.
`.trim();
}

export const ROSE_GREETING = `Hello! I'm Rose, your Esteem Events assistant. I can help with services, equipment rentals, funeral planning, bookings, and general enquiries. How may I assist you today?`;
