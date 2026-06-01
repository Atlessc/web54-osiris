import fs from "node:fs/promises";

import { ensureLocalConfig } from "./configBootstrap";
import { getConfigPath } from "./configPaths";

import type { LocalConfigMap, LocalConfigName } from "@/types/local-config";

export async function readLocalConfig<TConfigName extends LocalConfigName>(
  configName: TConfigName,
): Promise<LocalConfigMap[TConfigName]> {
  await ensureLocalConfig();

  const filePath = getConfigPath(configName);
  const raw = await fs.readFile(filePath, "utf-8");

  return JSON.parse(raw) as LocalConfigMap[TConfigName];
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