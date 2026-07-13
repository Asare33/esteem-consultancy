import Image from "next/image";
import { defaultPageHeaderImage } from "@/data/ghana-images";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  backgroundImage?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  backgroundImage = defaultPageHeaderImage,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 text-white">
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-green/90 via-green/75 to-purple/85" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-white/85">{description}</p>}
      </div>
    </section>
  );
}
