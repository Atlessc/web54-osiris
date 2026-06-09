import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { ensureLocalConfig } from "@/lib/local-config/configBootstrap";
import { CACHE_DIR } from "@/lib/local-config/configPaths";
import { resolveSourcePromotionPolicy } from "@/lib/event-pipeline/sourcePolicy";
import type { RssFeedConfig } from "@/types/local-config";
import type {
  SourceHealthItem,
  SourceHealthResponse,
  SourceHealthStatus,
  SourceIngestionDiagnostics,
  SourcePullStatus,
} from "@/types/source-health";

const RSS_CACHE_DIR = path.join(CACHE_DIR, "rss-sources");
const DIAGNOSTICS_PATH = path.join(CACHE_DIR, "rss-ingestion-diagnostics.json");
const USER_AGENT =
  "OSIRIS-RSS-OSINT-Mapper/1.0 (+https://osirisai.live)";
const ACCEPT_HEADER =
  "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8";
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

export async function readSourceIngestionDiagnostics() {
  await ensureRssCacheDir();

  try {
    const raw = await fs.readFile(DIAGNOSTICS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as DiagnosticsCache;

    if (parsed.version !== 1 || !Array.isArray(parsed.sources)) {
      return [];
    }

    return parsed.sources;
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

  const online = sources.filter((source) => source.status === "online").length;
  const warning = sources.filter((source) => source.status === "warning").length;
  const offline = sources.filter((source) => source.status === "offline").length;

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
      acceptedItemCount: sources.reduce(
        (total, source) => total + (source.ingestion?.acceptedItems ?? 0),
        0,
      ),
      rejectedItemCount: sources.reduce(
        (total, source) => total + (source.ingestion?.rejectedItems ?? 0),
        0,
      ),
    },
    sources,
  };
}
