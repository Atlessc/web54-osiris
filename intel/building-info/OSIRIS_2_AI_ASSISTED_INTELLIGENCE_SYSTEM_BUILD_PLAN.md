# OSIRIS 2.0 AI-Assisted Intelligence System Build Plan

## Document Purpose

This document defines how to build OSIRIS as a complete evidence-first intelligence analysis workspace with optional, auditable AI assistance.

The AI-assisted version must remain a functioning intelligence system when every AI provider is unavailable. AI may accelerate extraction, comparison, hypothesis generation, and report drafting, but it must never become:

- the source of truth;
- the only path from source data to a dossier;
- an invisible relationship generator;
- the final authority for high-impact judgments;
- a replacement for provenance, deterministic validation, or analyst review.

The target system is:

```text
Collection apparatus
+ normalized intelligence ontology
+ temporal, geospatial, and relationship fusion
+ deterministic signal engine
+ AI-assisted interpretation
+ analyst review workflow
+ persistent dossiers
+ versioned intelligence products
```

---

# 0. Alignment Contract With The Strictly Non-AI Variant

This document and `OSIRIS_2_STRICTLY_NON_AI_INTELLIGENCE_SYSTEM_BUILD_PLAN.md` describe one system, not two competing architectures.

The strictly non-AI plan is the normative shared-core implementation. Build it unchanged through Phase 9. AI work begins only after the Shared-Core Completion Gate passes.

## Shared-Core Invariants

- [ ] Use the same canonical object names, IDs, schemas, state machines, and relationship vocabulary.
- [ ] Use `EventHypothesis` everywhere; do not create an AI-specific event or assessment object.
- [ ] Use the same source adapters, normalization contracts, evidence graph, deterministic rules, dossiers, assessments, risks, report recipes, and analyst workflows.
- [ ] Use the same core database migrations and APIs.
- [ ] Keep provider-specific and model-specific fields in extension-side records only.
- [ ] Treat every AI result as an untrusted `AIProposal`.
- [ ] Ensure AI-disabled behavior is functionally identical to the strictly non-AI implementation.

## Shared-Core Completion Gate

No AI worker, provider call, embedding process, or AI-derived workflow may be enabled until:

- [ ] Phase 0 through Phase 9 of the strictly non-AI build are complete.
- [ ] All deterministic end-to-end scenario tests pass.
- [ ] Every dossier and report works without AI-authored content.
- [ ] The evidence graph, review workflow, and report citation validator are operational.
- [ ] AI extension records can be deleted without deleting or corrupting core intelligence records.
- [ ] Turning the AI feature flag off leaves ingestion, fusion, dossiers, review, search, and reporting fully operational.

## Permitted Divergence After The Gate

After the gate, the AI-assisted variant may add only sidecar capabilities:

```text
ai_runs
ai_proposals
ai_proposal_evidence
ai_evaluations
ai_provider_policies
prompt_versions
```

AI workers may read approved core objects and create proposals. They may not write directly to observations, claims, entities, relationships, signals, event hypotheses, assessments, risk scenarios, dossiers, or reports.

## Synchronized Implementation Phases

| Phase | Shared Deliverable | AI-Assisted Result |
|---:|---|---|
| 0 | Approved architecture and scenario walkthroughs | Same, with AI boundary documented but inactive |
| 1 | Immutable source, ontology, evidence, versioning, and audit foundation | Same |
| 2 | Deterministic extraction and entity-resolution review | Same |
| 3 | Deterministic fusion, baselines, signals, and event hypotheses | Same |
| 4 | Dossiers, synchronized graph/timeline/map, and analyst review | Same |
| 5 | Analyst assessments, alternatives, risks, and collection requirements | Same |
| 6 | Report recipes, deterministic facts, templates, citations, and approval | Same |
| 7 | Domain playbooks | Same |
| 8 | Historical intelligence | Same |
| 9 | Evaluation, privacy, security, and hardening | Shared-Core Completion Gate |
| 10+ | Optional AI sidecar capabilities | AI proposals, drafting assistance, and evaluated workers |

---

# 1. Target Outcome

OSIRIS should transform disconnected public or authorized source data into inspectable intelligence dossiers and reports.

```text
Raw source records
  -> normalized observations and claims
  -> entity mentions
  -> canonical entities
  -> evidence-backed relationships
  -> deterministic signals
  -> AI-proposed semantic findings
  -> event hypotheses
  -> assessments
  -> risk scenarios
  -> persistent dossiers
  -> versioned intelligence reports
```

The system should answer:

- What happened or may be happening?
- Which source records support that conclusion?
- Which observations are directly measured?
- Which claims are merely reported?
- Which relationships are confirmed, inferred, disputed, or AI-proposed?
- What changed from the established baseline?
- Which entities, locations, assets, and systems may be affected?
- What are the strongest alternative explanations?
- What information is missing?
- What should be monitored next?
- How has the assessment changed over time?

---

# 2. Non-Negotiable Design Principles

- [ ] Preserve every raw source record unchanged.
- [ ] Attach provenance to every derived object.
- [ ] Separate observations, claims, signals, hypotheses, assessments, and risks.
- [ ] Separate confidence, severity, likelihood, impact, urgency, and priority.
- [ ] Distinguish chronology, proximity, correlation, influence, and causation.
- [ ] Make all AI-generated objects visibly identifiable.
- [ ] Require evidence citations for every AI proposal.
- [ ] Preserve contradicting and weakening evidence.
- [ ] Preserve alternative explanations.
- [ ] Version every assessment and published report.
- [ ] Allow analysts to approve, reject, correct, merge, split, and supersede objects.
- [ ] Record why every automated or analyst action occurred.
- [ ] Make the system useful without AI.
- [ ] Do not allow generated prose to create unsupported facts.

---

# 3. Intelligence Lifecycle

## 3.1 Direction

Direction defines why OSIRIS is collecting and analyzing information.

- [ ] Define intelligence requirements.
- [ ] Define supported decisions.
- [ ] Define priority intelligence questions.
- [ ] Define standing watch conditions.
- [ ] Define required intelligence products.
- [ ] Define report audiences.
- [ ] Define acceptable evidence and confidence standards.
- [ ] Define geographic, topical, entity, and time scope.
- [ ] Define collection gaps and prohibited collection.

## 3.2 Collection

- [ ] Register every source in a source catalog.
- [ ] Record source type, owner, URL, access level, and collection method.
- [ ] Record expected update frequency and geographic coverage.
- [ ] Record known source limitations and potential bias.
- [ ] Track source reliability separately from individual-record credibility.
- [ ] Track source health, latency, failures, and data freshness.
- [ ] Store immutable raw payloads or source snapshots.
- [ ] Hash raw records for deduplication and audit.
- [ ] Mark records as observed, reported, static reference, simulated, or analyst-entered.

## 3.3 Processing

- [ ] Normalize timestamps and preserve original time strings.
- [ ] Normalize locations and preserve original location text.
- [ ] Normalize identifiers without losing original values.
- [ ] Normalize measurements and units.
- [ ] Clean text while preserving raw text.
- [ ] Extract deterministic identifiers and known entities.
- [ ] Submit eligible records to AI extraction workers.
- [ ] Validate AI extraction results against schemas and source excerpts.

## 3.4 Analysis

- [ ] Create observations and claims.
- [ ] Resolve entity mentions into canonical entities.
- [ ] Build evidence-backed relationships.
- [ ] Generate deterministic signals.
- [ ] Generate AI-assisted semantic proposals.
- [ ] Cluster signals into candidate events.
- [ ] Generate and test hypotheses.
- [ ] Calculate confidence and risk dimensions.
- [ ] Identify contradictions and alternative explanations.
- [ ] Create or update dossiers.

## 3.5 Dissemination

- [ ] Generate reports from approved dossier state.
- [ ] Preserve the exact dossier version used for each report.
- [ ] Include evidence, confidence, alternatives, and information gaps.
- [ ] Support executive, analyst, operational, warning, and historical products.
- [ ] Record recipients, publication state, and superseding reports.

## 3.6 Feedback

- [ ] Capture analyst approvals and rejections.
- [ ] Capture entity-resolution corrections.
- [ ] Capture false-positive and false-negative signals.
- [ ] Capture report-quality feedback.
- [ ] Measure AI proposal acceptance rates.
- [ ] Improve deterministic rules and AI prompts from reviewed outcomes.

---

# 4. Unified Intelligence Ontology

All domain playbooks must use one shared ontology. Domain-specific fields should extend shared objects rather than create separate intelligence systems.

## 4.1 Core Objects

### Source

The persistent definition of a publisher, sensor, API, feed, dataset, analyst, or system.

Required concepts:

- source identity;
- source category;
- collection method;
- access level;
- reliability profile;
- ownership and independence relationships;
- geographic and topical coverage;
- health and freshness;
- known limitations.

### Source Record

An immutable item received from a source.

Examples:

- RSS article;
- Telegram post;
- ADS-B response;
- AIS position;
- earthquake measurement;
- weather alert;
- CVE advisory;
- analyst note;
- imported historical document.

### Observation

A directly measured or directly observed fact.

Examples:

- an aircraft was observed at a coordinate and time;
- a vessel reported a speed of 0.2 knots;
- an earthquake sensor recorded magnitude 5.4;
- an RSS endpoint returned HTTP 503.

### Claim

A statement made by a source.

Examples:

- a port authority claims operations are delayed;
- a news article reports an explosion;
- a government states a ceasefire remains active.

Claims may conflict without either claim being automatically deleted.

### Entity Mention

A source-specific possible reference to an entity.

### Canonical Entity

A persistent real-world or conceptual object.

Entity types should include:

- person;
- organization;
- government;
- group;
- company;
- supplier;
- product;
- commodity;
- facility;
- infrastructure asset;
- service;
- location;
- region;
- route;
- port;
- chokepoint;
- vessel;
- aircraft;
- satellite;
- domain;
- IP address;
- ASN;
- vulnerability;
- threat actor;
- campaign;
- topic;
- narrative;
- historical event.

### Relationship

An evidence-backed connection between objects.

Every relationship must include:

- relationship type;
- from-object and to-object;
- valid time range;
- supporting evidence;
- contradicting evidence;
- confidence;
- derivation method;
- review state;
- explanation.

### Signal

A meaningful change, threshold, anomaly, convergence, or pattern.

Signals are leads, not conclusions.

### Event Hypothesis

A possible real-world event formed from related signals, claims, observations, entities, time, and location.

### Assessment

An analytical judgment explaining what evidence may mean.

### Risk Scenario

A possible future consequence connecting threat, vulnerability, exposure, likelihood, impact, controls, urgency, and priority.

### Dossier

A persistent analytical workspace centered on an event, entity, location, topic, risk, relationship, campaign, or historical question.

### Intelligence Report

A versioned, time-bounded published product generated from a dossier.

### Collection Requirement

A documented information gap or requested collection action.

### Analyst Review

A structured record of approval, rejection, correction, merge, split, escalation, or publication.

### Rule Definition

The complete versioned specification for an automated extraction, signal, clustering, contradiction, scoring, or report rule.

### AI Proposal Extension Object

An explicitly untrusted proposal produced by an AI worker.

`AIProposal` is an extension-side object. It is not part of the required shared-core ontology and no core object may depend on it.

Required fields:

- task type;
- proposed object or change;
- source record IDs;
- supporting excerpts;
- reasoning summary;
- model and model version;
- prompt version;
- generation timestamp;
- proposal confidence;
- validation results;
- analyst review state.

## 4.2 Canonical Contract Requirements

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
| Entity Mention | source text, offsets, candidate types, candidate entities, extraction method |
| Canonical Entity | type, canonical name, aliases, identifiers, attributes, valid time |
| Relationship | endpoints, relationship type, evidence, confidence, valid time, review state |
| Signal | rule or proposal origin, inputs, detection time, strength, status, expiration |
| Event Hypothesis | event type, supporting/contradicting signals, location, time window, alternatives |
| Assessment | key judgments, facts, assumptions, alternatives, unknowns, confidence, author/reviewer |
| Risk Scenario | threat, exposure, vulnerability, likelihood, impact, controls, urgency, priority |
| Dossier | subject, scope, memberships, status, current assessment, active collection requirements |
| Intelligence Report | recipe, dossier snapshot, audience, judgments, citations, approval, publication version |
| Collection Requirement | question, priority, target information, acceptable sources, due time, status |
| Analyst Review | reviewer, action, reason, affected object version, timestamp |
| Rule Definition | rule type, input contracts, formula, thresholds, output contract, tests, status, version |
| AI Proposal | task, model, prompt version, proposed changes, citations, validation, disposition |

Contract rules:

- [ ] No derived object may exist without input references.
- [ ] No relationship may exist without evidence or an explicit analyst assertion.
- [ ] No assessment may exist without supporting evidence and stated alternatives.
- [ ] No report may exist without a frozen dossier snapshot and recipe version.
- [ ] No AI proposal may be stored as an approved fact.
- [ ] Data-quality warnings must propagate into downstream confidence.

---

# 5. Truth And Provenance Model

Every intelligence object must declare its epistemic status.

```text
observed
reported
deterministically-derived
AI-proposed
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
  -> assessment judgment
  -> hypothesis or risk scenario
  -> supporting and contradicting signals
  -> observations and claims
  -> immutable source records
  -> registered sources
```

- [ ] Make every report sentence traceable.
- [ ] Store AI supporting excerpts with character offsets where possible.
- [ ] Store every deterministic rule version.
- [ ] Store every prompt version.
- [ ] Store every scoring-model version.
- [ ] Preserve old object versions after correction.
- [ ] Distinguish source deletion from analytical rejection.

---

# 6. Relationship Vocabulary

Avoid a generic `related_to` edge whenever a more precise relationship exists.

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
possibly_caused_by
confirmed_caused_by
possible_consequence_of
contributing_condition_for
influenced
organizational_successor_of
organizational_split_from
assessed_as
creates_risk_for
```

AI may propose relationships, but only deterministic validation or analyst review may move them beyond `AI-proposed`.

---

# 7. Scoring Framework

## 7.1 Separate Scores

- [ ] Source reliability
- [ ] Record credibility
- [ ] Extraction confidence
- [ ] Timestamp precision
- [ ] Geographic precision
- [ ] Entity-resolution confidence
- [ ] Relationship confidence
- [ ] Signal strength
- [ ] Hypothesis confidence
- [ ] Assessment confidence
- [ ] Forecast confidence
- [ ] Severity
- [ ] Likelihood
- [ ] Exposure
- [ ] Impact
- [ ] Urgency
- [ ] Priority

## 7.2 Confidence Inputs

Confidence may increase from:

- independent sources;
- primary or official evidence;
- direct observations;
- exact identifiers;
- precise location and time;
- agreement across different data domains;
- validated entity matches;
- confirmed relationships;
- consistent historical patterns.

Confidence may decrease from:

- circular reporting;
- approximate locations;
- stale records;
- AI-only relationships;
- unresolved entity ambiguity;
- contradictions;
- missing expected evidence;
- simulated or static-reference data;
- source outages and collection gaps.

All score calculations must expose their component values.

---

# 8. AI Responsibilities And Boundaries

## 8.1 Approved AI Tasks

- [ ] Extract candidate claims from unstructured text.
- [ ] Extract candidate entities and relationships.
- [ ] Classify source records into event and topic categories.
- [ ] Suggest duplicate or semantically similar records.
- [ ] Suggest narrative and claim clusters.
- [ ] Identify possible contradictions.
- [ ] Suggest alternative explanations.
- [ ] Suggest information gaps and collection requirements.
- [ ] Draft assessment language from structured evidence.
- [ ] Draft report sections from approved dossier objects.
- [ ] Answer natural-language questions using cited dossier evidence.
- [ ] Compare historical documents and competing interpretations.
- [ ] Interpret imagery only when the model and task are explicitly authorized.

## 8.2 Prohibited Autonomous AI Actions

- [ ] AI must not confirm an event.
- [ ] AI must not publish a report.
- [ ] AI must not mark causation as confirmed.
- [ ] AI must not finalize entity resolution.
- [ ] AI must not assign guilt, fraud, or hostile attribution as fact.
- [ ] AI must not silently alter source reliability.
- [ ] AI must not delete or hide contradicting evidence.
- [ ] AI must not create uncited report language.
- [ ] AI must not use private or restricted data outside its approved task.
- [ ] AI must not become required for ingestion, storage, graph traversal, or dossier rendering.

## 8.3 AI Worker Types

```text
claim-extraction worker
entity-extraction worker
relationship-proposal worker
semantic-deduplication worker
contradiction-discovery worker
narrative-clustering worker
hypothesis-suggestion worker
alternative-explanation worker
collection-gap worker
report-drafting worker
natural-language-query worker
historical-comparison worker
visual-analysis worker
```

Each worker requires:

- a narrow task;
- a strict schema;
- bounded source context;
- evidence citation requirements;
- validation rules;
- prompt versioning;
- evaluation data;
- cost and latency limits;
- retry and failure behavior.

## 8.4 AI Extension Adapter Contract

AI is connected through a one-way proposal boundary:

```text
Approved core objects
  -> bounded AI task package
  -> AI run
  -> schema-validated AI proposal
  -> deterministic validation
  -> analyst review
  -> approved conversion into a normal core object
```

Required rules:

- [ ] AI workers receive explicit source-record and dossier-object IDs.
- [ ] Every proposed fact, claim, relationship, or sentence includes supporting evidence references.
- [ ] AI outputs are rejected when citations do not support the proposed value.
- [ ] AI proposals never become evidence for themselves.
- [ ] Promotion uses the same core creation services used by analysts and deterministic rules.
- [ ] Promotion records the proposal, reviewer, validation results, and resulting core-object version.
- [ ] Rejected and expired proposals remain available for evaluation but never appear as approved intelligence.
- [ ] Core objects contain no required foreign key to an AI extension table.
- [ ] The system supports deleting AI run content while retaining the reviewed disposition and resulting approved core object.

## 8.5 Runtime Insertion Points

The stages below describe where optional AI workers may assist at runtime after the Shared-Core Completion Gate. They do not change the implementation order and do not replace deterministic stages.

| Core Pipeline Point | Optional AI Assistance | Required Non-AI Path |
|---|---|---|
| After normalization | Claim, entity, topic, and relationship proposals | Rules, registries, parsers, and manual extraction |
| After entity candidate generation | Semantic candidate suggestions | Identifier, alias, attribute, fuzzy, and analyst resolution |
| After evidence graph updates | Contradiction and missing-evidence proposals | Structured contradiction rules and analyst review |
| After deterministic signal generation | Semantic cluster and weak-signal proposals | Rule-generated signals and deterministic clustering |
| During assessment drafting | Alternative explanations and prose drafts | Analyst-authored assessment |
| During report production | Cited prose drafts and summaries | Structured facts, templates, and analyst-authored judgments |
| During historical analysis | Cited comparison and influence proposals | Analyst-curated relationships and competing assessments |

---

# 9. End-To-End Fusion Pipeline

## Stage 1: Ingest

- [ ] Collect source payload.
- [ ] Register collection attempt.
- [ ] Preserve raw payload.
- [ ] Create source record.
- [ ] Assign timestamps and source identity.
- [ ] Calculate raw-record hash.
- [ ] Mark access and epistemic status.

## Stage 2: Normalize

- [ ] Convert structured fields to canonical formats.
- [ ] Preserve original values.
- [ ] Normalize text, identifiers, units, time, and geometry.
- [ ] Run schema validation.
- [ ] Record normalization warnings.

## Stage 3: Deterministic Extraction

- [ ] Extract known identifiers.
- [ ] Match gazetteer locations.
- [ ] Match registered entities and aliases.
- [ ] Extract configured keywords and categories.
- [ ] Extract structured measurements.

## Stage 4: AI-Assisted Extraction

- [ ] Select eligible source records.
- [ ] Create bounded extraction package.
- [ ] Request claims, entities, relationships, and categories.
- [ ] Require source excerpts for each proposal.
- [ ] Validate output schema.
- [ ] Reject proposals lacking evidence.
- [ ] Store accepted proposals as `AI-proposed`.

## Stage 5: Entity Resolution

- [ ] Resolve exact identifiers deterministically.
- [ ] Generate fuzzy and AI-assisted candidates.
- [ ] Calculate match confidence.
- [ ] Preserve competing candidate matches.
- [ ] Require analyst review for consequential merges.

## Stage 6: Evidence Graph

- [ ] Create relationships from validated facts.
- [ ] Attach evidence and confidence.
- [ ] Store AI proposals separately.
- [ ] Record valid-time and transaction-time.

## Stage 7: Signal Generation

- [ ] Execute deterministic threshold rules.
- [ ] Execute temporal correlation rules.
- [ ] Execute geospatial correlation rules.
- [ ] Execute graph-pattern rules.
- [ ] Execute baseline and anomaly rules.
- [ ] Add AI-suggested semantic signals only after validation.

## Stage 8: Event Formation

- [ ] Cluster compatible signals.
- [ ] Check time, location, entity, and domain overlap.
- [ ] Identify supporting and contradicting evidence.
- [ ] Create candidate event hypotheses.
- [ ] Suggest alternative explanations.
- [ ] Calculate event confidence.

## Stage 9: Assessment

- [ ] Assemble structured assessment package.
- [ ] Generate deterministic assessment facts and score breakdowns.
- [ ] Allow AI to draft judgments and explanatory prose.
- [ ] Require every judgment to cite evidence.
- [ ] Require explicit assumptions, alternatives, and unknowns.
- [ ] Submit for analyst review.

## Stage 10: Risk Translation

- [ ] Connect event or assessment to exposed entities and assets.
- [ ] Calculate likelihood, impact, exposure, urgency, and priority.
- [ ] Identify controls and mitigating evidence.
- [ ] Create risk scenarios.

## Stage 11: Dossier Update

- [ ] Create or update dossier.
- [ ] Add new timeline entries.
- [ ] Add signals, relationships, assessments, and risks.
- [ ] Track confidence changes.
- [ ] Preserve superseded interpretations.

## Stage 12: Reporting

- [ ] Select report recipe.
- [ ] Freeze dossier snapshot.
- [ ] Generate structured report facts.
- [ ] Allow AI-assisted prose drafting.
- [ ] Validate citations and unsupported claims.
- [ ] Require analyst approval.
- [ ] Publish versioned report.

## 9.1 Reference Flow: Possible Port Disruption

This walkthrough must be representable without special-case data structures.

```text
1. AIS collector stores vessel-position source records.
2. Port authority RSS collector stores a delay notice.
3. Weather collector stores a severe-weather alert.
4. Normalizers create vessel observations, a reported-delay claim, and weather observations.
5. Deterministic rules create:
   - elevated waiting-vessel ratio signal;
   - multi-source delay-report signal;
   - weather exposure signal.
6. AI extraction proposes that the port notice concerns cargo operations and names the affected terminal.
7. Validation links the proposal to exact source excerpts.
8. Entity resolution proposes or confirms the port and terminal entities.
9. The event-clustering engine creates a possible port-disruption hypothesis.
10. The evidence graph connects observations, claims, signals, entities, and contradictions.
11. An AI worker suggests alternative explanations:
    - routine congestion;
    - scheduled maintenance;
    - temporary weather slowdown.
12. Deterministic confidence scoring exposes score components.
13. An analyst approves, edits, or rejects the hypothesis and alternatives.
14. The port dossier gains the event, timeline, graph, risk scenarios, and collection requirements.
15. A supply-chain disruption report recipe freezes the dossier state.
16. AI drafts prose only from approved structured objects and citations.
17. Citation validation and analyst approval produce the published report.
18. Later evidence updates the dossier but does not alter the historical report snapshot.
```

Required visible reasoning chain:

```text
Source records
  -> observations and claims
  -> signals
  -> possible port-disruption hypothesis
  -> analyst-approved assessment
  -> supply-chain risk scenario
  -> published report
```

---

# 10. Dossier System

## 10.1 Dossier Types

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

## 10.2 Required Dossier Sections

```text
Identity and scope
Current status
Key judgments
Confidence and reasoning
Known facts
Direct observations
Reported claims
Supporting evidence
Contradicting evidence
Entities and relationships
Map and geographic context
Timeline and lead-up
Active and historical signals
Event hypotheses
Alternative explanations
Risk scenarios
Affected assets and dependencies
Information gaps
Collection requirements
Indicators to watch
Analyst notes and review history
AI proposals and dispositions
Source provenance
Generated reports
```

## 10.3 Dossier Interactions

- [ ] Selecting a graph node highlights the map, timeline, evidence, and report references.
- [ ] Selecting a report sentence reveals its reasoning chain and evidence.
- [ ] Analysts can inspect the graph as it existed at a past time.
- [ ] Analysts can compare current and previous dossier states.
- [ ] Analysts can approve or reject AI proposals in context.
- [ ] Analysts can branch competing hypotheses without destroying either branch.

---

# 11. Graph And Timeline Design

## 11.1 Node Types

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

## 11.2 Visual Semantics

```text
Solid edge: confirmed or analyst-approved relationship
Dashed edge: deterministic derivation
Dotted edge: AI-proposed relationship
Red edge: disputed or contradicting relationship
Gray edge: chronology or proximity only
```

- [ ] Never imply causality through ordinary graph proximity.
- [ ] Display edge labels by default or on focus.
- [ ] Show relationship confidence and evidence count.
- [ ] Allow filtering by time, domain, confidence, and review state.
- [ ] Allow lead-up, aftermath, lineage, dependency, and evidence graph modes.

## 11.3 Timeline Modes

- [ ] Chronological event timeline
- [ ] Signal accumulation timeline
- [ ] Intelligence-at-the-time timeline
- [ ] Confidence-change timeline
- [ ] Entity relationship history
- [ ] Organizational lineage
- [ ] Decision and consequence chain
- [ ] Dossier revision history

---

# 12. Intelligence Report Recipe System

Every generated report must use a registered recipe.

Each recipe must define:

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
Permitted conclusions
Prohibited conclusions
Alternative explanations
Confidence model
Required output sections
Collection requirements
Limitations
Approval requirements
```

## Initial Report Families

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
- [ ] Narrative emergence and contradiction report
- [ ] Cyber threat-infrastructure dossier
- [ ] Risk scenario decision brief
- [ ] Historical lineage and causal-claims dossier

---

# 13. Historical Intelligence Design

Historical analysis must distinguish:

```text
documented organizational succession
confirmed direct relationship
assessed influence
contributing condition
disputed causal interpretation
chronology only
later retrospective interpretation
```

- [ ] Store historical source records and citations.
- [ ] Represent competing interpretations as separate assessments.
- [ ] Preserve valid-time ranges for organizations and relationships.
- [ ] Support organizational splits, mergers, renaming, and succession.
- [ ] Support decision-to-consequence chains without asserting unsupported causality.
- [ ] Allow AI to suggest historical relationships only with cited passages.
- [ ] Require analyst approval for causal and influence relationships.
- [ ] Show what was knowable at a historical point rather than only hindsight.

---

# 14. Storage And Versioning Strategy

The data layer must support:

- immutable raw source storage;
- normalized relational records;
- graph relationships;
- geospatial geometry;
- time-series observations;
- full-text search;
- object version history;
- report snapshots;
- prompt and model audit;
- analyst review history.

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
ai_proposals
ai_runs
report_recipes
reports
report_citations
object_versions
rule_definitions
rule_runs
```

## Required Time Model

- [ ] Observed time
- [ ] Reported or published time
- [ ] Retrieved time
- [ ] Valid-from and valid-to time
- [ ] System creation time
- [ ] Superseded time

---

# 15. Analyst Workflow And State Machines

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

## AI Proposal

```text
generated -> schema_validated -> rule_validated -> analyst_approved
          -> rejected
          -> expired
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

---

# 16. UI And Page Architecture

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
/search
/settings
```

## AI-Specific Analyst Surfaces

- [ ] AI proposal review queue
- [ ] Citation and excerpt inspector
- [ ] Prompt and model audit page
- [ ] AI acceptance and rejection metrics
- [ ] Side-by-side deterministic versus AI interpretation
- [ ] AI-generated relationship review
- [ ] Unsupported-claim detection warnings
- [ ] AI-cost and latency dashboard

---

# 17. Validation And Evaluation

## 17.1 Deterministic System Validation

- [ ] Provenance chain completeness tests
- [ ] Entity-resolution tests
- [ ] Relationship-evidence tests
- [ ] Temporal-join tests
- [ ] Geospatial-join tests
- [ ] Rule-engine tests
- [ ] Confidence-model tests
- [ ] Dossier-version reconstruction tests
- [ ] Report-citation tests

## 17.2 AI Evaluation

Build reviewed evaluation datasets for:

- claim extraction;
- entity extraction;
- relationship extraction;
- contradiction discovery;
- semantic deduplication;
- narrative clustering;
- alternative explanations;
- report drafting;
- historical relationship proposals.

Measure:

- precision;
- recall;
- citation accuracy;
- unsupported-claim rate;
- analyst acceptance rate;
- harmful overstatement rate;
- consistency across model versions;
- cost;
- latency.

## 17.3 End-To-End Scenario Tests

- [ ] Possible maritime chokepoint disruption
- [ ] Possible military escalation
- [ ] Possible infrastructure outage
- [ ] Possible cyber campaign
- [ ] Possible supplier disruption
- [ ] Possible coordinated narrative
- [ ] Historical organizational-lineage question

Each scenario must prove:

- raw sources remain inspectable;
- evidence survives every transformation;
- alternatives remain visible;
- AI proposals are clearly marked;
- analysts can correct the system;
- reports contain no uncited judgments.

---

# 18. Security, Privacy, And Governance

- [ ] Public, authorized, restricted, and prohibited access levels
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Source and dossier retention policies
- [ ] Sensitive-field redaction
- [ ] AI provider data-sharing controls
- [ ] Per-task AI authorization
- [ ] Prompt-injection defense for untrusted source text
- [ ] Schema and output validation
- [ ] Secrets isolation
- [ ] Human approval for high-impact reporting
- [ ] Clear labels for simulated and AI-generated content
- [ ] No default private-person surveillance

---

# 19. Build Order

Phase 0 through Phase 9 must remain aligned with the strictly non-AI build plan. They are the shared product foundation and must be completed without AI calls or AI-derived records.

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

AI-specific implementation starts only here.

## Phase 10: AI Extension Foundation

- [ ] Approve AI boundaries, provider policies, and task authorization rules.
- [ ] Build `ai_runs`, `ai_proposals`, proposal evidence, and evaluation stores.
- [ ] Build the one-way AI extension adapter.
- [ ] Build schema validation and citation validation.
- [ ] Build AI proposal review and disposition workflow.
- [ ] Add a global AI-disabled mode and verify shared-core parity.

## Phase 11: AI-Assisted Extraction And Discovery

- [ ] Add claim and entity proposal workers.
- [ ] Add relationship and entity-resolution candidate workers.
- [ ] Add contradiction and collection-gap proposal workers.
- [ ] Add semantic duplicate and narrative-cluster proposal workers.
- [ ] Prevent direct writes to core intelligence objects.
- [ ] Evaluate each worker before enabling it outside test fixtures.

## Phase 12: AI-Assisted Assessment And Reporting

- [ ] Add alternative-explanation and hypothesis-suggestion workers.
- [ ] Add assessment-drafting workers using approved evidence packages.
- [ ] Add report-drafting workers using frozen dossier snapshots.
- [ ] Validate every generated sentence against citations.
- [ ] Require analyst approval before promotion or publication.

## Phase 13: AI-Assisted Historical And Visual Analysis

- [ ] Add historical-document comparison proposals.
- [ ] Add cited lineage, influence, and competing-interpretation proposals.
- [ ] Add authorized imagery-analysis proposals.
- [ ] Require analyst approval for causal, influence, attribution, and visual-damage conclusions.

## Phase 14: AI Evaluation And Hardening

- [ ] Measure precision, recall, citation accuracy, and unsupported-claim rate.
- [ ] Measure analyst acceptance and rejection rates by worker and domain.
- [ ] Test prompt injection, malformed outputs, provider failures, and model drift.
- [ ] Test deletion of AI extension records without damage to core records.
- [ ] Verify full system operation with AI disabled.
- [ ] Re-run all Phase 0 through Phase 9 scenarios in AI-disabled and AI-enabled modes.

---

# 20. Definition Of Done

The AI-assisted OSIRIS architecture is ready for implementation only when:

- [ ] Every object has a documented purpose and schema.
- [ ] Every transformation has defined inputs, outputs, and provenance.
- [ ] Every score has a defined meaning and formula.
- [ ] Every AI task has a bounded role, schema, evaluation, and review path.
- [ ] Every dossier can reconstruct its evidence and history.
- [ ] Every report sentence can trace to evidence.
- [ ] Chronology and correlation cannot visually masquerade as causation.
- [ ] Contradictions and alternatives cannot be silently removed.
- [ ] Analysts can reject and correct AI proposals.
- [ ] The complete system remains useful with AI disabled.

The final product should behave as an evidence system first, an intelligence workspace second, and an AI-assisted analytical environment third.
