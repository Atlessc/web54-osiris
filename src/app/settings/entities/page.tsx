import type { Metadata } from "next";

import { EntitiesSettingsPage } from "@/features/settings/entities/EntitiesSettingsPage";

export const metadata: Metadata = {
  title: "Entity Registry | OSIRIS Intelligence",
};

export default function Page() {
  return <EntitiesSettingsPage />;
}