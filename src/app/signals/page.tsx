import type { Metadata } from "next";

import { SignalsPage } from "@/features/signals/SignalsPage";

export const metadata: Metadata = {
  title: "Signals",
  description:
    "Review deterministic, source-backed watch conditions and their supporting evidence.",
};

export default function SignalsRoute() {
  return <SignalsPage />;
}