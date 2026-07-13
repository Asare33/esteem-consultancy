"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/layout/page-header";
import { galleryImages as staticImages, galleryCategories, type GalleryCategory } from "@/data/gallery";

interface ApiImage {
  id: number;
  path: string;
  alt: string | null;
  album_name: string;
  album_slug: string;
}

interface DisplayImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  category: string;
}

const albumToCategory: Record<string, GalleryCategory | string> = {
  weddings: "weddings",
  funerals: "funerals",
  corporate: "corporate",
  parties: "events",
};

export default function GalleryPage() {
  const [apiImages, setApiImages] = useState<ApiImage[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setApiImages(d.images ?? []))
      .catch(() => {});
  }, []);

  const allImages = useMemo<DisplayImage[]>(() => {
    const fromApi: DisplayImage[] = apiImages.map((img) => ({
      id: `api-${img.id}`,
      src: img.path,
      alt: img.alt ?? img.album_name,
      title: img.album_name,
      category: albumToCategory[img.album_slug] ?? img.album_slug,
    }));
    const fromStatic: DisplayImage[] = staticImages.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      title: img.title,
      category: img.category,
    }));
    return [...fromApi, ...fromStatic];
  }, [apiImages]);

  const filtered =
    filter === "all" ? allImages : allImages.filter((g) => g.category === filter);

  const slides = filtered.map((g) => ({ src: g.src, alt: g.alt, title: g.title }));

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments of Excellence"
        description="Browse our gallery of corporate events, weddings, funerals, and celebrations."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 flex flex-wrap gap-2">
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label="All" />
            {galleryCategories.map((c) => (
              <FilterBtn key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.label} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(i)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg"
                aria-label={`View ${img.title ?? img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "gradient-brand text-white" : "bg-muted text-gray"}`}
    >
      {label}
    </button>
  );
}
