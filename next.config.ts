import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/services/events-management", destination: "/services/event-management", permanent: true },
      { source: "/services/social-media-management", destination: "/services/strategic-communications", permanent: true },
      { source: "/rentals", destination: "/services/equipment-rentals", permanent: false },
    ];
  },
};

export default nextConfig;
