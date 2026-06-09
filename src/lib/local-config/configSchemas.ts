import { z } from "zod";

const severityLevelSchema = z.enum(["notice", "watch", "warning", "critical"]);
const confidenceLevelSchema = z.enum(["low", "medium", "high"]);
const watchPrioritySchema = z.enum(["low", "normal", "high"]);
const topicToneSchema = z.enum(["negative", "neutral", "positive", "mixed"]);
const sourceLaneSchema = z.enum([
  "world-events",
  "local-events",
  "cyber",
  "structured-observation",
  "context",
]);

export const profileSchema = z.object({
  displayName: z.string().min(1),
  workspaceName: z.string().min(1),
  callsign: z.string().min(1),
  homePageMode: z.string().min(1),
});

export const settingsSchema = z.object({
  theme: z.enum(["dark", "light", "system"]),
  accentColor: z.string().min(1),
  density: z.enum(["compact", "comfortable"]),
  defaultLandingPage: z.string().min(1),
  autoRefresh: z.boolean(),
  refreshIntervalMinutes: z.number().int().min(1),
  defaultSeverityThreshold: severityLevelSchema,
  defaultConfidenceThreshold: confidenceLevelSchema,
  showDebugPanels: z.boolean(),
  enabledLayers: z.array(z.string().min(1)),
});

export const rssFeedSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    url: z.string().url(),
    logoUrl: z.string().url(),
    type: z.literal("rss"),
    category: z.string().min(1),
    enabled: z.boolean(),
    reliabilityWeight: z.number().min(0).max(1),
    refreshIntervalMinutes: z.number().int().min(1),
    spectrumScore: z.number().min(-100).max(100).nullable(),
    spectrumConfidence: z.enum(["low", "medium", "high", "unrated"]),
    spectrumAsOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    spectrumReferenceUrl: z.string().url().nullable(),
    tags: z.array(z.string()),
    promotionPolicy: z
      .object({
        lane: sourceLaneSchema.optional(),
        mapEligible: z.boolean().optional(),
        signalEligible: z.boolean().optional(),
        maxAgeHours: z.number().int().min(1).nullable().optional(),
        requireEventAction: z.boolean().optional(),
      })
      .optional(),
  })
  .superRefine((feed, context) => {
    if (feed.spectrumScore === null && feed.spectrumConfidence !== "unrated") {
      context.addIssue({
        code: "custom",
        path: ["spectrumConfidence"],
        message: "must be unrated when spectrumScore is null",
      });
    }

    if (feed.spectrumScore !== null && feed.spectrumConfidence === "unrated") {
      context.addIssue({
        code: "custom",
        path: ["spectrumConfidence"],
        message: "must be low, medium, or high when spectrumScore is numeric",
      });
    }
  });

export const rssFeedsSchema = z.array(rssFeedSchema);

export const keywordPacksSchema = z.record(
  z.string().min(1),
  z.array(z.string()),
);

export const locationRegistryItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    "country",
    "region",
    "city",
    "maritime-region",
    "infrastructure",
    "custom",
  ]),
  region: z.string().min(1),
  aliases: z.array(z.string()),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  watchPriority: watchPrioritySchema,
  tags: z.array(z.string()),
});

export const locationRegistrySchema = z.array(locationRegistryItemSchema);

export const topicRegistryItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  enabled: z.boolean(),
  keywordPacks: z.array(z.string()),
  defaultSeverity: severityLevelSchema,
  tone: topicToneSchema,
  tags: z.array(z.string()),
});

export const topicRegistrySchema = z.array(topicRegistryItemSchema);

export const entityRegistryItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    "person",
    "organization",
    "government-agency",
    "international-organization",
    "company",
    "military",
    "infrastructure",
    "custom",
  ]),
  aliases: z.array(z.string()),
  country: z.string().nullable(),
  tags: z.array(z.string()),
  watchPriority: watchPrioritySchema,
});

export const entityRegistrySchema = z.array(entityRegistryItemSchema);
