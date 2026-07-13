"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { RentalCartProvider } from "@/context/rental-cart-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <RentalCartProvider>{children}</RentalCartProvider>
    </ThemeProvider>
  );
}
