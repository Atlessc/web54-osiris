import type { Metadata } from "next";

import { SettingsPlaceholderPage } from "@/features/settings/components/SettingsPlaceholderPage";

export const metadata: Metadata = {
  title: "Import / Export | OSIRIS Intelligence",
};

export default function Page() {
  return (
    <SettingsPlaceholderPage
      title="Import / Export"
      description="Export, restore, or migrate your local OSIRIS configuration profile."
      configFile="osiris-data/"
    />
  );
}