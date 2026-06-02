import { NextResponse } from "next/server";

import { readLocalConfig } from "@/lib/local-config/configService";

export const dynamic = "force-dynamic";

type SourceHealthStatus = "online" | "warning" | "offline";

interface SourceHealthItem {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
  status: SourceHealthStatus;
  httpStatus: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
  error: string | null;
}

function getStatusFromResult(params: {
  enabled: boolean;
  httpStatus: number | null;
  responseTimeMs: number | null;
  error: string | null;
}): SourceHealthStatus {
  if (!params.enabled) return "warning";
  if (params.error) return "offline";
  if (!params.httpStatus) return "offline";
  if (params.httpStatus >= 500) return "offline";
  if (params.httpStatus >= 400) return "warning";
  if (params.responseTimeMs !== null && params.responseTimeMs > 7000) return "warning";

  return "online";
}

async function checkFeed(feed: {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
}): Promise<SourceHealthItem> {
  const checkedAt = new Date().toISOString();

  if (!feed.enabled) {
    return {
      id: feed.id,
      name: feed.name,
      url: feed.url,
      category: feed.category,
      enabled: feed.enabled,
      status: "warning",
      httpStatus: null,
      responseTimeMs: null,
      checkedAt,
      error: "Feed disabled",
    };
  }

  const startedAt = Date.now();

  try {
    const response = await fetch(feed.url, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "OSIRIS-Source-Health/1.0",
      },
    });

    const responseTimeMs = Date.now() - startedAt;

    return {
      id: feed.id,
      name: feed.name,
      url: feed.url,
      category: feed.category,
      enabled: feed.enabled,
      status: getStatusFromResult({
        enabled: feed.enabled,
        httpStatus: response.status,
        responseTimeMs,
        error: null,
      }),
      httpStatus: response.status,
      responseTimeMs,
      checkedAt,
      error: null,
    };
  } catch (error) {
    return {
      id: feed.id,
      name: feed.name,
      url: feed.url,
      category: feed.category,
      enabled: feed.enabled,
      status: "offline",
      httpStatus: null,
      responseTimeMs: Date.now() - startedAt,
      checkedAt,
      error: error instanceof Error ? error.message : "Source check failed",
    };
  }
}

export async function GET() {
  try {
    const feeds = await readLocalConfig("rss-feeds");

    const checkedSources = await Promise.all(
      feeds.map((feed) =>
        checkFeed({
          id: feed.id,
          name: feed.name,
          url: feed.url,
          category: feed.category,
          enabled: feed.enabled,
        }),
      ),
    );

    const online = checkedSources.filter((source) => source.status === "online").length;
    const warning = checkedSources.filter((source) => source.status === "warning").length;
    const offline = checkedSources.filter((source) => source.status === "offline").length;

    return NextResponse.json({
      ok: offline === 0,
      checkedAt: new Date().toISOString(),
      summary: {
        total: checkedSources.length,
        online,
        warning,
        offline,
        failedSourceCount: offline,
      },
      sources: checkedSources,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        checkedAt: new Date().toISOString(),
        summary: {
          total: 0,
          online: 0,
          warning: 0,
          offline: 0,
          failedSourceCount: 0,
        },
        sources: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to check source health",
      },
      { status: 500 },
    );
  }
}