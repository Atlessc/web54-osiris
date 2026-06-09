import type {
  RssFeedConfig,
  SourceLane,
  SourcePromotionPolicy,
} from "@/types/local-config";

const STRUCTURED_CATEGORIES = new Set(["weather", "natural-hazards"]);
const CYBER_CATEGORIES = new Set(["cybersecurity"]);
const CONTEXT_CATEGORIES = new Set([
  "technology",
  "business",
  "finance",
  "good-news",
]);
const LOCAL_CATEGORIES = new Set(["local-news", "portland-local"]);

const POLICY_BY_LANE: Record<SourceLane, SourcePromotionPolicy> = {
  "world-events": {
    lane: "world-events",
    mapEligible: true,
    signalEligible: true,
    maxAgeHours: 168,
    requireEventAction: true,
  },
  "local-events": {
    lane: "local-events",
    mapEligible: true,
    signalEligible: true,
    maxAgeHours: 120,
    requireEventAction: true,
  },
  cyber: {
    lane: "cyber",
    mapEligible: false,
    signalEligible: false,
    maxAgeHours: 168,
    requireEventAction: true,
  },
  "structured-observation": {
    lane: "structured-observation",
    mapEligible: false,
    signalEligible: false,
    maxAgeHours: 168,
    requireEventAction: false,
  },
  context: {
    lane: "context",
    mapEligible: false,
    signalEligible: false,
    maxAgeHours: null,
    requireEventAction: false,
  },
};

function getDefaultLane(feed: RssFeedConfig): SourceLane {
  const category = feed.category.trim().toLowerCase();

  if (STRUCTURED_CATEGORIES.has(category)) return "structured-observation";
  if (CYBER_CATEGORIES.has(category)) return "cyber";
  if (CONTEXT_CATEGORIES.has(category)) return "context";
  if (LOCAL_CATEGORIES.has(category)) return "local-events";
  return "world-events";
}

export function resolveSourcePromotionPolicy(
  feed: RssFeedConfig,
): SourcePromotionPolicy {
  const lane = feed.promotionPolicy?.lane ?? getDefaultLane(feed);
  const laneDefaults = POLICY_BY_LANE[lane];

  return {
    ...laneDefaults,
    ...feed.promotionPolicy,
    lane,
  };
}

export function getSourceLaneRejectionReason(lane: SourceLane) {
  return `source_lane_${lane.replace(/-/g, "_")}`;
}

export const SOURCE_LANES = Object.keys(POLICY_BY_LANE) as SourceLane[];
