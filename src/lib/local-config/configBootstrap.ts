import fs from "node:fs/promises";

import {
  BACKUP_DIR,
  CACHE_DIR,
  CONFIG_FILES,
  DATA_DIR,
  EXPORT_DIR,
  getConfigPath,
  getDefaultConfigPath,
} from "./configPaths";

import type { LocalConfigName } from "@/types/local-config";

export async function ensureLocalConfig() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  await fs.mkdir(EXPORT_DIR, { recursive: true });

  const configNames = Object.keys(CONFIG_FILES) as LocalConfigName[];

  await Promise.all(
    configNames.map(async (configName) => {
      const livePath = getConfigPath(configName);

      try {
        await fs.access(livePath);
      } catch {
        const defaultPath = getDefaultConfigPath(configName);
        const defaultContent = await fs.readFile(defaultPath, "utf-8");

        await fs.writeFile(livePath, defaultContent, "utf-8");
      }
    }),
  );
}