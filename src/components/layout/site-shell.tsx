"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { RoseChatbot } from "@/components/chat/rose-chatbot";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { MobileQuoteBar } from "@/components/layout/mobile-quote-bar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <RoseChatbot />
      <WhatsAppFloat />
      <ScrollToTop />
      <MobileQuoteBar />
    </>
  );
}
