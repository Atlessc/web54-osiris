import type { RssFeedConfig } from "@/types/local-config";
import type { SourceBiasLabel, SourceBiasProfile } from "@/types/source-bias";

function getBiasLabel(score: number): SourceBiasLabel {
  if (score <= -50) return "left";
  if (score <= -17) return "lean-left";
  if (score < 17) return "center";
  if (score < 50) return "lean-right";
  return "right";
}

export function getSourceBiasProfile(feed: RssFeedConfig): SourceBiasProfile {
  if (feed.spectrumScore === null) {
    return {
      score: null,
      label: "unrated",
      confidence: feed.spectrumConfidence,
      asOf: feed.spectrumAsOf,
      basis:
        "Not rated on the current US online-news political spectrum. Official, specialist, local, and non-US sources are not assumed to be neutral.",
      referenceUrl: feed.spectrumReferenceUrl,
      logoUrl: feed.logoUrl,
    };
  }

  return {
    score: feed.spectrumScore,
    label: getBiasLabel(feed.spectrumScore),
    confidence: feed.spectrumConfidence,
    asOf: feed.spectrumAsOf,
    basis:
      "Configured source-level US online-news spectrum estimate on a -100 (left) through +100 (right) scale.",
    referenceUrl: feed.spectrumReferenceUrl,
    logoUrl: feed.logoUrl,
  };
}
