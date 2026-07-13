import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "purple" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variant === "default" && "bg-muted text-gray",
        variant === "success" && "bg-green/10 text-green",
        variant === "warning" && "bg-amber-100 text-amber-800",
        variant === "purple" && "bg-purple/10 text-purple",
        variant === "outline" && "border border-border bg-transparent text-gray",
        className
      )}
      {...props}
    />
  );
}
