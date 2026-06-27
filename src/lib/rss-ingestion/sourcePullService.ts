import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { ensureLocalConfig } from "@/lib/local-config/configBootstrap";
import { CACHE_DIR } from "@/lib/local-config/configPaths";
import {
  resolveSourcePromotionPolicy,
  SOURCE_LANES,
} from "@/lib/event-pipeline/sourcePolicy";
import type { RssFeedConfig, SourceLane } from "@/types/local-config";
import type {
  SourceHealthItem,
  SourceHealthResponse,
  SourceHealthStatus,
  SourceIngestionDiagnostics,
  SourceIngestionReasonCount,
  SourceIngestionRollup,
  SourceIngestionSummary,
  SourcePullStatus,
} from "@/types/source-health";

const RSS_CACHE_DIR = path.join(CACHE_DIR, "rss-sources");
const DIAGNOSTICS_PATH = path.join(CACHE_DIR, "rss-ingestion-diagnostics.json");
const USER_AGENT =
  "OSIRIS-RSS-OSINT-Mapper/1.0 (+https://osirisai.live)";
const ACCEPT_HEADER =
  "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8";
const TOP_REASON_LIMIT = 12;
let rssCacheReadyPromise: Promise<void> | null = null;

interface SourcePullCacheEntry {
  version: 1;
  feedId: string;
  url: string;
  xml: string;
  itemCount: number;
  fetchedAt: string;
  lastCheckedAt: string;
  nextRefreshAt: string;
  httpStatus: number | null;
  responseTimeMs: number | null;
  contentType: string | null;
  lastError: string | null;
}

interface DiagnosticsCache {
  version: 1;
  updatedAt: string;
  sources: SourceIngestionDiagnostics[];
}

interface SourceIngestionSummarySource {
  category: string;
  sourceLane: SourceLane;
  ingestion: SourceIngestionDiagnostics | null;
}

export interface SourcePullResult {
  feed: RssFeedConfig;
  xml: string | null;
  itemCount: number;
  pullStatus: SourcePullStatus;
  httpStatus: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
  lastSuccessAt: string | null;
  nextRefreshAt: string | null;
  fromCache: boolean;
  isStale: boolean;
  error: string | null;
}

interface PullSourceOptions {
  force?: boolean;
  timeoutMs?: number;
}

function getCacheFilename(feedId: string) {
  const safeId = feedId.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
  return `${safeId || "unnamed-source"}.json`;
}

function getCachePath(feedId: string) {
  return path.join(RSS_CACHE_DIR, getCacheFilename(feedId));
}

function getItemCount(xml: string) {
  const rssItems = xml.match(/<item\b[^>]*>/gi) || [];
  const atomEntries = xml.match(/<entry\b[^>]*>/gi) || [];

  return rssItems.length + atomEntries.length;
}

function getReasonTotal(reasons: Record<string, number>) {
  return Object.values(reasons).reduce((total, count) => total + count, 0);
}

function getTopReasonCounts(
  reasons: Record<string, number>,
): SourceIngestionReasonCount[] {
  return Object.entries(reasons)
    .map(([reason, count]) => ({ reason, count }))
    .sort((reasonA, reasonB) => reasonB.count - reasonA.count)
    .slice(0, TOP_REASON_LIMIT);
}

function isLaneExclusionReason(reason: string) {
  return reason.startsWith("source_lane_");
}

function splitLegacyReasons(reasons: Record<string, number>) {
  const rejectionReasons: Record<string, number> = {};
  const excludedReasons: Record<string, number> = {};

  for (const [reason, count] of Object.entries(reasons)) {
    if (reason === "source_pull_failed") continue;

    if (isLaneExclusionReason(reason)) {
      excludedReasons[reason] = count;
    } else {
      rejectionReasons[reason] = count;
    }
  }

  return { rejectionReasons, excludedReasons };
}

export function normalizeSourceIngestionDiagnostics(
  diagnostics: SourceIngestionDiagnostics,
): SourceIngestionDiagnostics {
  const hasModernBuckets =
    typeof diagnostics.candidateRejectedItems === "number" ||
    typeof diagnostics.excludedItems === "number" ||
    Boolean(diagnostics.excludedReasons);
  const processedItems =
    diagnostics.processedItems ?? diagnostics.totalItems ?? 0;
  const acceptedItems = diagnostics.acceptedItems ?? 0;

  if (hasModernBuckets) {
    const rejectionReasons = diagnostics.rejectionReasons ?? {};
    const excludedReasons = diagnostics.excludedReasons ?? {};
    const rejectedSamples = Array.isArray(diagnostics.rejectedSamples)
      ? diagnostics.rejectedSamples
      : [];
    const candidateRejectedItems =
      diagnostics.candidateRejectedItems ??
      diagnostics.rejectedItems ??
      getReasonTotal(rejectionReasons);
    const excludedItems =
      diagnostics.excludedItems ?? getReasonTotal(excludedReasons);

    return {
      ...diagnostics,
      processedItems,
      totalItems: diagnostics.totalItems ?? processedItems,
      acceptedItems,
      candidateRejectedItems,
      rejectedItems: candidateRejectedItems,
      excludedItems,
      rejectionReasons,
      excludedReasons,
      rejectedSamples,
    };
  }

  const { rejectionReasons, excludedReasons } = splitLegacyReasons(
    diagnostics.rejectionReasons ?? {},
  );
  const candidateRejectedItems = getReasonTotal(rejectionReasons);
  const excludedItems = getReasonTotal(excludedReasons);

  return {
    ...diagnostics,
    processedItems,
    totalItems: diagnostics.totalItems ?? processedItems,
    acceptedItems,
    candidateRejectedItems,
    rejectedItems: candidateRejectedItems,
    excludedItems,
    rejectionReasons,
    excludedReasons,
    rejectedSamples: [],
  };
}

function createEmptyIngestionRollup(): SourceIngestionRollup {
  return {
    sourceCount: 0,
    processedItemCount: 0,
    acceptedItemCount: 0,
    candidateRejectedItemCount: 0,
    excludedItemCount: 0,
    rejectionReasons: {},
    excludedReasons: {},
    topRejectionReasons: [],
    topExcludedReasons: [],
  };
}

function addReasonCounts(
  target: Record<string, number>,
  source: Record<string, number>,
) {
  for (const [reason, count] of Object.entries(source)) {
    target[reason] = (target[reason] ?? 0) + count;
  }
}

function addIngestionToRollup(
  rollup: SourceIngestionRollup,
  ingestion: SourceIngestionDiagnostics | null,
) {
  rollup.sourceCount += 1;

  if (!ingestion) return;

  rollup.processedItemCount += ingestion.processedItems;
  rollup.acceptedItemCount += ingestion.acceptedItems;
  rollup.candidateRejectedItemCount += ingestion.candidateRejectedItems;
  rollup.excludedItemCount += ingestion.excludedItems;
  addReasonCounts(rollup.rejectionReasons, ingestion.rejectionReasons);
  addReasonCounts(rollup.excludedReasons, ingestion.excludedReasons);
}

function finalizeIngestionRollup(
  rollup: SourceIngestionRollup,
): SourceIngestionRollup {
  return {
    ...rollup,
    topRejectionReasons: getTopReasonCounts(rollup.rejectionReasons),
    topExcludedReasons: getTopReasonCounts(rollup.excludedReasons),
  };
}

export function buildSourceIngestionSummary(
  sources: SourceIngestionSummarySource[],
): SourceIngestionSummary {
  const total = createEmptyIngestionRollup();
  const ingestionByLane = SOURCE_LANES.reduce(
    (rollups, lane) => {
      rollups[lane] = createEmptyIngestionRollup();
      return rollups;
    },
    {} as Record<SourceLane, SourceIngestionRollup>,
  );
  const ingestionByCategory: Record<string, SourceIngestionRollup> = {};

  for (const source of sources) {
    const ingestion = source.ingestion
      ? normalizeSourceIngestionDiagnostics(source.ingestion)
      : null;
    const category = source.category || "uncategorized";

    addIngestionToRollup(total, ingestion);
    addIngestionToRollup(ingestionByLane[source.sourceLane], ingestion);

    if (!ingestionByCategory[category]) {
      ingestionByCategory[category] = createEmptyIngestionRollup();
    }

    addIngestionToRollup(ingestionByCategory[category], ingestion);
  }

  for (const lane of SOURCE_LANES) {
    ingestionByLane[lane] = finalizeIngestionRollup(ingestionByLane[lane]);
  }

  for (const [category, rollup] of Object.entries(ingestionByCategory)) {
    ingestionByCategory[category] = finalizeIngestionRollup(rollup);
  }

  const finalizedTotal = finalizeIngestionRollup(total);

  return {
    processedItemCount: finalizedTotal.processedItemCount,
    acceptedItemCount: finalizedTotal.acceptedItemCount,
    candidateRejectedItemCount: finalizedTotal.candidateRejectedItemCount,
    excludedItemCount: finalizedTotal.excludedItemCount,
    topRejectionReasons: finalizedTotal.topRejectionReasons,
    topExcludedReasons: finalizedTotal.topExcludedReasons,
    ingestionByLane,
    ingestionByCategory,
  };
}

function getNextRefreshAt(fetchedAt: string, refreshIntervalMinutes: number) {
  return new Date(
    new Date(fetchedAt).getTime() + refreshIntervalMinutes * 60_000,
  ).toISOString();
}

function isFresh(entry: SourcePullCacheEntry, feed: RssFeedConfig) {
  if (entry.url !== feed.url || !entry.xml) return false;

  return (
    Date.now() <
    new Date(
      getNextRefreshAt(entry.fetchedAt, feed.refreshIntervalMinutes),
    ).getTime()
  );
}

async function ensureRssCacheDir() {
  if (!rssCacheReadyPromise) {
    rssCacheReadyPromise = (async () => {
      await ensureLocalConfig();
      await fs.mkdir(RSS_CACHE_DIR, { recursive: true });
    })().catch((error) => {
      rssCacheReadyPromise = null;
      throw error;
    });
  }

  await rssCacheReadyPromise;
}

async function writeJsonAtomically(filePath: string, value: unknown) {
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;

  try {
    await fs.writeFile(
      temporaryPath,
      `${JSON.stringify(value, null, 2)}\n`,
      "utf-8",
    );
    await fs.rename(temporaryPath, filePath);
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function readSourceCache(
  feed: RssFeedConfig,
): Promise<SourcePullCacheEntry | null> {
  await ensureRssCacheDir();

  try {
    const raw = await fs.readFile(getCachePath(feed.id), "utf-8");
    const parsed = JSON.parse(raw) as SourcePullCacheEntry;

    if (
      parsed.version !== 1 ||
      parsed.feedId !== feed.id ||
      typeof parsed.xml !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    const isMissing =
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT";

    if (isMissing) return null;

    if (error instanceof SyntaxError) {
      console.warn(
        `[OSIRIS] Ignoring malformed RSS cache for ${feed.id}; it will be refreshed: ${error.message}`,
      );
      return null;
    }

    throw error;
  }
}

async function writeSourceCache(
  feed: RssFeedConfig,
  entry: SourcePullCacheEntry,
) {
  await ensureRssCacheDir();

  await writeJsonAtomically(getCachePath(feed.id), entry);
}

function resultFromCache(
  feed: RssFeedConfig,
  entry: SourcePullCacheEntry,
  pullStatus: "fresh-cache" | "stale-cache",
  error: string | null = entry.lastError,
): SourcePullResult {
  return {
    feed,
    xml: entry.xml,
    itemCount: entry.itemCount,
    pullStatus,
    httpStatus: entry.httpStatus,
    responseTimeMs: entry.responseTimeMs,
    checkedAt: entry.lastCheckedAt,
    lastSuccessAt: entry.fetchedAt,
    nextRefreshAt: getNextRefreshAt(
      entry.fetchedAt,
      feed.refreshIntervalMinutes,
    ),
    fromCache: true,
    isStale: pullStatus === "stale-cache",
    error,
  };
}

export async function pullRssSource(
  feed: RssFeedConfig,
  options: PullSourceOptions = {},
): Promise<SourcePullResult> {
  const checkedAt = new Date().toISOString();

  if (!feed.enabled && !options.force) {
    return {
      feed,
      xml: null,
      itemCount: 0,
      pullStatus: "disabled",
      httpStatus: null,
      responseTimeMs: null,
      checkedAt,
      lastSuccessAt: null,
      nextRefreshAt: null,
      fromCache: false,
      isStale: false,
      error: "Feed disabled",
    };
  }

  const cached = await readSourceCache(feed);

  if (!options.force && cached && isFresh(cached, feed)) {
    return resultFromCache(feed, cached, "fresh-cache");
  }

  const startedAt = Date.now();
  let attemptedHttpStatus: number | null = null;
  let attemptedResponseTimeMs: number | null = null;

  try {
    const response = await fetch(feed.url, {
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
      cache: "no-store",
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: ACCEPT_HEADER,
      },
    });

    const responseTimeMs = Date.now() - startedAt;
    attemptedHttpStatus = response.status;
    attemptedResponseTimeMs = responseTimeMs;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
    }

    const xml = await response.text();
    const itemCount = getItemCount(xml);

    if (!itemCount) {
      throw new Error("Response did not contain RSS items or Atom entries");
    }

    const fetchedAt = new Date().toISOString();
    const entry: SourcePullCacheEntry = {
      version: 1,
      feedId: feed.id,
      url: feed.url,
      xml,
      itemCount,
      fetchedAt,
      lastCheckedAt: fetchedAt,
      nextRefreshAt: getNextRefreshAt(fetchedAt, feed.refreshIntervalMinutes),
      httpStatus: response.status,
      responseTimeMs,
      contentType: response.headers.get("content-type"),
      lastError: null,
    };

    await writeSourceCache(feed, entry);

    return {
      feed,
      xml,
      itemCount,
      pullStatus: "network",
      httpStatus: response.status,
      responseTimeMs,
      checkedAt: fetchedAt,
      lastSuccessAt: fetchedAt,
      nextRefreshAt: entry.nextRefreshAt,
      fromCache: false,
      isStale: false,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Source pull failed";

    if (cached && cached.url === feed.url) {
      const staleEntry: SourcePullCacheEntry = {
        ...cached,
        lastCheckedAt: checkedAt,
        nextRefreshAt: getNextRefreshAt(
          cached.fetchedAt,
          feed.refreshIntervalMinutes,
        ),
        httpStatus: attemptedHttpStatus,
        responseTimeMs: attemptedResponseTimeMs ?? Date.now() - startedAt,
        lastError: message,
      };

      await writeSourceCache(feed, staleEntry);

      return resultFromCache(feed, staleEntry, "stale-cache", message);
    }

    const failedEntry: SourcePullCacheEntry = {
      version: 1,
      feedId: feed.id,
      url: feed.url,
      xml: "",
      itemCount: 0,
      fetchedAt: checkedAt,
      lastCheckedAt: checkedAt,
      nextRefreshAt: checkedAt,
      httpStatus: attemptedHttpStatus,
      responseTimeMs: attemptedResponseTimeMs ?? Date.now() - startedAt,
      contentType: null,
      lastError: message,
    };

    await writeSourceCache(feed, failedEntry);

    return {
      feed,
      xml: null,
      itemCount: 0,
      pullStatus: "error",
      httpStatus: attemptedHttpStatus,
      responseTimeMs: attemptedResponseTimeMs ?? Date.now() - startedAt,
      checkedAt,
      lastSuccessAt: null,
      nextRefreshAt: null,
      fromCache: false,
      isStale: false,
      error: message,
    };
  }
}

export async function pullRssSources(
  feeds: RssFeedConfig[],
  options: PullSourceOptions & { concurrency?: number } = {},
) {
  const results = new Array<SourcePullResult>(feeds.length);
  const concurrency = Math.max(1, Math.min(options.concurrency ?? 6, feeds.length));
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < feeds.length) {
      const index = nextIndex++;
      results[index] = await pullRssSource(feeds[index], options);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  return results;
}

export async function writeSourceIngestionDiagnostics(
  sources: SourceIngestionDiagnostics[],
) {
  await ensureRssCacheDir();

  const payload: DiagnosticsCache = {
    version: 1,
    updatedAt: new Date().toISOString(),
    sources,
  };

  await writeJsonAtomically(DIAGNOSTICS_PATH, payload);
}

export async function readSourceIngestionDiagnostics(): Promise<
  SourceIngestionDiagnostics[]
> {
  await ensureRssCacheDir();

  try {
    const raw = await fs.readFile(DIAGNOSTICS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as DiagnosticsCache;

    if (parsed.version !== 1 || !Array.isArray(parsed.sources)) {
      return [];
    }

    return parsed.sources.map(normalizeSourceIngestionDiagnostics);
  } catch (error) {
    const isMissing =
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT";

    if (isMissing) return [];

    if (error instanceof SyntaxError) {
      console.warn(
        `[OSIRIS] Ignoring malformed RSS ingestion diagnostics; they will be refreshed: ${error.message}`,
      );
      return [];
    }

    throw error;
  }
}

function getHealthStatus(result: SourcePullResult): SourceHealthStatus {
  if (result.pullStatus === "disabled") return "warning";
  if (result.pullStatus === "error") return "offline";
  if (result.pullStatus === "not-checked") return "warning";
  if (result.pullStatus === "stale-cache" || result.error) return "warning";
  return "online";
}

export function sourcePullResultToHealth(
  result: SourcePullResult,
  ingestion: SourceIngestionDiagnostics | null = null,
): SourceHealthItem {
  const promotionPolicy = resolveSourcePromotionPolicy(result.feed);

  return {
    id: result.feed.id,
    name: result.feed.name,
    url: result.feed.url,
    category: result.feed.category,
    tags: result.feed.tags,
    enabled: result.feed.enabled,
    reliabilityWeight: result.feed.reliabilityWeight,
    refreshIntervalMinutes: result.feed.refreshIntervalMinutes,
    sourceLane: promotionPolicy.lane,
    mapEligible: promotionPolicy.mapEligible,
    signalEligible: promotionPolicy.signalEligible,
    maxAgeHours: promotionPolicy.maxAgeHours,
    status: getHealthStatus(result),
    pullStatus: result.pullStatus,
    httpStatus: result.httpStatus,
    responseTimeMs: result.responseTimeMs,
    checkedAt: result.checkedAt,
    lastSuccessAt: result.lastSuccessAt,
    nextRefreshAt: result.nextRefreshAt,
    itemCount: result.itemCount,
    fromCache: result.fromCache,
    isStale: result.isStale,
    error: result.error,
    ingestion,
  };
}

async function getSourceSnapshot(feed: RssFeedConfig): Promise<SourcePullResult> {
  const checkedAt = new Date().toISOString();

  if (!feed.enabled) {
    return {
      feed,
      xml: null,
      itemCount: 0,
      pullStatus: "disabled",
      httpStatus: null,
      responseTimeMs: null,
      checkedAt,
      lastSuccessAt: null,
      nextRefreshAt: null,
      fromCache: false,
      isStale: false,
      error: "Feed disabled",
    };
  }

  const cached = await readSourceCache(feed);

  if (!cached || cached.url !== feed.url) {
    return {
      feed,
      xml: null,
      itemCount: 0,
      pullStatus: "not-checked",
      httpStatus: null,
      responseTimeMs: null,
      checkedAt,
      lastSuccessAt: null,
      nextRefreshAt: null,
      fromCache: false,
      isStale: false,
      error: "Source has not been pulled yet",
    };
  }

  if (!cached.xml && cached.lastError) {
    return {
      feed,
      xml: null,
      itemCount: 0,
      pullStatus: "error",
      httpStatus: cached.httpStatus,
      responseTimeMs: cached.responseTimeMs,
      checkedAt: cached.lastCheckedAt,
      lastSuccessAt: null,
      nextRefreshAt: null,
      fromCache: false,
      isStale: false,
      error: cached.lastError,
    };
  }

  return resultFromCache(
    feed,
    cached,
    isFresh(cached, feed) ? "fresh-cache" : "stale-cache",
  );
}

export async function getSourceHealthReport(
  feeds: RssFeedConfig[],
  options: { refresh?: boolean } = {},
): Promise<SourceHealthResponse> {
  const diagnosticsPromise = readSourceIngestionDiagnostics();
  let results: SourcePullResult[];

  if (options.refresh) {
    const enabledFeeds = feeds.filter((feed) => feed.enabled);
    const refreshed = await pullRssSources(enabledFeeds, {
      force: true,
      concurrency: 6,
    });
    const refreshedById = new Map(
      refreshed.map((result) => [result.feed.id, result]),
    );

    results = await Promise.all(
      feeds.map(
        async (feed) =>
          refreshedById.get(feed.id) ?? (await getSourceSnapshot(feed)),
      ),
    );
  } else {
    results = await Promise.all(feeds.map((feed) => getSourceSnapshot(feed)));
  }

  const diagnostics = await diagnosticsPromise;

  const diagnosticsByFeedId = new Map(
    diagnostics.map((item) => [item.feedId, item]),
  );
  const sources = results.map((result) =>
    sourcePullResultToHealth(
      result,
      diagnosticsByFeedId.get(result.feed.id) ?? null,
    ),
  );
  const ingestionSummary = buildSourceIngestionSummary(
    sources.map((source) => ({
      category: source.category,
      sourceLane: source.sourceLane,
      ingestion: source.ingestion,
    })),
  );

  const online = sources.filter((source) => source.status === "online").length;
  const warning = sources.filter((source) => source.status === "warning").length;
  const offline = sources.filter((source) => source.status === "offline").length;
  const sourceLaneCounts = SOURCE_LANES.reduce(
    (counts, lane) => {
      counts[lane] = sources.filter(
        (source) => source.sourceLane === lane,
      ).length;
      return counts;
    },
    {} as Record<SourceLane, number>,
  );
  const pullStatusCounts = sources.reduce<Partial<Record<SourcePullStatus, number>>>(
    (counts, source) => {
      counts[source.pullStatus] = (counts[source.pullStatus] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return {
    ok: offline === 0,
    checkedAt: new Date().toISOString(),
    summary: {
      total: sources.length,
      enabled: sources.filter((source) => source.enabled).length,
      disabled: sources.filter((source) => !source.enabled).length,
      online,
      warning,
      offline,
      failedSourceCount: offline,
      cachedSourceCount: sources.filter((source) => source.fromCache).length,
      staleSourceCount: sources.filter((source) => source.isStale).length,
      processedItemCount: ingestionSummary.processedItemCount,
      acceptedItemCount: ingestionSummary.acceptedItemCount,
      candidateRejectedItemCount:
        ingestionSummary.candidateRejectedItemCount,
      rejectedItemCount: ingestionSummary.candidateRejectedItemCount,
      excludedItemCount: ingestionSummary.excludedItemCount,
      ingestionByLane: ingestionSummary.ingestionByLane,
      ingestionByCategory: ingestionSummary.ingestionByCategory,
    },
    topRejectionReasons: ingestionSummary.topRejectionReasons,
    topExcludedReasons: ingestionSummary.topExcludedReasons,
    sourceLaneCounts,
    pullStatusCounts,
    sources,
  };
}
