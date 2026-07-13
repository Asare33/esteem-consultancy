import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green">Admin Workspace</p>
              <p className="text-sm text-slate-500">Manage bookings, rentals, gallery, and news in one place</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Website
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
