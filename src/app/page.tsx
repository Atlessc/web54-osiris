import type { Metadata } from "next";

import { HomePage } from "@/features/home/pages/HomePage";

export const metadata: Metadata = {
  title: "Home | OSIRIS Intelligence",
  description:
    "OSIRIS local command home for source health, active events, signals, config status, and navigation into the map, feed, sources, and settings.",
};

export default function Page() {
  return <HomePage />;
}