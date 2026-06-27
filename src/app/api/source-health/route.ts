import { NextRequest, NextResponse } from "next/server";

import { rssFeedSchema } from "@/lib/local-config/configSchemas";
import { readLocalConfig } from "@/lib/local-config/configService";
import {
  readLocalCache,
  writeLocalCache,
} from "@/lib/local-cache/cacheService";
import { SOURCE_LANES } from "@/lib/event-pipeline/sourcePolicy";
import {
  buildSourceIngestionSummary,
  getSourceHealthReport,
  normalizeSourceIngestionDiagnostics,
  pullRssSource,
  sourcePullResultToHealth,
} from "@/lib/rss-ingestion/sourcePullService";
import type { SourceLane } from "@/types/local-config";
import type { SourceHealthResponse } from "@/types/source-health";

export const dynamic = "force-dynamic";
const SOURCE_HEALTH_CACHE_TTL_MINUTES = 15;

function getEmptySourceLaneCounts(): SourceHealthResponse["sourceLaneCounts"] {
  return SOURCE_LANES.reduce(
    (counts, lane) => {
      counts[lane] = 0;
      return counts;
    },
    {} as Record<SourceLane, number>,
  );
}

function normalizeSourceHealthResponse(
  report: SourceHealthResponse,
): SourceHealthResponse {
  const sources = report.sources.map((source) => ({
    ...source,
    ingestion: source.ingestion
      ? normalizeSourceIngestionDiagnostics(source.ingestion)
      : null,
  }));
  const ingestionSummary = buildSourceIngestionSummary(
    sources.map((source) => ({
      category: source.category,
      sourceLane: source.sourceLane,
      ingestion: source.ingestion,
    })),
  );
  const sourceLaneCounts = sources.reduce<SourceHealthResponse["sourceLaneCounts"]>(
    (counts, source) => {
      counts[source.sourceLane] = (counts[source.sourceLane] ?? 0) + 1;
      return counts;
    },
    getEmptySourceLaneCounts(),
  );
  const pullStatusCounts = sources.reduce<SourceHealthResponse["pullStatusCounts"]>(
    (counts, source) => {
      counts[source.pullStatus] = (counts[source.pullStatus] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return {
    ...report,
    summary: {
      ...report.summary,
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

export async function GET(request: NextRequest) {
  try {
    const feeds = await readLocalConfig("rss-feeds");
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";
    const report = await getSourceHealthReport(feeds, { refresh });
    const cacheEntry = await writeLocalCache("source-health", report, {
      ttlMinutes: SOURCE_HEALTH_CACHE_TTL_MINUTES,
      source: "source-health-route",
    });

    return NextResponse.json({
      ...report,
      cache: {
        mode: "live",
        updatedAt: cacheEntry.updatedAt,
        expiresAt: cacheEntry.expiresAt,
        isStale: false,
        warning: null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load source health";
    const cached = await readLocalCache<SourceHealthResponse>("source-health");

    if (cached?.entry.data) {
      const cachedReport = normalizeSourceHealthResponse(cached.entry.data);

      return NextResponse.json({
        ...cachedReport,
        checkedAt: new Date().toISOString(),
        cache: {
          mode: "stale-cache",
          updatedAt: cached.entry.updatedAt,
          expiresAt: cached.entry.expiresAt,
          isStale: true,
          warning: `Live source health failed. Showing last known data: ${message}`,
        },
        warning: `Live source health failed. Showing last known data: ${message}`,
      });
    }

    const emptyIngestionSummary = buildSourceIngestionSummary([]);
    const emptySourceLaneCounts = getEmptySourceLaneCounts();

    return NextResponse.json(
      {
        ok: false,
        checkedAt: new Date().toISOString(),
        summary: {
          total: 0,
          enabled: 0,
          disabled: 0,
          online: 0,
          warning: 0,
          offline: 0,
          failedSourceCount: 0,
          cachedSourceCount: 0,
          staleSourceCount: 0,
          processedItemCount: 0,
          acceptedItemCount: 0,
          candidateRejectedItemCount: 0,
          rejectedItemCount: 0,
          excludedItemCount: 0,
          ingestionByLane: emptyIngestionSummary.ingestionByLane,
          ingestionByCategory: emptyIngestionSummary.ingestionByCategory,
        },
        topRejectionReasons: [],
        topExcludedReasons: [],
        sourceLaneCounts: emptySourceLaneCounts,
        pullStatusCounts: {},
        sources: [],
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = rssFeedSchema.safeParse(body?.feed ?? body);

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: validation.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; "),
        },
        { status: 400 },
      );
    }

    const result = await pullRssSource(validation.data, {
      force: true,
      timeoutMs: 12_000,
    });

    return NextResponse.json({
      ok: result.pullStatus !== "error",
      source: sourcePullResultToHealth(result),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to test RSS source",
      },
      { status: 500 },
    );
  }
}
