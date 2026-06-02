import { NextResponse } from "next/server";

import { readAllLocalConfigs } from "@/lib/local-config/configService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const configs = await readAllLocalConfigs();

    return NextResponse.json({
      ok: true,
      exportedAt: new Date().toISOString(),
      version: 1,
      type: "osiris-local-config-export",
      configs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to export local config",
      },
      { status: 500 },
    );
  }
}