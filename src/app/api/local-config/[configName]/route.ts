import { NextRequest, NextResponse } from "next/server";

import { isConfigName } from "@/lib/local-config/configPaths";
import { readLocalConfig } from "@/lib/local-config/configService";

interface RouteContext {
  params: Promise<{
    configName: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { configName } = await params;

  if (!isConfigName(configName)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid config name",
      },
      { status: 400 },
    );
  }

  try {
    const config = await readLocalConfig(configName);

    return NextResponse.json({
      ok: true,
      config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to read local config",
      },
      { status: 500 },
    );
  }
}