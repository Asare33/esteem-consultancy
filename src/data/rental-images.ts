/** Curated Unsplash images matched to Esteem rental catalogue items. */

function unsplash(id: string, width = 800): string {
  return `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;
}

export const rentalImages = {
  dancingFloor: unsplash("photo-1516450360452-9312f5e86fc7"),
  backdropBoards: unsplash("photo-1519167758481-83f550bb49b3"),
  tablesWooden: unsplash("photo-1577140917170-285929fb55b7"),
  tablesGlass: unsplash("photo-1595428774223-ef52624120d2"),
  tablesPlastic: unsplash("photo-1533090481720-856c6e3c1fdc"),
  chairs: unsplash("photo-1506439773649-6e0eb8cfb237"),
  tableCloth: unsplash("photo-1519225421980-715cb0215aed"),
  handNapkins: unsplash("photo-1556910103-1c02745aae4d"),
  centrepieces: unsplash("photo-1511795409834-ef04bbd61622"),
  stage: unsplash("photo-1501281668745-f7f57925c3b4"),
  artificialGrass: unsplash("photo-1558904541-efa843a96f01"),
  canopies: unsplash("photo-1464366400600-7168b8af9bc3"),
  chafingDish: unsplash("photo-1555244162-803834f70033"),
  catering: unsplash("photo-1414235077428-338989a2e8c0"),
} as const;

export type RentalImageKey = keyof typeof rentalImages;
