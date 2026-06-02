import type { Metadata } from "next";

import { LocationsSettingsPage } from "@/features/settings/locations/LocationsSettingsPage";

export const metadata: Metadata = {
  title: "Location Registry | OSIRIS Intelligence",
};

export default function Page() {
  return <LocationsSettingsPage />;
}