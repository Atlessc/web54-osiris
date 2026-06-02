import { NextRequest, NextResponse } from "next/server";

import { writeLocalConfig } from "@/lib/local-config/configService";
import type { LocalConfigMap, LocalConfigName } from "@/types/local-config";

export const dynamic = "force-dynamic";

const IMPORTABLE_CONFIG_NAMES: LocalConfigName[] = [
  "profile",
  "settings",
  "rss-feeds",
  "keyword-packs",
  "location-registry",
  "topic-registry",
  "entity-registry",
];

interface ImportPayload {
  type?: string;
  version?: number;
  configs?: Partial<LocalConfigMap>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ImportPayload;

    if (body.type !== "osiris-local-config-export") {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid OSIRIS config export file.",
        },
        { status: 400 },
      );
    }

    if (!body.configs || typeof body.configs !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "Import file does not contain configs.",
        },
        { status: 400 },
      );
    }

    const imported: LocalConfigName[] = [];

    for (const configName of IMPORTABLE_CONFIG_NAMES) {
      const nextConfig = body.configs[configName];

      if (nextConfig === undefined) {
        continue;
      }

      await writeLocalConfig(configName, nextConfig);
      imported.push(configName);
    }

    return NextResponse.json({
      ok: true,
      imported,
      importedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to import local config",
      },
      { status: 400 },
    );
  }
}