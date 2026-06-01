# OSIRIS 2.0 Full-Fledged Multi-Page Intelligence Workspace Game Plan

## Purpose

This document defines a full build plan for evolving OSIRIS from a primarily map-centered interface into a multi-page intelligence workspace.

The goal is **not** to create a marketing website.

The goal is to create an operator-style application where the map is one major view, but not the entire product. OSIRIS should become a structured intelligence console that lets a user move from broad situational awareness into deeper evidence-backed analysis.

The ideal flow:

```text
Map / Feed / Signals
        ↓
Compact event card
        ↓
Expanded event preview
        ↓
Full event dossier
        ↓
Sources, timeline, locations, entities, signals, and confidence
```

OSIRIS should feel like:

```text
A lightweight open-source intelligence dashboard
A global event monitoring workspace
A source-attributed situational awareness tool
A pattern-detection system that does not require paid AI usage
```

OSIRIS should **not** feel like:

```text
A landing page
A news blog
A fake military dashboard
A decorative map with cool pins but no deeper workflow
A product that pretends to know more than its sources support
```

---

# Core Product Direction

## Current Problem

The app currently appears to be heavily centered around one main command-center/map view.

That is a strong starting point, but it creates several limitations:

- The map can show where things are happening, but not always why they matter.
- Important context gets squeezed into small panels.
- Source attribution is hard to inspect deeply.
- Users cannot easily follow one event from first detection to evidence trail.
- Feed items, watch conditions, and source data do not yet feel like long-lived intelligence objects.
- The system can feel like it is “missing events” because users cannot see what sources are active, what filters are applied, or what data failed to load.

## New Direction

OSIRIS should become a **multi-page intelligence workspace**.

The map remains important, but it becomes one surface inside a larger application.

The main pages should be:

```text
/map
/feed
/events/[eventId]
/signals
/sources
/topics
/topics/[topicSlug]
/entities
/entities/[entitySlug]
/regions
/regions/[regionSlug]
/search
/settings
```

The core idea:

```text
Map = where things are happening
Feed = what is happening
Event Dossier = why it matters and what supports it
Signals = what patterns are emerging
Sources = where data came from and whether ingestion is healthy
Topics = repeated subjects across events
Entities = people, organizations, countries, groups, systems, platforms
Regions = geographic intelligence pages
Search = cross-app investigation
Settings = source/layer/display preferences
```

---

# Product Principles

## 1. Source-First Intelligence

Every claim should trace back to a source.

OSIRIS should prefer this:

```text
This event has 5 sources. Three mention drone activity. Two mention airspace restrictions. One includes an official statement.
```

Over this:

```text
OSIRIS believes this is a major escalation.
```

The user should always be able to inspect:

- Raw source title
- Source publisher
- Source URL
- Published time
- Pulled time
- Snippet or summary
- Extracted locations
- Extracted keywords
- Why OSIRIS grouped it into an event

## 2. Derived Intelligence Without Expensive AI

OSIRIS should not depend on paid AI calls for the core workflow.

Instead, use cheap deterministic logic:

```text
Keyword frequency
Entity extraction using dictionaries/rules
Location matching
Time clustering
Source overlap
Tag co-occurrence
Severity scoring
Confidence scoring
Trend detection
Duplicate detection
Topic clustering
```

This keeps the system affordable and predictable.

## 3. Honest Confidence

OSIRIS should show confidence clearly.

Example:

```text
Confidence: Moderate

Reason:
- 4 sources describe the same location and event type.
- 2 sources mention official statements.
- 1 source has conflicting casualty details.
- No primary document has been found yet.
```

Confidence should never be decorative. It should be computed from evidence.

## 4. No Fake Certainty

When sources disagree, the UI should show that.

Example:

```text
Disputed details:
- Casualty count differs between sources.
- One source says drone debris; another says explosion.
- No official confirmation found.
```

This is a trust feature, not a weakness.

## 5. Operator UX, Not Marketing UX

OSIRIS should feel like a tool.

Use language like:

```text
Signals
Sources
Evidence
Confidence
Watch Conditions
Dossier
Timeline
Related Events
Source Health
```

Avoid language like:

```text
Discover insights
Unlock intelligence
The future of awareness
```

No brochure-core nonsense. Keep it sharp.

---

# Target Navigation Structure

## Top-Level App Navigation

Recommended main nav:

```text
Map
Feed
Signals
Sources
Search
```

Secondary nav or drawer:

```text
Topics
Entities
Regions
Settings
```

## Route Structure

```text
/
  Redirect to /map or /feed depending on user preference

/map
  Main geospatial command view

/feed
  Full event stream and watch feed

/events/[eventId]
  Full event dossier

/signals
  Derived watch conditions and emerging clusters

/sources
  Source ingestion health and source catalog

/topics
  Topic index

/topics/[topicSlug]
  Topic-specific intelligence page

/entities
  Entity index

/entities/[entitySlug]
  Entity-specific intelligence page

/regions
  Region index

/regions/[regionSlug]
  Region-specific intelligence page

/search
  Global search across events, sources, topics, entities, and regions

/settings
  Display, source, refresh, and workspace preferences
```

---

# Page 1: Map View

## Route

```text
/map
```

## Purpose

The map is the real-time spatial awareness view.

It answers:

```text
Where are events happening?
What layers are active?
What regions are heating up?
What incidents are near each other?
What should I look at first?
```

## Primary Features

### Map Layers

Recommended layers:

```text
Global incidents
Conflict events
Protests / civil unrest
Natural disasters
Earthquakes
Weather alerts
Maritime risk
Aviation / airspace
Cyber incidents
Infrastructure disruption
Supply chain disruption
Disease / public health
Space weather
Radiation / nuclear monitoring
Markets / commodities
```

### Layer Controls

Each layer should have:

```text
Enabled / disabled
Last updated timestamp
Source count
Item count
Error state
Refresh button
Confidence threshold
Severity threshold
```

### Map Pins

Pins should represent normalized `OsirisEvent` objects, not random one-off API objects.

Each pin should show:

```text
Event title
Severity
Confidence
Primary location
Last updated
Source count
Tags
```

### Pin Click Preview

Clicking a pin should open a preview panel.

Preview panel should include:

```text
Title
Short summary
Severity
Confidence
Source count
Evidence count
Timeline sparkline
Top locations
Top tags
Open Dossier button
Related Events button
```

### Map Heat Zones

Add optional heat zones based on:

```text
Number of events in region
Severity-weighted event count
Recent acceleration
Multiple event categories overlapping
```

Example:

```text
Red Sea Risk Zone
7 maritime-related events
3 high-confidence source clusters
2 supply-chain mentions
Updated 14 min ago
```

## Map View Should Not Do Everything

The map should not become a cramped dashboard junk drawer.

If something requires deep reading, route the user to:

```text
/events/[eventId]
/signals
/sources
/regions/[regionSlug]
```

---

# Page 2: Full Intel Feed

## Route

```text
/feed
```

## Purpose

The feed is the main “what is happening?” page.

It should collect normalized events, source items, and derived watch conditions into a clean stream.

## Feed Modes

The feed should support multiple modes:

```text
All Events
High Watch
Breaking / Newly Detected
Updated Events
Source Items
Signals
Regional
Saved / Followed
```

## Feed Card Structure

Each feed card should show:

```text
Severity badge
Confidence badge
Event title
One-sentence TLDR
Primary location
Time detected
Last updated
Source count
Evidence count
Tags
Related entities
Expand button
Open Dossier button
```

Example:

```text
HIGH WATCH

Romania drone debris / NATO airspace concern

TLDR:
Multiple sources report drone-related debris near Romania's border region, with NATO/security language appearing in coverage.

Location:
Romania / Black Sea region

Evidence:
5 sources · 8 evidence items · Updated 22 min ago

Tags:
drone, NATO, airspace, Russia, border
```

## Expanded Feed Card

When expanded, the card should reveal:

```text
Why this was grouped
Key evidence
Top source titles
Extracted locations
Extracted entities
Related events
Watch next
Open Dossier button
```

Example:

```text
Why OSIRIS grouped this:
- 4 items mention Romania.
- 3 items mention drone or UAV.
- 2 items mention NATO or airspace.
- All items appeared within a 6-hour window.

Watch next:
- Official Romanian defense statement
- NATO response
- Airspace restriction updates
- Nearby Black Sea maritime activity
```

## Feed Filters

Filters should include:

```text
Severity
Confidence
Region
Country
Event category
Source
Time range
Tag
Entity
Has official source
Has conflicting reports
Has map location
Has timeline
```

## Sorting

Sort options:

```text
Newest detected
Recently updated
Highest severity
Highest confidence
Most sources
Most evidence
Most related events
Fastest growing
```

## Feed Search

The feed should support quick search:

```text
romania drone
red sea shipping
gps jamming
earthquake japan
port closure
nato article 4
```

## Feed Refresh Model

The feed should have:

```text
Manual refresh
Auto refresh toggle
Last refreshed timestamp
New item banner
Source error warning
```

Example:

```text
12 new events detected since 10:42 AM
Review updates
```

---

# Page 3: Event Dossier

## Route

```text
/events/[eventId]
```

## Purpose

The event dossier is the deep-dive page for a single normalized event.

It answers:

```text
What happened?
Where did it happen?
When did it start?
How has it changed?
What sources support it?
What is uncertain?
What is related?
What should be watched next?
```

## Dossier Page Layout

Recommended sections:

```text
Header
Executive TLDR
Confidence and Severity Panel
Timeline
Source Evidence
Locations
Entities
Topics / Tags
Derived Signals
Word Cloud / Keyword Cloud
Related Events
Contradictions / Uncertainty
Raw Data
```

## Header

The header should include:

```text
Event title
Severity
Confidence
Primary region
First seen
Last updated
Source count
Evidence count
Open map location button
Save / follow button
```

Example:

```text
Romania drone debris / NATO airspace concern

Severity: High Watch
Confidence: Moderate
Region: Eastern Europe / Black Sea
First Seen: 2026-05-31 08:14
Last Updated: 2026-05-31 10:42
Sources: 5
Evidence Items: 8
```

## Executive TLDR

This should be rule-generated, not AI-generated.

Possible template:

```text
OSIRIS grouped {sourceCount} source items into this event because they share overlapping references to {locations}, {eventTypes}, and {entities}. The strongest recurring terms are {topKeywords}. Current confidence is {confidence} because {confidenceReasons}.
```

Example:

```text
OSIRIS grouped 5 source items into this event because they share overlapping references to Romania, drone activity, NATO/security language, and Black Sea regional context. Current confidence is Moderate because multiple sources agree on the broad event type and location, but official confirmation is limited.
```

## Confidence Panel

Show:

```text
Confidence level
Confidence score
Reasons confidence increased
Reasons confidence decreased
Missing evidence
Conflicting details
```

Possible scoring inputs:

```text
+ Multiple independent sources
+ Official source found
+ Same location repeated
+ Same event type repeated
+ Sources published close together
+ Reliable source weighting
- Conflicting casualty count
- Unclear location
- Only one source
- Source summaries are vague
- No primary source
```

## Severity Panel

Severity should be separate from confidence.

An event can be:

```text
High severity / low confidence
Low severity / high confidence
```

Severity scoring inputs:

```text
Casualties
Military involvement
Civil unrest scale
Infrastructure impact
Economic impact
Nuclear/radiation relevance
Aviation disruption
Maritime disruption
Cyber impact
Disease spread
Natural disaster magnitude
Government response
Cross-border implications
```

## Timeline

The timeline should include:

```text
First source seen
Each source publication time
Major update points
Changes in severity
Changes in confidence
New locations added
New entities added
```

Example:

```text
08:14 - First RSS item detected from BBC
08:22 - Al Jazeera item matched Romania + drone terms
08:47 - NYT item matched NATO + airspace terms
09:12 - Confidence raised from Low to Moderate
10:42 - Related maritime event added to cluster
```

## Evidence Table

Columns:

```text
Source
Title
Published
Pulled
Matched Terms
Matched Locations
Matched Entities
Reliability Weight
Open Link
```

## Source Evidence Cards

Each source card should show:

```text
Publisher
Title
URL
Published timestamp
Pulled timestamp
Snippet
Matched keywords
Matched locations
Matched entities
Why it was included
```

## Locations Section

Show:

```text
Primary location
Secondary locations
Inferred region
Coordinates
Map preview
Nearby events
```

Important: clearly distinguish between:

```text
Exact location
Approximate location
Mentioned location
Region-level match
```

Example:

```text
Romania
Match Type: Mentioned country
Coordinate Precision: Country centroid
Confidence: Medium
```

## Entities Section

Entities can include:

```text
Countries
Governments
Military groups
Companies
NGOs
Agencies
People
Infrastructure
Ships
Airports
Ports
Systems
```

Each entity should link to:

```text
/entities/[entitySlug]
```

## Topics / Tags Section

Tags can include:

```text
drone
airspace
NATO
maritime
cyber
election
sanctions
earthquake
blackout
supply-chain
```

Each topic should link to:

```text
/topics/[topicSlug]
```

## Word Cloud / Keyword Cloud

This should be generated locally from source titles/snippets.

Inputs:

```text
Source titles
Source descriptions
Matched keywords
Entity names
Location names
Tags
```

Filtering:

```text
Remove stopwords
Remove publisher names
Remove generic words
Normalize plurals where reasonable
Lowercase terms
Merge simple synonyms where safe
```

Example output:

```text
drone
romania
airspace
nato
black sea
russia
border
debris
defense
```

This can be rendered as:

```text
Weighted chips
Word cloud
Term frequency list
Co-occurrence graph
```

Recommendation: start with weighted chips before fancy word-cloud rendering.

## Related Events

Related events should be generated from:

```text
Shared location
Shared entities
Shared tags
Similar time window
Same event category
Source overlap
Keyword overlap
```

Example:

```text
Related:
- Black Sea maritime warning
- Ukraine border strike cluster
- NATO eastern flank air policing update
```

## Contradictions / Uncertainty

This is a high-trust section.

Show:

```text
Conflicting casualty numbers
Conflicting location details
Unconfirmed claims
Single-source claims
Source language differences
Missing official statement
```

Example:

```text
Uncertainty:
- Only one source directly mentions NATO response.
- Location is country-level, not exact coordinates.
- No primary government statement found in current source set.
```

## Raw Data Section

Expandable developer/operator section:

```json
{
  "eventId": "evt_20260531_romania_drone_cluster",
  "sourceIds": [],
  "tags": [],
  "entities": [],
  "locations": [],
  "confidenceScore": 0.62,
  "severityScore": 0.71
}
```

---

# Page 4: Signals

## Route

```text
/signals
```

## Purpose

Signals are derived patterns across multiple events.

They answer:

```text
What patterns are emerging?
What is heating up?
What should be watched?
What looks connected?
```

## Signal Types

Recommended signal categories:

```text
Kinetic conflict signal
Civil unrest signal
Cyber disruption signal
Infrastructure disruption signal
Maritime chokepoint signal
Aviation / airspace signal
Disease outbreak signal
Natural disaster signal
Economic shock signal
Supply chain signal
Energy disruption signal
Election instability signal
Information operations signal
Nuclear / radiation signal
Space weather signal
```

## Signal Card

Each signal card should show:

```text
Signal name
Severity
Confidence
Region
Event count
Source count
Time window
Why it triggered
Related events
Top keywords
Watch next
```

Example:

```text
Maritime Chokepoint Signal

Region:
Red Sea / Gulf of Aden

Triggered because:
- 6 maritime-related events appeared in 12 hours.
- 4 mention shipping disruption.
- 3 mention missile/drone risk.
- Oil and shipping terms increased above normal baseline.

Related:
- Vessel rerouting item
- Port delay item
- Regional missile report
```

## Signal Generation Logic

Signals should be rule-generated.

Example:

```ts
if (
  eventsInRegion >= 5 &&
  sharedTags.includes("maritime") &&
  sharedTags.includes("disruption") &&
  timeWindowHours <= 24
) {
  createSignal("Maritime Chokepoint Signal");
}
```

## Signal Statuses

Signals should have lifecycle states:

```text
New
Watching
Escalating
Cooling
Resolved
Archived
```

## Signal Page Filters

```text
Signal type
Region
Severity
Confidence
Time window
Status
Has related events
Has official source
```

---

# Page 5: Sources

## Route

```text
/sources
```

## Purpose

The sources page explains what OSIRIS is actually ingesting.

This is essential because users will ask:

```text
Why is OSIRIS missing this event?
Where did this information come from?
Is this source down?
When was this source last checked?
```

## Source Health Dashboard

Show source cards:

```text
Source name
Source type
Status
Last successful pull
Last attempted pull
Items returned
Items accepted
Items rejected
Error message
Average response time
```

Example:

```text
BBC World RSS

Status: Online
Last Pull: 2 min ago
Returned: 18
Accepted: 5
Rejected: 13
Reason rejected:
- No matched location: 7
- No matched event keyword: 4
- Duplicate: 2
```

## Source Types

```text
RSS
JSON API
CSV
Static file
Manual source
Government feed
Weather feed
Earthquake feed
Market feed
Aviation feed
Maritime feed
Cyber feed
```

## Source Detail Page

Optional route:

```text
/sources/[sourceSlug]
```

Should show:

```text
Source metadata
Recent pulls
Recent accepted items
Recent rejected items
Error history
Mapping rules
Keyword coverage
Location coverage
```

## Source Diagnostics

This is where the app should show why items are missing.

Examples:

```text
Rejected because no known location was matched.
Rejected because no event keyword was matched.
Rejected because it duplicated an existing source item.
Rejected because source timestamp was too old.
Rejected because category is disabled.
```

This is a killer feature for debugging.

## Source Catalog

Recommended initial source categories:

```text
General World News RSS
Government / Official Statements
Disaster and Earthquake APIs
Weather and Storm Feeds
Cybersecurity Advisories
Maritime / Port / Shipping Sources
Aviation / Airspace Sources
Market / Commodity Sources
Public Health Sources
Space Weather Sources
```

---

# Page 6: Topics

## Routes

```text
/topics
/topics/[topicSlug]
```

## Purpose

Topics are recurring concepts across events.

Examples:

```text
drone
gps-jamming
airspace
red-sea
nato
blackout
earthquake
cyberattack
port-closure
sanctions
election-unrest
```

## Topic Index

The topic index should show:

```text
Topic name
Active event count
Recent trend
Severity average
Regions involved
Top entities
Last updated
```

## Topic Detail Page

Each topic page should show:

```text
Topic overview
Active events
Related signals
Top regions
Top entities
Source coverage
Term frequency
Timeline
```

Example:

```text
/topics/gps-jamming
```

Sections:

```text
Active GPS jamming events
Regions with repeated mentions
Aviation/maritime overlaps
Related entities
Source evidence
Timeline
Related topics
```

## Topic Generation

Topics can be generated from:

```text
Matched keywords
Manual dictionary
Tags
Entity co-occurrence
Repeated terms across events
```

---

# Page 7: Entities

## Routes

```text
/entities
/entities/[entitySlug]
```

## Purpose

Entities are named things that appear across events.

Examples:

```text
NATO
Russia
Romania
Houthis
NOAA
USGS
Red Sea
Black Sea
Microsoft
Cloudflare
Ukraine
Taiwan
```

## Entity Types

```text
Country
Government
Organization
Military group
Company
Person
Region
Port
Airport
Infrastructure
Agency
System
Unknown
```

## Entity Index

Show:

```text
Entity name
Entity type
Active event count
Related regions
Related topics
Last mentioned
```

## Entity Detail Page

Show:

```text
Entity summary
Active events
Historical events
Related entities
Related topics
Mention timeline
Top sources
Regions
Confidence notes
```

## Entity Extraction Without AI

Use:

```text
Manual dictionaries
Known country list
Known organization list
Known agency list
Capitalized phrase matching
Source metadata
Tag mappings
```

Avoid pretending every capitalized phrase is a real entity.

Use entity statuses:

```text
Confirmed
Likely
Candidate
Ignored
```

---

# Page 8: Regions

## Routes

```text
/regions
/regions/[regionSlug]
```

## Purpose

Regions collect events spatially.

Examples:

```text
Eastern Europe
Black Sea
Red Sea
Middle East
South China Sea
Pacific Northwest
Horn of Africa
Sahel
Caribbean
Arctic
```

## Region Page Sections

```text
Region overview
Current severity
Active events
Active signals
Top topics
Top entities
Timeline
Map view
Source coverage
Nearby regions
```

## Region Risk Score

Generate a regional score from:

```text
Event count
Severity-weighted event count
Recent acceleration
Number of categories active
Source diversity
Confidence average
Infrastructure relevance
Cross-border relevance
```

Example:

```text
Black Sea Region

Risk: Elevated
Reason:
- 9 active events in 24 hours
- 4 maritime or airspace related
- 3 involve NATO/Russia tags
- 6 independent sources
```

---

# Page 9: Search

## Route

```text
/search
```

## Purpose

Global search across OSIRIS data.

Search should cover:

```text
Events
Source items
Signals
Topics
Entities
Regions
Locations
Tags
```

## Search Result Types

Each result should clearly show its type:

```text
Event
Signal
Topic
Entity
Region
Source Item
```

## Search Filters

```text
Type
Date range
Source
Region
Severity
Confidence
Tag
Entity
Has map location
Has source URL
```

## Search Queries

Example queries:

```text
romania drone nato
red sea shipping
cyberattack hospital
earthquake japan
gps jamming aviation
port closure panama
```

---

# Page 10: Settings

## Route

```text
/settings
```

## Purpose

Settings should control workspace behavior, not marketing preferences.

## Settings Sections

```text
Display
Map
Feed
Sources
Refresh
Severity Scoring
Confidence Scoring
Storage
Developer Diagnostics
```

## Useful Settings

```text
Default landing page: Map / Feed / Signals
Auto refresh interval
Default severity threshold
Default confidence threshold
Enabled source categories
Enabled map layers
Compact feed cards
Show raw source snippets
Show rejected source items
Show debug scoring details
```

---

# Data Model

## Normalized Event

```ts
export type OsirisEvent = {
  id: string;
  slug: string;
  title: string;
  tldr: string;
  description?: string;

  category: OsirisEventCategory;
  severity: OsirisSeverity;
  severityScore: number;

  confidence: OsirisConfidence;
  confidenceScore: number;
  confidenceReasons: string[];
  confidenceWarnings: string[];

  firstSeenAt: string;
  lastSeenAt: string;
  updatedAt: string;

  primaryLocation?: OsirisLocation;
  locations: OsirisLocation[];

  sourceIds: string[];
  sources: OsirisSourceItem[];

  evidence: OsirisEvidenceItem[];

  tags: string[];
  entities: OsirisEntityRef[];
  topics: OsirisTopicRef[];

  relatedEventIds: string[];

  generatedFrom: OsirisGenerationSource[];
  status: "new" | "watching" | "updated" | "cooling" | "resolved" | "archived";

  raw?: unknown;
};
```

## Source Item

```ts
export type OsirisSourceItem = {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: "rss" | "api" | "manual" | "static" | "government" | "other";

  title: string;
  url?: string;
  publisher?: string;
  author?: string;

  publishedAt?: string;
  pulledAt: string;

  summary?: string;
  rawText?: string;

  matchedKeywords: string[];
  matchedLocations: OsirisLocation[];
  matchedEntities: OsirisEntityRef[];
  matchedTopics: OsirisTopicRef[];

  accepted: boolean;
  rejectionReasons?: string[];

  reliabilityWeight: number;

  raw?: unknown;
};
```

## Evidence Item

```ts
export type OsirisEvidenceItem = {
  id: string;
  eventId: string;
  sourceItemId: string;

  evidenceType:
    | "title-match"
    | "summary-match"
    | "location-match"
    | "entity-match"
    | "keyword-match"
    | "official-source"
    | "time-cluster"
    | "source-overlap"
    | "manual-note";

  label: string;
  detail: string;
  weight: number;
};
```

## Location

```ts
export type OsirisLocation = {
  id: string;
  name: string;
  slug: string;

  type:
    | "country"
    | "region"
    | "city"
    | "coordinate"
    | "infrastructure"
    | "maritime-zone"
    | "unknown";

  lat?: number;
  lng?: number;

  precision:
    | "exact"
    | "approximate"
    | "city"
    | "country"
    | "region"
    | "mentioned-only";

  confidence: OsirisConfidence;
};
```

## Entity

```ts
export type OsirisEntity = {
  id: string;
  slug: string;
  name: string;

  type:
    | "country"
    | "government"
    | "organization"
    | "company"
    | "person"
    | "military"
    | "agency"
    | "infrastructure"
    | "system"
    | "unknown";

  aliases: string[];
  description?: string;

  status: "confirmed" | "likely" | "candidate" | "ignored";

  relatedEntityIds: string[];
  relatedTopicIds: string[];
};
```

## Topic

```ts
export type OsirisTopic = {
  id: string;
  slug: string;
  name: string;

  aliases: string[];
  keywords: string[];

  category:
    | "conflict"
    | "civil-unrest"
    | "cyber"
    | "weather"
    | "disaster"
    | "health"
    | "market"
    | "infrastructure"
    | "maritime"
    | "aviation"
    | "supply-chain"
    | "political"
    | "other";

  activeEventCount: number;
  lastSeenAt?: string;
};
```

## Signal

```ts
export type OsirisSignal = {
  id: string;
  slug: string;

  name: string;
  description: string;

  signalType:
    | "kinetic-conflict"
    | "civil-unrest"
    | "cyber-disruption"
    | "infrastructure-disruption"
    | "maritime-chokepoint"
    | "aviation-airspace"
    | "disease-outbreak"
    | "natural-disaster"
    | "economic-shock"
    | "supply-chain"
    | "energy-disruption"
    | "election-instability"
    | "information-operations"
    | "nuclear-radiation"
    | "space-weather";

  severity: OsirisSeverity;
  severityScore: number;

  confidence: OsirisConfidence;
  confidenceScore: number;

  status: "new" | "watching" | "escalating" | "cooling" | "resolved" | "archived";

  regionIds: string[];
  eventIds: string[];
  sourceItemIds: string[];

  triggeredBy: string[];
  watchNext: string[];

  createdAt: string;
  updatedAt: string;
};
```

## Shared Types

```ts
export type OsirisSeverity =
  | "low"
  | "watch"
  | "elevated"
  | "high"
  | "critical";

export type OsirisConfidence =
  | "low"
  | "moderate"
  | "high";

export type OsirisGenerationSource =
  | "rss"
  | "api"
  | "manual-rule"
  | "gdelt"
  | "static"
  | "mixed";

export type OsirisEventCategory =
  | "conflict"
  | "civil-unrest"
  | "cyber"
  | "weather"
  | "disaster"
  | "health"
  | "market"
  | "infrastructure"
  | "maritime"
  | "aviation"
  | "supply-chain"
  | "political"
  | "other";
```

---

# Ingestion Pipeline

## Current Issue To Fix

The current global event pipeline appears too narrow.

The likely current funnel:

```text
Small number of feeds
        ↓
Hardcoded keyword match
        ↓
Hardcoded location match
        ↓
Map event created
```

This misses important events when:

```text
The source is not included
The event uses different wording
The location is missing from the dictionary
The event is important but not conflict-oriented
The source feed does not return the story
The app only fetches once per session
```

## Target Pipeline

The new pipeline should be:

```text
Fetch source items
        ↓
Normalize source item
        ↓
Extract locations
        ↓
Extract entities
        ↓
Extract topics/tags
        ↓
Score relevance
        ↓
Accept/reject with reasons
        ↓
Deduplicate
        ↓
Cluster into events
        ↓
Score severity
        ↓
Score confidence
        ↓
Generate signals
        ↓
Expose to map/feed/dossiers
```

## Pipeline Stages

### 1. Source Fetching

Each source fetcher should return a consistent shape.

```ts
type SourceFetchResult = {
  sourceId: string;
  pulledAt: string;
  ok: boolean;
  error?: string;
  items: RawSourceItem[];
};
```

### 2. Normalization

Normalize everything into `OsirisSourceItem`.

Fields:

```text
id
sourceId
sourceName
sourceType
title
url
publisher
publishedAt
pulledAt
summary
rawText
raw
```

### 3. Extraction

Extract:

```text
keywords
locations
entities
topics
event category
time references
```

### 4. Acceptance Rules

Source item is accepted if it has at least:

```text
A relevant topic or keyword
A location or entity
A reasonable timestamp
A non-duplicate URL/title
```

Rejected items should be stored or logged with reasons.

### 5. Deduplication

Deduplicate by:

```text
Canonical URL
Title similarity
Source + published timestamp
Similar title + same publisher
Same event keywords + same location + close time window
```

### 6. Event Clustering

Cluster source items into events using:

```text
Same/similar location
Same/similar keywords
Same/similar entities
Same event category
Close publication window
Source overlap
```

### 7. Scoring

Generate:

```text
Severity score
Confidence score
Source diversity score
Freshness score
Location precision score
```

### 8. Signal Generation

Generate signals across events.

Inputs:

```text
Events
Regions
Topics
Entities
Time windows
Severity changes
Frequency spikes
```

---

# Source Expansion Plan

## Source Categories To Add

### General World News

Potential source types:

```text
RSS feeds
Public JSON feeds
Publisher topic feeds
```

Possible categories:

```text
BBC World
Al Jazeera
NYT World
The Guardian World
NPR World
DW
France24
RFI
UN News
ReliefWeb
```

### Disaster / Earthquake

```text
USGS earthquakes
NOAA alerts
National Hurricane Center
GDACS if usable
ReliefWeb disasters
```

### Weather / Storms

```text
NOAA
NHC
National weather feeds
Open-Meteo where useful
```

### Cybersecurity

```text
CISA advisories
NVD CVE feeds
Vendor security advisories
Known exploited vulnerabilities catalog
```

### Maritime / Supply Chain

```text
Port authority notices
Maritime advisories
Shipping disruption public feeds
Chokepoint-specific sources
```

### Aviation / Airspace

```text
FAA notices
Eurocontrol public updates
Airspace closure public notices
Aviation incident feeds where legally usable
```

### Public Health

```text
WHO
CDC
ECDC
Public outbreak feeds
ReliefWeb health-related updates
```

### Space Weather

```text
NOAA SWPC
NASA public feeds
```

## Source Config Model

```ts
export type OsirisSourceConfig = {
  id: string;
  name: string;
  slug: string;

  enabled: boolean;

  type: "rss" | "json" | "csv" | "manual" | "static";

  category:
    | "world-news"
    | "disaster"
    | "weather"
    | "cyber"
    | "maritime"
    | "aviation"
    | "health"
    | "markets"
    | "space-weather"
    | "other";

  url: string;

  refreshIntervalMinutes: number;

  reliabilityWeight: number;

  parser: string;

  termsOfUseNote?: string;

  lastPullAt?: string;
  lastSuccessAt?: string;
  lastError?: string;
};
```

---

# Keyword and Topic Strategy

## Problem

A small conflict keyword list will miss major events.

## Solution

Use category-specific dictionaries.

## Conflict Keywords

```text
attack
strike
missile
drone
uav
war
troops
military
shelling
airstrike
bombing
border
incursion
invasion
artillery
ceasefire
mobilization
```

## Civil Unrest Keywords

```text
protest
riot
demonstration
clash
police
curfew
state of emergency
election unrest
mass arrest
strike action
blockade
```

## Cyber Keywords

```text
cyberattack
ransomware
breach
outage
ddos
malware
zero-day
cve
data leak
critical vulnerability
exploited
```

## Infrastructure Keywords

```text
blackout
power outage
grid failure
bridge collapse
rail disruption
port closure
water outage
telecom outage
pipeline
refinery
explosion
```

## Maritime Keywords

```text
shipping
vessel
cargo
port
strait
canal
chokepoint
piracy
missile
drone boat
naval
rerouting
freight
```

## Aviation Keywords

```text
airspace
airport
flight cancellation
ground stop
notam
gps jamming
spoofing
air defense
interception
```

## Public Health Keywords

```text
outbreak
epidemic
pandemic
infection
cases
hospitalization
quarantine
avian flu
cholera
measles
ebola
```

## Disaster Keywords

```text
earthquake
tsunami
flood
wildfire
hurricane
cyclone
landslide
volcano
evacuation
aftershock
```

## Economic / Market Keywords

```text
sanctions
oil
gas
supply shock
inflation
currency crisis
market halt
commodity
export ban
trade disruption
```

---

# Location Strategy

## Problem

A small hardcoded geo dictionary causes missed events.

## Solution

Build a larger structured location registry.

## Location Registry Should Include

```text
Countries
Country aliases
Major cities
Regions
Conflict zones
Maritime chokepoints
Ports
Airports
Strategic infrastructure
```

## Example Location Entry

```ts
{
  id: "loc_romania",
  name: "Romania",
  slug: "romania",
  type: "country",
  aliases: ["romania", "romanian"],
  lat: 45.9432,
  lng: 24.9668,
  regionIds: ["region_eastern_europe", "region_black_sea"],
}
```

## Alias Matching

Use aliases:

```text
USA
U.S.
US
United States
America
American
```

Without aliases, obvious events will be missed.

## Precision Levels

Every location match should have precision:

```text
Exact coordinate
City
Country
Region
Mentioned only
```

Do not pretend country centroid equals exact event location.

---

# Scoring Systems

## Confidence Score

Confidence measures whether OSIRIS has enough evidence.

Inputs:

```text
Source count
Independent publisher count
Official source presence
Location match strength
Entity match strength
Keyword overlap
Time clustering
Conflicting details
Duplicate risk
```

Example formula:

```ts
confidenceScore =
  sourceDiversityScore * 0.25 +
  locationConfidenceScore * 0.20 +
  keywordOverlapScore * 0.15 +
  entityOverlapScore * 0.15 +
  officialSourceScore * 0.15 +
  timeClusterScore * 0.10 -
  contradictionPenalty;
```

## Severity Score

Severity measures potential importance.

Inputs:

```text
Event category
Casualty terms
Military terms
Cross-border terms
Infrastructure terms
Aviation/maritime disruption
Government response
Public safety impact
Economic impact
```

Example formula:

```ts
severityScore =
  categoryBaseScore +
  casualtyScore +
  militaryScore +
  infrastructureScore +
  crossBorderScore +
  disruptionScore +
  governmentResponseScore;
```

## Freshness Score

Freshness measures recency.

```ts
freshnessScore = Math.max(0, 1 - hoursSinceLastUpdate / 72);
```

## Regional Risk Score

```ts
regionalRiskScore =
  severityWeightedEventCount * 0.35 +
  recentAccelerationScore * 0.25 +
  categoryDiversityScore * 0.15 +
  sourceDiversityScore * 0.15 +
  confidenceAverage * 0.10;
```

---

# Storage Strategy

## Option A: Client-Only / Local First

Good for early development.

Use:

```text
Zustand
localStorage
IndexedDB if needed
```

Pros:

```text
Cheap
Simple
No database bill
Fast iteration
```

Cons:

```text
No shared history
No server-side scheduled ingestion
Refresh depends on user opening app
```

## Option B: Supabase

Good if persistence matters.

Tables:

```text
osiris_sources
osiris_source_pulls
osiris_source_items
osiris_events
osiris_event_sources
osiris_evidence
osiris_entities
osiris_topics
osiris_locations
osiris_signals
osiris_event_relations
```

Pros:

```text
Persistent
Queryable
Better history
Can support dashboards
```

Cons:

```text
More setup
RLS needed if user accounts exist
Could increase usage
```

## Option C: Hybrid

Recommended.

Use:

```text
Serverless/API routes for fetching
Client cache for UI
Optional Supabase persistence later
Static config files for dictionaries
```

This keeps costs low while keeping the architecture sane.

---

# Suggested Folder Structure

```text
src/
  app/
    routes/
      MapPage.tsx
      FeedPage.tsx
      EventDossierPage.tsx
      SignalsPage.tsx
      SourcesPage.tsx
      TopicsPage.tsx
      TopicDetailPage.tsx
      EntitiesPage.tsx
      EntityDetailPage.tsx
      RegionsPage.tsx
      RegionDetailPage.tsx
      SearchPage.tsx
      SettingsPage.tsx

  features/
    map/
      components/
      hooks/
      utils/

    feed/
      components/
        IntelFeed.tsx
        FeedCard.tsx
        FeedFilters.tsx
        ExpandedFeedCard.tsx
      hooks/
      utils/

    events/
      components/
        EventDossierHeader.tsx
        EventTimeline.tsx
        EventEvidenceTable.tsx
        EventSourceCard.tsx
        EventConfidencePanel.tsx
        EventSeverityPanel.tsx
        EventLocationPanel.tsx
        EventEntityPanel.tsx
        EventKeywordCloud.tsx
        RelatedEventsPanel.tsx
        EventUncertaintyPanel.tsx
      hooks/
      utils/

    signals/
      components/
        SignalCard.tsx
        SignalFilters.tsx
        SignalDetailPanel.tsx
      hooks/
      utils/

    sources/
      components/
        SourceHealthCard.tsx
        SourcePullLog.tsx
        SourceRejectedItems.tsx
        SourceCatalog.tsx
      hooks/
      utils/

    topics/
      components/
      utils/

    entities/
      components/
      utils/

    regions/
      components/
      utils/

    search/
      components/
      utils/

    osiris-core/
      types/
        osiris.types.ts
      data/
        sourceRegistry.ts
        keywordRegistry.ts
        locationRegistry.ts
        entityRegistry.ts
        topicRegistry.ts
      ingestion/
        fetchSources.ts
        normalizeSourceItems.ts
        extractKeywords.ts
        extractLocations.ts
        extractEntities.ts
        extractTopics.ts
        acceptRejectSourceItems.ts
        dedupeSourceItems.ts
        clusterEvents.ts
        scoreConfidence.ts
        scoreSeverity.ts
        generateSignals.ts
      utils/
        text.ts
        time.ts
        scoring.ts
        ids.ts
```

---

# API Route Plan

## API Routes

```text
/api/sources
/api/sources/health
/api/sources/pull
/api/source-items
/api/events
/api/events/[eventId]
/api/signals
/api/topics
/api/entities
/api/regions
/api/search
```

## API Route Responsibilities

### `/api/sources`

Returns configured sources.

### `/api/sources/health`

Returns source status.

### `/api/sources/pull`

Triggers fetching and normalization.

### `/api/source-items`

Returns raw normalized source items.

### `/api/events`

Returns normalized clustered events.

### `/api/events/[eventId]`

Returns full dossier data.

### `/api/signals`

Returns generated signals.

### `/api/search`

Searches across normalized objects.

---

# Zustand Store Plan

## Recommended Stores

```text
useOsirisDataStore
useMapStore
useFeedStore
useEventDossierStore
useSignalStore
useSourceHealthStore
useSearchStore
useSettingsStore
```

## useOsirisDataStore

Handles shared data:

```ts
type OsirisDataStore = {
  events: OsirisEvent[];
  sourceItems: OsirisSourceItem[];
  signals: OsirisSignal[];
  topics: OsirisTopic[];
  entities: OsirisEntity[];
  locations: OsirisLocation[];

  lastUpdatedAt?: string;
  loading: boolean;
  error?: string;

  fetchAll: () => Promise<void>;
  refreshEvents: () => Promise<void>;
};
```

## useFeedStore

Handles feed UI:

```ts
type FeedStore = {
  filters: FeedFilters;
  sort: FeedSort;
  expandedEventIds: string[];

  setFilter: (key: string, value: unknown) => void;
  setSort: (sort: FeedSort) => void;
  toggleExpanded: (eventId: string) => void;
};
```

## useSettingsStore

Handles user preferences:

```ts
type SettingsStore = {
  defaultPage: "map" | "feed" | "signals";
  autoRefreshEnabled: boolean;
  refreshIntervalMinutes: number;
  minSeverity: OsirisSeverity;
  minConfidence: OsirisConfidence;
  enabledSourceIds: string[];
  enabledLayerIds: string[];

  updateSetting: (key: string, value: unknown) => void;
};
```

---

# Implementation Phases

## Phase 1: Normalize The Core Data Model

### Goal

Create the shared data shape that all pages will use.

### Tasks

- [ ] Create `src/features/osiris-core/types/osiris.types.ts`
- [ ] Define `OsirisEvent`
- [ ] Define `OsirisSourceItem`
- [ ] Define `OsirisEvidenceItem`
- [ ] Define `OsirisLocation`
- [ ] Define `OsirisEntity`
- [ ] Define `OsirisTopic`
- [ ] Define `OsirisSignal`
- [ ] Define shared severity/confidence/category types
- [ ] Update existing map/feed code to consume normalized events where practical
- [ ] Add temporary adapter functions for existing API responses

### Acceptance Criteria

- [ ] App can still load the current map
- [ ] Existing event/pin data can be adapted into `OsirisEvent`
- [ ] Feed and map can use the same event object
- [ ] No major UI redesign required yet

---

## Phase 2: Source Registry And Diagnostics

### Goal

Make sources visible, inspectable, and debuggable.

### Tasks

- [ ] Create `sourceRegistry.ts`
- [ ] Add source config type
- [ ] Move hardcoded RSS URLs into registry
- [ ] Add enabled/disabled status per source
- [ ] Add source category
- [ ] Add reliability weight
- [ ] Add parser type
- [ ] Track last pull time
- [ ] Track last success time
- [ ] Track last error
- [ ] Track returned item count
- [ ] Track accepted item count
- [ ] Track rejected item count
- [ ] Create `/sources` page
- [ ] Create `SourceHealthCard`
- [ ] Create `SourcePullLog`
- [ ] Create rejected item diagnostics

### Acceptance Criteria

- [ ] User can see what sources exist
- [ ] User can see whether each source is working
- [ ] User can see how many items each source returned
- [ ] User can see why items were rejected
- [ ] Missing-event debugging becomes possible

---

## Phase 3: Expand Source Coverage

### Goal

Reduce missing events by adding more free data sources.

### Tasks

- [ ] Add more world news feeds
- [ ] Add disaster/earthquake feeds
- [ ] Add weather/storm feeds
- [ ] Add cyber/security feeds
- [ ] Add public health feeds
- [ ] Add maritime/supply-chain sources where practical
- [ ] Add space weather source
- [ ] Add terms-of-use notes per source
- [ ] Add source category filters
- [ ] Add source fetch timeout handling
- [ ] Add per-source error states
- [ ] Add fallback behavior when one source fails

### Acceptance Criteria

- [ ] OSIRIS no longer depends on only a few RSS feeds
- [ ] Different event categories can come from category-specific sources
- [ ] Source failures do not break the whole app
- [ ] Source list is visible in `/sources`

---

## Phase 4: Keyword, Topic, And Location Registries

### Goal

Replace overly small hardcoded matching with structured registries.

### Tasks

- [ ] Create `keywordRegistry.ts`
- [ ] Create category-specific keyword lists
- [ ] Create `topicRegistry.ts`
- [ ] Create `locationRegistry.ts`
- [ ] Add country aliases
- [ ] Add region aliases
- [ ] Add major city aliases
- [ ] Add maritime chokepoints
- [ ] Add ports and airports where useful
- [ ] Add event category mapping
- [ ] Add topic alias mapping
- [ ] Add entity alias support
- [ ] Add match precision levels

### Acceptance Criteria

- [ ] More events are accepted due to broader keyword coverage
- [ ] Location matching works with aliases like `U.S.`, `US`, `United States`
- [ ] Topics are generated consistently
- [ ] Location precision is shown honestly

---

## Phase 5: Ingestion Pipeline Refactor

### Goal

Create a real event intelligence pipeline.

### Tasks

- [ ] Create `fetchSources.ts`
- [ ] Create `normalizeSourceItems.ts`
- [ ] Create `extractKeywords.ts`
- [ ] Create `extractLocations.ts`
- [ ] Create `extractEntities.ts`
- [ ] Create `extractTopics.ts`
- [ ] Create `acceptRejectSourceItems.ts`
- [ ] Create `dedupeSourceItems.ts`
- [ ] Create `clusterEvents.ts`
- [ ] Create `scoreConfidence.ts`
- [ ] Create `scoreSeverity.ts`
- [ ] Create `generateSignals.ts`
- [ ] Add logs for each pipeline stage
- [ ] Add debug output in development mode

### Acceptance Criteria

- [ ] Source items flow through clear stages
- [ ] Accepted/rejected status is explainable
- [ ] Clustered events are generated from multiple source items
- [ ] Confidence and severity are computed separately
- [ ] Signal generation can consume events

---

## Phase 6: Full Feed Page

### Goal

Create `/feed` as a first-class app page.

### Tasks

- [ ] Create `FeedPage.tsx`
- [ ] Create `FeedCard.tsx`
- [ ] Create `ExpandedFeedCard.tsx`
- [ ] Create `FeedFilters.tsx`
- [ ] Create feed sorting
- [ ] Add severity filter
- [ ] Add confidence filter
- [ ] Add region filter
- [ ] Add source filter
- [ ] Add tag/topic filter
- [ ] Add entity filter
- [ ] Add time range filter
- [ ] Add compact/expanded card modes
- [ ] Add `Open Dossier` button
- [ ] Add `View on Map` button
- [ ] Add new-item refresh banner

### Acceptance Criteria

- [ ] `/feed` can be used without opening the map
- [ ] Feed cards can expand inline
- [ ] Feed cards link to event dossiers
- [ ] User can filter/sort events meaningfully
- [ ] Feed feels like an intelligence stream, not a news list

---

## Phase 7: Event Dossier Page

### Goal

Create the deep-dive page for every normalized event.

### Tasks

- [ ] Create `/events/[eventId]` route
- [ ] Create `EventDossierPage.tsx`
- [ ] Create `EventDossierHeader`
- [ ] Create `EventConfidencePanel`
- [ ] Create `EventSeverityPanel`
- [ ] Create `EventTimeline`
- [ ] Create `EventEvidenceTable`
- [ ] Create `EventSourceCard`
- [ ] Create `EventLocationPanel`
- [ ] Create `EventEntityPanel`
- [ ] Create `EventKeywordCloud`
- [ ] Create `RelatedEventsPanel`
- [ ] Create `EventUncertaintyPanel`
- [ ] Create raw data expandable section
- [ ] Add map preview
- [ ] Add source links
- [ ] Add topic/entity links

### Acceptance Criteria

- [ ] Every event has a dossier page
- [ ] Sources are clearly attributed
- [ ] Confidence is explained
- [ ] Severity is explained
- [ ] Uncertainty is visible
- [ ] Related events are shown
- [ ] Keyword cloud is generated without AI

---

## Phase 8: Signals Page

### Goal

Create a dedicated derived-pattern page.

### Tasks

- [ ] Create `/signals`
- [ ] Create `SignalCard`
- [ ] Create `SignalFilters`
- [ ] Create signal lifecycle states
- [ ] Add signal type filters
- [ ] Add region filters
- [ ] Add related event links
- [ ] Add watch-next section
- [ ] Add signal generation rules
- [ ] Add signal confidence/severity scoring
- [ ] Add signal status transitions

### Acceptance Criteria

- [ ] Signals are generated from event clusters
- [ ] Signals link back to supporting events
- [ ] Signal reasoning is visible
- [ ] User can distinguish new/escalating/cooling signals

---

## Phase 9: Topics, Entities, And Regions

### Goal

Create deeper context pages that connect events across time and categories.

### Tasks

- [ ] Create `/topics`
- [ ] Create `/topics/[topicSlug]`
- [ ] Create `/entities`
- [ ] Create `/entities/[entitySlug]`
- [ ] Create `/regions`
- [ ] Create `/regions/[regionSlug]`
- [ ] Add topic index cards
- [ ] Add entity index cards
- [ ] Add region index cards
- [ ] Add active event lists
- [ ] Add related signal lists
- [ ] Add timelines
- [ ] Add top sources
- [ ] Add top related entities/topics
- [ ] Add regional risk score

### Acceptance Criteria

- [ ] User can investigate recurring topics
- [ ] User can inspect entities across events
- [ ] User can inspect regions across event types
- [ ] Dossier pages link into topic/entity/region pages
- [ ] Topic/entity/region pages link back into events

---

## Phase 10: Search

### Goal

Make OSIRIS searchable across all normalized objects.

### Tasks

- [ ] Create `/search`
- [ ] Create global search input
- [ ] Search events
- [ ] Search source items
- [ ] Search signals
- [ ] Search topics
- [ ] Search entities
- [ ] Search regions
- [ ] Add result type badges
- [ ] Add filters
- [ ] Add date range filter
- [ ] Add severity/confidence filters
- [ ] Add source filter
- [ ] Add empty state suggestions

### Acceptance Criteria

- [ ] User can search across the app
- [ ] Search results clearly show object type
- [ ] Search links to the correct detail pages
- [ ] Search supports investigation workflows

---

## Phase 11: Map Integration Upgrade

### Goal

Connect the map to the new normalized intelligence objects.

### Tasks

- [ ] Make map pins use `OsirisEvent`
- [ ] Make pin previews link to dossiers
- [ ] Add event severity/confidence visual treatment
- [ ] Add layer source health indicators
- [ ] Add layer item counts
- [ ] Add heat zones
- [ ] Add region overlays
- [ ] Add source failure warnings
- [ ] Add “View related feed” action
- [ ] Add “Open region page” action

### Acceptance Criteria

- [ ] Map is no longer isolated from the rest of the app
- [ ] Map pins are backed by dossier-ready event objects
- [ ] Map explains data freshness and source health
- [ ] Map routes naturally to deeper pages

---

## Phase 12: Persistence And Caching

### Goal

Prevent the app from feeling stateless or constantly re-fetching.

### Tasks

- [ ] Add client cache
- [ ] Store last successful source results
- [ ] Store normalized events locally
- [ ] Store source health locally
- [ ] Add cache expiration
- [ ] Add manual cache clear
- [ ] Add optional Supabase persistence plan
- [ ] Add event history storage
- [ ] Add source pull history storage
- [ ] Add rejected item history storage

### Acceptance Criteria

- [ ] App can show previous data while refreshing
- [ ] Refresh failures do not blank the UI
- [ ] User can see stale data warning
- [ ] Event history can be inspected

---

## Phase 13: Workspace Settings

### Goal

Let users control the operator experience.

### Tasks

- [ ] Create `/settings`
- [ ] Add default landing page setting
- [ ] Add enabled sources setting
- [ ] Add enabled layers setting
- [ ] Add refresh interval setting
- [ ] Add severity threshold setting
- [ ] Add confidence threshold setting
- [ ] Add compact feed setting
- [ ] Add debug mode setting
- [ ] Persist settings locally

### Acceptance Criteria

- [ ] User can tune OSIRIS to their workflow
- [ ] Settings persist across sessions
- [ ] Source/layer preferences affect map and feed

---

## Phase 14: Quality, Trust, And Debugging

### Goal

Make OSIRIS trustworthy and easier to debug.

### Tasks

- [ ] Add source attribution everywhere
- [ ] Add confidence reasoning everywhere
- [ ] Add rejected source item diagnostics
- [ ] Add pipeline debug panel in development
- [ ] Add event raw data viewer
- [ ] Add source pull logs
- [ ] Add contradiction display
- [ ] Add stale data warnings
- [ ] Add empty states that explain why no data appears
- [ ] Add error boundaries
- [ ] Add loading skeletons
- [ ] Add retry buttons

### Acceptance Criteria

- [ ] User can understand why something appears
- [ ] User can understand why something is missing
- [ ] App does not silently fail
- [ ] Debugging does not require digging through console logs

---

## Phase 15: Visual Design System

### Goal

Create a coherent OSIRIS interface style.

### Design Tone

```text
Dark
Operational
Readable
Dense but not cluttered
Sharp
Data-first
Calm under pressure
```

## Core Components

```text
SeverityBadge
ConfidenceBadge
SourceBadge
EntityChip
TopicChip
LocationChip
SignalCard
EvidenceCard
TimelineItem
StatusDot
DataPanel
EmptyState
ErrorPanel
RefreshBanner
```

## Visual Rules

```text
Use color for status, not decoration
Keep text readable
Avoid fake sci-fi clutter
Use panels for grouping
Use badges consistently
Use icons sparingly
Show timestamps clearly
Show source counts clearly
```

---

# Non-AI Intelligence Features

## Keyword Cloud

Inputs:

```text
Titles
Summaries
Tags
Entities
Locations
```

Output:

```text
Weighted keyword chips
Optional word cloud
Term frequency list
```

## Co-Occurrence Graph

Show which terms appear together.

Example:

```text
drone + romania
romania + nato
airspace + russia
black sea + maritime
```

## Event Clustering

Cluster by:

```text
Location
Topic
Entity
Time
Source overlap
Keyword similarity
```

## Confidence Explanation

Generate from scoring inputs.

Example:

```text
Confidence is Moderate because 4 independent sources mention the same location and event type, but only 1 source includes official confirmation.
```

## Watch Next Suggestions

Generate from category templates.

Example for drone/airspace:

```text
Watch for:
- Official defense ministry statement
- Airspace restrictions
- NATO response
- Nearby aviation disruptions
- Related border incidents
```

## Related Events

Generate with weighted overlap:

```text
Shared tags
Shared entities
Shared region
Recent time proximity
Source overlap
```

---

# Cost-Control Strategy

## Avoid Paid AI For Core Features

Do not require AI for:

```text
Summaries
Dossiers
Signals
Keyword clouds
Topic pages
Entity pages
Confidence scoring
Severity scoring
Related events
```

## Use Templates Instead Of AI

Example TLDR template:

```text
{sourceCount} sources mention {topLocation} with recurring terms {topKeywords}. OSIRIS classified this as {category} with {confidence} confidence.
```

## Keep Expensive Calls Optional

If AI is ever added later, make it:

```text
Manual
Optional
Per-event
Cached
Clearly labeled
```

Example:

```text
Generate AI Brief
```

Not automatic. Not required.

## Cache Everything Reasonable

Cache:

```text
Source pulls
Normalized source items
Clustered events
Generated signals
Keyword counts
Search index
```

---

# Priority Build Order

## Recommended Order

```text
1. Normalize data model
2. Source registry and source health
3. Expand source coverage
4. Keyword/location/topic registries
5. Ingestion pipeline
6. Feed page
7. Event dossier page
8. Signals page
9. Topic/entity/region pages
10. Search
11. Map integration upgrade
12. Persistence/cache
13. Settings
14. Trust/debugging polish
15. Visual system polish
```

## Why This Order

Do not start with the prettiest pages.

Start with the data shape.

If the data is normalized, every page becomes easier.

If the data is messy, every page becomes a custom one-off pain machine with flashing lights and emotional damage.

---

# Definition Of Done

OSIRIS 2.0 is considered fully successful when:

- [ ] The map is only one part of the app, not the whole app
- [ ] The feed provides a useful real-time event stream
- [ ] Every meaningful event can open into a dossier
- [ ] Every dossier shows sources and evidence
- [ ] Confidence and severity are explained separately
- [ ] Source health is visible
- [ ] Missing event debugging is possible
- [ ] Topics connect related events
- [ ] Entities connect recurring actors/organizations/places
- [ ] Regions show localized intelligence views
- [ ] Signals detect patterns across events
- [ ] Search works across the workspace
- [ ] The app does not require paid AI to feel intelligent
- [ ] The UI feels like an operator console, not a landing page
- [ ] The system is honest about uncertainty

---

# Final Product Vision

OSIRIS should become a tool where the user can start with:

```text
Something is happening somewhere.
```

Then move to:

```text
What happened?
Where?
Who is involved?
What sources support it?
How confident is this?
What else is related?
What changed over time?
What should I watch next?
```

The full experience should feel like:

```text
Map → Feed → Event Dossier → Sources → Signals → Related Topics/Entities/Regions
```

That is the product.

Not a map.

Not a news feed.

Not AI cosplay.

A source-backed intelligence workspace.
