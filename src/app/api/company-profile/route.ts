import { siteInfo } from "@/data/site";

export async function GET() {
  const profile = `${siteInfo.name}
${siteInfo.legalName}

Tagline: ${siteInfo.tagline}

ABOUT US
${siteInfo.description}

MISSION
${siteInfo.mission}

VISION
${siteInfo.vision}

CONTACT
${siteInfo.contact.contactPerson ? `${siteInfo.contact.contactPerson.name}
${siteInfo.contact.contactPerson.title}
` : ""}${siteInfo.contact.address}, ${siteInfo.contact.city}, ${siteInfo.contact.region}, ${siteInfo.contact.country}
Phone: ${siteInfo.contact.phone}
Email: ${siteInfo.contact.email}

SERVICES
- Event Management (event planning, funeral coordination, equipment rentals)
- Strategic Communications
- Training

---
This is a placeholder company profile. Replace with your branded PDF before going live.
Generated: ${new Date().toISOString().split("T")[0]}
`;

  return new Response(profile, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="esteem-company-profile.txt"',
    },
  });
}
