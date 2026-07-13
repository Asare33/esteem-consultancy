import { ghanaImage, galleryImageSet } from "@/data/ghana-images";

export type GalleryCategory =
  | "events"
  | "weddings"
  | "funerals"
  | "equipment"
  | "corporate"
  | "behind-the-scenes";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  title?: string;
  width: number;
  height: number;
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "events", label: "Events" },
  { id: "weddings", label: "Weddings" },
  { id: "funerals", label: "Funerals" },
  { id: "equipment", label: "Equipment" },
  { id: "corporate", label: "Corporate" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
];

const galleryMeta: {
  category: GalleryCategory;
  title: string;
  width: number;
  height: number;
}[] = [
  { category: "corporate", title: "Corporate AGM in Accra", width: 1200, height: 800 },
  { category: "weddings", title: "Traditional Ghanaian Wedding", width: 1200, height: 1600 },
  { category: "funerals", title: "Memorial at Kwame Nkrumah Park", width: 1200, height: 900 },
  { category: "equipment", title: "Coastal Event Tent Setup", width: 1200, height: 800 },
  { category: "events", title: "Cultural Festival in Accra", width: 1200, height: 900 },
  { category: "equipment", title: "Independence Square Programme", width: 1200, height: 800 },
  { category: "corporate", title: "Accra City Conference", width: 1200, height: 900 },
  { category: "events", title: "Traditional Celebration", width: 1200, height: 1600 },
  { category: "funerals", title: "Family Gathering in Accra", width: 1200, height: 900 },
  { category: "corporate", title: "Accra Business Forum", width: 1200, height: 800 },
  { category: "weddings", title: "Ghanaian Wedding Ceremony", width: 1200, height: 900 },
  { category: "behind-the-scenes", title: "Coastal Venue Preparation", width: 1200, height: 800 },
  { category: "equipment", title: "Accra Skyline Event", width: 1200, height: 900 },
  { category: "corporate", title: "Accra Office Programme", width: 1200, height: 800 },
  { category: "events", title: "National Landmark Event", width: 1200, height: 800 },
  { category: "behind-the-scenes", title: "Festival Coordination in Ghana", width: 1200, height: 800 },
];

export const galleryImages: GalleryImage[] = galleryImageSet.map((item, index) => {
  const meta = galleryMeta[index];
  return {
    id: `gallery-${index + 1}`,
    src: ghanaImage(item.key, 1200),
    alt: item.alt,
    category: meta.category,
    title: meta.title,
    width: meta.width,
    height: meta.height,
  };
});

export function getGalleryByCategory(
  category: GalleryCategory
): GalleryImage[] {
  return galleryImages.filter((image) => image.category === category);
}
