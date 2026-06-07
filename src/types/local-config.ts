export type OsirisTheme = "dark" | "light" | "system";

export type OsirisDensity = "compact" | "comfortable";

export type SeverityLevel = "notice" | "watch" | "warning" | "critical";

export type ConfidenceLevel = "low" | "medium" | "high";

export type WatchPriority = "low" | "normal" | "high";

export type SourceType = "rss";

export type RegistryLocationType =
  | "country"
  | "region"
  | "city"
  | "maritime-region"
  | "infrastructure"
  | "custom";

export type RegistryEntityType =
  | "person"
  | "organization"
  | "government-agency"
  | "international-organization"
  | "company"
  | "military"
  | "infrastructure"
  | "custom";

  export type TopicTone = "negative" | "neutral" | "positive" | "mixed";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ProfileConfig {
  displayName: string;
  workspaceName: string;
  callsign: string;
  homePageMode: string;
}

export interface SettingsConfig {
  theme: OsirisTheme;
  accentColor: string;
  density: OsirisDensity;
  defaultLandingPage: string;
  autoRefresh: boolean;
  refreshIntervalMinutes: number;
  defaultSeverityThreshold: SeverityLevel;
  defaultConfidenceThreshold: ConfidenceLevel;
  showDebugPanels: boolean;
  enabledLayers: string[];
}

export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  type: SourceType;
  category: string;
  enabled: boolean;
  reliabilityWeight: number;
  refreshIntervalMinutes: number;
  spectrumScore: number | null;
  spectrumConfidence: "low" | "medium" | "high" | "unrated";
  spectrumAsOf: string;
  spectrumReferenceUrl: string | null;
  tags: string[];
}

export type RssFeedsConfig = RssFeedConfig[];

export type KeywordPacksConfig = Record<string, string[]>;

export interface LocationRegistryItem {
  id: string;
  name: string;
  type: RegistryLocationType;
  region: string;
  aliases: string[];
  coordinates: Coordinates;
  watchPriority: WatchPriority;
  tags: string[];
}

export type LocationRegistryConfig = LocationRegistryItem[];

export interface TopicRegistryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  enabled: boolean;
  keywordPacks: string[];
  defaultSeverity: SeverityLevel;
  tone: TopicTone;
  tags: string[];
}

export type TopicRegistryConfig = TopicRegistryItem[];

export interface EntityRegistryItem {
  id: string;
  name: string;
  type: RegistryEntityType;
  aliases: string[];
  country: string | null;
  tags: string[];
  watchPriority: WatchPriority;
}

export type EntityRegistryConfig = EntityRegistryItem[];

export interface LocalConfigMap {
  profile: ProfileConfig;
  settings: SettingsConfig;
  "rss-feeds": RssFeedsConfig;
  "keyword-packs": KeywordPacksConfig;
  "location-registry": LocationRegistryConfig;
  "topic-registry": TopicRegistryConfig;
  "entity-registry": EntityRegistryConfig;
}

export type LocalConfigName = keyof LocalConfigMap;

export interface ConfigStatusItem {
  name: LocalConfigName;
  filename: string;
  exists: boolean;
  valid: boolean;
  status: "valid" | "missing" | "invalid";
  error?: string;
}

export interface ConfigStatusResponse {
  ok: boolean;
  configs: ConfigStatusItem[];
}
