import { NextResponse } from "next/server";

import { getLocalConfigStatus } from "@/lib/local-config/configService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getLocalConfigStatus();

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configs: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to read local config status",
      },
      { status: 500 },
    );
  }
}