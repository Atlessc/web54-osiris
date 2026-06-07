# OSIRIS 2.0 Event Intelligence Report

**Subtitle:** Turning disconnected, benign source items into possible event leads, explanations, confidence scores, and source-backed reasoning.

**Purpose:** This document explains how Palantir-style intelligence workflows, analyst tools, and knowledge-graph systems convert disconnected data into structured event assessments. It is designed for an OSIRIS-style local-first project that ingests public or authorized data, extracts entities and signals, clusters related items, and produces transparent possible-event reports.

**Important safety and ethics note:** This document is for lawful, defensive, research, civic-awareness, emergency-management, business-intelligence, journalism, and project-design use. It should not be used to identify, track, profile, harass, or target private people. The system should favor transparency, source attribution, confidence limits, and alternative explanations over “predictive policing” style certainty.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Concept](#core-concept)
3. [Public Research Basis](#public-research-basis)
4. [The Intelligence Pipeline](#the-intelligence-pipeline)
5. [Process 1: Source Ingestion](#process-1-source-ingestion)
6. [Process 2: Source Normalization](#process-2-source-normalization)
7. [Process 3: Entity Extraction](#process-3-entity-extraction)
8. [Process 4: Entity Resolution](#process-4-entity-resolution)
9. [Process 5: Event Signal Extraction](#process-5-event-signal-extraction)
10. [Process 6: Relationship Mapping](#process-6-relationship-mapping)
11. [Process 7: Timeline and Geospatial Context](#process-7-timeline-and-geospatial-context)
12. [Process 8: Clustering Benign Signals into Possible Events](#process-8-clustering-benign-signals-into-possible-events)
13. [Process 9: Confidence Scoring](#process-9-confidence-scoring)
14. [Process 10: Explanation Generation](#process-10-explanation-generation)
15. [Process 11: Alternative Explanations and Red-Team Checks](#process-11-alternative-explanations-and-red-team-checks)
16. [Process 12: Human Review and Feedback Loop](#process-12-human-review-and-feedback-loop)
17. [Recommended OSIRIS Data Model](#recommended-osiris-data-model)
18. [Recommended Prompt/Data Package Structure](#recommended-promptdata-package-structure)
19. [AI Chatbot Prompt Pretext](#ai-chatbot-prompt-pretext)
20. [Example Data Payload](#example-data-payload)
21. [Example Expected AI Output](#example-expected-ai-output)
22. [Implementation Notes for a Local-First App](#implementation-notes-for-a-local-first-app)
23. [Risk Controls and Guardrails](#risk-controls-and-guardrails)
24. [Source References](#source-references)

---

# Executive Summary

The core pattern behind Palantir-style systems, link-analysis tools, threat-intelligence platforms, and intelligence-fusion workflows is:

```text
Raw source items
  -> normalized records
  -> extracted entities
  -> resolved entities
  -> extracted event signals
  -> relationships
  -> timeline / location context
  -> clusters
  -> possible-event hypotheses
  -> confidence score
  -> explanation with source attribution
  -> human review
```

The system does not truly “know” that an event happened. It identifies patterns that might indicate something is happening, then produces a confidence-rated analytic lead. The best version of this does not say:

> “This event is happening.”

It says:

> “These source items appear related. Here is the possible event they may indicate. Here is why. Here are the source references. Here are alternative explanations. Here is the confidence level. Here is what would increase or decrease confidence.”

For OSIRIS, the ideal direction is a transparent **event intelligence graph**: a system that builds dossiers from public or authorized sources, groups related signals, and shows exactly how the conclusion was reached.

---

# Core Concept

A single data point is usually not enough to infer an event.

Example:

```text
Data point A: A port posts a routine delay notice.
Data point B: Several suppliers update delivery estimates.
Data point C: Local trucking job postings spike near the port.
```

Each item is benign by itself. Together, they might suggest a possible localized logistics disruption.

The goal is not to treat every correlation as truth. The goal is to surface a lead:

```text
Possible Event:
Localized supply-chain disruption near Terminal X.

Why:
Multiple independent source items mention related entities, location, time window, and downstream effects.

Confidence:
Moderate-low until confirmed by direct port or carrier data.
```

This is the heart of intelligence fusion: connect weak signals into structured hypotheses while clearly labeling uncertainty.

---

# Public Research Basis

This document is based on public descriptions of data-fusion and analysis systems, not insider or classified details.

## Palantir-style ontology and object modeling

Palantir’s public Foundry documentation describes an Ontology where existing data sources are mapped into **objects, properties, and links**. An object type is a schema definition of a real-world entity or event, and links represent relationships between objects.

In OSIRIS terms, this means you do not only store raw articles. You convert them into things like:

```text
Organization -> mentioned_in -> Source
Organization -> located_near -> Place
EventSignal -> references -> Organization
EventSignal -> occurred_at -> TimeWindow
EventSignal -> supported_by -> Source
```

## Entity resolution

Entity resolution is the process of deciding whether separate records refer to the same real-world entity. For example:

```text
"Acme Inc."
"ACME Incorporated"
"acme.com"
"Acme Logistics LLC"
```

These might refer to the same organization, related organizations, or completely different entities. The system should score the match instead of assuming certainty.

## Link analysis and investigative timelines

Tools like i2 Analyst’s Notebook publicly describe modeling data as **entities, links, events, timelines, and attributes**. This is very close to what OSIRIS should do: turn source data into objects and relationships that can be visualized, filtered, searched, and explained.

## Analytic tradecraft

The U.S. intelligence community’s analytic standards emphasize objectivity, uncertainty, source quality, assumptions, alternatives, and clear reasoning. OSIRIS should borrow those habits even if the project is not a government intelligence system.

A good report includes:

- What the system thinks might be happening.
- What data supports that idea.
- How strong the evidence is.
- What assumptions are being made.
- What alternative explanations exist.
- What evidence would change the conclusion.

---

# The Intelligence Pipeline

## High-level pipeline

```text
1. Ingest source data
2. Normalize the source data
3. Extract entities
4. Resolve duplicate/related entities
5. Extract event signals
6. Map relationships
7. Add time and location context
8. Cluster related signals
9. Score confidence
10. Generate explanation
11. Add alternative explanations
12. Human review
13. Store feedback and improve
```

## Why each stage matters

| Stage | Purpose | Failure if skipped |
|---|---|---|
| Ingestion | Bring data into the system | No inputs |
| Normalization | Make messy data consistent | Comparisons break |
| Entity extraction | Identify people, orgs, places, assets, topics | Data stays unstructured |
| Entity resolution | Merge likely duplicates | Same entity appears as many fake entities |
| Signal extraction | Identify “things that happened” | Sources stay as plain documents |
| Relationship mapping | Connect entities and signals | No graph intelligence |
| Timeline/geospatial context | Add when/where | No event patterning |
| Clustering | Group related signals | No possible-event detection |
| Confidence scoring | Estimate strength of conclusion | False certainty |
| Explanation | Make reasoning transparent | Black-box output |
| Alternatives | Fight tunnel vision | Bad analysis |
| Human review | Validate or reject leads | Automation bias |

---

# Process 1: Source Ingestion

Source ingestion means collecting raw input items from allowed sources.

## Example source types

```text
RSS article
Government bulletin
Weather alert
Company status page
Public transportation notice
Public event listing
Cybersecurity advisory
Supply-chain update
Public social post
Manual analyst note
Internal authorized log
```

## Recommended source object

```json
{
  "sourceId": "src_001",
  "sourceType": "rss",
  "title": "Terminal X reports temporary cargo delay",
  "url": "https://example.com/terminal-x-delay",
  "publisher": "Port Authority",
  "publishedAt": "2026-06-06T14:30:00-07:00",
  "retrievedAt": "2026-06-06T14:45:00-07:00",
  "rawText": "Terminal X reports delays due to maintenance...",
  "language": "en",
  "sourceReliability": 0.85,
  "accessLevel": "public",
  "notes": "Official source"
}
```

## Ingestion rules

- Preserve the original source text.
- Store the retrieval timestamp.
- Store the published timestamp if available.
- Keep the source URL.
- Assign source type.
- Assign source reliability.
- Never overwrite raw source data after ingestion.
- Avoid private-person targeting unless there is a lawful, consent-based, or defensive reason.

---

# Process 2: Source Normalization

Normalization converts messy source data into consistent structures.

## Normalize these fields

| Field | Normalized format |
|---|---|
| Date/time | ISO 8601 |
| Location | Structured place object |
| Organization names | Canonical display name + aliases |
| URLs/domains | Lowercase hostname |
| Topics/tags | Controlled vocabulary |
| Language | ISO language code |
| Source type | Enum |
| Reliability | 0.00–1.00 score |
| Confidence | 0.00–1.00 score |

## Example normalization

Raw:

```text
"Port delays this afternoon at terminal x"
```

Normalized:

```json
{
  "title": "Port delays this afternoon at Terminal X",
  "eventTimeWindow": {
    "start": "2026-06-06T12:00:00-07:00",
    "end": "2026-06-06T18:00:00-07:00"
  },
  "entitiesMentioned": ["Terminal X"],
  "tags": ["logistics", "port", "delay"]
}
```

## Why normalization matters

Without normalization, these may not match:

```text
Terminal X
terminal x
Port Terminal X
TX Cargo Terminal
```

A human sees they may be related. The system needs structured help.

---

# Process 3: Entity Extraction

Entity extraction identifies meaningful objects from text.

## Entity types

```text
person
organization
place
facility
vehicle
asset
domain
ip_address
product
event
topic
document
source
```

For a safety-first OSIRIS build, be careful with **person** entities. Default to organizations, places, events, topics, assets, and public figures only unless the data context justifies otherwise.

## Example source text

```text
Terminal X reported cargo processing delays. Two refrigerated goods suppliers, Northline Foods and Cascade Cold Chain, updated delivery estimates for the Portland metro area.
```

## Extracted entities

```json
[
  {
    "entityId": "ent_terminal_x",
    "type": "facility",
    "name": "Terminal X",
    "aliases": ["TX Cargo Terminal"],
    "confidence": 0.92
  },
  {
    "entityId": "ent_northline_foods",
    "type": "organization",
    "name": "Northline Foods",
    "aliases": [],
    "confidence": 0.89
  },
  {
    "entityId": "ent_cascade_cold_chain",
    "type": "organization",
    "name": "Cascade Cold Chain",
    "aliases": [],
    "confidence": 0.89
  },
  {
    "entityId": "ent_portland_metro",
    "type": "place",
    "name": "Portland metro area",
    "aliases": ["Portland area"],
    "confidence": 0.82
  }
]
```

## Cheap extraction methods

You do not need a giant AI model for all extraction.

Possible local-first approaches:

| Method | Use case |
|---|---|
| Regex | Domains, IPs, dates, emails, IDs |
| Keyword lists | Known organizations, places, categories |
| Fuzzy matching | Slightly different entity names |
| Capitalized phrase detection | Possible names |
| NLP library | Named entity recognition |
| Manual tagging | Human-confirmed entities |
| AI extraction | Optional fallback for messy text |

---

# Process 4: Entity Resolution

Entity resolution determines whether multiple mentions refer to the same thing.

## Example

```text
"Portland Terminal X"
"Terminal X"
"TX Cargo Terminal"
```

Possible resolution:

```json
{
  "canonicalEntityId": "ent_terminal_x",
  "canonicalName": "Terminal X",
  "aliases": [
    "Portland Terminal X",
    "TX Cargo Terminal"
  ],
  "resolutionConfidence": 0.88,
  "matchReasons": [
    "same location context",
    "shared terminal keyword",
    "appears in logistics-related sources"
  ]
}
```

## Entity resolution signals

| Signal | Meaning |
|---|---|
| Exact name match | Strongest simple match |
| Alias match | Strong if alias is known |
| Shared domain | Strong for organizations |
| Shared address | Strong for facilities |
| Same coordinates | Strong for places/facilities |
| Similar name | Medium |
| Same category and location | Medium |
| Same co-mentioned entities | Medium |
| Same source only | Weak |
| Similar topic only | Weak |

## Entity resolution scoring example

```text
resolutionScore =
  exactNameMatch * 0.30
+ aliasMatch * 0.20
+ sharedLocation * 0.15
+ sharedDomain * 0.15
+ coMentionOverlap * 0.10
+ sourceReliability * 0.10
```

Then classify:

```text
0.85–1.00 = likely same entity
0.65–0.84 = possible same entity
0.45–0.64 = weak possible match
0.00–0.44 = do not merge
```

## Important rule

Do not automatically merge uncertain entities. Use a relationship like:

```text
possibly_same_as
```

instead of collapsing the records.

That prevents one bad merge from poisoning the whole graph.

---

# Process 5: Event Signal Extraction

An event signal is a structured claim that something happened, may happen, changed, or was observed.

## Event signal examples

```text
Cargo delay reported
Delivery ETA changed
Public advisory issued
Login failures increased
Lookalike domain registered
Job postings increased
Transit crowding expected
Clinic visits increased
Weather warning issued
Supplier status page changed
```

## Recommended event signal object

```json
{
  "signalId": "sig_001",
  "signalType": "delay_notice",
  "title": "Terminal X reports cargo processing delay",
  "summary": "An official port source reported cargo delays at Terminal X due to maintenance.",
  "sourceIds": ["src_001"],
  "entityIds": ["ent_terminal_x"],
  "location": {
    "label": "Terminal X",
    "lat": null,
    "lng": null,
    "precision": "facility"
  },
  "timeWindow": {
    "start": "2026-06-06T12:00:00-07:00",
    "end": "2026-06-06T18:00:00-07:00"
  },
  "tags": ["logistics", "port", "delay"],
  "signalStrength": 0.78,
  "extractionConfidence": 0.88
}
```

## Signal extraction checklist

For every source item, ask:

```text
What happened?
Who or what was involved?
Where did it happen?
When did it happen?
What changed?
Is this confirmed or claimed?
Which source says this?
How reliable is the source?
What tags apply?
```

---

# Process 6: Relationship Mapping

Relationship mapping connects entities, signals, sources, and events.

## Relationship examples

```text
Source -> supports -> EventSignal
EventSignal -> mentions -> Entity
Entity -> located_at -> Place
Entity -> related_to -> Entity
EventSignal -> occurs_near -> Place
EventSignal -> occurs_during -> TimeWindow
EventSignal -> possibly_related_to -> EventSignal
PossibleEvent -> supported_by -> EventSignal
PossibleEvent -> contradicted_by -> EventSignal
```

## Relationship object

```json
{
  "relationshipId": "rel_001",
  "fromType": "event_signal",
  "fromId": "sig_001",
  "toType": "entity",
  "toId": "ent_terminal_x",
  "relationshipType": "mentions",
  "sourceIds": ["src_001"],
  "confidence": 0.91,
  "reason": "The source directly names Terminal X."
}
```

## Why relationships matter

Relationships turn a pile of documents into a graph:

```text
Source A -> mentions -> Terminal X
Source B -> mentions -> Terminal X
Source C -> mentions -> Portland Metro
Source C -> mentions -> refrigerated goods
Terminal X -> located_near -> Portland Metro
Northline Foods -> ships_through -> Terminal X
Possible Event -> supported_by -> Source A, Source B, Source C
```

That graph is what lets the system detect clusters.

---

# Process 7: Timeline and Geospatial Context

Time and location are what turn unrelated facts into possible activity patterns.

## Timeline fields

```json
{
  "occurredAt": "2026-06-06T14:30:00-07:00",
  "timeWindowStart": "2026-06-06T12:00:00-07:00",
  "timeWindowEnd": "2026-06-06T18:00:00-07:00",
  "temporalPrecision": "hour",
  "publishedAt": "2026-06-06T14:30:00-07:00",
  "retrievedAt": "2026-06-06T14:45:00-07:00"
}
```

## Location fields

```json
{
  "locationLabel": "Terminal X",
  "placeType": "facility",
  "lat": null,
  "lng": null,
  "locationPrecision": "facility",
  "region": "Portland metro",
  "country": "US"
}
```

## Temporal clustering

Signals are more likely related if they occur within a meaningful time window.

Example:

```text
Signal A: 10:00 AM
Signal B: 1:00 PM
Signal C: 3:00 PM
```

If all are logistics-related and mention related entities, a 5-hour cluster may matter.

## Geospatial clustering

Signals are more likely related if they occur around the same place.

Example:

```text
Terminal X
Portland metro
Nearby trucking yard
Regional delivery route
```

The system can treat these as a possible shared geography.

---

# Process 8: Clustering Benign Signals into Possible Events

Clustering is the process of grouping multiple event signals that may describe the same larger situation.

## Cluster trigger conditions

A possible event cluster should form when at least two or three of these are true:

```text
Same entity
Related entities
Same location or nearby location
Same time window
Same topic/tag
Same downstream effect
Multiple independent sources
Unusual compared to baseline
Known sequence pattern
```

## Example cluster rule

```text
IF:
  3 or more signals
  AND at least 2 independent sources
  AND time window <= 72 hours
  AND entity/tag overlap >= medium
THEN:
  create PossibleEvent candidate
```

## Possible event object

```json
{
  "possibleEventId": "evt_001",
  "title": "Possible localized logistics disruption near Terminal X",
  "eventType": "logistics_disruption",
  "summary": "Several independent signals suggest short-term freight disruption around Terminal X.",
  "supportingSignalIds": ["sig_001", "sig_002", "sig_003"],
  "entityIds": ["ent_terminal_x", "ent_northline_foods", "ent_cascade_cold_chain"],
  "location": {
    "label": "Terminal X / Portland metro",
    "precision": "regional"
  },
  "timeWindow": {
    "start": "2026-06-06T08:00:00-07:00",
    "end": "2026-06-08T18:00:00-07:00"
  },
  "confidence": 0.62,
  "confidenceLabel": "moderate-low",
  "status": "candidate",
  "createdAt": "2026-06-06T16:00:00-07:00"
}
```

---

# Process 9: Confidence Scoring

Confidence scoring estimates how much weight the system should give to a possible event hypothesis.

## Recommended confidence factors

| Factor | Description |
|---|---|
| Source reliability | Are the sources official, reputable, direct, or unknown? |
| Source independence | Are sources independent or repeating the same original claim? |
| Corroboration | Do multiple sources support the same pattern? |
| Entity match confidence | Are the entities likely the same or related? |
| Time proximity | Did signals happen close together? |
| Location proximity | Did signals happen in the same place or region? |
| Tag/topic overlap | Are the topics meaningfully related? |
| Baseline anomaly | Is the pattern unusual compared to normal? |
| Sequence fit | Does it match a known event pattern? |
| Contradictions | Are there sources that weaken the hypothesis? |

## Simple scoring model

```text
confidence =
  (sourceReliabilityAvg * 0.20)
+ (sourceIndependence * 0.15)
+ (corroborationStrength * 0.15)
+ (entityMatchConfidence * 0.15)
+ (timeProximityScore * 0.10)
+ (locationProximityScore * 0.10)
+ (tagOverlapScore * 0.05)
+ (baselineAnomalyScore * 0.05)
+ (sequenceFitScore * 0.05)
- (contradictionPenalty * 0.20)
```

## Confidence labels

```text
0.85–1.00 = high
0.70–0.84 = moderate-high
0.55–0.69 = moderate
0.40–0.54 = moderate-low
0.25–0.39 = low
0.00–0.24 = very low
```

## Important confidence rule

Confidence should not mean “impact” or “severity.”

Example:

```text
High confidence, low severity:
A minor scheduled road closure.

Low confidence, high severity:
An unconfirmed report of major infrastructure disruption.
```

Track these separately:

```json
{
  "confidence": 0.62,
  "severity": 0.35,
  "urgency": 0.42
}
```

---

# Process 10: Explanation Generation

Explanation generation turns graph evidence into readable reasoning.

## A good explanation includes

```text
1. The possible event
2. The supporting signals
3. The source references
4. The relationship between the signals
5. The confidence score
6. The assumptions
7. Alternative explanations
8. What would increase confidence
9. What would decrease confidence
```

## Explanation template

```text
This possible event was generated because [number] source items within [time window] referenced related entities, locations, and topics.

The strongest supporting signals are:
- [Signal 1] from [Source 1]
- [Signal 2] from [Source 2]
- [Signal 3] from [Source 3]

These signals are connected by:
- Shared entity: [Entity]
- Shared location: [Location]
- Shared time window: [Time]
- Shared topic: [Topic]

Confidence is [label] ([score]) because:
- [Positive reason]
- [Positive reason]
- [Limitation]
- [Contradiction or missing info]

Alternative explanations:
- [Alternative 1]
- [Alternative 2]
- [Alternative 3]

Recommended next checks:
- [Check 1]
- [Check 2]
- [Check 3]
```

---

# Process 11: Alternative Explanations and Red-Team Checks

This is one of the most important parts.

Without alternatives, the system becomes a conspiracy generator with a React frontend. Bad combo. 🧨

## Always ask

```text
What else could explain these same signals?
Are the sources independent?
Is one source just quoting another?
Could this be seasonal?
Could this be routine?
Could this be a reporting artifact?
Could the entity match be wrong?
Could the timestamps be misleading?
Is there contradictory data?
What evidence would prove this wrong?
```

## Alternative explanation object

```json
{
  "alternativeId": "alt_001",
  "possibleEventId": "evt_001",
  "explanation": "Routine maintenance delay with unrelated supplier ETA updates.",
  "plausibility": 0.58,
  "supportingEvidence": ["src_001 mentions maintenance"],
  "weakeningEvidence": ["src_002 and src_003 show downstream changes"]
}
```

## Red-team result object

```json
{
  "redTeamCheckId": "rtc_001",
  "possibleEventId": "evt_001",
  "question": "Are the supplier ETA changes actually related to Terminal X?",
  "finding": "Unknown. The sources do not explicitly identify Terminal X as the cause.",
  "effectOnConfidence": -0.08
}
```

---

# Process 12: Human Review and Feedback Loop

The system should never act like the final authority.

## Review statuses

```text
candidate
needs_review
confirmed
rejected
watchlist
merged
archived
```

## Human review object

```json
{
  "reviewId": "rev_001",
  "possibleEventId": "evt_001",
  "reviewer": "local_user",
  "decision": "watchlist",
  "notes": "Signals are interesting but not enough for confirmed event.",
  "confidenceOverride": null,
  "createdAt": "2026-06-06T17:00:00-07:00"
}
```

## Feedback loop

When a user confirms or rejects an event, store why.

Examples:

```text
Rejected because sources were duplicates.
Rejected because entity match was wrong.
Confirmed by official source.
Merged with larger event.
Archived because stale.
```

That feedback can improve future scoring.

---

# Recommended OSIRIS Data Model

## SourceItem

```ts
export interface SourceItem {
  id: string;
  sourceType:
    | "rss"
    | "official_notice"
    | "status_page"
    | "public_record"
    | "manual_note"
    | "authorized_log"
    | "document"
    | "other";
  title: string;
  url?: string;
  publisher?: string;
  author?: string;
  publishedAt?: string;
  retrievedAt: string;
  rawText: string;
  normalizedText?: string;
  language?: string;
  sourceReliability: number; // 0-1
  accessLevel: "public" | "internal_authorized" | "private_restricted";
  tags: string[];
}
```

## Entity

```ts
export interface Entity {
  id: string;
  type:
    | "person"
    | "organization"
    | "place"
    | "facility"
    | "asset"
    | "domain"
    | "ip_address"
    | "product"
    | "event"
    | "topic"
    | "document";
  name: string;
  aliases: string[];
  description?: string;
  confidence: number;
  createdFromSourceIds: string[];
}
```

## EventSignal

```ts
export interface EventSignal {
  id: string;
  signalType: string;
  title: string;
  summary: string;
  sourceIds: string[];
  entityIds: string[];
  location?: {
    label: string;
    lat?: number;
    lng?: number;
    precision: "exact" | "facility" | "city" | "region" | "unknown";
  };
  timeWindow?: {
    start?: string;
    end?: string;
    precision?: "minute" | "hour" | "day" | "week" | "unknown";
  };
  tags: string[];
  signalStrength: number;
  extractionConfidence: number;
}
```

## Relationship

```ts
export interface Relationship {
  id: string;
  fromType: "source" | "entity" | "event_signal" | "possible_event";
  fromId: string;
  toType: "source" | "entity" | "event_signal" | "possible_event";
  toId: string;
  relationshipType:
    | "mentions"
    | "supports"
    | "contradicts"
    | "located_near"
    | "same_as"
    | "possibly_same_as"
    | "related_to"
    | "occurs_during"
    | "caused_by_claim"
    | "downstream_effect";
  sourceIds: string[];
  confidence: number;
  reason?: string;
}
```

## PossibleEvent

```ts
export interface PossibleEvent {
  id: string;
  title: string;
  eventType: string;
  summary: string;
  supportingSignalIds: string[];
  contradictingSignalIds: string[];
  entityIds: string[];
  relationshipIds: string[];
  location?: {
    label: string;
    lat?: number;
    lng?: number;
    precision: "exact" | "facility" | "city" | "region" | "unknown";
  };
  timeWindow?: {
    start?: string;
    end?: string;
  };
  confidence: number;
  confidenceLabel:
    | "very low"
    | "low"
    | "moderate-low"
    | "moderate"
    | "moderate-high"
    | "high";
  severity?: number;
  urgency?: number;
  assumptions: string[];
  alternativeExplanations: AlternativeExplanation[];
  reasoning: string;
  recommendedNextChecks: string[];
  status:
    | "candidate"
    | "needs_review"
    | "confirmed"
    | "rejected"
    | "watchlist"
    | "merged"
    | "archived";
}
```

## AlternativeExplanation

```ts
export interface AlternativeExplanation {
  id: string;
  explanation: string;
  plausibility: number;
  supportingEvidence: string[];
  weakeningEvidence: string[];
}
```

---

# Recommended Prompt/Data Package Structure

When sending data to ChatGPT, do not paste random raw articles and ask “what does this mean?”

That works poorly.

Instead, send a structured package:

```text
1. Prompt pretext / analyst instructions
2. Analysis goal
3. Rules and guardrails
4. Confidence scoring rubric
5. Source reliability scale
6. Data schema
7. Source items
8. Extracted entities, if available
9. Extracted signals, if available
10. Known relationships, if available
11. Desired output format
```

## Recommended message structure

```text
[AI CHATBOT PROMPT PRETEXT]

[PROJECT CONTEXT]

[ANALYSIS TASK]

[SCORING RULES]

[DATA PAYLOAD]

[OUTPUT FORMAT]
```

This reduces hallucinations and makes the AI act more like an analyst than a fortune cookie with a GPU.

---

# AI Chatbot Prompt Pretext

Use this as one giant message before the data payload when asking ChatGPT or another LLM to analyze possible events.

```text
You are acting as an intelligence-style event analysis assistant for a lawful, ethical, source-attributed, transparency-first project.

Your job is to analyze the provided structured data and identify possible events that may be indicated by multiple benign or disconnected source items.

You must not claim certainty unless the provided data directly supports it. You must distinguish facts, assumptions, inferences, and speculation.

You must not create accusations against private people. You must not identify private individuals as threats. If a person is mentioned, treat them carefully and only discuss them when directly relevant, publicly documented, and necessary to the analysis.

You must not treat correlation as causation. You must always include alternative explanations and confidence limits.

You must base your conclusions only on the provided data. If the data is insufficient, say so clearly.

Your task is to:

1. Review all source items.
2. Identify meaningful entities, including organizations, places, facilities, public events, products, domains, assets, and topics.
3. Identify event signals, meaning specific claims or observations that something happened, changed, increased, decreased, appeared, disappeared, moved, failed, was delayed, was announced, was warned about, or was otherwise notable.
4. Resolve entities carefully. If two entity names may refer to the same thing but the evidence is weak, mark them as “possibly same as” instead of merging them.
5. Identify relationships between entities, signals, and sources.
6. Cluster related signals into possible events when there is enough overlap in time, location, entities, tags, source corroboration, or sequence pattern.
7. For each possible event, produce:
   - event title
   - event type
   - short summary
   - supporting source IDs
   - supporting signal IDs
   - key entities
   - time window
   - location
   - confidence score from 0.00 to 1.00
   - confidence label
   - severity score from 0.00 to 1.00 if applicable
   - urgency score from 0.00 to 1.00 if applicable
   - explanation of how the conclusion was reached
   - source-backed evidence list
   - assumptions
   - alternative explanations
   - contradictions or missing evidence
   - what would increase confidence
   - what would decrease confidence
   - recommended next checks

8. Use this confidence label scale:
   - 0.85 to 1.00 = high
   - 0.70 to 0.84 = moderate-high
   - 0.55 to 0.69 = moderate
   - 0.40 to 0.54 = moderate-low
   - 0.25 to 0.39 = low
   - 0.00 to 0.24 = very low

9. Score confidence using these factors:
   - source reliability
   - source independence
   - corroboration across multiple sources
   - entity match confidence
   - time proximity
   - location proximity
   - topic/tag overlap
   - baseline anomaly
   - sequence fit
   - contradictions or missing evidence

10. Do not overstate the conclusion. Use language like:
   - “possible”
   - “may indicate”
   - “suggests”
   - “consistent with”
   - “low-confidence”
   - “moderate-confidence”
   - “requires confirmation”

11. Avoid language like:
   - “proves”
   - “definitely”
   - “confirmed”
   - “threat”
   - “guilty”
   - “responsible for”
   unless the provided data directly proves it.

12. Output the analysis in this exact structure:

# Possible Event Analysis

## Executive Summary
Briefly summarize the strongest possible events and the overall reliability of the data.

## Data Quality Notes
Explain the quality, limitations, missing fields, source independence concerns, and reliability issues.

## Extracted Entities
Provide a table with:
- entity ID
- entity name
- entity type
- aliases
- confidence
- supporting source IDs

## Extracted Event Signals
Provide a table with:
- signal ID
- signal title
- signal type
- source IDs
- entity IDs
- time window
- location
- signal strength
- extraction confidence

## Possible Events
For each possible event, provide:

### Event [number]: [title]

**Event Type:**  
**Confidence:** [score] / [label]  
**Severity:** [score or N/A]  
**Urgency:** [score or N/A]  
**Time Window:**  
**Location:**  

**Summary:**  
Explain the event in 2-4 sentences.

**Supporting Evidence:**  
List each supporting signal and source ID.

**Reasoning:**  
Explain step-by-step how the source items connect. Clearly identify whether the connection is based on shared entity, time proximity, location proximity, tag overlap, sequence pattern, anomaly, or corroboration.

**Assumptions:**  
List assumptions required for this event interpretation to be true.

**Alternative Explanations:**  
List at least 3 plausible alternatives.

**Contradictions / Missing Evidence:**  
List what weakens the conclusion.

**What Would Increase Confidence:**  
List specific additional evidence.

**What Would Decrease Confidence:**  
List specific evidence that would weaken or disprove the hypothesis.

**Recommended Next Checks:**  
List safe, lawful, non-invasive next checks.

## Relationship Map
Provide a readable text map of the most important relationships.

Example:
Source src_001 -> supports -> Signal sig_001
Signal sig_001 -> mentions -> Entity ent_terminal_x
Signal sig_001 -> possibly_related_to -> Signal sig_002
Signal sig_001 + sig_002 + sig_003 -> support -> Possible Event evt_001

## Final Notes
Give a cautious final interpretation. Do not overstate certainty.
```

---

# Example Data Payload

This is an example of how to structure the data after the prompt pretext.

```json
{
  "project": {
    "name": "OSIRIS 2.0",
    "analysisGoal": "Identify possible events from disconnected benign source items.",
    "analysisDate": "2026-06-06",
    "timezone": "America/Los_Angeles"
  },
  "sourceItems": [
    {
      "id": "src_001",
      "sourceType": "official_notice",
      "title": "Terminal X reports temporary cargo processing delays",
      "publisher": "Port Authority",
      "url": "https://example.com/terminal-x-delay",
      "publishedAt": "2026-06-06T09:30:00-07:00",
      "retrievedAt": "2026-06-06T09:45:00-07:00",
      "sourceReliability": 0.86,
      "accessLevel": "public",
      "rawText": "Terminal X is experiencing temporary cargo processing delays due to scheduled maintenance. Delays may affect outbound refrigerated shipments.",
      "tags": ["logistics", "port", "delay", "refrigerated_goods"]
    },
    {
      "id": "src_002",
      "sourceType": "status_page",
      "title": "Northline Foods updates delivery ETA",
      "publisher": "Northline Foods",
      "url": "https://example.com/northline-status",
      "publishedAt": "2026-06-06T12:15:00-07:00",
      "retrievedAt": "2026-06-06T12:20:00-07:00",
      "sourceReliability": 0.76,
      "accessLevel": "public",
      "rawText": "Northline Foods has adjusted delivery estimates for Portland metro refrigerated goods orders by 2 to 3 business days.",
      "tags": ["logistics", "delivery", "eta_change", "refrigerated_goods"]
    },
    {
      "id": "src_003",
      "sourceType": "job_posting",
      "title": "Short-notice refrigerated trucking shifts posted near Terminal X",
      "publisher": "Regional Freight Jobs",
      "url": "https://example.com/freight-jobs",
      "publishedAt": "2026-06-06T14:00:00-07:00",
      "retrievedAt": "2026-06-06T14:10:00-07:00",
      "sourceReliability": 0.58,
      "accessLevel": "public",
      "rawText": "Several short-notice refrigerated trucking shifts are available near Terminal X for the next 48 hours.",
      "tags": ["logistics", "trucking", "labor_demand", "refrigerated_goods"]
    }
  ],
  "knownEntities": [
    {
      "id": "ent_terminal_x",
      "type": "facility",
      "name": "Terminal X",
      "aliases": ["Portland Terminal X", "TX Cargo Terminal"],
      "confidence": 0.92,
      "createdFromSourceIds": ["src_001", "src_003"]
    },
    {
      "id": "ent_northline_foods",
      "type": "organization",
      "name": "Northline Foods",
      "aliases": [],
      "confidence": 0.89,
      "createdFromSourceIds": ["src_002"]
    },
    {
      "id": "ent_portland_metro",
      "type": "place",
      "name": "Portland metro",
      "aliases": ["Portland metro area"],
      "confidence": 0.84,
      "createdFromSourceIds": ["src_002"]
    }
  ]
}
```

---

# Example Expected AI Output

```text
# Possible Event Analysis

## Executive Summary

The data suggests one moderate-confidence possible event: a localized refrigerated-goods logistics disruption near Terminal X affecting Portland metro deliveries. The strongest support comes from three source items that overlap on topic, time window, location, and downstream effects. The conclusion remains below high confidence because only one source directly names Terminal X as the cause, and the trucking job postings may be unrelated.

## Data Quality Notes

The data includes one official notice, one company status update, and one lower-reliability job posting source. Source independence appears moderate because the sources come from different publishers. However, the connection between Northline Foods and Terminal X is inferred rather than directly confirmed.

## Extracted Entities

| Entity ID | Name | Type | Aliases | Confidence | Supporting Sources |
|---|---|---|---|---:|---|
| ent_terminal_x | Terminal X | facility | Portland Terminal X, TX Cargo Terminal | 0.92 | src_001, src_003 |
| ent_northline_foods | Northline Foods | organization | none | 0.89 | src_002 |
| ent_portland_metro | Portland metro | place | Portland metro area | 0.84 | src_002 |

## Extracted Event Signals

| Signal ID | Signal Title | Signal Type | Source IDs | Entity IDs | Time Window | Location | Signal Strength | Extraction Confidence |
|---|---|---|---|---|---|---|---:|---:|
| sig_001 | Terminal X reports cargo processing delays | delay_notice | src_001 | ent_terminal_x | 2026-06-06 | Terminal X | 0.78 | 0.88 |
| sig_002 | Northline Foods changes Portland delivery ETA | eta_change | src_002 | ent_northline_foods, ent_portland_metro | 2026-06-06 | Portland metro | 0.69 | 0.82 |
| sig_003 | Refrigerated trucking demand increases near Terminal X | labor_demand | src_003 | ent_terminal_x | 2026-06-06 to 2026-06-08 | near Terminal X | 0.55 | 0.74 |

## Possible Events

### Event 1: Possible refrigerated-goods logistics disruption near Terminal X

**Event Type:** logistics_disruption  
**Confidence:** 0.62 / moderate  
**Severity:** 0.35  
**Urgency:** 0.42  
**Time Window:** 2026-06-06 to 2026-06-08  
**Location:** Terminal X / Portland metro  

**Summary:**  
Three source items may indicate a short-term refrigerated-goods logistics disruption near Terminal X. The strongest connection is the overlap between the official delay notice, the downstream delivery ETA change, and short-notice trucking demand near the same facility.

**Supporting Evidence:**  
- sig_001 / src_001: Official notice of cargo delays at Terminal X.
- sig_002 / src_002: Northline Foods adjusted Portland metro refrigerated goods ETAs.
- sig_003 / src_003: Short-notice refrigerated trucking shifts posted near Terminal X.

**Reasoning:**  
The conclusion is based on shared topic overlap, time proximity, and location proximity. All three sources were published on the same day. Two mention Terminal X directly or nearby. Two mention refrigerated goods. The ETA change may be a downstream effect of the Terminal X delay, but that connection is inferred and not directly confirmed.

**Assumptions:**  
- Northline Foods uses or is affected by Terminal X.
- The trucking job postings are related to the delay rather than routine staffing.
- The refrigerated goods references describe the same logistics chain.

**Alternative Explanations:**  
1. Routine scheduled maintenance with minor unrelated delivery changes.
2. Seasonal refrigerated trucking demand.
3. Northline Foods ETA changes caused by a different supplier or route.
4. Job postings may reflect normal staffing churn.

**Contradictions / Missing Evidence:**  
- No source directly says Northline Foods shipments pass through Terminal X.
- The job posting source has lower reliability.
- No carrier confirmation is provided.

**What Would Increase Confidence:**  
- Carrier confirmation linking Northline Foods shipments to Terminal X.
- Additional supplier ETA changes referencing Terminal X.
- Continued delay notices over multiple days.
- Direct statement from the port or shipper.

**What Would Decrease Confidence:**  
- Northline Foods confirms a different cause.
- Trucking postings are shown to be routine.
- Terminal X delay is resolved quickly with no downstream impact.

**Recommended Next Checks:**  
- Check official port updates.
- Check carrier status pages.
- Check whether affected suppliers route through Terminal X.
- Compare current trucking postings against normal baseline.

## Relationship Map

Source src_001 -> supports -> Signal sig_001  
Signal sig_001 -> mentions -> Entity ent_terminal_x  
Source src_002 -> supports -> Signal sig_002  
Signal sig_002 -> mentions -> Entity ent_northline_foods  
Signal sig_002 -> mentions -> Entity ent_portland_metro  
Source src_003 -> supports -> Signal sig_003  
Signal sig_003 -> mentions -> Entity ent_terminal_x  
Signals sig_001 + sig_002 + sig_003 -> support -> Possible Event evt_001  

## Final Notes

The data is consistent with a possible short-term refrigerated-goods logistics disruption, but it is not enough to confirm one. The event should be treated as a watchlist lead rather than a verified incident.
```

---

# Implementation Notes for a Local-First App

## Suggested feature pages

For OSIRIS, this should not be only a map. You should strongly consider pages like:

```text
/events
/events/:eventId
/entities
/entities/:entityId
/sources
/sources/:sourceId
/timeline
/graph
/dossiers
/settings/scoring
/settings/sources
```

## Recommended UI flow

```text
Source feed
  -> extracted signals
  -> clustered possible events
  -> event card
  -> event dossier page
  -> source evidence
  -> relationship map
  -> timeline
  -> confidence explanation
```

## Event feed card

```text
Possible Event:
Refrigerated-goods logistics disruption near Terminal X

Confidence:
0.62 / Moderate

Why this surfaced:
3 signals within 48 hours
2 sources mention Terminal X or nearby activity
2 sources mention refrigerated goods
1 source describes downstream ETA changes

Buttons:
[View Dossier] [View Sources] [Mark Watchlist] [Reject]
```

## Dossier page sections

```text
1. Summary
2. Confidence score
3. Supporting evidence
4. Source list
5. Timeline
6. Entity list
7. Relationship map
8. Alternative explanations
9. Missing evidence
10. Analyst notes
```

## Cheap local-first analysis methods

| Feature | Low-cost approach |
|---|---|
| Keyword extraction | Term frequency, stopword removal |
| Word cloud | TF-IDF or simple frequency |
| Entity matching | Alias table + fuzzy matching |
| Source clustering | Shared tags/entities/date range |
| Confidence score | Deterministic scoring formula |
| Timeline | Sort event signals by timestamp |
| Dossier page | Group source/signal/entity records |
| Relationship map | Use stored Relationship objects |
| AI report | Only run on clustered payloads, not every raw source |

## AI cost-control strategy

Do not send every source item to AI.

Instead:

```text
1. Ingest everything locally.
2. Extract simple keywords/entities locally.
3. Cluster likely related items locally.
4. Send only the compact cluster package to AI.
5. Cache the AI result.
6. Re-run only when new high-value evidence is added.
```

This keeps cost under control and prevents your app from becoming a money vacuum with a login page.

---

# Risk Controls and Guardrails

## Do

```text
Use public or authorized data.
Show source attribution.
Label uncertainty.
Include alternative explanations.
Allow manual rejection.
Track confidence separately from severity.
Avoid private-person profiling.
Log why a possible event was generated.
Let users inspect the evidence.
```

## Do not

```text
Do not claim prediction as fact.
Do not target private individuals.
Do not infer criminality from weak signals.
Do not merge entities with weak evidence.
Do not hide source limitations.
Do not let AI invent missing evidence.
Do not skip alternative explanations.
Do not use this for harassment or surveillance.
```

## Recommended system warning label

```text
OSIRIS generates possible-event leads from source patterns. These are not confirmed facts. Review all evidence, source quality, assumptions, and alternatives before acting.
```

---

# Source References

The following public sources informed this report:

1. Palantir Foundry Ontology Overview  
   https://palantir.com/docs/foundry/ontology/overview/

2. Palantir Object Types Overview  
   https://palantir.com/docs/foundry/object-link-types/object-types-overview/

3. Palantir Link Types Overview  
   https://palantir.com/docs/foundry/object-link-types/link-types-overview/

4. Palantir Action Types Overview  
   https://palantir.com/docs/foundry/action-types/overview/

5. Palantir Foundry Entity Resolution  
   https://www.palantir.com/foundry-entity-resolution/

6. i2 Analyst’s Notebook  
   https://i2group.com/solutions/i2-analysts-notebook

7. i2 Social Network Analysis Documentation  
   https://docs.i2group.com/anb/10.0.2/about_social_network_analysis.html

8. ODNI Objectivity and Analytic Tradecraft  
   https://www.dni.gov/index.php/how-we-work/objectivity

9. ODNI Intelligence Community Directive 203: Analytic Standards  
   https://www.dni.gov/files/documents/ICD/ICD-203.pdf

---

# Final Project Takeaway

The most useful OSIRIS version is not a magic AI prediction engine.

The better version is:

```text
A transparent, source-backed event intelligence graph that turns scattered public or authorized data into possible-event dossiers with confidence scores, evidence, reasoning, alternatives, and human review.
```

That gives you something genuinely useful: a system that can say, “These separate things may connect, here is why, here is how sure we are, and here is what would prove us wrong.”
