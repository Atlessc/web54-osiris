# OSIRIS 2.0 — Geospatial Intelligence Data Fusion Report

**Report type:** Geospatial Intelligence / GEOINT  
**Project context:** OSIRIS 2.0 local-first intelligence synthesis system  
**Purpose:** Explain how OSIRIS can extract, normalize, connect, analyze, score, and explain geospatial signals from many disconnected data sources.

---

## 1. Executive Summary

Geospatial intelligence, often shortened to **GEOINT**, is the process of using location-based information, maps, imagery, movement patterns, terrain context, infrastructure data, and geographically referenced activity to understand what is happening, where it is happening, why it may matter, and what may happen next.

For OSIRIS, GEOINT should not be treated as only “satellite images.” It should be treated as a full intelligence layer that connects:

- locations
- coordinates
- map features
- routes
- boundaries
- infrastructure
- movement
- proximity
- events
- environmental context
- source reliability
- time-based changes
- confidence scoring

A good OSIRIS geospatial intelligence system should answer questions like:

```text
What happened here?
What changed here?
What else is nearby?
Is this location connected to other events?
Is this activity normal for this area?
Are multiple weak signals clustering around the same place?
Could this be part of a larger pattern?
What are the alternative explanations?
How confident are we?
```

The goal is not to magically predict events. The goal is to turn disconnected location-based signals into explainable, source-attributed, confidence-rated assessments.

---

## 2. What Geospatial Intelligence Means

The National Geospatial-Intelligence Agency describes GEOINT as the exploitation and analysis of imagery and geospatial information to describe, assess, and visually depict physical features and geographically referenced activities on Earth.

In OSIRIS terms:

```text
GEOINT = location + time + entity + source + context + change detection + explanation
```

A single point on a map is not intelligence.

A single article mentioning a road closure is not intelligence.

A single satellite image is not intelligence.

But when OSIRIS connects a road closure, nearby infrastructure, weather data, traffic deviation, social posts, and a repeating pattern across time, it can produce a useful geospatial intelligence object.

---

## 3. GEOINT Compared to Other Intelligence Types

| Intelligence Type | Main Focus | GEOINT Relationship |
|---|---|---|
| Event Intelligence | What happened or may happen | GEOINT adds where, proximity, route, and terrain context |
| Threat Intelligence | Who or what may cause harm | GEOINT adds target location, area of effect, movement, and exposure |
| Cyber Intelligence | Digital systems, networks, vulnerabilities | GEOINT adds physical asset location, regional outage patterns, infrastructure dependency |
| Business / Market Intelligence | Market, demand, competitors, economics | GEOINT adds store locations, logistics, demographics, regional demand, expansion zones |
| Operational Intelligence | Real-time performance and activity | GEOINT adds live map state, routing, field operations, assets, and coverage |
| Risk Intelligence | Probability and impact of negative outcomes | GEOINT adds hazard zones, flood/fire/earthquake exposure, proximity risk |

GEOINT is not isolated. It acts like a spatial brain layer across all other intelligence types.

---

## 4. Core GEOINT Data Sources

OSIRIS can support multiple classes of geospatial data.

### 4.1 Map and Base-Layer Data

Examples:

- roads
- boundaries
- coastlines
- rivers
- rail lines
- buildings
- parcels
- land cover
- elevation
- transportation networks
- administrative regions
- points of interest

Useful sources:

- OpenStreetMap
- USGS National Map
- local government GIS portals
- state open data portals
- city/county transportation departments
- public infrastructure datasets

### 4.2 Event and Incident Data

Examples:

- public safety alerts
- road closures
- power outages
- wildfire perimeters
- earthquake feeds
- weather warnings
- port delays
- airport disruptions
- protests or public gatherings
- disease outbreak notices
- supply chain disruptions

### 4.3 Imagery and Remote Sensing Data

Examples:

- satellite imagery
- aerial imagery
- drone imagery, when legally collected
- orthophotos
- land surface temperature
- vegetation indexes
- flood extent imagery
- wildfire burn scars
- night lights
- change detection layers

Useful public sources include NASA Earthdata, USGS Landsat, Sentinel imagery, NOAA data, and other open Earth observation datasets.

### 4.4 Movement and Routing Data

Examples:

- traffic congestion
- transit delays
- shipping routes
- flight tracks
- vessel tracks
- road detours
- delivery ETA changes
- commute pattern changes
- emergency evacuation routes

OSIRIS should be careful here. Movement data can become privacy-sensitive quickly. Prefer aggregated, public, licensed, or user-owned data.

### 4.5 Environmental and Terrain Data

Examples:

- elevation
- slope
- flood zones
- soil type
- vegetation
- fire risk
- temperature
- precipitation
- wind
- visibility
- river gauge levels
- coastline exposure

These data layers help explain why an event matters in a specific place.

### 4.6 Human and Economic Geography

Examples:

- population density
- business density
- schools
- hospitals
- utilities
- demographics
- industrial zones
- ports
- warehouses
- shopping corridors
- commuter zones
- housing density

This helps OSIRIS understand impact.

A power outage in an empty field and a power outage affecting hospitals are not the same intelligence object.

---

## 5. The GEOINT Processing Pipeline

OSIRIS should process geospatial intelligence in a pipeline.

```text
Source ingestion
  ↓
Geoparsing
  ↓
Geocoding
  ↓
Spatial normalization
  ↓
Entity extraction
  ↓
Layer enrichment
  ↓
Spatial relationship detection
  ↓
Temporal correlation
  ↓
Change detection
  ↓
Cluster generation
  ↓
Hypothesis generation
  ↓
Confidence scoring
  ↓
Analyst-ready report
```

---

## 6. Step 1 — Source Ingestion

The first step is pulling data into OSIRIS.

Possible input types:

```text
RSS feed
API response
CSV file
GeoJSON file
KML file
Shapefile export
Manual note
News article
Government alert
Weather feed
Satellite metadata
Log file
User-submitted observation
```

Every source item should preserve the original source data.

### Source Object

```ts
export interface GeoSource {
  id: string;
  sourceType:
    | "rss"
    | "api"
    | "manual"
    | "geojson"
    | "csv"
    | "kml"
    | "shapefile"
    | "imagery"
    | "government_alert"
    | "sensor"
    | "news"
    | "weather"
    | "social_public";

  title: string;
  url?: string;
  publisher?: string;
  publishedAt?: string;
  collectedAt: string;

  rawText?: string;
  rawData?: unknown;

  reliabilityScore: number; // 0-100
  accessLevel: "public" | "internal" | "private" | "restricted";
  license?: string;
}
```

### Why this matters

OSIRIS should never only store the extracted conclusion. It should store:

- what was collected
- where it came from
- when it was collected
- what license or access level it has
- how reliable the source is
- what was extracted from it

This keeps the system explainable.

---

## 7. Step 2 — Geoparsing

Geoparsing means identifying place references in text.

Example input:

```text
A landslide has closed Highway 101 near Manzanita, Oregon, with traffic being diverted through local roads.
```

Extracted place references:

```json
{
  "places": [
    "Highway 101",
    "Manzanita",
    "Oregon"
  ]
}
```

Possible extracted geographic hints:

```text
road: Highway 101
city: Manzanita
state: Oregon
event: landslide
activity: road closure
```

### Geoparsing challenges

Place names are messy.

```text
Portland
Portland, Oregon
Portland, Maine
PDX
Downtown
North Ave
Ocean Road
The coast
Terminal 6
```

OSIRIS needs context to avoid wrong matches.

### Recommended approach

Use a layered method:

```text
1. Exact place dictionary match
2. Known user/project region bias
3. Administrative hierarchy matching
4. Geocoder lookup
5. Confidence scoring
6. Human review when uncertain
```

---

## 8. Step 3 — Geocoding

Geocoding converts a location name into coordinates.

Example:

```text
Manzanita, Oregon
```

Becomes:

```json
{
  "lat": 45.7184,
  "lng": -123.9351
}
```

Reverse geocoding does the opposite:

```text
45.7184, -123.9351
```

Becomes:

```text
Manzanita, Tillamook County, Oregon, United States
```

### Geocoded Location Object

```ts
export interface GeoLocation {
  id: string;

  label: string;
  normalizedName: string;

  geometryType: "point" | "line" | "polygon" | "bbox";
  coordinates: number[] | number[][] | number[][][];

  centroid?: {
    lat: number;
    lng: number;
  };

  bbox?: [number, number, number, number]; // minLng, minLat, maxLng, maxLat

  administrativeArea?: {
    city?: string;
    county?: string;
    state?: string;
    country?: string;
  };

  geocoderProvider?: string;
  geocodeConfidence: number; // 0-100
}
```

---

## 9. Step 4 — Spatial Normalization

Different sources express places differently.

One source may say:

```text
near Highway 101
```

Another may say:

```text
US-101 at milepost 43
```

Another may give:

```text
45.72, -123.94
```

Another may provide a polygon.

OSIRIS should normalize these into common spatial forms.

### Supported geometry types

```text
Point     = exact or approximate location
Line      = road, route, river, pipeline, rail segment
Polygon   = affected area, boundary, fire perimeter, flood zone
BBOX      = bounding box for rough area or search extent
```

Use GeoJSON-style geometry whenever possible.

### GeoJSON-like Structure

```ts
export interface GeoGeometry {
  type: "Point" | "LineString" | "Polygon" | "MultiPolygon";
  coordinates: unknown;
}
```

---

## 10. Step 5 — Entity Extraction

Geospatial intelligence is not only about locations. OSIRIS should extract entities connected to locations.

Examples:

```text
person
organization
facility
road
bridge
port
airport
ship
truck route
utility substation
power line
warehouse
school
hospital
weather system
wildfire
earthquake
protest
outage
construction project
```

### Geo Entity Object

```ts
export interface GeoEntity {
  id: string;

  entityType:
    | "person"
    | "organization"
    | "location"
    | "facility"
    | "infrastructure"
    | "transportation"
    | "natural_feature"
    | "weather_system"
    | "hazard"
    | "event"
    | "asset"
    | "route"
    | "region";

  name: string;
  aliases: string[];

  locationIds: string[];
  sourceIds: string[];

  firstSeenAt?: string;
  lastSeenAt?: string;

  confidence: number; // 0-100
}
```

---

## 11. Step 6 — Layer Enrichment

Layer enrichment means adding context from other map layers.

Example signal:

```text
Flood warning near River X
```

Useful enrichment:

```text
near hospitals?
near schools?
inside floodplain?
near power substation?
near evacuation route?
near low-income housing?
near major highway?
near industrial chemical site?
```

### Enrichment Object

```ts
export interface GeoEnrichment {
  id: string;
  locationId: string;

  enrichmentType:
    | "nearby_asset"
    | "within_boundary"
    | "terrain"
    | "weather"
    | "infrastructure"
    | "demographic"
    | "environmental"
    | "transportation"
    | "historical_baseline";

  label: string;
  value: string | number | boolean | Record<string, unknown>;

  distanceMeters?: number;
  sourceIds: string[];
  confidence: number;
}
```

---

## 12. Step 7 — Spatial Relationship Detection

This is where GEOINT starts feeling powerful.

OSIRIS should detect relationships like:

```text
inside
near
overlaps
crosses
intersects
upstream_from
downstream_from
north_of
south_of
within_radius
along_route
same_corridor
adjacent_to
connected_by_road
inside_hazard_zone
near_critical_infrastructure
```

### Spatial Relationship Object

```ts
export interface GeoRelationship {
  id: string;

  fromId: string;
  toId: string;

  relationshipType:
    | "inside"
    | "near"
    | "overlaps"
    | "intersects"
    | "crosses"
    | "adjacent_to"
    | "within_radius"
    | "along_route"
    | "connected_by_route"
    | "upstream_from"
    | "downstream_from"
    | "inside_hazard_zone"
    | "near_critical_infrastructure";

  distanceMeters?: number;
  bearingDegrees?: number;

  sourceIds: string[];
  confidence: number;
}
```

---

## 13. Step 8 — Temporal Correlation

Geospatial intelligence becomes much stronger when it includes time.

OSIRIS should ask:

```text
Did several things happen in the same place within a short period?
Did activity move from one place to another?
Did the event follow a known route?
Did the timing match weather, traffic, holidays, or known schedules?
Did the same place show repeated signals over days or weeks?
```

### Geo Temporal Signal

```ts
export interface GeoTemporalSignal {
  id: string;

  title: string;
  description: string;

  occurredAt?: string;
  detectedAt: string;

  locationIds: string[];
  entityIds: string[];
  sourceIds: string[];

  signalType:
    | "closure"
    | "delay"
    | "hazard"
    | "movement"
    | "crowding"
    | "weather"
    | "imagery_change"
    | "infrastructure_status"
    | "public_report"
    | "official_notice"
    | "anomaly";

  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
}
```

---

## 14. Step 9 — Change Detection

Change detection compares a current state to a previous baseline.

Examples:

```text
new construction
new road closure
new flood extent
new wildfire perimeter
new vessel concentration
new vegetation loss
new traffic bottleneck
new power outage region
new business opening/closure pattern
```

### Change Detection Object

```ts
export interface GeoChangeDetection {
  id: string;

  locationId: string;
  changeType:
    | "new_object"
    | "removed_object"
    | "expanded_area"
    | "reduced_area"
    | "route_change"
    | "land_cover_change"
    | "water_extent_change"
    | "heat_signature_change"
    | "traffic_pattern_change"
    | "infrastructure_status_change";

  baselineSourceId: string;
  comparisonSourceId: string;

  baselineAt: string;
  comparisonAt: string;

  description: string;

  magnitude: number; // normalized 0-100
  confidence: number;
}
```

---

## 15. Step 10 — Geospatial Clustering

A cluster is a group of related signals near each other in space and time.

Example:

```text
traffic delay + road closure + social post + weather alert
```

Could become:

```text
Possible transportation disruption cluster
```

### Cluster Object

```ts
export interface GeoCluster {
  id: string;

  title: string;
  clusterType:
    | "transportation_disruption"
    | "hazard_cluster"
    | "crowd_activity"
    | "infrastructure_disruption"
    | "weather_impact"
    | "supply_chain_geography"
    | "environmental_change"
    | "business_activity"
    | "unknown";

  locationIds: string[];
  signalIds: string[];
  entityIds: string[];
  sourceIds: string[];

  timeWindow: {
    start: string;
    end: string;
  };

  centroid: {
    lat: number;
    lng: number;
  };

  radiusMeters: number;

  summary: string;
  confidence: number;
}
```

---

## 16. Step 11 — Hypothesis Generation

A hypothesis is not a conclusion. It is a possible explanation.

Example cluster:

```text
- road closure
- heavy rainfall
- public reports of standing water
- traffic rerouting
```

Possible hypotheses:

```text
1. Localized flooding
2. Storm drain failure
3. Construction-related closure
4. Traffic accident
5. False cluster from unrelated reports
```

### Geo Hypothesis Object

```ts
export interface GeoHypothesis {
  id: string;
  clusterId: string;

  hypothesis: string;

  supportingSignalIds: string[];
  contradictingSignalIds: string[];
  missingInformation: string[];

  confidence: number; // 0-100

  impactEstimate: {
    affectedArea?: string;
    affectedPopulation?: number;
    affectedAssets?: string[];
    severity: "low" | "medium" | "high" | "critical";
  };

  alternativeExplanations: string[];
}
```

---

## 17. Step 12 — Confidence Scoring

GEOINT confidence should not be based on vibes. OSIRIS should calculate it from measurable factors.

### Recommended confidence factors

| Factor | Meaning |
|---|---|
| Source reliability | Is the source official, known, independent, or unknown? |
| Geocode confidence | How sure are we that the location match is correct? |
| Spatial precision | Exact coordinate vs vague area |
| Source corroboration | Do multiple independent sources support the same pattern? |
| Temporal alignment | Did the signals happen close together in time? |
| Spatial alignment | Did the signals occur close together geographically? |
| Historical baseline | Is this unusual for the location? |
| Contradictions | Are there sources saying something different? |
| Recency | Is the data fresh enough to matter? |

### Example formula

```text
confidence =
  sourceReliability * 0.20 +
  geocodeConfidence * 0.15 +
  spatialPrecision * 0.10 +
  corroboration * 0.20 +
  temporalAlignment * 0.10 +
  spatialAlignment * 0.10 +
  baselineAnomaly * 0.10 -
  contradictionPenalty * 0.15
```

### Confidence labels

```ts
export type ConfidenceLabel =
  | "very_low"
  | "low"
  | "moderate"
  | "high"
  | "very_high";
```

Recommended thresholds:

```text
0-19    very_low
20-39   low
40-59   moderate
60-79   high
80-100  very_high
```

---

## 18. Risk Scoring vs Confidence Scoring

Confidence and risk are not the same.

```text
Confidence = how sure OSIRIS is about the assessment
Risk = how bad it could be if the assessment is true
```

Example:

```text
A low-confidence flood warning near a hospital can still be high-risk.
```

### Risk factors

```text
severity
affected population
critical infrastructure
economic impact
transportation impact
duration
hazard type
proximity to vulnerable assets
speed of escalation
available response options
```

### Risk Object

```ts
export interface GeoRiskAssessment {
  id: string;
  hypothesisId: string;

  riskScore: number; // 0-100
  confidenceScore: number; // 0-100

  severity: "low" | "medium" | "high" | "critical";

  exposedAssets: string[];
  exposedPopulations?: string[];
  likelyImpacts: string[];

  recommendedActions: string[];
}
```

---

## 19. Example GEOINT Analysis

### Raw Signals

```json
[
  {
    "title": "County road alert reports closure near Riverbend Bridge",
    "sourceType": "government_alert",
    "publishedAt": "2026-06-05T08:20:00Z",
    "locationText": "Riverbend Bridge, County Route 12",
    "signalType": "closure"
  },
  {
    "title": "Rain gauge shows 3.2 inches of rain overnight",
    "sourceType": "weather",
    "publishedAt": "2026-06-05T07:45:00Z",
    "locationText": "Riverbend watershed",
    "signalType": "weather"
  },
  {
    "title": "Public reports mention water over roadway near bridge",
    "sourceType": "public_report",
    "publishedAt": "2026-06-05T08:10:00Z",
    "locationText": "near Riverbend Bridge",
    "signalType": "hazard"
  }
]
```

### OSIRIS Interpretation

```text
Possible GEOINT Assessment:
Localized flooding affecting Riverbend Bridge corridor.

Why this surfaced:
- Three independent signals reference the same bridge/watershed area.
- Signals occurred within a 40-minute window.
- Weather data supports a plausible physical cause.
- Public reports align with the official road closure.

Confidence:
High, assuming geocoding is correct.

Risk:
Medium to high depending on bridge importance, detour length, and nearby population.

Alternative explanations:
- Road accident unrelated to flooding
- Planned construction
- Drainage blockage
- Mislocated public reports
```

---

## 20. OSIRIS GEOINT Intelligence Object

A final intelligence object should combine all major pieces.

```ts
export interface GeoIntelligenceAssessment {
  id: string;

  title: string;
  summary: string;

  assessmentType:
    | "possible_event"
    | "confirmed_event"
    | "change_detection"
    | "risk_assessment"
    | "movement_pattern"
    | "infrastructure_exposure"
    | "environmental_hazard"
    | "market_geography"
    | "unknown";

  locationIds: string[];
  entityIds: string[];
  signalIds: string[];
  clusterIds: string[];
  sourceIds: string[];

  geographicScope: {
    centroid?: {
      lat: number;
      lng: number;
    };
    radiusMeters?: number;
    bbox?: [number, number, number, number];
    namedArea?: string;
  };

  timeWindow: {
    start?: string;
    end?: string;
  };

  keyFindings: string[];
  supportingEvidence: string[];
  contradictingEvidence: string[];
  alternativeExplanations: string[];
  missingInformation: string[];

  confidenceScore: number;
  confidenceLabel: ConfidenceLabel;

  riskScore?: number;
  riskLabel?: "low" | "medium" | "high" | "critical";

  recommendedActions: string[];

  createdAt: string;
  updatedAt: string;
}
```

---

## 21. Suggested OSIRIS GEOINT UI Pages

### 21.1 GEOINT Dashboard

Purpose:

```text
Show active geospatial assessments and map clusters.
```

Components:

```text
map
active clusters
risk list
confidence labels
recent signals
source filter
time slider
```

### 21.2 Map Intelligence Page

Purpose:

```text
Interactive map for viewing all signals, clusters, entities, and layers.
```

Features:

```text
layer toggles
event pins
cluster heatmap
source markers
area selection
radius search
timeline scrubber
relationship overlays
```

### 21.3 Location Dossier Page

Purpose:

```text
Explain everything OSIRIS knows about one location.
```

Sections:

```text
summary
map preview
linked entities
recent signals
historical activity
nearby infrastructure
known hazards
source list
confidence notes
```

### 21.4 Cluster Dossier Page

Purpose:

```text
Explain why OSIRIS thinks multiple signals belong together.
```

Sections:

```text
cluster summary
included signals
map extent
timeline
supporting sources
alternative explanations
confidence score breakdown
recommended next steps
```

### 21.5 Layer Manager

Purpose:

```text
Manage map layers and datasets.
```

Layers:

```text
roads
boundaries
weather
hazards
infrastructure
terrain
population
businesses
user-imported data
```

---

## 22. Local-First GEOINT Implementation

For OSIRIS, start simple and local-first.

### Phase 1 — Basic Location Extraction

```text
- Store source items
- Extract location names from text
- Manually resolve locations when uncertain
- Save coordinates
- Display map pins
```

### Phase 2 — GeoJSON and Layers

```text
- Support GeoJSON imports
- Add polygons and lines
- Add layer toggles
- Add basic map filtering
```

### Phase 3 — Proximity and Clustering

```text
- Calculate distance between signals
- Group signals by time window and radius
- Generate cluster cards
- Add confidence scoring
```

### Phase 4 — Dossier Pages

```text
- Build location dossier pages
- Build cluster dossier pages
- Add source attribution
- Add timeline views
```

### Phase 5 — AI-Assisted Analysis

```text
- Let user send structured GEOINT payload to ChatGPT
- Generate hypotheses
- Generate confidence explanation
- Generate alternatives
- Generate recommended next steps
```

### Phase 6 — Advanced GEOINT

```text
- Change detection
- Raster/imagery metadata support
- Elevation/terrain enrichment
- Route analysis
- Hazard exposure scoring
- Offline tile support
```

---

## 23. Recommended Technical Stack for OSIRIS

Since OSIRIS is local-first and web-oriented, a practical stack could be:

```text
React / Next.js / Vite
TypeScript
Zustand
SQLite or DuckDB for local analysis
Supabase optional for sync
Leaflet or MapLibre GL JS for maps
Turf.js for geospatial calculations
GeoJSON for feature storage
RSS/API ingestion modules
Local file import/export
```

### Useful JavaScript libraries

```text
MapLibre GL JS     vector maps
Leaflet            simpler interactive maps
Turf.js            geospatial calculations
FlatGeobuf         efficient spatial data format
geolib             distance calculations
rbush              spatial indexing
martinez-polygon-clipping  polygon operations
topojson           compact topology data
```

---

## 24. AI Chatbot Prompt Pretext

The following prompt is designed to be pasted before a structured GEOINT data payload.

Use it when you want ChatGPT to analyze OSIRIS geospatial data and return possible geographic events, explanations, confidence scores, risk scores, and reasoning.

```text
You are acting as a geospatial intelligence analyst for OSIRIS 2.0.

Your job is to analyze the structured geospatial data I provide and produce explainable, source-attributed geospatial intelligence assessments.

You must not assume facts that are not supported by the provided data. You may generate hypotheses, but you must clearly label them as hypotheses, not confirmed facts.

You must distinguish between:
- confirmed facts
- inferred relationships
- possible hypotheses
- alternative explanations
- missing information
- confidence level
- risk level

Your analysis should focus on:
1. Locations
2. Coordinates
3. Map features
4. Spatial proximity
5. Time windows
6. Movement or route patterns
7. Infrastructure exposure
8. Environmental or terrain context
9. Repeated activity near the same place
10. Clusters of weak signals that may form a stronger assessment

For every possible assessment, include:

- Assessment title
- Assessment type
- Geographic scope
- Time window
- Summary
- Key supporting signals
- Linked entities
- Spatial relationships
- Source references by source ID
- Confidence score from 0-100
- Confidence label: very_low, low, moderate, high, or very_high
- Risk score from 0-100 when applicable
- Risk label: low, medium, high, or critical when applicable
- Explanation of how you reached the conclusion
- Alternative explanations
- Contradicting evidence
- Missing information that would increase or decrease confidence
- Recommended next steps

Confidence scoring rules:
- Increase confidence when multiple independent sources support the same location, time window, and explanation.
- Increase confidence when geocoding precision is high.
- Increase confidence when official or high-reliability sources support the assessment.
- Increase confidence when spatial and temporal clustering is tight.
- Decrease confidence when the location is vague.
- Decrease confidence when sources are low-reliability.
- Decrease confidence when signals may be unrelated.
- Decrease confidence when there are strong alternative explanations.
- Decrease confidence when there is contradicting evidence.

Risk scoring rules:
- Risk is not the same as confidence.
- A low-confidence assessment can still be high-risk if critical infrastructure or vulnerable populations may be affected.
- Risk should consider severity, exposed assets, affected population, geographic spread, speed of escalation, and response difficulty.

Important rules:
- Do not identify private individuals unless the data explicitly and lawfully includes them and they are necessary to the assessment.
- Do not provide instructions for harming, tracking, stalking, or targeting people.
- Do not invent coordinates, source claims, or event details.
- Do not overstate uncertainty.
- Do not turn normal civic activity into a threat claim without evidence.
- Use plain English.
- Be skeptical.
- Explain your logic clearly.

Return the output in this structure:

# Geospatial Intelligence Assessment

## Executive Summary

## Possible Assessments

### Assessment 1: [Title]

**Assessment Type:**  
**Geographic Scope:**  
**Time Window:**  
**Confidence Score:**  
**Confidence Label:**  
**Risk Score:**  
**Risk Label:**  

#### Summary

#### Supporting Signals

#### Spatial Relationships

#### Timeline

#### Linked Entities

#### Source References

#### Reasoning

#### Alternative Explanations

#### Contradicting Evidence

#### Missing Information

#### Recommended Next Steps

## Cluster Map Notes

## Overall Confidence Notes

## Data Quality Issues

## Analyst Cautions

Now analyze the following OSIRIS geospatial data payload:
```

---

## 25. Example Structured Data Payload

Paste this after the prompt pretext.

```json
{
  "project": "OSIRIS 2.0",
  "analysisType": "geospatial_intelligence",
  "createdAt": "2026-06-06T12:00:00Z",
  "sources": [
    {
      "id": "src_001",
      "sourceType": "government_alert",
      "title": "County road closure alert",
      "publisher": "County Transportation Department",
      "publishedAt": "2026-06-06T08:15:00Z",
      "reliabilityScore": 90,
      "accessLevel": "public"
    },
    {
      "id": "src_002",
      "sourceType": "weather",
      "title": "Heavy rainfall report",
      "publisher": "Weather Service",
      "publishedAt": "2026-06-06T07:50:00Z",
      "reliabilityScore": 85,
      "accessLevel": "public"
    },
    {
      "id": "src_003",
      "sourceType": "public_report",
      "title": "Water over roadway report",
      "publisher": "Public community feed",
      "publishedAt": "2026-06-06T08:05:00Z",
      "reliabilityScore": 45,
      "accessLevel": "public"
    }
  ],
  "locations": [
    {
      "id": "loc_001",
      "label": "Riverbend Bridge",
      "normalizedName": "Riverbend Bridge, County Route 12",
      "geometryType": "point",
      "coordinates": [-123.1234, 45.1234],
      "centroid": {
        "lat": 45.1234,
        "lng": -123.1234
      },
      "administrativeArea": {
        "county": "Example County",
        "state": "Oregon",
        "country": "United States"
      },
      "geocodeConfidence": 88
    },
    {
      "id": "loc_002",
      "label": "Riverbend Watershed",
      "normalizedName": "Riverbend Watershed",
      "geometryType": "polygon",
      "coordinates": [],
      "centroid": {
        "lat": 45.125,
        "lng": -123.13
      },
      "geocodeConfidence": 75
    }
  ],
  "entities": [
    {
      "id": "ent_001",
      "entityType": "infrastructure",
      "name": "Riverbend Bridge",
      "aliases": ["County Route 12 Bridge"],
      "locationIds": ["loc_001"],
      "sourceIds": ["src_001"],
      "confidence": 90
    },
    {
      "id": "ent_002",
      "entityType": "hazard",
      "name": "Heavy rainfall",
      "aliases": ["overnight rain"],
      "locationIds": ["loc_002"],
      "sourceIds": ["src_002"],
      "confidence": 85
    }
  ],
  "signals": [
    {
      "id": "sig_001",
      "title": "Road closure near Riverbend Bridge",
      "description": "County alert reports County Route 12 closed near Riverbend Bridge.",
      "occurredAt": "2026-06-06T08:15:00Z",
      "detectedAt": "2026-06-06T08:20:00Z",
      "locationIds": ["loc_001"],
      "entityIds": ["ent_001"],
      "sourceIds": ["src_001"],
      "signalType": "closure",
      "severity": "medium",
      "confidence": 90
    },
    {
      "id": "sig_002",
      "title": "Heavy rainfall in Riverbend Watershed",
      "description": "Weather source reports heavy overnight rainfall in the watershed.",
      "occurredAt": "2026-06-06T07:50:00Z",
      "detectedAt": "2026-06-06T07:55:00Z",
      "locationIds": ["loc_002"],
      "entityIds": ["ent_002"],
      "sourceIds": ["src_002"],
      "signalType": "weather",
      "severity": "medium",
      "confidence": 85
    },
    {
      "id": "sig_003",
      "title": "Public report of water over roadway",
      "description": "A public report states water is over the roadway near Riverbend Bridge.",
      "occurredAt": "2026-06-06T08:05:00Z",
      "detectedAt": "2026-06-06T08:10:00Z",
      "locationIds": ["loc_001"],
      "entityIds": ["ent_001"],
      "sourceIds": ["src_003"],
      "signalType": "hazard",
      "severity": "medium",
      "confidence": 55
    }
  ],
  "relationships": [
    {
      "id": "rel_001",
      "fromId": "loc_001",
      "toId": "loc_002",
      "relationshipType": "inside",
      "sourceIds": ["src_001", "src_002"],
      "confidence": 75
    },
    {
      "id": "rel_002",
      "fromId": "sig_001",
      "toId": "sig_003",
      "relationshipType": "within_radius",
      "distanceMeters": 150,
      "sourceIds": ["src_001", "src_003"],
      "confidence": 85
    }
  ]
}
```

---

## 26. Example AI Output

```text
# Geospatial Intelligence Assessment

## Executive Summary

The provided data supports a high-confidence assessment that a localized roadway disruption is occurring near Riverbend Bridge. The most likely explanation is water-related road impact caused by heavy rainfall in the Riverbend Watershed.

## Possible Assessments

### Assessment 1: Possible localized flooding near Riverbend Bridge

Assessment Type:
environmental_hazard / infrastructure_disruption

Geographic Scope:
Riverbend Bridge and surrounding County Route 12 corridor.

Time Window:
2026-06-06 07:50-08:20 UTC

Confidence Score:
78

Confidence Label:
high

Risk Score:
62

Risk Label:
medium-high

Summary:
Multiple signals indicate a road closure and possible water hazard near Riverbend Bridge. A weather source reports heavy rainfall in the related watershed shortly before the closure and public report.

Supporting Signals:
- sig_001: County road closure near Riverbend Bridge
- sig_002: Heavy rainfall in Riverbend Watershed
- sig_003: Public report of water over roadway

Spatial Relationships:
- Riverbend Bridge is inside or associated with the Riverbend Watershed.
- Road closure and public water-over-roadway report are within 150 meters.

Reasoning:
The assessment is supported by an official road closure, a weather event in the same watershed, and a public report describing water over the roadway. The timing is tight and the locations are spatially aligned.

Alternative Explanations:
- Crash-related closure
- Construction-related closure
- Drainage issue unrelated to watershed rainfall
- Incorrect public report location

Missing Information:
- Official reason for road closure
- River gauge levels
- Photos or field confirmation
- Detour route impact
- Bridge structural status

Recommended Next Steps:
- Check official closure reason
- Pull river gauge or flood warning data
- Monitor road reopening notices
- Map nearby critical facilities and detours
```

---

## 27. Safety, Privacy, and Ethics Guardrails

GEOINT can become creepy or dangerous if handled irresponsibly.

OSIRIS should avoid:

```text
tracking private individuals
doxxing
stalking
target selection
real-time personal movement monitoring
identifying homes of private people
collecting private location data without consent
turning protest/civic activity into threat claims without evidence
```

OSIRIS should prefer:

```text
public data
aggregated data
official alerts
licensed datasets
user-owned datasets
privacy-preserving analysis
clear confidence labels
source attribution
alternative explanations
human review
```

### Important rule

Just because something is on a map does not mean OSIRIS should analyze it.

The system should be built around useful, ethical intelligence synthesis — not surveillance cosplay with a dark mode UI.

---

## 28. Common GEOINT Failure Modes

| Failure Mode | Description | Fix |
|---|---|---|
| Wrong geocode | System maps a place to the wrong city or state | Use admin context and confidence scoring |
| Vague location | “near downtown” is treated as exact | Store uncertainty radius |
| False cluster | Unrelated events happen near each other | Require temporal and source support |
| Overconfidence | System treats weak evidence as confirmed | Use confidence labels and alternatives |
| Missing baseline | No idea what is normal for the location | Build historical comparison |
| Source bias | Only sees sources from one platform or agency | Diversify data |
| Privacy violation | Tracks individuals unnecessarily | Aggregate and minimize personal data |
| Map bias | Map display makes uncertain data look precise | Visualize uncertainty radius |

---

## 29. How OSIRIS Should Explain GEOINT Conclusions

Each conclusion should answer:

```text
What are we saying?
Where is it happening?
When did it happen?
What data supports it?
What data contradicts it?
How close are the signals?
How reliable are the sources?
How precise are the locations?
What else could explain it?
What would increase confidence?
What should the user do next?
```

A good OSIRIS output does not say:

```text
Flood confirmed.
```

It says:

```text
Possible localized flooding near Riverbend Bridge.

Confidence is high because an official road closure, heavy rainfall report, and public water-over-roadway report overlap in the same location and time window.

However, the closure reason is not directly confirmed, so construction or crash-related explanations remain possible.
```

That is the difference between intelligence and guesswork.

---

## 30. Public Reference Sources

These are useful public references for understanding GEOINT, GIS, remote sensing, and geospatial data standards.

- National Geospatial-Intelligence Agency — About NGA and GEOINT  
  https://www.nga.mil/about/About_Us.html

- National Geospatial-Intelligence Agency — GEOINT Basic Doctrine Publication 1.0  
  https://www.nga.mil/resources/GEOINT_Basic_Doctrine_Publication_10_.html

- U.S. Intelligence Careers — NGA / GEOINT description  
  https://www.intelligencecareers.gov/nga/about-nga

- U.S. Geological Survey — The National Map GIS Data Download  
  https://www.usgs.gov/the-national-map-data-delivery/gis-data-download

- U.S. Geological Survey — Geospatial Data  
  https://www.usgs.gov/geospatial-data

- U.S. Geological Survey — Remote Sensing  
  https://www.usgs.gov/programs/ecosystems-land-change-science-program/science/science-topics/remote-sensing

- NASA Earthdata  
  https://www.earthdata.nasa.gov/

- NASA Earthdata Search  
  https://search.earthdata.nasa.gov/

- NASA Earthdata GIS  
  https://gis.earthdata.nasa.gov/portal/home/

- Open Geospatial Consortium — Standards  
  https://www.ogc.org/standards/

- Open Geospatial Consortium — WMS Standard  
  https://www.ogc.org/standards/wms/

- Open Geospatial Consortium — OGC API Standards  
  https://ogcapi.ogc.org/

- Esri — What is GIS?  
  https://www.esri.com/en-us/what-is-gis/overview

---

## 31. Final OSIRIS Framing

GEOINT should be one of OSIRIS 2.0’s major intelligence pillars.

The clean framing:

```text
OSIRIS Geospatial Intelligence turns disconnected location-based data into explainable map-centered assessments.

It links sources, places, entities, events, layers, movement, terrain, infrastructure, and time into confidence-rated geospatial intelligence objects.
```

The practical goal:

```text
Do not just show dots on a map.

Explain why those dots matter.
```

That is the entire sauce.
