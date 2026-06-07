# OSIRIS 2.0 Strictly Non-AI Intelligence System Build Plan

## Document Purpose

This document defines how to build OSIRIS as a complete intelligence analysis workspace without artificial intelligence, language models, machine-learning models, embedding models, generative systems, or AI-assisted analysis anywhere in the system.

The strictly non-AI version must derive intelligence through:

- immutable source collection;
- explicit schemas;
- dictionaries and registries;
- regular expressions and parsers;
- deterministic normalization;
- exact and fuzzy string matching;
- transparent statistics;
- temporal and geospatial joins;
- graph algorithms;
- versioned rule definitions;
- analyst review;
- template-based reports.

The target system is:

```text
Collection apparatus
+ normalized intelligence ontology
+ deterministic fusion engine
+ rules and transparent statistics
+ analyst review workflow
+ persistent dossiers
+ versioned template-generated intelligence reports
```

---

# 0. Alignment Contract With The AI-Assisted Variant

This document and `OSIRIS_2_AI_ASSISTED_INTELLIGENCE_SYSTEM_BUILD_PLAN.md` describe one system, not two competing architectures.

The strictly non-AI implementation is the complete shared core. The AI-assisted implementation must build this plan unchanged through Phase 9 before enabling any AI capability.

## Shared-Core Invariants

- [ ] Use the same canonical object names, IDs, schemas, state machines, and relationship vocabulary.
- [ ] Use `EventHypothesis` everywhere; do not create a separate AI-specific event object.
- [ ] Use the same source adapters, normalization contracts, evidence graph, deterministic rules, dossiers, assessments, risks, report recipes, and analyst workflows.
- [ ] Use the same core database migrations and APIs.
- [ ] Keep all provider-specific or model-specific fields outside core intelligence objects.
- [ ] Ensure every dossier and report remains complete when no AI extension exists.
- [ ] Do not add empty AI placeholders, hidden AI dependencies, or AI-generated values to this implementation.

## Shared-Core Completion Gate

The shared core is complete only when:

- [ ] Phase 0 through Phase 9 are complete.
- [ ] All end-to-end scenario tests pass using deterministic logic and analyst review only.
- [ ] Every report can be generated without AI-authored text.
- [ ] Every report sentence traces to structured facts or analyst-authored judgments.
- [ ] Disabling all optional extensions cannot break ingestion, fusion, dossiers, review, search, or reporting.
- [ ] The paired AI-assisted plan can consume core objects without changing their schemas.

The strictly non-AI implementation stops after this gate. It remains a complete supported product, not a degraded fallback.

## Synchronized Implementation Phases

| Phase | Shared Deliverable | Strictly Non-AI Result |
|---:|---|---|
| 0 | Approved architecture and scenario walkthroughs | Same |
| 1 | Immutable source, ontology, evidence, versioning, and audit foundation | Same |
| 2 | Deterministic extraction and entity-resolution review | Same |
| 3 | Deterministic fusion, baselines, signals, and event hypotheses | Same |
| 4 | Dossiers, synchronized graph/timeline/map, and analyst review | Same |
| 5 | Analyst assessments, alternatives, risks, and collection requirements | Same |
| 6 | Report recipes, deterministic facts, templates, citations, and approval | Same |
| 7 | Domain playbooks | Same |
| 8 | Historical intelligence | Same |
| 9 | Evaluation, privacy, security, and hardening | Complete strictly non-AI product |

---

# 1. Strict Non-AI Boundary

OSIRIS must not use:

- large language models;
- generative AI;
- AI chatbots;
- embedding models;
- semantic vector search;
- machine-learning classifiers;
- neural image or video analysis;
- AI entity extraction;
- AI relationship extraction;
- AI summarization;
- AI-generated hypotheses;
- AI-written reports;
- third-party APIs that silently perform AI analysis.

If a dependency or service uses AI internally, it must not be used for analytical processing in this system.

Permitted techniques include:

- deterministic parsers;
- regular expressions;
- configured dictionaries;
- gazetteers;
- exact identifiers;
- phonetic and fuzzy string algorithms;
- TF-IDF;
- Jaccard similarity;
- MinHash or locality-sensitive hashing;
- moving averages;
- percentiles;
- standard deviation and z-scores;
- change-point rules using explicit statistical formulas;
- graph traversal and community algorithms;
- deterministic scoring formulas;
- analyst-entered conclusions.

Every automated output must be reproducible from recorded inputs and a versioned algorithm or rule.

---

# 2. Target Outcome

OSIRIS should transform disconnected public or authorized source data into inspectable dossiers and reports without relying on AI interpretation.

```text
Raw source records
  -> deterministic normalization
  -> structured observations and reported claims
  -> dictionary and identifier entity matching
  -> canonical entities
  -> evidence-backed relationships
  -> rule-generated signals
  -> rule-generated event hypotheses
  -> analyst-authored assessments
  -> deterministic risk scenarios
  -> persistent dossiers
  -> template-generated intelligence reports
```

The system should answer:

- What was observed?
- What was reported?
- Which rule generated this signal?
- Which sources and records support it?
- Which entities, times, and locations overlap?
- What changed compared with the historical baseline?
- Which deterministic conditions were satisfied?
- Which conditions were missing or contradictory?
- Which analyst-authored assessment explains the evidence?
- What should be monitored next?

---

# 3. Non-Negotiable Design Principles

- [ ] Preserve every raw source record unchanged.
- [ ] Attach provenance to every derived object.
- [ ] Separate observations, claims, signals, event hypotheses, assessments, and risks.
- [ ] Separate confidence, severity, likelihood, impact, urgency, and priority.
- [ ] Distinguish chronology, proximity, correlation, influence, and causation.
- [ ] Make every automated decision reproducible.
- [ ] Version every rule, formula, dictionary, and registry.
- [ ] Preserve contradicting and weakening evidence.
- [ ] Preserve alternative explanations through analyst-authored structured records.
- [ ] Version every assessment and published report.
- [ ] Require analyst review for causal, influence, attribution, and wrongdoing claims.
- [ ] Never present a statistical correlation as confirmed causation.
- [ ] Never present a template-generated sentence without traceable structured facts.

---

# 4. Intelligence Lifecycle

## 4.1 Direction

- [ ] Define intelligence requirements.
- [ ] Define supported decisions.
- [ ] Define priority intelligence questions.
- [ ] Define standing watch conditions.
- [ ] Define required intelligence products.
- [ ] Define report audiences.
- [ ] Define evidence and confidence standards.
- [ ] Define geographic, topical, entity, and time scope.
- [ ] Define collection gaps and prohibited collection.

## 4.2 Collection

- [ ] Register every source.
- [ ] Record source type, owner, URL, access level, and collection method.
- [ ] Record expected update frequency and geographic coverage.
- [ ] Record known limitations and potential bias.
- [ ] Track source reliability.
- [ ] Track source health, latency, failures, and freshness.
- [ ] Store immutable raw payloads or snapshots.
- [ ] Hash records for exact deduplication and audit.
- [ ] Mark records as observed, reported, static reference, simulated, or analyst-entered.

## 4.3 Processing

- [ ] Parse source-specific formats.
- [ ] Normalize timestamps and preserve original time strings.
- [ ] Normalize locations and preserve original location text.
- [ ] Normalize identifiers without losing original values.
- [ ] Normalize measurements and units.
- [ ] Clean text while preserving raw text.
- [ ] Extract configured keywords, identifiers, locations, and known entities.
- [ ] Produce validation warnings for ambiguous or incomplete records.

## 4.4 Analysis

- [ ] Create observations and claims from deterministic extraction rules.
- [ ] Resolve entity mentions using explicit matching rules.
- [ ] Build evidence-backed relationships.
- [ ] Generate deterministic signals.
- [ ] Cluster signals into event hypotheses.
- [ ] Calculate confidence and risk dimensions.
- [ ] Identify contradictions using structured-field and rule comparisons.
- [ ] Present candidates to analysts.
- [ ] Store analyst-authored assessments and alternatives.
- [ ] Create or update dossiers.

## 4.5 Dissemination

- [ ] Generate reports from approved dossier state.
- [ ] Preserve the exact dossier version used.
- [ ] Include evidence, confidence, alternatives, and information gaps.
- [ ] Use deterministic templates and analyst-authored text.
- [ ] Record publication state and superseding reports.

## 4.6 Feedback

- [ ] Capture analyst approvals and rejections.
- [ ] Capture entity-resolution corrections.
- [ ] Capture false-positive and false-negative signals.
- [ ] Capture report-quality feedback.
- [ ] Adjust rules, thresholds, dictionaries, and formulas through versioned changes.

---

# 5. Unified Intelligence Ontology

All domain playbooks must use one shared ontology.

## 5.1 Core Objects

### Source

The persistent definition of a publisher, sensor, API, feed, dataset, analyst, or system.

### Source Record

An immutable item received from a source.

### Observation

A directly measured or observed fact created from structured data or an analyst-confirmed extraction.

### Claim

A statement made by a source. Claims extracted from text must use explicit rules or analyst entry.

### Entity Mention

A source-specific possible reference to an entity.

### Canonical Entity

A persistent real-world or conceptual object.

### Relationship

An evidence-backed connection between objects.

### Signal

A meaningful change, threshold, anomaly, convergence, or pattern created by a versioned deterministic rule.

### Event Hypothesis

A possible event created when a versioned clustering rule is satisfied.

### Assessment

An analyst-authored analytical judgment.

### Risk Scenario

A deterministic or analyst-authored possible future consequence connecting threat, vulnerability, exposure, likelihood, impact, controls, urgency, and priority.

### Dossier

A persistent analytical workspace centered on an event, entity, location, topic, risk, relationship, campaign, or historical question.

### Intelligence Report

A versioned, time-bounded product generated from structured dossier facts and analyst-approved text.

### Collection Requirement

A documented information gap or requested collection action.

### Analyst Review

A structured record of approval, rejection, correction, merge, split, escalation, or publication.

### Rule Definition

The complete versioned specification for an automated extraction, signal, clustering, contradiction, scoring, or report rule.

## 5.2 Canonical Contract Requirements

Every core object must carry common system metadata:

```text
id
object type
schema version
epistemic status
access level
created time
updated time
valid-from and valid-to time
created-by method
source-record references
evidence references
confidence dimensions
data-quality flags
review status
version
superseded-by reference
```

Object-specific required contracts:

| Object | Required Fields |
|---|---|
| Source | identity, category, ownership, reliability profile, collection method, coverage, limitations |
| Source Record | source ID, raw payload reference, raw hash, published/retrieved times, content type, language |
| Observation | observed value, unit, observed time, location, sensor/source, quality |
| Claim | exact claim text, claimant, claim time, subject entities, evidence excerpt, credibility |
| Entity Mention | source text, offsets, candidate types, candidate entities, extraction rule |
| Canonical Entity | type, canonical name, aliases, identifiers, attributes, valid time |
| Relationship | endpoints, relationship type, evidence, confidence, valid time, review state |
| Signal | rule ID and version, inputs, detection time, strength, status, expiration |
| Event Hypothesis | rule ID and version, event type, signals, location, time window, missing evidence |
| Assessment | analyst judgments, facts, assumptions, alternatives, unknowns, confidence, reviewer |
| Risk Scenario | threat, exposure, vulnerability, likelihood, impact, controls, urgency, priority |
| Dossier | subject, scope, memberships, status, current assessment, active collection requirements |
| Intelligence Report | recipe, dossier snapshot, audience, structured facts, analyst text, citations, approval |
| Collection Requirement | question, priority, target information, acceptable sources, due time, status |
| Analyst Review | reviewer, action, reason, affected object version, timestamp |
| Rule Definition | rule type, input contracts, formula, thresholds, output contract, tests, status, version |

Contract rules:

- [ ] No derived object may exist without input references.
- [ ] No relationship may exist without evidence or an explicit analyst assertion.
- [ ] No assessment may exist without supporting evidence and stated alternatives.
- [ ] No report may exist without a frozen dossier snapshot and recipe version.
- [ ] No automated result may exist without a rule ID and version.
- [ ] Data-quality warnings must propagate into downstream confidence.

---

# 6. Truth And Provenance Model

Every intelligence object must declare its epistemic status.

```text
observed
reported
deterministically-derived
analyst-assessed
confirmed
disputed
rejected
simulated
static-reference
```

## Required Provenance Chain

```text
Report sentence
  -> structured report field or analyst judgment
  -> assessment or event hypothesis
  -> supporting and contradicting signals
  -> observations and claims
  -> immutable source records
  -> registered sources
```

- [ ] Make every report sentence traceable.
- [ ] Store every rule version.
- [ ] Store every dictionary and registry version.
- [ ] Store every scoring-model version.
- [ ] Preserve old object versions after correction.
- [ ] Record every analyst edit and disposition.

---

# 7. Deterministic Extraction System

## 7.1 Structured Source Adapters

Each API or feed requires an explicit adapter that maps source fields into the shared ontology.

- [ ] ADS-B aircraft adapter
- [ ] AIS vessel adapter
- [ ] Satellite adapter
- [ ] Earthquake adapter
- [ ] Fire and volcano adapter
- [ ] Weather-alert adapter
- [ ] Air-quality adapter
- [ ] Space-weather adapter
- [ ] Market-data adapter
- [ ] Infrastructure and supplier adapter
- [ ] Cyber-advisory adapter
- [ ] Domain, IP, DNS, BGP, certificate, and sanctions adapters
- [ ] RSS and Atom adapter
- [ ] Telegram source adapter
- [ ] CCTV metadata adapter
- [ ] Sentinel scene-metadata adapter
- [ ] Analyst note and historical-source adapter

Each adapter must define:

- source schema;
- target fields;
- field validation;
- timestamp semantics;
- coordinate semantics;
- identifier semantics;
- missing-value behavior;
- provenance links;
- adapter version.

## 7.2 Text Extraction Without AI

Use:

- regular expressions;
- keyword packs;
- entity alias registries;
- gazetteers;
- lookup tables;
- finite-state parsers;
- source-specific templates;
- deterministic sentence splitting;
- configured verb and relationship patterns.

Examples:

```text
"closed", "shutdown", "suspended" near port name
  -> reported operational-status claim

CVE pattern
  -> vulnerability entity mention

MMSI, ICAO, NORAD, domain, IP, ASN, ticker, and country codes
  -> exact identifier mentions

"X acquired Y"
  -> candidate acquisition relationship requiring analyst review
```

## 7.3 Manual Extraction Queue

Ambiguous records should enter a review queue instead of being forcefully interpreted.

- [ ] Show raw text.
- [ ] Show matched terms and patterns.
- [ ] Suggest registry candidates.
- [ ] Allow analyst to create claims and entities.
- [ ] Preserve analyst identity and timestamp.

---

# 8. Deterministic Entity Resolution

## 8.1 Match Strength Order

```text
exact authoritative identifier
exact normalized identifier
analyst-confirmed alias
exact canonical name
configured alias
normalized name plus compatible attributes
fuzzy name plus compatible attributes
geographic and temporal compatibility
analyst review
```

## 8.2 Permitted Algorithms

- exact matching;
- normalized string matching;
- Levenshtein distance;
- Jaro-Winkler similarity;
- Soundex or phonetic comparison where appropriate;
- token-set similarity;
- weighted attribute matching;
- analyst-confirmed merge and split.

## 8.3 Resolution Rules

- [ ] Never merge entities solely from fuzzy name similarity.
- [ ] Preserve all source-specific mentions.
- [ ] Preserve competing candidate matches.
- [ ] Show match evidence and score components.
- [ ] Require analyst review for consequential ambiguous matches.
- [ ] Support merge reversal.
- [ ] Version alias and identity changes.

---

# 9. Relationship Vocabulary

Use precise relationship types and prohibit silent causal inference.

## Evidence Relationships

```text
supports
weakens
contradicts
contextualizes
derived_from
reported_by
observed_by
corroborates
disputes
supersedes
```

## Temporal Relationships

```text
occurred_before
occurred_after
overlaps_in_time
preceded
followed
valid_during
```

## Geospatial Relationships

```text
located_at
located_near
inside
crosses
approaches
departed_from
arrived_at
travels_through
exposed_to
```

## Entity And Dependency Relationships

```text
same_as
possibly_same_as
part_of
owned_by
operated_by
member_of
affiliated_with
depends_on
supplies
uses
hosts
routes_through
affects
```

## Analytical Relationships

```text
possible_consequence_of
contributing_condition_for
organizational_successor_of
organizational_split_from
assessed_as
creates_risk_for
```

Relationships such as `influenced`, `possibly_caused_by`, and `confirmed_caused_by` must be analyst-authored and evidence-cited.

---

# 10. Deterministic Signal Engine

## 10.1 Rule Definition Requirements

Every rule must include:

- rule ID;
- title and purpose;
- domain;
- version;
- enabled state;
- required inputs;
- optional supporting inputs;
- contradicting inputs;
- time window;
- geographic window;
- entity conditions;
- threshold conditions;
- output signal type;
- score formula;
- cooldown and expiration;
- limitations;
- test cases.

## 10.2 Signal Categories

- [ ] Threshold signal
- [ ] Proximity signal
- [ ] Temporal-convergence signal
- [ ] Multi-source corroboration signal
- [ ] Contradiction signal
- [ ] Baseline-deviation signal
- [ ] Trend signal
- [ ] Change-point signal
- [ ] Graph-pattern signal
- [ ] Dependency-exposure signal
- [ ] Collection-gap signal
- [ ] Source-health signal

## 10.3 Example Rules

```text
IF military aircraft count in region
   > 30-day same-hour median * configured multiplier
AND observation coverage is sufficient
THEN create military_activity_deviation signal
```

```text
IF port waiting-vessel ratio > configured threshold
AND at least two independent delay claims exist
THEN create corroborated_port_congestion signal
```

```text
IF earthquake magnitude >= configured threshold
AND distance to nuclear facility < configured distance
THEN create nuclear_facility_seismic_exposure signal
```

```text
IF domain registration age < configured days
AND string similarity to watched organization > threshold
AND threat-reputation record exists
THEN create suspicious_lookalike_domain signal
```

---

# 11. Statistical And Algorithmic Analysis

## 11.1 Baselines

Store baselines by:

- entity;
- location;
- hour of day;
- day of week;
- season;
- source;
- signal category;
- route;
- facility;
- market instrument.

## 11.2 Permitted Methods

| Method | Use |
|---|---|
| Moving average | Trend and normal activity |
| Median and percentile bands | Robust baseline ranges |
| Z-score | Transparent anomaly detection |
| Rate of change | Escalation and cooling |
| Change-point threshold rules | Behavior shifts |
| TF-IDF | Document-term comparison |
| Jaccard similarity | Entity and keyword overlap |
| MinHash | Approximate duplicate detection |
| Temporal joins | Time-window convergence |
| Spatial joins | Proximity and exposure |
| Connected components | Relationship clusters |
| Community detection | Dense graph groups |
| Shortest path | Dependency and evidence chains |
| Centrality measures | Important graph nodes |

Every method must document:

- formula;
- assumptions;
- minimum sample size;
- threshold;
- missing-data behavior;
- interpretation limits.

---

# 12. Event Hypothesis Formation

Event candidates must be generated by explicit clustering recipes.

## 12.1 Candidate Inputs

- compatible signal categories;
- overlapping time windows;
- overlapping or nearby locations;
- shared entities;
- shared identifiers;
- independent source support;
- compatible relationship patterns;
- contradicting evidence.

## 12.2 Candidate Output

```text
candidate title
candidate event type
supporting signal IDs
contradicting signal IDs
shared entities
location and precision
time window
rule-generated explanation
confidence score and breakdown
missing expected evidence
analyst review status
```

## 12.3 Analyst Responsibilities

- [ ] Confirm, reject, merge, or split candidates.
- [ ] Write or select alternative explanations.
- [ ] Approve causal or influence relationships.
- [ ] Author analytical judgments.
- [ ] Define collection requirements.

## 12.4 Reference Flow: Possible Port Disruption

This walkthrough must be representable without special-case data structures.

```text
1. AIS collector stores vessel-position source records.
2. Port authority RSS collector stores a delay notice.
3. Weather collector stores a severe-weather alert.
4. Source adapters create vessel observations and weather observations.
5. Keyword, entity-alias, and sentence-pattern rules extract a reported-delay claim.
6. Exact and configured-alias matching links the claim to the canonical port entity.
7. Deterministic rules create:
   - elevated waiting-vessel ratio signal;
   - multi-source delay-report signal;
   - weather exposure signal.
8. Event-candidate clustering creates a possible port-disruption candidate.
9. The evidence graph connects observations, claims, signals, entities, and contradictions.
10. The rule explanation lists satisfied conditions and missing expected evidence.
11. Deterministic confidence scoring exposes score components.
12. An analyst confirms, edits, or rejects the candidate.
13. The analyst authors alternative explanations:
    - routine congestion;
    - scheduled maintenance;
    - temporary weather slowdown.
14. The port dossier gains the event, timeline, graph, risk scenarios, and collection requirements.
15. A supply-chain disruption report recipe freezes the dossier state.
16. Controlled templates assemble structured facts, while analysts author judgments.
17. Citation validation and analyst approval produce the published report.
18. Later evidence updates the dossier but does not alter the historical report snapshot.
```

Required visible reasoning chain:

```text
Source records
  -> observations and claims
  -> deterministic signals
  -> possible port-disruption candidate
  -> analyst-authored assessment
  -> supply-chain risk scenario
  -> published report
```

---

# 13. Scoring Framework

## 13.1 Separate Scores

- [ ] Source reliability
- [ ] Record credibility
- [ ] Extraction confidence
- [ ] Timestamp precision
- [ ] Geographic precision
- [ ] Entity-resolution confidence
- [ ] Relationship confidence
- [ ] Signal strength
- [ ] Event-candidate confidence
- [ ] Analyst assessment confidence
- [ ] Severity
- [ ] Likelihood
- [ ] Exposure
- [ ] Impact
- [ ] Urgency
- [ ] Priority

## 13.2 Confidence Inputs

Confidence may increase from:

- independent sources;
- primary or official evidence;
- direct observations;
- exact identifiers;
- precise location and time;
- agreement across different source domains;
- validated entity matches;
- analyst-approved relationships;
- consistent historical patterns.

Confidence may decrease from:

- circular reporting;
- approximate locations;
- stale records;
- ambiguous matches;
- contradictions;
- missing expected evidence;
- simulated or static-reference data;
- source outages and collection gaps.

All score calculations must expose their exact component values and rule versions.

---

# 14. Dossier System

## 14.1 Dossier Types

- [ ] Event dossier
- [ ] Entity dossier
- [ ] Location or region dossier
- [ ] Facility or infrastructure dossier
- [ ] Relationship dossier
- [ ] Signal dossier
- [ ] Assessment dossier
- [ ] Risk dossier
- [ ] Campaign dossier
- [ ] Narrative dossier
- [ ] Historical lineage dossier
- [ ] Investigation or case dossier

## 14.2 Required Dossier Sections

```text
Identity and scope
Current status
Analyst-authored key judgments
Confidence and score breakdown
Known facts
Direct observations
Reported claims
Supporting evidence
Contradicting evidence
Entities and relationships
Map and geographic context
Timeline and lead-up
Active and historical signals
Event candidates
Analyst-authored alternative explanations
Risk scenarios
Affected assets and dependencies
Information gaps
Collection requirements
Indicators to watch
Analyst notes and review history
Source provenance
Generated reports
```

## 14.3 Dossier Interactions

- [ ] Selecting a graph node highlights the map, timeline, evidence, and report references.
- [ ] Selecting a report sentence reveals structured facts and analyst judgments.
- [ ] Analysts can inspect the graph as it existed at a past time.
- [ ] Analysts can compare current and previous dossier states.
- [ ] Analysts can branch competing hypotheses.
- [ ] Analysts can reconstruct why a rule fired.

---

# 15. Graph And Timeline Design

## 15.1 Node Types

```text
source
source record
observation
claim
entity
relationship
signal
event hypothesis
assessment
risk scenario
collection requirement
report
```

## 15.2 Visual Semantics

```text
Solid edge: analyst-approved or directly confirmed relationship
Dashed edge: deterministic derivation
Red edge: disputed or contradicting relationship
Gray edge: chronology or proximity only
```

- [ ] Never imply causality through graph proximity.
- [ ] Display edge labels.
- [ ] Show relationship confidence and evidence count.
- [ ] Allow filtering by time, domain, confidence, and review state.
- [ ] Allow lead-up, aftermath, lineage, dependency, and evidence graph modes.

## 15.3 Timeline Modes

- [ ] Chronological event timeline
- [ ] Signal accumulation timeline
- [ ] Intelligence-at-the-time timeline
- [ ] Confidence-change timeline
- [ ] Entity relationship history
- [ ] Organizational lineage
- [ ] Decision and consequence chain
- [ ] Dossier revision history

---

# 16. Reports Without AI

Reports must be assembled from:

- deterministic structured facts;
- score explanations;
- registered report recipes;
- controlled text templates;
- analyst-authored judgments and alternatives;
- cited evidence lists.

## 16.1 Template Example

```text
[Assessment title]

Status:
{assessment_status}

Key judgment:
{analyst_approved_judgment}

Confidence:
{confidence_label} ({confidence_score})

Confidence basis:
- {confidence_reason_1}
- {confidence_reason_2}
- {confidence_limitation_1}

Supporting evidence:
- {source_linked_evidence}

Contradicting evidence:
- {source_linked_contradiction}

Alternative explanations:
- {analyst_authored_alternative}

Indicators to watch:
- {rule_or_analyst_defined_indicator}
```

## 16.2 Report Recipe Requirements

Every recipe must define:

```text
Report identity and domain
Analytical question
Required inputs
Supporting inputs
Contradicting inputs
Temporal window
Geographic rules
Entity and relationship rules
Trigger conditions
Derived metrics
Permitted template statements
Prohibited statements
Required analyst-written sections
Confidence model
Output sections
Collection requirements
Limitations
Approval requirements
```

## 16.3 Initial Report Families

- [ ] Global daily intelligence brief
- [ ] Regional situation estimate
- [ ] Emerging hotspot report
- [ ] Cross-domain anomaly report
- [ ] Conflict escalation assessment
- [ ] Reported attack corroboration
- [ ] Force mobilization warning
- [ ] Electronic-warfare assessment
- [ ] Port and chokepoint disruption assessment
- [ ] Strategic supplier exposure report
- [ ] Critical infrastructure disruption report
- [ ] Compound-hazard assessment
- [ ] Humanitarian access assessment
- [ ] Narrative keyword and source-divergence report
- [ ] Cyber threat-infrastructure dossier
- [ ] Risk scenario decision brief
- [ ] Historical lineage and causal-claims dossier

---

# 17. Historical Intelligence Without AI

Historical dossiers require analyst-curated source imports and relationships.

The system must distinguish:

```text
documented organizational succession
confirmed direct relationship
analyst-assessed influence
contributing condition
disputed causal interpretation
chronology only
later retrospective interpretation
```

- [ ] Import cited historical source records.
- [ ] Create entities, events, and claims through analyst entry or explicit extraction rules.
- [ ] Store source excerpts and citations.
- [ ] Represent competing interpretations as separate assessments.
- [ ] Preserve valid-time ranges.
- [ ] Support organizational splits, mergers, renaming, and succession.
- [ ] Require analyst approval for all causal and influence relationships.
- [ ] Show intelligence-at-the-time separately from hindsight.

---

# 18. Storage And Versioning Strategy

The data layer must support:

- immutable raw source storage;
- normalized relational records;
- graph relationships;
- geospatial geometry;
- time-series observations;
- full-text and fielded search;
- object version history;
- report snapshots;
- analyst review history;
- rule, formula, dictionary, and registry versions.

## Recommended Logical Stores

```text
sources
source_records
observations
claims
entity_mentions
entities
entity_aliases
relationships
relationship_evidence
signals
signal_evidence
event_hypotheses
assessments
assessment_evidence
risk_scenarios
dossiers
dossier_memberships
collection_requirements
analyst_reviews
report_recipes
reports
report_citations
object_versions
rule_definitions
rule_runs
dictionaries
gazetteers
registry_versions
baseline_snapshots
```

## Required Time Model

- [ ] Observed time
- [ ] Reported or published time
- [ ] Retrieved time
- [ ] Valid-from and valid-to time
- [ ] System creation time
- [ ] Superseded time

---

# 19. Analyst Workflow And State Machines

## Signal

```text
new -> acknowledged -> monitoring -> escalating -> cooling -> resolved
                                    -> rejected
```

## Event Hypothesis

```text
candidate -> needs_review -> corroborated -> confirmed
                          -> disputed
                          -> rejected
                          -> merged
                          -> archived
```

## Assessment

```text
draft -> reviewed -> approved -> published -> superseded
               -> withdrawn
```

## Dossier

```text
active -> monitoring -> dormant -> reopened -> archived
```

## Rule Change

```text
draft -> tested -> approved -> active -> deprecated -> retired
```

---

# 20. UI And Page Architecture

## Core Workspace Pages

```text
/map
/feed
/signals
/events/[id]
/entities/[id]
/relationships/[id]
/locations/[id]
/dossiers/[id]
/assessments/[id]
/risks/[id]
/reports/[id]
/sources
/collection-requirements
/review-queue
/rules
/dictionaries
/baselines
/search
/settings
```

## Non-AI Analyst Surfaces

- [ ] Rule definition and simulation page
- [ ] Rule-run explanation page
- [ ] Entity-resolution review queue
- [ ] Manual extraction queue
- [ ] Contradiction review queue
- [ ] Baseline and anomaly inspector
- [ ] Dictionary and gazetteer manager
- [ ] Report-template editor
- [ ] Analyst assessment editor
- [ ] Data-quality and source-health dashboard

---

# 21. Validation

## 21.1 Unit And Contract Validation

- [ ] Source-adapter contract tests
- [ ] Parser tests
- [ ] Dictionary-matching tests
- [ ] Identifier-extraction tests
- [ ] Entity-resolution tests
- [ ] Relationship-evidence tests
- [ ] Temporal-join tests
- [ ] Geospatial-join tests
- [ ] Statistical-method tests
- [ ] Rule-engine tests
- [ ] Confidence-model tests
- [ ] Report-template tests
- [ ] Dossier-version reconstruction tests

## 21.2 Rule Evaluation

For every signal and event-hypothesis rule:

- [ ] Define known-positive fixtures.
- [ ] Define known-negative fixtures.
- [ ] Define boundary-condition fixtures.
- [ ] Define missing-data fixtures.
- [ ] Measure false positives.
- [ ] Measure false negatives.
- [ ] Measure source-coverage dependency.
- [ ] Require approval before activation.

## 21.3 End-To-End Scenario Tests

- [ ] Possible maritime chokepoint disruption
- [ ] Possible military escalation
- [ ] Possible infrastructure outage
- [ ] Possible cyber campaign
- [ ] Possible supplier disruption
- [ ] Possible narrative divergence
- [ ] Historical organizational-lineage question

Each scenario must prove:

- raw sources remain inspectable;
- every automated output identifies its exact rule;
- evidence survives every transformation;
- contradictions and alternatives remain visible;
- analysts can correct the system;
- reports contain no unsupported template statements.

---

# 22. Security, Privacy, And Governance

- [ ] Public, authorized, restricted, and prohibited access levels
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Source and dossier retention policies
- [ ] Sensitive-field redaction
- [ ] Secrets isolation
- [ ] Human approval for high-impact reporting
- [ ] Clear labels for simulated content
- [ ] No default private-person surveillance
- [ ] Review of external services to ensure they do not perform hidden AI analysis

---

# 23. Build Order

## Phase 0: Design Freeze

- [ ] Approve ontology.
- [ ] Approve relationship vocabulary.
- [ ] Approve provenance model.
- [ ] Approve score definitions.
- [ ] Approve dossier structure.
- [ ] Approve report-recipe structure.
- [ ] Approve strict non-AI boundary.
- [ ] Complete scenario walkthroughs.

## Phase 1: Intelligence Foundation

- [ ] Build immutable source registry and source-record storage.
- [ ] Build source adapters and normalization contracts.
- [ ] Build canonical entity and alias store.
- [ ] Build relationship and evidence store.
- [ ] Build versioning and audit records.

## Phase 2: Deterministic Extraction

- [ ] Build identifier extraction.
- [ ] Build keyword and category extraction.
- [ ] Build gazetteer and entity matching.
- [ ] Build manual extraction queue.
- [ ] Build entity-resolution review.

## Phase 3: Deterministic Fusion

- [ ] Build temporal and geospatial joins.
- [ ] Build baseline store.
- [ ] Build statistical utilities.
- [ ] Build rule engine.
- [ ] Build signal lifecycle.
- [ ] Build event-hypothesis clustering.

## Phase 4: Dossier Workspace

- [ ] Build event, entity, signal, relationship, and location dossiers.
- [ ] Build graph, timeline, evidence, and map synchronization.
- [ ] Build analyst review workflow.
- [ ] Build rule-run explanation surfaces.

## Phase 5: Assessment And Risk

- [ ] Build analyst-authored assessment lifecycle.
- [ ] Build alternative-explanation records.
- [ ] Build risk scenarios and control mapping.
- [ ] Build collection requirements.

## Phase 6: Reporting

- [ ] Build report-recipe registry.
- [ ] Build deterministic report facts.
- [ ] Build controlled templates.
- [ ] Build analyst-authored judgment sections.
- [ ] Build citation validation and approval.

## Phase 7: Domain Playbooks

- [ ] Event intelligence
- [ ] GEOINT
- [ ] Threat intelligence
- [ ] Cyber intelligence
- [ ] Infrastructure intelligence
- [ ] Supply-chain intelligence
- [ ] Business and market intelligence
- [ ] Social and narrative intelligence
- [ ] Operational intelligence
- [ ] Financial and fraud intelligence
- [ ] Risk intelligence

## Phase 8: Historical Intelligence

- [ ] Historical source imports
- [ ] Analyst-curated lineage and influence relationships
- [ ] Competing interpretations
- [ ] Intelligence-at-the-time reconstruction

## Phase 9: Evaluation And Hardening

- [ ] Complete rule evaluation suites.
- [ ] Measure false positives and false negatives.
- [ ] Conduct security and privacy review.
- [ ] Validate every report recipe.
- [ ] Audit all dependencies and external services for hidden AI.
- [ ] Pass the Shared-Core Completion Gate.

---

# 24. Definition Of Done

The strictly non-AI OSIRIS architecture is ready for implementation only when:

- [ ] Every object has a documented purpose and schema.
- [ ] Every transformation has defined inputs, outputs, provenance, and a versioned rule.
- [ ] Every score has a defined meaning and formula.
- [ ] Every dossier can reconstruct its evidence and history.
- [ ] Every report sentence can trace to structured facts or analyst-authored judgments.
- [ ] Chronology and correlation cannot visually masquerade as causation.
- [ ] Contradictions and alternatives cannot be silently removed.
- [ ] Analysts can inspect why every automated rule fired.
- [ ] Analysts can reject, correct, merge, and split derived objects.
- [ ] No system capability depends on AI, machine learning, embeddings, or generative services.

The final product should behave as a deterministic evidence system first, an analyst-controlled intelligence workspace second, and a reproducible report-generation platform third.
