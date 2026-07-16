import { siteInfo } from "@/data/site";
import { buildRoseKnowledge } from "@/lib/rose-knowledge";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiConfig {
  url: string;
  apiKey: string;
  model: string;
  provider: "vercel-gateway" | "openai";
}

function includesAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

export function isRoseAiEnabled(): boolean {
  return Boolean(getAiConfig());
}

function getAiConfig(): AiConfig | null {
  const gatewayKey =
    process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL_OIDC_TOKEN?.trim();
  if (gatewayKey) {
    return {
      url: "https://ai-gateway.vercel.sh/v1/chat/completions",
      apiKey: gatewayKey,
      model:
        process.env.ROSE_AI_MODEL ??
        process.env.OPENAI_MODEL ??
        "openai/gpt-4o-mini",
      provider: "vercel-gateway",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    return {
      url: "https://api.openai.com/v1/chat/completions",
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      provider: "openai",
    };
  }

  return null;
}

export function getRoseFallbackReply(message: string): string {
  const q = message.toLowerCase().trim();

  if (includesAny(q, ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"])) {
    return `Hello! I'm Rose from ${siteInfo.name}. I can guide you on event management, funeral planning, equipment rentals, training, and bookings. What would you like help with?`;
  }

  if (includesAny(q, ["service", "offer", "what do you do", "what can you"])) {
    return `We provide three core areas:\n\n• **Event Management** — weddings, funerals, corporate events, décor, catering, and logistics\n• **Strategic Communications** — PR, corporate communications, and social media\n• **Training** — emotional intelligence and professional communication\n\nExplore details at /services or tell me which area interests you.`;
  }

  if (includesAny(q, ["funeral", "condolence", "vigil", "burial", "memorial"])) {
    return `Our funeral planning team supports families with dignity and care — Book of Condolences, night vigil setup, church service coordination, outdoor reception, ushers, musical/cultural services, brochures, catering, and logistics.\n\nLearn more: /services/funeral-planning\nFor urgent support, call ${siteInfo.contact.phone} or WhatsApp ${siteInfo.contact.whatsapp}.`;
  }

  if (includesAny(q, ["rental", "equipment", "chairs", "tables", "canopy", "stage", "tent", "hire"])) {
    return `We rent premium event equipment including dance floors, stages, backdrops, tables, chairs, linens, décor, canopies, and catering equipment.\n\nBrowse the catalogue and add items to your quote cart at /services/equipment-rentals\nWhen you're ready, use /request-quote for a tailored estimate.`;
  }

  if (includesAny(q, ["book", "consultation", "appointment", "meet"])) {
    return `You can book a consultation online at /book-consultation.\nShare your event type, date, and location and our team will follow up promptly.\nYou may also call ${siteInfo.contact.phone} or email ${siteInfo.contact.email}.`;
  }

  if (includesAny(q, ["quote", "price", "cost", "how much", "pricing", "rate"])) {
    return `Pricing depends on your event scope, equipment list, duration, and delivery location.\n\nFor an accurate estimate:\n• Equipment rentals → /request-quote\n• Full event planning → /book-consultation\n\nOur team will respond with a clear proposal tailored to your needs.`;
  }

  if (includesAny(q, ["contact", "phone", "email", "whatsapp", "address", "location", "where"])) {
    return `You can reach us at:\n\n📍 ${siteInfo.contact.address}, ${siteInfo.contact.city}\n📞 ${siteInfo.contact.phone}\n✉️ ${siteInfo.contact.email}\n💬 WhatsApp: ${siteInfo.contact.whatsapp}\n\nLead consultant: ${siteInfo.contact.contactPerson?.name ?? "Rose Abena Peprah, APR"}\n\nFull contact page: /contact`;
  }

  if (includesAny(q, ["hour", "open", "time", "when are you"])) {
    return `Our business hours:\n• ${siteInfo.contact.businessHours.weekdays}\n• ${siteInfo.contact.businessHours.saturday}\n• ${siteInfo.contact.businessHours.sunday}`;
  }

  if (includesAny(q, ["wedding", "corporate", "conference", "birthday", "party"])) {
    return `Yes — we plan and manage ${q.includes("wedding") ? "weddings" : q.includes("corporate") || q.includes("conference") ? "corporate events and conferences" : "celebrations"} end-to-end, including venue setup, coordination, rentals, and guest experience.\n\nSee /services/event-management or book a consultation at /book-consultation.`;
  }

  if (includesAny(q, ["training", "emotional intelligence", "workshop", "corporate training"])) {
    return `Our Training division offers emotional intelligence and professional communication programmes for teams and organisations.\n\nDetails: /services/training\nBook a session: /book-consultation`;
  }

  if (includesAny(q, ["portal", "account", "login", "track order", "my booking"])) {
    return `Customers can register and track rentals, bookings, and payments in the Customer Portal at /portal.`;
  }

  if (includesAny(q, ["thank", "thanks", "bye", "goodbye"])) {
    return `You're welcome! If you need anything else, I'm here to help. For direct support, call ${siteInfo.contact.phone} or visit /contact.`;
  }

  return `I'd be happy to help with Esteem's services, equipment rentals, funeral planning, consultations, or contact details.\n\nTry asking about:\n• Our services\n• Equipment rentals\n• Funeral planning\n• Booking a consultation\n\nOr visit /contact to speak with our team directly at ${siteInfo.contact.phone}.`;
}

export async function generateRoseReply(messages: ChatMessage[]): Promise<string> {
  const config = getAiConfig();
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return getRoseFallbackReply("hello");

  if (!config) {
    return getRoseFallbackReply(lastUser.content);
  }

  try {
    const knowledge = buildRoseKnowledge();
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `You are Rose, the friendly AI assistant for Esteem Management Consultancy (Esteem Events Management) in Accra, Ghana. You are named after the lead consultant Rose Abena Peprah, APR. Answer clearly in plain English. Keep replies concise (under 120 words unless listing services). Use markdown sparingly for short lists. When helpful, mention relevant site paths like /services/equipment-rentals. Never make up prices — direct users to request a quote or book a consultation.

COMPANY KNOWLEDGE:
${knowledge}`,
          },
          ...messages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!res.ok) {
      console.error(`Rose AI error (${config.provider}):`, await res.text());
      return getRoseFallbackReply(lastUser.content);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || getRoseFallbackReply(lastUser.content);
  } catch (error) {
    console.error("Rose chat error:", error);
    return getRoseFallbackReply(lastUser.content);
  }
}
