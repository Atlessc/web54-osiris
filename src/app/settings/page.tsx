import type { Metadata } from "next";

import { SettingsSectionPage } from "@/features/settings/components/SettingsSectionPage";

export const metadata: Metadata = {
  title: "Settings | OSIRIS Intelligence",
  description:
    "Manage OSIRIS local configuration, sources, keywords, locations, topics, entities, and import/export settings.",
};

export default function Page() {
  return <SettingsSectionPage />;
}