export type LocalCacheKey =
  | "gdelt-response"
  | "normalized-events"
  | "generated-signals"
  | "source-health";

export type LocalCacheState = "ready" | "cleared";

export interface LocalCacheEnvelope<T = unknown> {
  version: 1;
  key: LocalCacheKey;
  state: LocalCacheState;
  updatedAt: string;
  expiresAt: string;
  data: T | null;
  metadata: {
    recordCount: number;
    source: string;
    note?: string;
  };
}

export interface LocalCacheRead<T = unknown> {
  entry: LocalCacheEnvelope<T>;
  isStale: boolean;
  ageMinutes: number;
}

export interface LocalCacheItemStatus {
  key: LocalCacheKey;
  filename: string;
  exists: boolean;
  state: LocalCacheState | "missing" | "invalid";
  recordCount: number;
  updatedAt: string | null;
  expiresAt: string | null;
  isStale: boolean;
  ageMinutes: number | null;
  error?: string;
}

export interface LocalCacheStatusResponse {
  ok: boolean;
  checkedAt: string;
  jsonFilesPreserved: true;
  rawSourceCacheFiles: number;
  derivedCaches: LocalCacheItemStatus[];
}

export interface LocalCacheClearResponse {
  ok: boolean;
  clearedAt: string;
  cleared: LocalCacheKey[];
  jsonFilesPreserved: true;
}

export interface ApiCacheMetadata {
  mode: "live" | "fresh-cache" | "stale-cache" | "fallback";
  updatedAt: string;
  expiresAt: string;
  isStale: boolean;
  warning: string | null;
  servedFrom?: "live-network" | "fresh-local-cache" | "stale-local-cache" | "fallback-cache";
  requestReason?: "default" | "manual-refresh" | "cache-miss" | "stale-cache-revalidation";
  sharedJob?: boolean;
}
