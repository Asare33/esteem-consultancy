import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Icon/mark size in pixels */
  size?: number;
  className?: string;
  imageClassName?: string;
  /** Show company name beside the mark */
  showText?: boolean;
  /** default: dark text on light bg · light: white text for hero/nav overlay */
  textVariant?: "default" | "light" | "onDark";
  href?: string | false;
  priority?: boolean;
}

export function Logo({
  size = 40,
  className,
  imageClassName,
  showText = false,
  textVariant = "default",
  href = "/",
  priority = false,
}: LogoProps) {
  const { src, alt, width, height } = siteInfo.logo;

  const textPrimary =
    textVariant === "light"
      ? "text-white"
      : textVariant === "onDark"
        ? "text-white"
        : "text-gray";

  const textSecondary =
    textVariant === "light"
      ? "text-white/80"
      : textVariant === "onDark"
        ? "text-white/70"
        : "text-gray-muted";

  const mark = (
    <Image
      src={src}
      alt={alt}
      width={width ?? size}
      height={height ?? size}
      className={cn("rounded-xl object-contain", imageClassName)}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
    />
  );

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      {showText && (
        <span className="leading-tight">
          <span className={cn("block font-display text-lg font-semibold", textPrimary)}>
            Esteem
          </span>
          <span className={cn("block text-xs", textSecondary)}>Management Consultancy</span>
        </span>
      )}
    </span>
  );

  if (href !== false) {
    return (
      <Link href={href ?? "/"} aria-label={`${siteInfo.name} home`} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
