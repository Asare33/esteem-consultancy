import PortalSectionClientPage from "./portal-section-client";

const VALID = new Set(["profile", "rentals", "bookings", "payments", "documents", "notifications"]);

interface Props {
  params: Promise<{ section: string }>;
}

export default async function PortalSectionPage({ params }: Props) {
  const { section } = await params;
  const safe = VALID.has(section) ? section : "rentals";
  return <PortalSectionClientPage section={safe} />;
}
