import { NextRequest, NextResponse } from "next/server";

import { rssFeedSchema } from "@/lib/local-config/configSchemas";
import { readLocalConfig } from "@/lib/local-config/configService";
import {
  getSourceHealthReport,
  pullRssSource,
  sourcePullResultToHealth,
} from "@/lib/rss-ingestion/sourcePullService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const feeds = await readLocalConfig("rss-feeds");
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";
    const report = await getSourceHealthReport(feeds, { refresh });

    return NextResponse.json(report);
  } catch (error) {
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
          acceptedItemCount: 0,
          rejectedItemCount: 0,
        },
        sources: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to load source health",
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
