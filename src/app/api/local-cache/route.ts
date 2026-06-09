import { NextRequest, NextResponse } from "next/server";

import {
  clearDerivedCaches,
  getLocalCacheStatus,
} from "@/lib/local-cache/cacheService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getLocalCacheStatus());
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to read local cache status",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body?.action !== "clear-derived") {
      return NextResponse.json(
        {
          ok: false,
          error: 'Unsupported cache action. Expected "clear-derived".',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(await clearDerivedCaches());
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to clear derived caches",
      },
      { status: 500 },
    );
  }
}
