import fs from "node:fs/promises";
import path from "node:path";

import { ensureLocalConfig } from "./configBootstrap";
import { BACKUP_DIR, CONFIG_FILES, getConfigPath } from "./configPaths";
import { validateConfig } from "./configValidation";

import type {
  ConfigStatusItem,
  ConfigStatusResponse,
  LocalConfigMap,
  LocalConfigName,
} from "@/types/local-config";

export async function readLocalConfig<TConfigName extends LocalConfigName>(
  configName: TConfigName,
): Promise<LocalConfigMap[TConfigName]> {
  await ensureLocalConfig();

  const filePath = getConfigPath(configName);
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  const validation = validateConfig(configName, parsed);

  if (!validation.valid) {
    throw new Error(validation.error ?? `${configName} config failed validation`);
  }

  return parsed as LocalConfigMap[TConfigName];
}

export async function readAllLocalConfigs(): Promise<LocalConfigMap> {
  const [
    profile,
    settings,
    rssFeeds,
    keywordPacks,
    locationRegistry,
    topicRegistry,
    entityRegistry,
  ] = await Promise.all([
    readLocalConfig("profile"),
    readLocalConfig("settings"),
    readLocalConfig("rss-feeds"),
    readLocalConfig("keyword-packs"),
    readLocalConfig("location-registry"),
    readLocalConfig("topic-registry"),
    readLocalConfig("entity-registry"),
  ]);

  return {
    profile,
    settings,
    "rss-feeds": rssFeeds,
    "keyword-packs": keywordPacks,
    "location-registry": locationRegistry,
    "topic-registry": topicRegistry,
    "entity-registry": entityRegistry,
  };
}

export async function getLocalConfigStatus(): Promise<ConfigStatusResponse> {
  await ensureLocalConfig();

  const configNames = Object.keys(CONFIG_FILES) as LocalConfigName[];
  const configs: ConfigStatusItem[] = [];

  for (const configName of configNames) {
    const filename = CONFIG_FILES[configName];
    const filePath = getConfigPath(configName);

    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      const validation = validateConfig(configName, parsed);

      configs.push({
        name: configName,
        filename,
        exists: true,
        valid: validation.valid,
        status: validation.valid ? "valid" : "invalid",
        error: validation.error,
      });
    } catch (error) {
      const isMissing =
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT";

      configs.push({
        name: configName,
        filename,
        exists: false,
        valid: false,
        status: isMissing ? "missing" : "invalid",
        error: error instanceof Error ? error.message : "Config could not be read",
      });
    }
  }

  return {
    ok: configs.every((config) => config.valid),
    configs,
  };
}

export async function writeLocalConfig<TConfigName extends LocalConfigName>(
  configName: TConfigName,
  nextConfig: unknown,
): Promise<LocalConfigMap[TConfigName]> {
  await ensureLocalConfig();

  const validation = validateConfig(configName, nextConfig);

  if (!validation.valid) {
    throw new Error(validation.error ?? `${configName} config failed validation`);
  }

  const filePath = getConfigPath(configName);
  const filename = CONFIG_FILES[configName];

  try {
    const existingContent = await fs.readFile(filePath, "utf-8");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `${filename}.${timestamp}.bak`;
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    await fs.writeFile(backupPath, existingContent, "utf-8");
  } catch (error) {
    const isMissing =
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT";

    if (!isMissing) {
      throw error;
    }
  }

  const formattedJson = `${JSON.stringify(nextConfig, null, 2)}\n`;

  await fs.writeFile(filePath, formattedJson, "utf-8");

  return nextConfig as LocalConfigMap[TConfigName];
}