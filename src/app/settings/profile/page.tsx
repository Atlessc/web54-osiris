import type { Metadata } from "next";

import { ProfileSettingsPage } from "@/features/settings/profile/ProfileSettingsPage";

export const metadata: Metadata = {
  title: "Profile Settings | OSIRIS Intelligence",
};

export default function Page() {
  return <ProfileSettingsPage />;
}