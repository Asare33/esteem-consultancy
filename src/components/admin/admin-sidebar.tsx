"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Images,
  Newspaper,
  LogOut,
  ExternalLink,
  Boxes,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/rentals", label: "Rentals", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/reports", label: "Reports", icon: FileSpreadsheet },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/news", label: "News / Updates", icon: Newspaper },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-green/80">Esteem Admin</p>
        <h1 className="font-display text-lg font-bold">Management Panel</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                active ? "bg-green text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-700 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <ExternalLink className="h-5 w-5" /> View Website
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-slate-800 hover:text-red-200"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
