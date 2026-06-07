import type { SourceBiasProfile } from "@/types/source-bias";

export type SignalSeverity =
  | "low"
  | "watch"
  | "elevated"
  | "high"
  | "critical";

export type SignalConfidence = "low" | "moderate" | "high";

export type SignalLifecycle =
  | "new"
  | "acknowledged"
  | "monitoring"
  | "escalating"
  | "cooling"
  | "resolved"
  | "rejected";

export interface DerivedSignal {
  id: string;
  title: string;
  primaryEventId: string;
  severity: SignalSeverity;
  confidence: SignalConfidence;
  location: {
    key: string;
    label: string;
    lat: number;
    lng: number;
    precision: string;
  };
  evidenceCount: number;
  sources: string[];
  matchedKeywords: string[];
  keywordFamilies: string[];
  averageSeverityScore: number;
  averageConfidenceScore: number;
  newestPublishedAt: string | null;
  explanation: string;
  knownFacts: string[];
  inferredMeaning: string[];
  uncertainty: string[];
  watchNext: string[];
  relatedEventIds: string[];
}

export interface SignalEvidenceArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  sourceId: string;
  source: string;
  sourceCategory: string;
  sourceTags: string[];
  sourceReliability: number;
  sourceBias: SourceBiasProfile;
  publishedAt: string | null;
  matchedKeywords: string[];
}

export interface SignalsApiResponse {
  events?: SignalEvidenceArticle[];
  derivedSignals?: DerivedSignal[];
  derivedTotal?: number;
  timestamp?: string;
  sourceNote?: string;
  error?: string;
  metadata?: {
    feedCount?: number;
    cacheHitCount?: number;
    staleCacheCount?: number;
    failedFeedCount?: number;
    limitations?: string[];
  };
}
