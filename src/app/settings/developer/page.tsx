import type { Metadata } from "next";

import { DeveloperSettingsPage } from "@/features/settings/developer/DeveloperSettingsPage";

export const metadata: Metadata = {
  title: "Developer Tools | OSIRIS Intelligence",
};

export default function Page() {
  return <DeveloperSettingsPage />;
}