"use client";

import { MessageCircle } from "lucide-react";
import { siteInfo } from "@/data/site";

export function WhatsAppFloat() {
  const whatsapp = siteInfo.social.find((s) => s.platform === "whatsapp");

  if (!whatsapp) return null;

  return (
    <a
      href={whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.label}
      className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:shadow-xl md:bottom-6"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
