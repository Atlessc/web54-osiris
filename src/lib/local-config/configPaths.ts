import path from "node:path";

import type { LocalConfigName } from "@/types/local-config";

export const CONFIG_FILES = {
  profile: "profile.json",
  settings: "settings.json",
  "rss-feeds": "rss-feeds.json",
  "keyword-packs": "keyword-packs.json",
  "location-registry": "location-registry.json",
  "topic-registry": "topic-registry.json",
  "entity-registry": "entity-registry.json",
} as const satisfies Record<LocalConfigName, string>;

export const DEFAULT_CONFIG_FILES = {
  profile: "profile.default.json",
  settings: "settings.default.json",
  "rss-feeds": "rss-feeds.default.json",
  "keyword-packs": "keyword-packs.default.json",
  "location-registry": "location-registry.default.json",
  "topic-registry": "topic-registry.default.json",
  "entity-registry": "entity-registry.default.json",
} as const satisfies Record<LocalConfigName, string>;

export const DATA_DIR = path.join(process.cwd(), "osiris-data");
export const CACHE_DIR = path.join(DATA_DIR, "cache");
export const BACKUP_DIR = path.join(DATA_DIR, "backups");
export const EXPORT_DIR = path.join(DATA_DIR, "exports");
export const DEFAULT_CONFIG_DIR = path.join(process.cwd(), "src", "config-defaults");

export function isConfigName(value: string): value is LocalConfigName {
  return value in CONFIG_FILES;
}

export function getConfigPath(configName: LocalConfigName) {
  return path.join(DATA_DIR, CONFIG_FILES[configName]);
}

export function getDefaultConfigPath(configName: LocalConfigName) {
  return path.join(DEFAULT_CONFIG_DIR, DEFAULT_CONFIG_FILES[configName]);
}