import type { ApiCacheMetadata } from "@/types/local-cache";
import type { SourceLane } from "@/types/local-config";

export type SourceHealthStatus = "online" | "warning" | "offline";

export type SourcePullStatus =
  | "network"
  | "fresh-cache"
  | "stale-cache"
  | "not-checked"
  | "disabled"
  | "error";

export interface SourceIngestionRejectedSample {
  reason: string;
  title: string;
  url: string;
  source: string;
  matchedKeywords: string[];
  matchedLocation: string | null;
  matchedSentence: string | null;
}

export interface SourceIngestionDiagnostics {
  feedId: string;
  processedAt: string;
  processedItems: number;
  totalItems: number;
  acceptedItems: number;
  candidateRejectedItems: number;
  rejectedItems: number;
  excludedItems: number;
  rejectionReasons: Record<string, number>;
  excludedReasons: Record<string, number>;
  rejectedSamples: SourceIngestionRejectedSample[];
}

export interface SourceIngestionReasonCount {
  reason: string;
  count: number;
}

export interface SourceIngestionRollup {
  sourceCount: number;
  processedItemCount: number;
  acceptedItemCount: number;
  candidateRejectedItemCount: number;
  excludedItemCount: number;
  rejectionReasons: Record<string, number>;
  excludedReasons: Record<string, number>;
  topRejectionReasons: SourceIngestionReasonCount[];
  topExcludedReasons: SourceIngestionReasonCount[];
}

export interface SourceIngestionSummary {
  processedItemCount: number;
  acceptedItemCount: number;
  candidateRejectedItemCount: number;
  excludedItemCount: number;
  topRejectionReasons: SourceIngestionReasonCount[];
  topExcludedReasons: SourceIngestionReasonCount[];
  ingestionByLane: Record<SourceLane, SourceIngestionRollup>;
  ingestionByCategory: Record<string, SourceIngestionRollup>;
}

export interface SourceHealthItem {
  id: string;
  name: string;
  url: string;
  category: string;
  tags: string[];
  enabled: boolean;
  reliabilityWeight: number;
  refreshIntervalMinutes: number;
  sourceLane: SourceLane;
  mapEligible: boolean;
  signalEligible: boolean;
  maxAgeHours: number | null;
  status: SourceHealthStatus;
  pullStatus: SourcePullStatus;
  httpStatus: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
  lastSuccessAt: string | null;
  nextRefreshAt: string | null;
  itemCount: number;
  fromCache: boolean;
  isStale: boolean;
  error: string | null;
  ingestion: SourceIngestionDiagnostics | null;
}

export interface SourceHealthResponse {
  ok: boolean;
  checkedAt: string;
  summary: {
    total: number;
    enabled: number;
    disabled: number;
    online: number;
    warning: number;
    offline: number;
    failedSourceCount: number;
    cachedSourceCount: number;
    staleSourceCount: number;
    processedItemCount: number;
    acceptedItemCount: number;
    candidateRejectedItemCount: number;
    rejectedItemCount: number;
    excludedItemCount: number;
    ingestionByLane: Record<SourceLane, SourceIngestionRollup>;
    ingestionByCategory: Record<string, SourceIngestionRollup>;
  };
  topRejectionReasons: SourceIngestionReasonCount[];
  topExcludedReasons: SourceIngestionReasonCount[];
  sourceLaneCounts: Record<SourceLane, number>;
  pullStatusCounts: Partial<Record<SourcePullStatus, number>>;
  sources: SourceHealthItem[];
  cache?: ApiCacheMetadata;
  warning?: string;
  error?: string;
}

export interface SourceTestResponse {
  ok: boolean;
  source?: SourceHealthItem;
  error?: string;
}
