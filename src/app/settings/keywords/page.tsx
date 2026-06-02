import type { Metadata } from "next";

import { KeywordsSettingsPage } from "@/features/settings/keywords/KeywordsSettingsPage";

export const metadata: Metadata = {
  title: "Keyword Settings | OSIRIS Intelligence",
};

export default function Page() {
  return <KeywordsSettingsPage />;
}