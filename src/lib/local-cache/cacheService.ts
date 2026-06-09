import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { ensureLocalConfig } from "@/lib/local-config/configBootstrap";
import { CACHE_DIR } from "@/lib/local-config/configPaths";
import type {
  LocalCacheClearResponse,
  LocalCacheEnvelope,
  LocalCacheItemStatus,
  LocalCacheKey,
  LocalCacheRead,
  LocalCacheStatusResponse,
} from "@/types/local-cache";

export const DERIVED_CACHE_KEYS: LocalCacheKey[] = [
  "normalized-events",
  "generated-signals",
  "source-health",
];

const CACHE_FILES: Record<LocalCacheKey, string> = {
  "normalized-events": "normalized-events.json",
  "generated-signals": "generated-signals.json",
  "source-health": "source-health.json",
};

const RSS_SOURCE_CACHE_DIR = path.join(CACHE_DIR, "rss-sources");

function getCachePath(key: LocalCacheKey) {
  return path.join(CACHE_DIR, CACHE_FILES[key]);
}

function getRecordCount(data: unknown) {
  if (Array.isArray(data)) return data.length;

  if (data && typeof data === "object" && "sources" in data) {
    const sources = (data as { sources?: unknown }).sources;
    if (Array.isArray(sources)) return sources.length;
  }

  return data === null || data === undefined ? 0 : 1;
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

export async function writeLocalCache<T>(
  key: LocalCacheKey,
  data: T,
  options: {
    ttlMinutes: number;
    source: string;
    note?: string;
  },
): Promise<LocalCacheEnvelope<T>> {
  await ensureLocalConfig();

  const updatedAt = new Date().toISOString();
  const entry: LocalCacheEnvelope<T> = {
    version: 1,
    key,
    state: "ready",
    updatedAt,
    expiresAt: new Date(
      new Date(updatedAt).getTime() + options.ttlMinutes * 60_000,
    ).toISOString(),
    data,
    metadata: {
      recordCount: getRecordCount(data),
      source: options.source,
      note: options.note,
    },
  };

  await writeJsonAtomically(getCachePath(key), entry);
  return entry;
}

export async function readLocalCache<T>(
  key: LocalCacheKey,
): Promise<LocalCacheRead<T> | null> {
  await ensureLocalConfig();

  try {
    const raw = await fs.readFile(getCachePath(key), "utf-8");
    const entry = JSON.parse(raw) as LocalCacheEnvelope<T>;

    if (
      entry.version !== 1 ||
      entry.key !== key ||
      entry.state !== "ready" ||
      entry.data === null
    ) {
      return null;
    }

    const now = Date.now();
    const updatedAt = new Date(entry.updatedAt).getTime();
    const expiresAt = new Date(entry.expiresAt).getTime();

    return {
      entry,
      isStale: !Number.isFinite(expiresAt) || now >= expiresAt,
      ageMinutes: Number.isFinite(updatedAt)
        ? Math.max(0, Math.floor((now - updatedAt) / 60_000))
        : 0,
    };
  } catch (error) {
    const isMissing =
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT";

    if (isMissing || error instanceof SyntaxError) return null;
    throw error;
  }
}

async function clearLocalCacheKey(
  key: LocalCacheKey,
  clearedAt: string,
): Promise<void> {
  const entry: LocalCacheEnvelope<null> = {
    version: 1,
    key,
    state: "cleared",
    updatedAt: clearedAt,
    expiresAt: clearedAt,
    data: null,
    metadata: {
      recordCount: 0,
      source: "developer-tools",
      note: "Derived cache contents cleared; JSON file preserved.",
    },
  };

  await writeJsonAtomically(getCachePath(key), entry);
}

export async function clearDerivedCaches(): Promise<LocalCacheClearResponse> {
  await ensureLocalConfig();

  const clearedAt = new Date().toISOString();
  await Promise.all(
    DERIVED_CACHE_KEYS.map((key) => clearLocalCacheKey(key, clearedAt)),
  );

  return {
    ok: true,
    clearedAt,
    cleared: DERIVED_CACHE_KEYS,
    jsonFilesPreserved: true,
  };
}

async function getCacheItemStatus(
  key: LocalCacheKey,
): Promise<LocalCacheItemStatus> {
  const filename = CACHE_FILES[key];

  try {
    const raw = await fs.readFile(getCachePath(key), "utf-8");
    const entry = JSON.parse(raw) as LocalCacheEnvelope;

    if (
      entry.version !== 1 ||
      entry.key !== key ||
      !["ready", "cleared"].includes(entry.state)
    ) {
      return {
        key,
        filename,
        exists: true,
        state: "invalid",
        recordCount: 0,
        updatedAt: null,
        expiresAt: null,
        isStale: true,
        ageMinutes: null,
        error: "Cache envelope is invalid.",
      };
    }

    const now = Date.now();
    const updatedAt = new Date(entry.updatedAt).getTime();
    const expiresAt = new Date(entry.expiresAt).getTime();

    return {
      key,
      filename,
      exists: true,
      state: entry.state,
      recordCount: entry.metadata.recordCount,
      updatedAt: entry.updatedAt,
      expiresAt: entry.expiresAt,
      isStale:
        entry.state === "cleared" ||
        !Number.isFinite(expiresAt) ||
        now >= expiresAt,
      ageMinutes: Number.isFinite(updatedAt)
        ? Math.max(0, Math.floor((now - updatedAt) / 60_000))
        : null,
    };
  } catch (error) {
    const isMissing =
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT";

    return {
      key,
      filename,
      exists: !isMissing,
      state: isMissing ? "missing" : "invalid",
      recordCount: 0,
      updatedAt: null,
      expiresAt: null,
      isStale: true,
      ageMinutes: null,
      error: isMissing
        ? undefined
        : error instanceof Error
          ? error.message
          : "Cache could not be read.",
    };
  }
}

export async function getLocalCacheStatus(): Promise<LocalCacheStatusResponse> {
  await ensureLocalConfig();

  const [derivedCaches, rawSourceFiles] = await Promise.all([
    Promise.all(DERIVED_CACHE_KEYS.map((key) => getCacheItemStatus(key))),
    fs
      .readdir(RSS_SOURCE_CACHE_DIR)
      .then((files) => files.filter((file) => file.endsWith(".json")).length)
      .catch(() => 0),
  ]);

  return {
    ok: derivedCaches.every((cache) => cache.state !== "invalid"),
    checkedAt: new Date().toISOString(),
    jsonFilesPreserved: true,
    rawSourceCacheFiles: rawSourceFiles,
    derivedCaches,
  };
}
