import { ZodError } from "zod";

import {
  entityRegistrySchema,
  keywordPacksSchema,
  locationRegistrySchema,
  profileSchema,
  rssFeedsSchema,
  settingsSchema,
  topicRegistrySchema,
} from "./configSchemas";

import type { LocalConfigName } from "@/types/local-config";

export interface ConfigValidationResult {
  valid: boolean;
  error?: string;
}

export function validateConfig(
  configName: LocalConfigName,
  data: unknown,
): ConfigValidationResult {
  try {
    switch (configName) {
      case "profile":
        profileSchema.parse(data);
        break;

      case "settings":
        settingsSchema.parse(data);
        break;

      case "rss-feeds":
        rssFeedsSchema.parse(data);
        break;

      case "keyword-packs":
        keywordPacksSchema.parse(data);
        break;

      case "location-registry":
        locationRegistrySchema.parse(data);
        break;

      case "topic-registry":
        topicRegistrySchema.parse(data);
        break;

      case "entity-registry":
        entityRegistrySchema.parse(data);
        break;

      default:
        return {
          valid: false,
          error: "Unknown config name",
        };
    }

    return {
      valid: true,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        valid: false,
        error: error.issues
          .map((issue) => {
            const path = issue.path.length ? issue.path.join(".") : "root";
            return `${path}: ${issue.message}`;
          })
          .join("; "),
      };
    }

    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid config",
    };
  }
}