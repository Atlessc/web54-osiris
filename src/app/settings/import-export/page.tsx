import type { Metadata } from "next";

import { ImportExportSettingsPage } from "@/features/settings/import-export/ImprtExportSettingsPage";

export const metadata: Metadata = {
  title: "Import / Export | OSIRIS Intelligence",
};

export default function Page() {
  return <ImportExportSettingsPage />;
}