import type { Metadata } from "next";

import { SourcesSettingsPage } from "@/features/settings/sources/SourcesSettingsPage";

export const metadata: Metadata = {
  title: "Source Settings | OSIRIS Intelligence",
};

export default function Page() {
  return <SourcesSettingsPage />;
}