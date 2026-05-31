import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * OSIRIS — RSS OSINT Incident Mapper
 *
 * This route acts as a metadata-rich fallback for global incident mapping.
 *
 * It does NOT pretend to be full GDELT event intelligence.
 * It pulls free RSS feeds, extracts useful metadata, performs lightweight
 * keyword + location matching, and returns both map events and derived
 * analyst-style signals.
 */

type GeoPrecision = "city" | "country" | "region" | "actor_proxy";

type SeverityLevel = "low" | "watch" | "elevated" | "high" | "critical";

type ConfidenceLevel = "low" | "moderate" | "high";

interface RssFeed {
  url: string;
  source: string;
  reliability: number;
}

interface GeoEntry {
  coords: [number, number]; // [lng, lat]
  precision: GeoPrecision;
  confidence: number;
  label: string;
  aliases?: string[];
}

interface KeywordEntry {
  weight: number;
  family:
    | "kinetic"
    | "military"
    | "civil_unrest"
    | "casualty"
    | "political"
    | "security"
    | "disaster"
    | "infrastructure";
}

interface MatchedLocation {
  key: string;
  label: string;
  coords: [number, number];
  precision: GeoPrecision;
  confidence: number;
}

interface OsintEvent {
  id: string;
  lat: number;
  lng: number;
  name: string;
  title: string;
  description: string;
  url: string;
  html: string;
  type: "conflict";
  source: string;
  sourceReliability: number;
  publishedAt: string | null;
  fetchedAt: string;
  articleAgeMinutes: number | null;
  matchedKeywords: string[];
  keywordFamilies: string[];
  matchedLocation: MatchedLocation;
  geoPrecision: GeoPrecision;
  displayJitterApplied: boolean;
  severityScore: number;
  severityLevel: SeverityLevel;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  whyFlagged: string;
  knownFacts: string[];
  inferredMeaning: string[];
  uncertainty: string[];
  watchNext: string[];
  metadata: {
    mapper: "rss_keyword_geo_mapper";
    sourceType: "rss";
    exactLocationVerified: false;
    fullGdeltEvent: false;
  };
}

interface DerivedSignal {
  id: string;
  title: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  location: {
    key: string;
    label: string;
    lat: number;
    lng: number;
    precision: GeoPrecision;
  };
  evidenceCount: number;
  sources: string[];
  matchedKeywords: string[];
  keywordFamilies: string[];
  averageSeverityScore: number;
  averageConfidenceScore: number;
  newestPublishedAt: string | null;
  explanation: string;
  knownFacts: string[];
  inferredMeaning: string[];
  uncertainty: string[];
  watchNext: string[];
  relatedEventIds: string[];
}

const RSS_FEEDS: RssFeed[] = [
  {
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    source: "BBC World",
    reliability: 0.9,
  },
  {
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    source: "Al Jazeera",
    reliability: 0.85,
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    source: "NYT World",
    reliability: 0.88,
  },
];

/**
 * Coordinates are [lng, lat].
 *
 * Important:
 * - Country-level locations should have lower confidence.
 * - Actor proxy locations should be explicitly labeled as proxy/inferred.
 * - City-level matches are more useful and should score higher.
 */
const GEO_DICT: Record<string, GeoEntry> = {
  ukraine: {
    coords: [31.1656, 48.3794],
    precision: "country",
    confidence: 0.45,
    label: "Ukraine",
  },
  kyiv: {
    coords: [30.5234, 50.4501],
    precision: "city",
    confidence: 0.85,
    label: "Kyiv, Ukraine",
    aliases: ["kiev"],
  },
  russia: {
    coords: [37.6173, 55.7558],
    precision: "country",
    confidence: 0.45,
    label: "Russia",
  },
  moscow: {
    coords: [37.6173, 55.7558],
    precision: "city",
    confidence: 0.85,
    label: "Moscow, Russia",
  },
  gaza: {
    coords: [34.4668, 31.5017],
    precision: "region",
    confidence: 0.75,
    label: "Gaza",
  },
  israel: {
    coords: [34.8516, 31.0461],
    precision: "country",
    confidence: 0.45,
    label: "Israel",
  },
  "tel aviv": {
    coords: [34.7818, 32.0853],
    precision: "city",
    confidence: 0.85,
    label: "Tel Aviv, Israel",
  },
  palestine: {
    coords: [35.2332, 31.9522],
    precision: "region",
    confidence: 0.55,
    label: "Palestine",
  },
  iran: {
    coords: [53.688, 32.4279],
    precision: "country",
    confidence: 0.45,
    label: "Iran",
  },
  tehran: {
    coords: [51.389, 35.6892],
    precision: "city",
    confidence: 0.85,
    label: "Tehran, Iran",
  },
  syria: {
    coords: [38.9968, 34.8021],
    precision: "country",
    confidence: 0.45,
    label: "Syria",
  },
  lebanon: {
    coords: [35.8623, 33.8547],
    precision: "country",
    confidence: 0.45,
    label: "Lebanon",
  },
  beirut: {
    coords: [35.5018, 33.8938],
    precision: "city",
    confidence: 0.85,
    label: "Beirut, Lebanon",
  },
  yemen: {
    coords: [47.5868, 15.5527],
    precision: "country",
    confidence: 0.45,
    label: "Yemen",
  },
  houthi: {
    coords: [44.2066, 15.3694],
    precision: "actor_proxy",
    confidence: 0.3,
    label: "Houthi-linked area proxy near Sana'a",
    aliases: ["houthis"],
  },
  sudan: {
    coords: [30.2176, 12.8628],
    precision: "country",
    confidence: 0.45,
    label: "Sudan",
  },
  china: {
    coords: [116.4074, 39.9042],
    precision: "country",
    confidence: 0.45,
    label: "China",
  },
  taiwan: {
    coords: [120.9605, 23.6978],
    precision: "country",
    confidence: 0.55,
    label: "Taiwan",
  },
  korea: {
    coords: [127.7669, 35.9078],
    precision: "region",
    confidence: 0.4,
    label: "Korean Peninsula",
  },
  "north korea": {
    coords: [127.5101, 40.3399],
    precision: "country",
    confidence: 0.55,
    label: "North Korea",
  },
  "south korea": {
    coords: [127.7669, 35.9078],
    precision: "country",
    confidence: 0.55,
    label: "South Korea",
  },
  usa: {
    coords: [-77.0369, 38.9072],
    precision: "country",
    confidence: 0.35,
    label: "United States",
    aliases: ["united states", "u.s.", "us"],
  },
  myanmar: {
    coords: [95.956, 21.9162],
    precision: "country",
    confidence: 0.45,
    label: "Myanmar",
    aliases: ["burma"],
  },
  haiti: {
    coords: [-72.2852, 18.9712],
    precision: "country",
    confidence: 0.45,
    label: "Haiti",
  },
  somalia: {
    coords: [46.1996, 5.1521],
    precision: "country",
    confidence: 0.45,
    label: "Somalia",
  },
  bulgaria: {
    coords: [25.4858, 42.7339],
    precision: "country",
    confidence: 0.45,
    label: "Bulgaria",
  },
  serbia: {
    coords: [21.0059, 44.0165],
    precision: "country",
    confidence: 0.45,
    label: "Serbia",
  },
  greece: {
    coords: [21.8243, 39.0742],
    precision: "country",
    confidence: 0.45,
    label: "Greece",
  },
  turkey: {
    coords: [35.2433, 38.9637],
    precision: "country",
    confidence: 0.45,
    label: "Turkey",
    aliases: ["türkiye"],
  },
  macedonia: {
    coords: [21.7453, 41.6086],
    precision: "country",
    confidence: 0.45,
    label: "North Macedonia",
  },
  romania: {
    coords: [24.9668, 45.9432],
    precision: "country",
    confidence: 0.45,
    label: "Romania",
  },
  france: {
    coords: [2.2137, 46.2276],
    precision: "country",
    confidence: 0.45,
    label: "France",
  },
  germany: {
    coords: [10.4515, 51.1657],
    precision: "country",
    confidence: 0.45,
    label: "Germany",
  },
  uk: {
    coords: [-3.4359, 55.3781],
    precision: "country",
    confidence: 0.4,
    label: "United Kingdom",
    aliases: ["britain", "united kingdom"],
  },
  mexico: {
    coords: [-102.5528, 23.6345],
    precision: "country",
    confidence: 0.45,
    label: "Mexico",
  },
};

const KEYWORD_WEIGHTS: Record<string, KeywordEntry> = {
  missile: { weight: 34, family: "kinetic" },
  missiles: { weight: 34, family: "kinetic" },
  drone: { weight: 28, family: "kinetic" },
  drones: { weight: 28, family: "kinetic" },
  bomb: { weight: 32, family: "kinetic" },
  bombing: { weight: 32, family: "kinetic" },
  explosion: { weight: 28, family: "kinetic" },
  explosions: { weight: 28, family: "kinetic" },
  attack: { weight: 26, family: "kinetic" },
  attacks: { weight: 26, family: "kinetic" },
  strike: { weight: 24, family: "kinetic" },
  strikes: { weight: 24, family: "kinetic" },
  airstrike: { weight: 30, family: "kinetic" },
  airstrikes: { weight: 30, family: "kinetic" },

  killed: { weight: 24, family: "casualty" },
  dead: { weight: 22, family: "casualty" },
  wounded: { weight: 18, family: "casualty" },
  injured: { weight: 16, family: "casualty" },
  casualties: { weight: 22, family: "casualty" },

  troops: { weight: 18, family: "military" },
  military: { weight: 15, family: "military" },
  forces: { weight: 12, family: "military" },
  army: { weight: 14, family: "military" },
  navy: { weight: 14, family: "military" },
  mobilization: { weight: 22, family: "military" },
  mobilisation: { weight: 22, family: "military" },

  protest: { weight: 12, family: "civil_unrest" },
  protests: { weight: 12, family: "civil_unrest" },
  riot: { weight: 20, family: "civil_unrest" },
  riots: { weight: 20, family: "civil_unrest" },
  clash: { weight: 20, family: "civil_unrest" },
  clashes: { weight: 20, family: "civil_unrest" },
  unrest: { weight: 18, family: "civil_unrest" },

  police: { weight: 8, family: "security" },
  security: { weight: 8, family: "security" },
  evacuation: { weight: 18, family: "security" },
  evacuations: { weight: 18, family: "security" },

  war: { weight: 16, family: "political" },
  invasion: { weight: 28, family: "political" },
  sanctions: { weight: 14, family: "political" },
  ceasefire: { weight: 12, family: "political" },

  blackout: { weight: 18, family: "infrastructure" },
  outage: { weight: 16, family: "infrastructure" },
  infrastructure: { weight: 14, family: "infrastructure" },
  port: { weight: 10, family: "infrastructure" },
  airport: { weight: 10, family: "infrastructure" },

  earthquake: { weight: 18, family: "disaster" },
  flood: { weight: 16, family: "disaster" },
  wildfire: { weight: 18, family: "disaster" },
};

function decodeXmlEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value: string): string {
  return decodeXmlEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractTag(item: string, tagName: string): string | null {
  const cdataRegex = new RegExp(
    `<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`,
    "i",
  );

  const normalRegex = new RegExp(
    `<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i",
  );

  const cdataMatch = item.match(cdataRegex);
  if (cdataMatch?.[1]) return decodeXmlEntities(cdataMatch[1]).trim();

  const normalMatch = item.match(normalRegex);
  if (normalMatch?.[1]) return decodeXmlEntities(normalMatch[1]).trim();

  return null;
}

function parsePublishedAt(item: string): string | null {
  const rawDate =
    extractTag(item, "pubDate") ||
    extractTag(item, "published") ||
    extractTag(item, "updated") ||
    extractTag(item, "dc:date");

  if (!rawDate) return null;

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString();
}

function getArticleAgeMinutes(
  publishedAt: string | null,
  now: Date,
): number | null {
  if (!publishedAt) return null;

  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) return null;

  return Math.max(
    0,
    Math.round((now.getTime() - published.getTime()) / 60_000),
  );
}

function normalizeForSearch(value: string): string {
  return stripHtml(value).toLowerCase();
}

function getWordRegex(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /**
   * This avoids matching tiny terms inside bigger words.
   * Example: "war" should not match "hardware".
   */
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function getMatchedKeywords(text: string): string[] {
  const matched: string[] = [];

  for (const keyword of Object.keys(KEYWORD_WEIGHTS)) {
    if (getWordRegex(keyword).test(text)) {
      matched.push(keyword);
    }
  }

  return matched;
}

function getKeywordFamilies(matchedKeywords: string[]): string[] {
  return Array.from(
    new Set(
      matchedKeywords
        .map((keyword) => KEYWORD_WEIGHTS[keyword]?.family)
        .filter(Boolean),
    ),
  );
}

function getMatchedLocation(text: string): MatchedLocation | null {
  const candidates: MatchedLocation[] = [];

  for (const [key, entry] of Object.entries(GEO_DICT)) {
    const terms = [key, ...(entry.aliases || [])];

    for (const term of terms) {
      if (getWordRegex(term).test(text)) {
        candidates.push({
          key,
          label: entry.label,
          coords: entry.coords,
          precision: entry.precision,
          confidence: entry.confidence,
        });
        break;
      }
    }
  }

  if (!candidates.length) return null;

  /**
   * Prefer the most precise match.
   * Example: "Kyiv" should beat "Ukraine".
   */
  const precisionRank: Record<GeoPrecision, number> = {
    city: 4,
    region: 3,
    country: 2,
    actor_proxy: 1,
  };

  return candidates.sort((a, b) => {
    const precisionDiff =
      precisionRank[b.precision] - precisionRank[a.precision];
    if (precisionDiff !== 0) return precisionDiff;

    return b.confidence - a.confidence;
  })[0];
}

function getSeverityScore(
  matchedKeywords: string[],
  articleAgeMinutes: number | null,
): number {
  const rawKeywordScore = matchedKeywords.reduce((total, keyword) => {
    return total + (KEYWORD_WEIGHTS[keyword]?.weight || 0);
  }, 0);

  const keywordScore = Math.min(rawKeywordScore, 85);

  /**
   * Recent articles get a small boost because they are more operationally useful.
   */
  let recencyBoost = 0;

  if (articleAgeMinutes !== null) {
    if (articleAgeMinutes <= 30) recencyBoost = 15;
    else if (articleAgeMinutes <= 120) recencyBoost = 10;
    else if (articleAgeMinutes <= 360) recencyBoost = 5;
  }

  return Math.min(100, keywordScore + recencyBoost);
}

function getSeverityLevel(score: number): SeverityLevel {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "elevated";
  if (score >= 30) return "watch";
  return "low";
}

function getConfidenceScore(params: {
  sourceReliability: number;
  locationConfidence: number;
  matchedKeywords: string[];
  publishedAt: string | null;
  geoPrecision: GeoPrecision;
}): number {
  const {
    sourceReliability,
    locationConfidence,
    matchedKeywords,
    publishedAt,
    geoPrecision,
  } = params;

  const sourceScore = sourceReliability * 35;
  const locationScore = locationConfidence * 35;
  const keywordScore = Math.min(matchedKeywords.length * 5, 20);
  const publishedScore = publishedAt ? 10 : 0;

  let precisionPenalty = 0;

  if (geoPrecision === "country") precisionPenalty = 8;
  if (geoPrecision === "actor_proxy") precisionPenalty = 15;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        sourceScore +
          locationScore +
          keywordScore +
          publishedScore -
          precisionPenalty,
      ),
    ),
  );
}

function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 72) return "high";
  if (score >= 45) return "moderate";
  return "low";
}

function getDisplayCoords(
  baseCoords: [number, number],
  eventIndex: number,
  precision: GeoPrecision,
): [number, number] {
  /**
   * City-level matches receive smaller jitter.
   * Country/actor-level matches receive larger jitter because many stories
   * may map to the same centroid.
   */
  const jitterScaleByPrecision: Record<GeoPrecision, number> = {
    city: 0.25,
    region: 0.6,
    country: 1.2,
    actor_proxy: 1.0,
  };

  const scale = jitterScaleByPrecision[precision];

  const jitterLng = ((((eventIndex * 137.5) % 200) - 100) / 100) * scale;
  const jitterLat = ((((eventIndex * 251.3) % 200) - 100) / 100) * scale;

  return [baseCoords[0] + jitterLng, baseCoords[1] + jitterLat];
}

function buildWhyFlagged(params: {
  matchedKeywords: string[];
  matchedLocation: MatchedLocation;
  source: string;
}): string {
  const { matchedKeywords, matchedLocation, source } = params;

  return `Article from ${source} matched monitored terms (${matchedKeywords.join(
    ", ",
  )}) and was mapped to ${matchedLocation.label} with ${matchedLocation.precision.replace(
    "_",
    " ",
  )} precision.`;
}

function buildKnownFacts(params: {
  source: string;
  title: string;
  matchedKeywords: string[];
  matchedLocation: MatchedLocation;
  publishedAt: string | null;
}): string[] {
  const { source, title, matchedKeywords, matchedLocation, publishedAt } =
    params;

  return [
    `Source: ${source}`,
    `Title: ${title}`,
    `Matched location: ${matchedLocation.label}`,
    `Matched keywords: ${matchedKeywords.join(", ")}`,
    publishedAt
      ? `Published at: ${publishedAt}`
      : "Published time was not available in the feed item",
  ];
}

function buildInferredMeaning(params: {
  matchedLocation: MatchedLocation;
  keywordFamilies: string[];
  severityLevel: SeverityLevel;
}): string[] {
  const { matchedLocation, keywordFamilies, severityLevel } = params;

  const families = keywordFamilies.join(", ");

  return [
    `This may indicate ${families || "security"}-related activity associated with ${matchedLocation.label}.`,
    `The current automated severity level is ${severityLevel}.`,
  ];
}

function buildUncertainty(params: {
  matchedLocation: MatchedLocation;
  publishedAt: string | null;
}): string[] {
  const { matchedLocation, publishedAt } = params;

  const uncertainty = [
    "This is based on RSS headline/description keyword matching, not a fully structured incident report.",
    "The article has not been independently corroborated by this route alone.",
  ];

  if (matchedLocation.precision === "country") {
    uncertainty.push(
      "Location is country-level and should not be treated as an exact event coordinate.",
    );
  }

  if (matchedLocation.precision === "actor_proxy") {
    uncertainty.push(
      "Location is an actor proxy and may not represent where the event occurred.",
    );
  }

  if (!publishedAt) {
    uncertainty.push(
      "Published timestamp was unavailable, so recency confidence is lower.",
    );
  }

  return uncertainty;
}

function buildWatchNext(keywordFamilies: string[]): string[] {
  const watchItems = new Set<string>();

  watchItems.add("additional independent source mentions");
  watchItems.add("official statements or local authority updates");

  if (
    keywordFamilies.includes("kinetic") ||
    keywordFamilies.includes("military")
  ) {
    watchItems.add("aviation route changes");
    watchItems.add("GPS interference indicators");
    watchItems.add("nearby military or security reporting");
  }

  if (
    keywordFamilies.includes("civil_unrest") ||
    keywordFamilies.includes("security")
  ) {
    watchItems.add("local CCTV or traffic disruption");
    watchItems.add("public transit or road closure notices");
  }

  if (keywordFamilies.includes("infrastructure")) {
    watchItems.add("port, airport, power, or telecom outage reports");
    watchItems.add("market or supply-chain movement");
  }

  if (keywordFamilies.includes("disaster")) {
    watchItems.add("weather alerts");
    watchItems.add("emergency response activity");
  }

  return Array.from(watchItems);
}

function buildEventHtml(event: {
  title: string;
  url: string;
  source: string;
  severityLevel: SeverityLevel;
  confidenceLevel: ConfidenceLevel;
  matchedLocation: MatchedLocation;
  matchedKeywords: string[];
  whyFlagged: string;
}): string {
  const safeTitle = escapeHtml(event.title);
  const safeUrl = escapeHtml(event.url);
  const safeSource = escapeHtml(event.source);
  const safeLocation = escapeHtml(event.matchedLocation.label);
  const safeKeywords = escapeHtml(event.matchedKeywords.join(", "));
  const safeWhy = escapeHtml(event.whyFlagged);

  return `
    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
    <br/>
    <i>Source: ${safeSource}</i>
    <br/>
    <b>Location:</b> ${safeLocation}
    <br/>
    <b>Severity:</b> ${event.severityLevel}
    <br/>
    <b>Confidence:</b> ${event.confidenceLevel}
    <br/>
    <b>Matched:</b> ${safeKeywords}
    <br/>
    <small>${safeWhy}</small>
  `;
}

function getClusterKey(event: OsintEvent): string {
  const primaryFamily = event.keywordFamilies[0] || "general";
  return `${event.matchedLocation.key}:${primaryFamily}`;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

function getHighestSeverityLevel(events: OsintEvent[]): SeverityLevel {
  const rank: Record<SeverityLevel, number> = {
    low: 1,
    watch: 2,
    elevated: 3,
    high: 4,
    critical: 5,
  };

  return events
    .map((event) => event.severityLevel)
    .sort((a, b) => rank[b] - rank[a])[0];
}

function getClusterConfidenceLevel(events: OsintEvent[]): ConfidenceLevel {
  const uniqueSources = new Set(events.map((event) => event.source));
  const avgConfidence = average(events.map((event) => event.confidenceScore));

  const corroborationBoost = uniqueSources.size >= 2 ? 10 : 0;
  return getConfidenceLevel(Math.min(100, avgConfidence + corroborationBoost));
}

function buildDerivedSignals(
  events: OsintEvent[],
  fetchedAt: string,
): DerivedSignal[] {
  const clusters = new Map<string, OsintEvent[]>();

  for (const event of events) {
    const clusterKey = getClusterKey(event);
    const existing = clusters.get(clusterKey) || [];
    existing.push(event);
    clusters.set(clusterKey, existing);
  }

  const derivedSignals: DerivedSignal[] = [];

  for (const [clusterKey, clusterEvents] of clusters.entries()) {
    /**
     * Single-source/single-event clusters are still useful, but derived signals
     * should prioritize clusters with multiple pieces of evidence.
     */
    const shouldKeepCluster =
      clusterEvents.length >= 2 ||
      clusterEvents.some(
        (event) =>
          event.severityLevel === "high" || event.severityLevel === "critical",
      );

    if (!shouldKeepCluster) continue;

    const first = clusterEvents[0];
    const sources = Array.from(
      new Set(clusterEvents.map((event) => event.source)),
    );
    const matchedKeywords = Array.from(
      new Set(clusterEvents.flatMap((event) => event.matchedKeywords)),
    );
    const keywordFamilies = Array.from(
      new Set(clusterEvents.flatMap((event) => event.keywordFamilies)),
    );

    const severity = getHighestSeverityLevel(clusterEvents);
    const confidence = getClusterConfidenceLevel(clusterEvents);

    const newestPublishedAt =
      clusterEvents
        .map((event) => event.publishedAt)
        .filter(Boolean)
        .sort()
        .reverse()[0] || null;

    const averageSeverityScore = average(
      clusterEvents.map((event) => event.severityScore),
    );
    const averageConfidenceScore = average(
      clusterEvents.map((event) => event.confidenceScore),
    );

    const sourcePhrase =
      sources.length > 1
        ? `${sources.length} sources (${sources.join(", ")})`
        : `${sources[0]}`;

    derivedSignals.push({
      id: `signal-${clusterKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${fetchedAt.slice(
        0,
        13,
      )}`,
      title: `${severity.toUpperCase()} watch: ${first.matchedLocation.label} ${keywordFamilies.join(
        "/",
      )} reporting cluster`,
      severity,
      confidence,
      location: {
        key: first.matchedLocation.key,
        label: first.matchedLocation.label,
        lat: first.matchedLocation.coords[1],
        lng: first.matchedLocation.coords[0],
        precision: first.matchedLocation.precision,
      },
      evidenceCount: clusterEvents.length,
      sources,
      matchedKeywords,
      keywordFamilies,
      averageSeverityScore,
      averageConfidenceScore,
      newestPublishedAt,
      explanation: `${clusterEvents.length} RSS items from ${sourcePhrase} matched ${matchedKeywords.join(
        ", ",
      )} around ${first.matchedLocation.label}. This suggests elevated reporting density, not confirmed causation.`,
      knownFacts: [
        `${clusterEvents.length} feed items matched the same location/family cluster.`,
        `Sources involved: ${sources.join(", ")}`,
        `Matched keyword families: ${keywordFamilies.join(", ")}`,
        newestPublishedAt
          ? `Newest published item: ${newestPublishedAt}`
          : "Published timestamps were incomplete for this cluster.",
      ],
      inferredMeaning: [
        `Reporting density around ${first.matchedLocation.label} is higher than a single isolated article.`,
        `This may deserve analyst review, especially if aviation, maritime, weather, GPS, market, or infrastructure layers also show movement.`,
      ],
      uncertainty: [
        "Cluster is based on lightweight RSS parsing and keyword matching.",
        "Multiple articles may describe the same underlying event.",
        "Location may be approximate depending on the matched place precision.",
      ],
      watchNext: buildWatchNext(keywordFamilies),
      relatedEventIds: clusterEvents.map((event) => event.id),
    });
  }

  return derivedSignals.sort((a, b) => {
    const severityRank: Record<SeverityLevel, number> = {
      low: 1,
      watch: 2,
      elevated: 3,
      high: 4,
      critical: 5,
    };

    const severityDiff = severityRank[b.severity] - severityRank[a.severity];
    if (severityDiff !== 0) return severityDiff;

    return b.evidenceCount - a.evidenceCount;
  });
}

export async function GET() {
  const fetchedAtDate = new Date();
  const fetchedAt = fetchedAtDate.toISOString();

  try {
    const allEvents: OsintEvent[] = [];
    let eventId = 0;

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          signal: AbortSignal.timeout(5000),
          headers: {
            Accept: "application/rss+xml, application/xml, text/xml, */*",
            "User-Agent": "OSIRIS-RSS-OSINT-Mapper/1.0",
          },
        });

        if (!res.ok) {
          console.warn(`Failed to fetch ${feed.source}: HTTP ${res.status}`);
          continue;
        }

        const xml = await res.text();

        /**
         * Lightweight RSS extraction to avoid adding XML parser deps.
         * This is intentionally defensive, but a real XML parser would be cleaner.
         */
        const items = xml.match(/<item\b[^>]*>([\s\S]*?)<\/item>/gi) || [];

        for (const item of items) {
          const rawTitle = extractTag(item, "title");
          const rawLink = extractTag(item, "link");
          const rawDesc =
            extractTag(item, "description") ||
            extractTag(item, "summary") ||
            "";

          if (!rawTitle || !rawLink) continue;

          const title = stripHtml(rawTitle);
          const description = stripHtml(rawDesc);
          const url = rawLink.trim();
          const publishedAt = parsePublishedAt(item);
          const articleAgeMinutes = getArticleAgeMinutes(
            publishedAt,
            fetchedAtDate,
          );

          const textToSearch = normalizeForSearch(`${title} ${description}`);

          const matchedKeywords = getMatchedKeywords(textToSearch);
          if (!matchedKeywords.length) continue;

          const matchedLocation = getMatchedLocation(textToSearch);
          if (!matchedLocation) continue;

          const keywordFamilies = getKeywordFamilies(matchedKeywords);
          const severityScore = getSeverityScore(
            matchedKeywords,
            articleAgeMinutes,
          );
          const severityLevel = getSeverityLevel(severityScore);

          /**
           * Low-score matches are usually noisy.
           * Example: an article matching only "police" and "France" should not
           * automatically become an OSIRIS incident unless other strong terms exist.
           */
          if (severityScore < 18) continue;

          const confidenceScore = getConfidenceScore({
            sourceReliability: feed.reliability,
            locationConfidence: matchedLocation.confidence,
            matchedKeywords,
            publishedAt,
            geoPrecision: matchedLocation.precision,
          });

          const confidenceLevel = getConfidenceLevel(confidenceScore);
          const displayCoords = getDisplayCoords(
            matchedLocation.coords,
            eventId,
            matchedLocation.precision,
          );

          const whyFlagged = buildWhyFlagged({
            matchedKeywords,
            matchedLocation,
            source: feed.source,
          });

          const knownFacts = buildKnownFacts({
            source: feed.source,
            title,
            matchedKeywords,
            matchedLocation,
            publishedAt,
          });

          const inferredMeaning = buildInferredMeaning({
            matchedLocation,
            keywordFamilies,
            severityLevel,
          });

          const uncertainty = buildUncertainty({
            matchedLocation,
            publishedAt,
          });

          const watchNext = buildWatchNext(keywordFamilies);

          const id = `osint-${feed.source.replace(/\s+/g, "")}-${eventId++}`;

          const eventForHtml = {
            title,
            url,
            source: feed.source,
            severityLevel,
            confidenceLevel,
            matchedLocation,
            matchedKeywords,
            whyFlagged,
          };

          allEvents.push({
            id,
            lat: displayCoords[1],
            lng: displayCoords[0],
            name: `[${feed.source}] ${title}`,
            title,
            description,
            url,
            html: buildEventHtml(eventForHtml),
            type: "conflict",
            source: feed.source,
            sourceReliability: feed.reliability,
            publishedAt,
            fetchedAt,
            articleAgeMinutes,
            matchedKeywords,
            keywordFamilies,
            matchedLocation,
            geoPrecision: matchedLocation.precision,
            displayJitterApplied: true,
            severityScore,
            severityLevel,
            confidenceScore,
            confidenceLevel,
            whyFlagged,
            knownFacts,
            inferredMeaning,
            uncertainty,
            watchNext,
            metadata: {
              mapper: "rss_keyword_geo_mapper",
              sourceType: "rss",
              exactLocationVerified: false,
              fullGdeltEvent: false,
            },
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch ${feed.source}:`, error);
      }
    }

    const derivedSignals = buildDerivedSignals(allEvents, fetchedAt);

    return NextResponse.json(
      {
        events: allEvents,
        derivedSignals,
        total: allEvents.length,
        derivedTotal: derivedSignals.length,
        timestamp: fetchedAt,
        source: "RSS_OSINT_MAPPING",
        sourceNote:
          "This route uses free RSS feeds with lightweight keyword/location mapping. It is not full GDELT event intelligence.",
        metadata: {
          fullGdeltEvent: false,
          mapper: "rss_keyword_geo_mapper",
          feedCount: RSS_FEEDS.length,
          feeds: RSS_FEEDS.map((feed) => ({
            source: feed.source,
            url: feed.url,
            reliability: feed.reliability,
          })),
          limitations: [
            "Keyword matching can produce false positives.",
            "Location matching is dictionary-based and may be approximate.",
            "Country-level and actor-proxy matches are not exact event coordinates.",
            "Multiple articles may refer to the same underlying event.",
          ],
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("RSS OSINT mapper error:", error);

    return NextResponse.json(
      {
        events: [],
        derivedSignals: [],
        total: 0,
        derivedTotal: 0,
        timestamp: fetchedAt,
        source: "RSS_OSINT_MAPPING",
        error: "Failed to fetch RSS OSINT data",
      },
      { status: 500 },
    );
  }
}
