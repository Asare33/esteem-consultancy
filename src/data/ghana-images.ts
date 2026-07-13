/** Curated Unsplash photography from Accra and Ghana for site-wide imagery. */

export const ghanaImages = {
  accraStreet: "photo-1669418989936-fae7f3cebd56",
  independenceSquare: "photo-1727023663921-967d01f69c7e",
  kwameNkrumahStatue: "photo-1636865266989-58043bceaa71",
  accraAerial: "photo-1568025848823-86404cd04ad1",
  accraSkyline: "photo-1718766304636-cb9309953a55",
  accraOffice: "photo-1568232033336-8bbd9ff19a9a",
  accraBeachTents: "photo-1727023663928-1772e2c7e679",
  traditionalDress: "photo-1660675133902-acd1b057f75d",
  traditionalDance: "photo-1660675134044-6f1990caba94",
  ghanaWedding: "photo-1768739936628-ac38f8f5efed",
  traditionalQueen: "photo-1590670796065-5c2469672e18",
  ghanaFlagBuilding: "photo-1630386226447-af0a955c1009",
  accraCityscape: "photo-1594159667349-2b4b2b911824",
  accraHarbor: "photo-1589104602532-9cee07f8f62c",
  accraWindowView: "photo-1682899236650-ed6fd1244080",
  accraConvention: "photo-1568306954278-df7b9ad9a72f",
} as const;

export type GhanaImageKey = keyof typeof ghanaImages;

export function ghanaImage(key: GhanaImageKey, width = 1200): string {
  return `https://images.unsplash.com/${ghanaImages[key]}?w=${width}&q=80&auto=format&fit=crop`;
}

/** Default hero/header backdrop — Accra skyline */
export const defaultPageHeaderImage = ghanaImage("accraSkyline", 1920);

/** Hero carousel backgrounds */
export const heroBackgrounds = {
  corporate: ghanaImage("accraOffice", 1920),
  celebration: ghanaImage("traditionalDress", 1920),
  outdoor: ghanaImage("accraBeachTents", 1920),
  community: ghanaImage("independenceSquare", 1920),
} as const;

/** Service card imagery */
export const serviceImages = {
  eventManagement: ghanaImage("accraBeachTents", 1200),
  strategicCommunications: ghanaImage("accraOffice", 1200),
  training: ghanaImage("traditionalDance", 1200),
} as const;

/** Equipment catalogue — Ghana outdoor events and venues */
export const equipmentImageKeys: GhanaImageKey[] = [
  "accraBeachTents",
  "independenceSquare",
  "traditionalDance",
  "accraConvention",
  "accraStreet",
  "accraBeachTents",
  "traditionalQueen",
  "accraHarbor",
  "accraCityscape",
  "accraAerial",
  "accraOffice",
  "independenceSquare",
  "traditionalDress",
  "accraBeachTents",
  "accraStreet",
];

export function equipmentImage(index: number, width = 800): string {
  const key = equipmentImageKeys[index % equipmentImageKeys.length];
  return ghanaImage(key, width);
}

/** Gallery and portfolio image sets */
export const galleryImageSet: { key: GhanaImageKey; alt: string }[] = [
  { key: "accraOffice", alt: "Corporate conference setup in Accra, Ghana" },
  { key: "traditionalQueen", alt: "Ghanaian bride in traditional kente at an Accra celebration" },
  { key: "kwameNkrumahStatue", alt: "Kwame Nkrumah Memorial Park in Accra, Ghana" },
  { key: "accraBeachTents", alt: "Outdoor event tents along the Accra coastline" },
  { key: "traditionalDance", alt: "Traditional cultural performance in Accra, Ghana" },
  { key: "independenceSquare", alt: "Black Star Square at Independence Arch, Accra" },
  { key: "accraAerial", alt: "Aerial view of Accra cityscape, Ghana" },
  { key: "traditionalDress", alt: "Guests in traditional Ghanaian dress at a celebration" },
  { key: "accraStreet", alt: "Busy street scene in Accra, Ghana" },
  { key: "accraConvention", alt: "Formal venue in Accra prepared for a corporate programme" },
  { key: "ghanaWedding", alt: "Ghanaian wedding ceremony details" },
  { key: "accraHarbor", alt: "Coastal view near Accra, Ghana" },
  { key: "accraCityscape", alt: "Accra skyline with high-rise buildings" },
  { key: "accraWindowView", alt: "City view from an Accra office building" },
  { key: "ghanaFlagBuilding", alt: "Government building with Ghana flag in Accra" },
  { key: "traditionalDance", alt: "Esteem team coordinating a community festival in Ghana" },
];
