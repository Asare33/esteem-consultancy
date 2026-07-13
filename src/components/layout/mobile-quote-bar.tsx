"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export function MobileQuoteBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background p-3 shadow-lg md:hidden">
      <Link
        href="/request-quote"
        className="flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-sm font-semibold text-white"
      >
        <FileText className="h-4 w-4" />
        Request a Quote
      </Link>
    </div>
  );
}
