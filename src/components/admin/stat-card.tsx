import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  className?: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, hint, className, icon: Icon }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
