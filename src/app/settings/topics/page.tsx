import type { Metadata } from "next";

import { TopicsSettingsPage } from "@/features/settings/topics/TopicsSettingsPage";

export const metadata: Metadata = {
  title: "Topic Registry | OSIRIS Intelligence",
};

export default function Page() {
  return <TopicsSettingsPage />;
}