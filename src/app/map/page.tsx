import type { Metadata } from "next";

import MapPage from "./MapPage";

const SITE_URL = "https://osirisai.live";

export const metadata: Metadata = {
  title: "Map | OSIRIS Intelligence",
  description:
    "Open the OSIRIS live intelligence map with global incidents, source layers, tracking data, and map-based OSINT context.",
  alternates: {
    canonical: `${SITE_URL}/map`,
  },
};

export default function Page() {
  return <MapPage />;
}