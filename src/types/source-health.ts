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

export interface SourceIngestionDiagnostics {
  feedId: string;
  processedAt: string;
  totalItems: number;
  acceptedItems: number;
  rejectedItems: number;
  rejectionReasons: Record<string, number>;
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
    acceptedItemCount: number;
    rejectedItemCount: number;
  };
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
