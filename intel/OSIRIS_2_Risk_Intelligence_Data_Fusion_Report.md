# OSIRIS 2.0 — Risk Intelligence Data Fusion Report

**Report type:** Risk Intelligence  
**Project context:** OSIRIS 2.0 local-first intelligence synthesis system  
**Purpose:** Explain how OSIRIS can extract, normalize, connect, score, and explain risk from disconnected data sources across event, threat, cyber, business, geospatial, operational, supply chain, financial/fraud, social/narrative, and infrastructure intelligence.

---

## 1. Executive Summary

Risk intelligence is the layer that answers:

> “What could go wrong, how likely is it, how bad would it be, how confident are we, what evidence supports it, and what should be done next?”

Risk intelligence is not the same as threat intelligence, cyber intelligence, or event intelligence.

Those intelligence types often answer:

- **What is happening?**
- **Who or what is involved?**
- **What indicators exist?**
- **What pattern is emerging?**
- **What scenario might be developing?**

Risk intelligence takes those signals and turns them into a decision-support object:

```text
Signal → Exposure → Vulnerability → Likelihood → Impact → Risk → Priority → Treatment
```

In OSIRIS, risk intelligence should act as a cross-cutting intelligence layer that sits above all other modules.

```text
Event Intelligence
Threat Intelligence
Cyber Intelligence
Business / Market Intelligence
Geospatial Intelligence
Operational Intelligence
Supply Chain Intelligence
Financial / Fraud Intelligence
Social / Narrative Intelligence
Infrastructure Intelligence
        ↓
Risk Intelligence Layer
        ↓
Risk Register
Risk Graph
Risk Feed
Risk Dossier
Control Map
Scenario Analysis
Decision Brief
```

Risk intelligence is most useful when it does **not** pretend to predict the future with certainty. The goal is to identify risk conditions early, explain why they matter, show the evidence, separate confidence from severity, and recommend actions.

---

## 2. Public Frameworks This Report Is Based On

This report is designed around public, defensive, and governance-oriented risk frameworks.

### 2.1 NIST Risk Management Framework

NIST describes the Risk Management Framework as a comprehensive, flexible, repeatable, and measurable seven-step process for managing information security and privacy risk.

Official source:

```text
https://csrc.nist.gov/projects/risk-management
```

Relevant OSIRIS takeaway:

> Risk management should be repeatable, measurable, documented, and tied to systems, controls, and organizational decisions.

### 2.2 NIST Risk Assessment Concepts

NIST risk assessment guidance focuses on identifying threats, vulnerabilities, likelihood, impact, and risk response decisions.

Relevant OSIRIS takeaway:

> OSIRIS should separate “what could happen,” “why it could happen,” “what would be affected,” “how likely it is,” and “how bad it would be.”

### 2.3 ISO 31000

ISO 31000 provides principles, a framework, and a process for managing risk. It can be used by organizations regardless of size, activity, or sector.

Official source:

```text
https://www.iso.org/standard/65694.html
```

Relevant OSIRIS takeaway:

> Risk intelligence should not only focus on threats. It should also identify opportunities, uncertainty, strategic exposure, and decision tradeoffs.

### 2.4 COSO Enterprise Risk Management

COSO ERM frames enterprise risk management as something integrated with strategy and performance.

Official source:

```text
https://www.coso.org/guidance-erm
```

Relevant OSIRIS takeaway:

> Risk intelligence should connect risk to business objectives, performance, controls, and governance — not just scary events.

### 2.5 FAIR Quantitative Risk Analysis

The FAIR model is a taxonomy and quantitative risk analysis model used especially for cyber and operational risk, focusing on business-facing measurement and financial terms.

Official source:

```text
https://www.fairinstitute.org/
```

Relevant OSIRIS takeaway:

> For advanced versions, OSIRIS can estimate risk in ranges instead of only labels: expected loss, probable loss magnitude, and probable frequency.

---

## 3. What Risk Intelligence Means in OSIRIS

Risk intelligence is the discipline of collecting and analyzing signals that indicate uncertainty around objectives.

It answers:

```text
What are we exposed to?
What could trigger harm or opportunity?
What assets, processes, people, systems, regions, or decisions are affected?
What controls already exist?
How likely is the scenario?
How severe would the outcome be?
How confident are we in the assessment?
What evidence supports the conclusion?
What should be monitored or done next?
```

A risk intelligence object should not just say:

```text
Risk: High
```

That is weak.

A better OSIRIS risk intelligence object says:

```text
Risk: Elevated supplier disruption risk for Product Line A

Why:
- Supplier A has repeated late shipments.
- Route X has weather disruption warnings.
- Inventory buffer is below normal threshold.
- Alternate supplier coverage is limited.

Likelihood:
Moderate

Impact:
High

Confidence:
Moderate

Primary affected entities:
Product Line A, Supplier A, Distribution Center 3, Route X

Recommended next actions:
- Validate Supplier A ETA.
- Increase inventory watch frequency.
- Check alternate supplier availability.
- Notify operations if delay exceeds 48 hours.
```

This is the difference between a scary label and useful intelligence.

---

## 4. Risk Intelligence vs Other Intelligence Types

| Intelligence Type | Primary Question | Risk Intelligence Adds |
|---|---|---|
| Event Intelligence | What is happening or emerging? | What could happen next and how much it matters |
| Threat Intelligence | Who/what may cause harm? | How likely the threat is to affect specific assets |
| Cyber Intelligence | What is happening in digital systems? | Business impact and remediation priority |
| Business / Market Intelligence | What is changing in the market? | Strategic risk and opportunity exposure |
| Geospatial Intelligence | Where are signals clustering? | Location-based exposure and cascading impact |
| Operational Intelligence | How are workflows performing? | SLA, staffing, capacity, and process risk |
| Supply Chain Intelligence | What is happening across suppliers/routes? | Dependency, delay, and continuity risk |
| Financial / Fraud Intelligence | What money/identity patterns are suspicious? | Loss likelihood, fraud exposure, and escalation priority |
| Social / Narrative Intelligence | What claims/narratives are spreading? | Reputation, trust, misinformation, and escalation risk |
| Infrastructure Intelligence | What assets/systems are affected? | Dependency-chain and resilience risk |

Risk intelligence is not another silo. It is a scoring and decision layer across all of them.

---

## 5. Core Risk Intelligence Concepts

### 5.1 Asset

An asset is anything that matters.

Examples:

```text
Application
Server
Building
Employee group
Supplier
Route
Product line
Customer segment
Brand reputation
Revenue stream
Data set
Facility
Cloud service
Transit corridor
```

### 5.2 Objective

An objective is what the organization or user is trying to protect or achieve.

Examples:

```text
Keep service uptime above 99.9%.
Avoid customer data exposure.
Maintain delivery within 3 business days.
Protect public trust.
Keep staffing above minimum coverage.
Avoid regulatory penalties.
Prevent fraudulent payments.
```

### 5.3 Threat

A threat is a possible source of harm.

Examples:

```text
Storm
Ransomware actor
Supplier bankruptcy
Credential phishing campaign
Regulatory change
Port closure
Infrastructure outage
Fraud ring
Misinformation campaign
Staffing shortage
```

### 5.4 Vulnerability

A vulnerability is a weakness or condition that makes harm easier or more severe.

Examples:

```text
No backup supplier
Unpatched system
Low inventory buffer
Single internet provider
Manual approval process
No MFA
Poor monitoring
High employee turnover
No documented playbook
Weak vendor due diligence
```

### 5.5 Exposure

Exposure is the degree to which an asset or objective is within the path of possible harm.

Examples:

```text
A public-facing login system is exposed to credential attacks.
A warehouse is exposed to flood risk.
A single supplier supports 80% of a key product.
A business unit depends on one SaaS provider.
A brand is exposed to a viral false claim.
```

### 5.6 Control

A control is a protection, mitigation, detection, or recovery measure.

Examples:

```text
MFA
Backups
Vendor redundancy
Insurance
Rate limiting
Approval workflow
Monitoring alert
Employee training
Incident response plan
Alternate route
Inventory buffer
```

### 5.7 Likelihood

Likelihood estimates how probable the risk scenario is.

Likelihood should consider:

```text
Frequency of triggering signals
Historical baseline
Threat capability
Threat intent
Current exposure
Control effectiveness
Environmental conditions
Trend direction
Time proximity
```

### 5.8 Impact

Impact estimates how severe the outcome would be.

Impact can include:

```text
Financial loss
Operational downtime
Safety harm
Legal/regulatory exposure
Customer impact
Reputation damage
Data loss
Strategic disadvantage
Supply interruption
Recovery cost
```

### 5.9 Confidence

Confidence is not the same as risk.

Confidence answers:

> “How sure are we about this assessment?”

Risk answers:

> “How much does this matter if true?”

A low-confidence, high-impact risk may still deserve monitoring. A high-confidence, low-impact risk may not deserve urgent action.

---

## 6. OSIRIS Risk Intelligence Pipeline

### 6.1 Full Pipeline

```text
1. Ingest Data
   ↓
2. Extract Entities, Events, Metrics, Controls, and Signals
   ↓
3. Normalize Data
   ↓
4. Resolve Entities
   ↓
5. Build Risk Graph
   ↓
6. Identify Risk Scenarios
   ↓
7. Calculate Likelihood
   ↓
8. Calculate Impact
   ↓
9. Calculate Confidence
   ↓
10. Calculate Priority
   ↓
11. Recommend Monitoring / Mitigation / Escalation
   ↓
12. Generate Risk Dossier
```

### 6.2 Ingestion

Risk intelligence can ingest:

```text
RSS/news
Internal tickets
System logs
Vendor alerts
Weather alerts
Public records
Market data
Financial transactions
Incident reports
Supply chain status
Infrastructure outage feeds
Social/narrative signals
Cyber alerts
Vulnerability feeds
Manual analyst notes
```

### 6.3 Extraction

Extract the following objects from each source item:

```text
Entities
Events
Assets
Threats
Vulnerabilities
Controls
Metrics
Locations
Dates/times
Source claims
Affected objectives
Risk indicators
```

### 6.4 Normalization

Normalize:

```text
Dates and time zones
Locations
Organization names
Asset names
Risk categories
Severity labels
Probability labels
Source reliability
Currency values
Service names
Supplier names
Product names
```

### 6.5 Entity Resolution

Entity resolution determines whether different records refer to the same real-world thing.

Examples:

```text
"Amazon Web Services" = "AWS"
"Microsoft 365" = "M365" = "Office 365"
"Port of LA" = "Port of Los Angeles"
"Supplier ABC LLC" = "ABC Supply"
"DC-03" = "Distribution Center 3"
```

### 6.6 Risk Graph

Risk intelligence becomes powerful when it is modeled as a graph.

```text
Threat
  → affects Asset
  → threatens Objective
  → exploits Vulnerability
  → mitigated_by Control
  → observed_in Signal
  → supported_by Source
  → located_at Location
  → related_to Scenario
```

Example:

```text
Storm Warning
  → affects Route 17
  → impacts Supplier A delivery
  → threatens Product Line A availability
  → worsened_by Low Inventory Buffer
  → mitigated_by Alternate Supplier B
  → supported_by NOAA Alert + Carrier Delay Notice
```

---

## 7. Risk Object Model

### 7.1 Risk Scenario

A risk scenario is a structured statement of possible uncertainty.

Good format:

```text
Due to [cause/threat], [asset/objective] may experience [impact] within [time window], because [exposure/vulnerability], supported by [signals].
```

Example:

```text
Due to repeated supplier delays and regional weather disruption, Product Line A may experience a stockout within 7 days because current inventory buffer is below normal threshold and alternate supplier coverage is limited.
```

### 7.2 Risk Register Entry

A risk register is the structured list of known risks.

Each entry should include:

```text
Risk ID
Title
Category
Description
Affected assets
Affected objectives
Threats
Vulnerabilities
Controls
Signals
Sources
Likelihood
Impact
Confidence
Priority
Status
Owner
Recommended actions
Review date
```

### 7.3 Risk Signal

A risk signal is a piece of evidence that may increase or decrease risk.

Examples:

```text
Vendor status changed to delayed
Failed login attempts increased
Inventory buffer dropped below threshold
Negative sentiment increased
Regulatory deadline approaching
Weather alert issued
Payment pattern deviated from baseline
Cloud region reported degraded service
```

Risk signals should be small, specific, and evidence-backed.

---

## 8. Risk Categories for OSIRIS

OSIRIS should support a flexible taxonomy.

```ts
export type RiskCategory =
  | "strategic"
  | "operational"
  | "cyber"
  | "financial"
  | "fraud"
  | "compliance"
  | "legal"
  | "reputational"
  | "supply_chain"
  | "infrastructure"
  | "geospatial"
  | "safety"
  | "market"
  | "vendor"
  | "data_privacy"
  | "business_continuity"
  | "social_narrative"
  | "environmental"
  | "unknown";
```

---

## 9. Risk Scoring Model

### 9.1 Separate Scores

Do not combine everything too early.

Use separate scores first:

```text
Likelihood Score
Impact Score
Exposure Score
Control Strength Score
Confidence Score
Urgency Score
Priority Score
```

### 9.2 Likelihood Score

Likelihood estimates probability of occurrence.

Suggested 1–5 scale:

| Score | Label | Meaning |
|---:|---|---|
| 1 | Rare | Unlikely under current conditions |
| 2 | Unlikely | Possible but weak evidence |
| 3 | Possible | Plausible and supported by multiple signals |
| 4 | Likely | Strong evidence or active trend |
| 5 | Almost Certain | Already happening or imminent |

Inputs:

```text
signal_count
signal_recency
historical_frequency
trend_direction
threat_capability
threat_intent
exposure_level
control_weakness
```

### 9.3 Impact Score

Impact estimates severity.

| Score | Label | Meaning |
|---:|---|---|
| 1 | Minimal | Little to no meaningful disruption |
| 2 | Minor | Small impact, easy recovery |
| 3 | Moderate | Noticeable disruption or cost |
| 4 | Major | Significant business, safety, legal, or operational impact |
| 5 | Severe | Critical failure, severe loss, or major cascading impact |

Inputs:

```text
financial_loss_estimate
service_downtime
customer_count_affected
safety_effect
regulatory_effect
reputation_effect
recovery_complexity
dependency_centrality
```

### 9.4 Exposure Score

Exposure measures how directly affected the asset/objective is.

| Score | Label |
|---:|---|
| 1 | Isolated |
| 2 | Indirect |
| 3 | Partial |
| 4 | Direct |
| 5 | Critical dependency |

### 9.5 Control Strength Score

Control strength measures mitigation quality.

| Score | Label | Meaning |
|---:|---|---|
| 1 | Strong | Controls are tested, current, and effective |
| 2 | Adequate | Controls exist and likely reduce risk |
| 3 | Partial | Controls exist but have gaps |
| 4 | Weak | Controls are incomplete or untested |
| 5 | Missing | No known control exists |

Important: higher control weakness should increase risk.

### 9.6 Confidence Score

Confidence estimates trust in the assessment.

| Score | Label | Meaning |
|---:|---|---|
| 1 | Very Low | Single weak or unclear signal |
| 2 | Low | Limited evidence or poor source quality |
| 3 | Moderate | Multiple signals but some uncertainty |
| 4 | High | Strong corroboration from reliable sources |
| 5 | Very High | Direct evidence, strong sources, low ambiguity |

Inputs:

```text
source_reliability
source_independence
corroboration_count
entity_resolution_confidence
data_freshness
alternative_explanation_strength
analyst_review_status
```

### 9.7 Urgency Score

Urgency estimates how soon action is needed.

| Score | Label |
|---:|---|
| 1 | Monitor only |
| 2 | Review soon |
| 3 | Act this week |
| 4 | Act within 24–48 hours |
| 5 | Act immediately |

### 9.8 Priority Score

Priority should combine likelihood, impact, exposure, control weakness, urgency, and confidence.

Simple formula:

```text
priority =
  ((likelihood * impact) + exposure + controlWeakness + urgency)
  * confidenceMultiplier
```

Suggested confidence multiplier:

```text
Very Low: 0.60
Low:      0.75
Moderate: 1.00
High:     1.10
Very High:1.20
```

Example:

```text
likelihood = 4
impact = 5
exposure = 4
controlWeakness = 3
urgency = 4
confidence = Moderate = 1.00

priority = ((4 * 5) + 4 + 3 + 4) * 1.00
priority = 31
```

Priority labels:

| Priority Score | Label |
|---:|---|
| 0–10 | Low |
| 11–20 | Medium |
| 21–30 | High |
| 31+ | Critical |

This is intentionally simple so the user understands it. OSIRIS should avoid mysterious “AI magic number soup.”

---

## 10. Risk Confidence vs Risk Severity

A major OSIRIS rule:

> Never let confidence and severity collapse into the same number.

Example:

```text
Scenario A:
High impact, low confidence
→ Monitor and seek validation.

Scenario B:
Low impact, high confidence
→ Handle through routine process.

Scenario C:
High impact, high confidence
→ Escalate immediately.

Scenario D:
Low impact, low confidence
→ Keep as background noise unless pattern grows.
```

Decision matrix:

| Impact | Confidence | Response |
|---|---|---|
| High | High | Escalate |
| High | Low | Validate quickly |
| Low | High | Routine handling |
| Low | Low | Monitor / deprioritize |

---

## 11. Risk Intelligence Source Types

### 11.1 Internal Sources

```text
Tickets
Incidents
Logs
Alerts
Asset inventory
Change management
Vendor records
Financial records
Inventory data
Customer support data
Operational metrics
Risk register
Policy exceptions
Audit findings
Control test results
```

### 11.2 External Sources

```text
News
RSS feeds
Weather alerts
Government advisories
Market data
Supplier announcements
SEC filings
Public records
Social media
Cyber advisories
Vulnerability databases
Economic indicators
Transportation alerts
Utility outage maps
Regulatory updates
```

### 11.3 Manual Sources

```text
Analyst notes
Manager updates
Field reports
Stakeholder interviews
Postmortems
Lessons learned
Meeting notes
Decision logs
```

---

## 12. OSIRIS TypeScript Data Models

### 12.1 Core Types

```ts
export type RiskLikelihood = 1 | 2 | 3 | 4 | 5;
export type RiskImpact = 1 | 2 | 3 | 4 | 5;
export type RiskConfidence = 1 | 2 | 3 | 4 | 5;
export type RiskUrgency = 1 | 2 | 3 | 4 | 5;
export type RiskExposure = 1 | 2 | 3 | 4 | 5;
export type ControlWeakness = 1 | 2 | 3 | 4 | 5;

export type RiskStatus =
  | "new"
  | "watching"
  | "validated"
  | "mitigating"
  | "accepted"
  | "transferred"
  | "closed"
  | "false_positive";

export type RiskTreatment =
  | "avoid"
  | "mitigate"
  | "transfer"
  | "accept"
  | "monitor"
  | "exploit_opportunity";
```

### 12.2 Source Item

```ts
export interface RiskSource {
  id: string;
  title: string;
  sourceType:
    | "rss"
    | "news"
    | "internal_ticket"
    | "log"
    | "alert"
    | "vendor_notice"
    | "financial_record"
    | "public_record"
    | "manual_note"
    | "government_advisory"
    | "social_post"
    | "dataset";

  url?: string;
  authorOrPublisher?: string;
  collectedAt: string;
  publishedAt?: string;
  reliabilityScore: number; // 0-100
  freshnessScore: number; // 0-100
  accessLevel: "public" | "internal" | "restricted";
  rawText?: string;
  summary?: string;
}
```

### 12.3 Entity

```ts
export interface RiskEntity {
  id: string;
  type:
    | "person"
    | "organization"
    | "supplier"
    | "asset"
    | "system"
    | "application"
    | "facility"
    | "location"
    | "route"
    | "product"
    | "account"
    | "service"
    | "control"
    | "objective"
    | "threat"
    | "vulnerability";

  name: string;
  aliases?: string[];
  description?: string;
  confidence: number; // 0-100
  sourceIds: string[];
}
```

### 12.4 Risk Signal

```ts
export interface RiskSignal {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;

  signalType:
    | "trend"
    | "anomaly"
    | "threshold_breach"
    | "warning"
    | "incident"
    | "control_gap"
    | "dependency"
    | "delay"
    | "exposure"
    | "claim"
    | "metric_change"
    | "manual_observation";

  observedAt: string;
  entityIds: string[];
  sourceIds: string[];

  direction: "increases_risk" | "decreases_risk" | "neutral" | "unknown";
  strength: 1 | 2 | 3 | 4 | 5;
  confidence: RiskConfidence;
}
```

### 12.5 Control

```ts
export interface RiskControl {
  id: string;
  name: string;
  type:
    | "preventive"
    | "detective"
    | "corrective"
    | "recovery"
    | "governance"
    | "compensating";

  description: string;
  owner?: string;
  relatedEntityIds: string[];
  relatedRiskIds?: string[];

  effectiveness: 1 | 2 | 3 | 4 | 5; // 1 weak, 5 strong
  testedAt?: string;
  testResult?: "pass" | "partial" | "fail" | "unknown";
  sourceIds: string[];
}
```

### 12.6 Risk Scenario

```ts
export interface RiskScenario {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;

  affectedObjectiveIds: string[];
  affectedAssetIds: string[];
  threatEntityIds: string[];
  vulnerabilityEntityIds: string[];
  controlIds: string[];
  signalIds: string[];
  sourceIds: string[];

  likelihood: RiskLikelihood;
  impact: RiskImpact;
  exposure: RiskExposure;
  controlWeakness: ControlWeakness;
  confidence: RiskConfidence;
  urgency: RiskUrgency;

  priorityScore: number;
  priorityLabel: "low" | "medium" | "high" | "critical";

  status: RiskStatus;
  recommendedTreatment: RiskTreatment;

  assumptions: string[];
  alternativeExplanations: string[];
  evidenceSummary: string;
  recommendedActions: string[];
  informationGaps: string[];

  createdAt: string;
  updatedAt: string;
  reviewBy?: string;
}
```

### 12.7 Risk Relationship

```ts
export interface RiskRelationship {
  id: string;
  fromId: string;
  toId: string;

  relationshipType:
    | "affects"
    | "depends_on"
    | "threatens"
    | "exploits"
    | "mitigates"
    | "detects"
    | "increases"
    | "decreases"
    | "causes"
    | "correlates_with"
    | "contradicts"
    | "supports";

  sourceIds: string[];
  confidence: number; // 0-100
  notes?: string;
}
```

---

## 13. Example Risk Intelligence Payload

```json
{
  "context": {
    "project": "OSIRIS 2.0",
    "analysisType": "risk_intelligence",
    "timeWindow": "2026-06-01 to 2026-06-06",
    "objective": "Identify possible risks, explain evidence, score likelihood/impact/confidence, and recommend next actions."
  },
  "sources": [
    {
      "id": "src-001",
      "title": "Vendor status notice",
      "sourceType": "vendor_notice",
      "publishedAt": "2026-06-05T09:00:00-07:00",
      "reliabilityScore": 85,
      "freshnessScore": 95,
      "summary": "Supplier A reports delayed shipments due to regional transportation constraints."
    },
    {
      "id": "src-002",
      "title": "Inventory system export",
      "sourceType": "dataset",
      "collectedAt": "2026-06-06T08:00:00-07:00",
      "reliabilityScore": 90,
      "freshnessScore": 90,
      "summary": "Product Line A inventory is below the normal 10-day buffer threshold."
    },
    {
      "id": "src-003",
      "title": "Weather alert",
      "sourceType": "government_advisory",
      "publishedAt": "2026-06-05T16:00:00-07:00",
      "reliabilityScore": 95,
      "freshnessScore": 90,
      "summary": "Severe weather may affect Route X over the next 48 hours."
    }
  ],
  "entities": [
    {
      "id": "ent-001",
      "type": "supplier",
      "name": "Supplier A",
      "confidence": 95,
      "sourceIds": ["src-001"]
    },
    {
      "id": "ent-002",
      "type": "product",
      "name": "Product Line A",
      "confidence": 95,
      "sourceIds": ["src-002"]
    },
    {
      "id": "ent-003",
      "type": "route",
      "name": "Route X",
      "confidence": 90,
      "sourceIds": ["src-001", "src-003"]
    }
  ],
  "signals": [
    {
      "id": "sig-001",
      "title": "Supplier shipment delay",
      "category": "supply_chain",
      "signalType": "delay",
      "observedAt": "2026-06-05T09:00:00-07:00",
      "entityIds": ["ent-001", "ent-003"],
      "sourceIds": ["src-001"],
      "direction": "increases_risk",
      "strength": 4,
      "confidence": 4
    },
    {
      "id": "sig-002",
      "title": "Inventory buffer below threshold",
      "category": "operational",
      "signalType": "threshold_breach",
      "observedAt": "2026-06-06T08:00:00-07:00",
      "entityIds": ["ent-002"],
      "sourceIds": ["src-002"],
      "direction": "increases_risk",
      "strength": 5,
      "confidence": 5
    },
    {
      "id": "sig-003",
      "title": "Route weather disruption",
      "category": "geospatial",
      "signalType": "warning",
      "observedAt": "2026-06-05T16:00:00-07:00",
      "entityIds": ["ent-003"],
      "sourceIds": ["src-003"],
      "direction": "increases_risk",
      "strength": 3,
      "confidence": 4
    }
  ]
}
```

---

## 14. Giant AI Chatbot Prompt Pretext

Use this as the reusable message before providing OSIRIS risk data.

```text
You are an OSIRIS 2.0 Risk Intelligence Analyst.

Your job is to analyze the structured data payload I provide and produce explainable risk intelligence. You must only use the data provided unless I explicitly allow outside research. Do not invent facts. Do not treat correlation as causation. Do not overstate certainty.

Your task:

1. Extract possible risk scenarios from the data.
2. Identify affected assets, objectives, entities, systems, suppliers, locations, users, services, narratives, or processes.
3. Identify the signals that increase or decrease risk.
4. Separate facts from assumptions.
5. Identify alternative explanations.
6. Estimate likelihood, impact, exposure, control weakness, urgency, and confidence.
7. Calculate a simple priority score.
8. Explain how you reached the conclusion.
9. Identify missing information that would increase or decrease confidence.
10. Recommend next actions.

Important scoring rules:

- Likelihood means how probable the risk scenario is.
- Impact means how severe the outcome would be if it happens.
- Confidence means how sure you are about the assessment.
- Urgency means how quickly action may be needed.
- Exposure means how directly affected the asset or objective is.
- Control weakness means how weak or missing the known mitigations are.
- Do not combine confidence and severity into one vague score.
- A high-impact low-confidence risk should be marked for validation, not treated as confirmed.
- A low-impact high-confidence risk should not be exaggerated.
- If data is too weak, say so clearly.

Use this 1–5 scale:

Likelihood:
1 Rare
2 Unlikely
3 Possible
4 Likely
5 Almost Certain

Impact:
1 Minimal
2 Minor
3 Moderate
4 Major
5 Severe

Exposure:
1 Isolated
2 Indirect
3 Partial
4 Direct
5 Critical dependency

Control Weakness:
1 Strong controls
2 Adequate controls
3 Partial controls
4 Weak controls
5 Missing controls

Urgency:
1 Monitor only
2 Review soon
3 Act this week
4 Act within 24–48 hours
5 Act immediately

Confidence:
1 Very Low
2 Low
3 Moderate
4 High
5 Very High

Priority formula:

priority = ((likelihood * impact) + exposure + controlWeakness + urgency) * confidenceMultiplier

Confidence multiplier:
Very Low = 0.60
Low = 0.75
Moderate = 1.00
High = 1.10
Very High = 1.20

Priority labels:
0–10 Low
11–20 Medium
21–30 High
31+ Critical

Return your answer in this structure:

# Risk Intelligence Assessment

## Executive Summary
Briefly summarize the top risks and the overall risk posture.

## Top Risk Scenarios
For each scenario include:

### Risk Scenario [number]: [Title]

**Category:**  
**Status:** New / Watching / Validated / Mitigating / Accepted / Closed / False Positive

**Scenario Statement:**  
Due to [cause/threat], [asset/objective] may experience [impact] within [time window], because [exposure/vulnerability], supported by [signals].

**Affected Entities:**  
List entities.

**Supporting Signals:**  
List signal IDs and explain what each contributes.

**Likelihood:** 1–5 with explanation  
**Impact:** 1–5 with explanation  
**Exposure:** 1–5 with explanation  
**Control Weakness:** 1–5 with explanation  
**Urgency:** 1–5 with explanation  
**Confidence:** 1–5 with explanation  

**Priority Score:**  
Show the formula with the numbers.

**Priority Label:** Low / Medium / High / Critical

**Evidence Summary:**  
Explain the strongest evidence.

**Assumptions:**  
List assumptions.

**Alternative Explanations:**  
List plausible non-risk explanations.

**Information Gaps:**  
List missing data that would help.

**Recommended Actions:**  
List practical next actions.

**What Would Increase Confidence:**  
List evidence that would strengthen the assessment.

**What Would Decrease Confidence:**  
List evidence that would weaken the assessment.

## Cross-Risk Patterns
Identify shared entities, repeated signals, common vulnerabilities, control gaps, or dependency chains across multiple risks.

## Control and Mitigation Map
List known controls, missing controls, and recommended controls.

## Monitoring Plan
List what should be watched next and why.

## Analyst Notes
Include caveats, uncertainty, and warnings against overinterpretation.

Now analyze the following OSIRIS risk intelligence payload:
```

Then paste the JSON data after the prompt.

---

## 15. Example AI Output

```markdown
# Risk Intelligence Assessment

## Executive Summary

The data indicates a high-priority supply chain continuity risk affecting Product Line A. The risk is driven by three converging signals: Supplier A shipment delays, low inventory buffer, and weather disruption affecting Route X. The assessment is not certain, but the signals are mutually reinforcing and time-proximate.

## Top Risk Scenarios

### Risk Scenario 1: Product Line A Stockout Risk

**Category:** Supply Chain / Operational  
**Status:** New

**Scenario Statement:**  
Due to Supplier A shipment delays and severe weather affecting Route X, Product Line A may experience a stockout within the next 7 days because inventory is already below the normal buffer threshold and alternate supply coverage is unknown.

**Affected Entities:**

- Supplier A
- Product Line A
- Route X

**Supporting Signals:**

- sig-001: Supplier shipment delay increases risk because inbound replenishment may be late.
- sig-002: Inventory buffer below threshold increases impact because there is less time to absorb disruption.
- sig-003: Route weather disruption increases likelihood because the affected route may slow or block shipments.

**Likelihood:** 4 — Likely  
The delay and weather warning are current and directly related to the same route/supplier path.

**Impact:** 4 — Major  
A stockout may affect sales, customer fulfillment, operations, and downstream planning.

**Exposure:** 4 — Direct  
Product Line A appears directly dependent on Supplier A and Route X.

**Control Weakness:** 3 — Partial  
No alternate supplier or inventory mitigation was included in the data.

**Urgency:** 4 — Act within 24–48 hours  
The weather window and existing inventory shortage make this time-sensitive.

**Confidence:** 4 — High  
The assessment is supported by three timely and reliable sources.

**Priority Score:**  
((4 * 4) + 4 + 3 + 4) * 1.10 = 29.7

**Priority Label:** High

**Evidence Summary:**  
The strongest evidence is the combination of delayed supplier shipments, reduced inventory buffer, and route-specific weather disruption within the same short time window.

**Assumptions:**

- Supplier A is important to Product Line A.
- Route X is used for Product Line A shipments.
- Inventory buffer threshold is meaningful.

**Alternative Explanations:**

- Supplier delay may be minor and already resolved.
- Weather warning may not affect actual shipment windows.
- Inventory may be intentionally low due to demand planning.

**Information Gaps:**

- Current ETA for Supplier A.
- Alternate supplier availability.
- Sales velocity for Product Line A.
- Current in-transit shipment status.
- Existing mitigation plan.

**Recommended Actions:**

1. Validate Supplier A’s current ETA.
2. Check current inventory burn rate.
3. Confirm whether Route X is still being used.
4. Identify alternate supplier or route options.
5. Place Product Line A on elevated monitoring until replenishment is confirmed.

**What Would Increase Confidence:**

- Carrier confirms route delay.
- Inventory continues dropping.
- Supplier provides revised ETA beyond expected stockout date.

**What Would Decrease Confidence:**

- Shipment already arrived.
- Alternate route is active.
- Product Line A demand has dropped.
```

---

## 16. OSIRIS UI Pages for Risk Intelligence

### 16.1 Risk Feed

A feed of detected risk scenarios.

Cards should show:

```text
Risk title
Category
Priority label
Likelihood
Impact
Confidence
Affected entities
Top evidence
Recommended next action
```

### 16.2 Risk Dossier Page

A deep-dive page for one risk.

Sections:

```text
Executive summary
Scenario statement
Evidence timeline
Entity graph
Risk score breakdown
Affected objectives
Controls
Alternative explanations
Information gaps
Recommended actions
Source list
Analyst notes
```

### 16.3 Risk Register

Structured table of known risks.

Columns:

```text
Risk ID
Title
Category
Owner
Status
Likelihood
Impact
Confidence
Priority
Treatment
Review date
```

### 16.4 Control Map

Shows how controls relate to risks.

```text
Control → Mitigates → Risk
Control → Protects → Asset
Control → Detected by → Signal
Control → Tested by → Source
```

### 16.5 Scenario Simulator

Allows the user to adjust inputs:

```text
What if likelihood increases?
What if impact decreases?
What if control improves?
What if exposure expands?
What if confidence drops?
```

### 16.6 Dependency Risk Graph

Graph view:

```text
Supplier → Route → Facility → Product → Customer → Revenue
Cloud Provider → Application → Business Process → SLA → Customer Impact
Narrative → Audience → Reputation → Demand → Revenue
```

---

## 17. Local-First Implementation Strategy

### Phase 1 — Risk Register Foundation

Build:

```text
RiskScenario model
RiskSignal model
RiskSource model
RiskEntity model
RiskRelationship model
Risk scoring utility
Manual risk creation form
Risk register table
Risk dossier page
```

### Phase 2 — Signal Extraction

Build:

```text
RSS/manual source ingestion
Keyword/entity extraction
Signal classification
Source reliability scoring
Freshness scoring
Entity resolution
```

### Phase 3 — Risk Graph

Build:

```text
Entity relationship graph
Risk-to-asset mapping
Risk-to-control mapping
Shared dependency detection
Cross-risk pattern detection
```

### Phase 4 — AI-Assisted Risk Analysis

Build:

```text
Export selected risk payload
Copy giant prompt + JSON payload
Paste into ChatGPT
Import AI-generated assessment manually
Store analyst-reviewed result
```

Important: The AI should not directly overwrite source data or risk scores without human review. AI output should be treated as a draft assessment.

### Phase 5 — Monitoring and Alerts

Build:

```text
Risk watchlist
Threshold triggers
Confidence change tracking
Status change history
Review reminders
```

---

## 18. Risk Intelligence Design Rules

### 18.1 Always Separate Evidence From Conclusion

Bad:

```text
Supplier A is failing.
```

Good:

```text
Supplier A has two current delay signals and one unresolved ETA gap. This suggests elevated delivery risk, but it does not prove supplier failure.
```

### 18.2 Always Include Alternative Explanations

If the system cannot explain what else might be happening, it is not doing intelligence. It is just making accusations with tables.

### 18.3 Always Track Confidence

Risk without confidence becomes fear-math. Confidence without evidence becomes vibes. OSIRIS should avoid both.

### 18.4 Use Risk as Decision Support, Not Automated Judgment

OSIRIS should recommend:

```text
Monitor
Validate
Escalate
Mitigate
Close as false positive
```

It should not automatically punish people, block vendors, accuse entities, or trigger irreversible actions.

### 18.5 Avoid Individual Surveillance

Risk intelligence should focus on systems, assets, processes, organizations, events, infrastructure, and authorized business data.

If personal data is used, OSIRIS should require:

```text
Legal basis
Access control
Minimum necessary data
Purpose limitation
Retention limit
Audit log
Human review
```

---

## 19. Example Risk Categories and Signals

### 19.1 Cyber Risk

Signals:

```text
Unpatched critical CVE
Failed login spike
New exposed service
MFA disabled
Known exploited vulnerability
Credential leak mention
```

Risk scenario:

```text
Public-facing application may be compromised due to known exploited vulnerability and missing patch.
```

### 19.2 Supply Chain Risk

Signals:

```text
Supplier delay
Port congestion
Inventory below threshold
Commodity price spike
Route disruption
Single supplier dependency
```

Risk scenario:

```text
Product line may face fulfillment delay due to supplier route disruption and low inventory buffer.
```

### 19.3 Operational Risk

Signals:

```text
Ticket backlog spike
Staffing shortage
SLA breach trend
Tool outage
Process handoff failure
Repeated escalation
```

Risk scenario:

```text
Support queue may breach SLA due to increased volume and reduced staffing.
```

### 19.4 Financial / Fraud Risk

Signals:

```text
Unusual payment pattern
New counterparty
Invoice amount anomaly
Device mismatch
Repeated failed verification
Refund abuse pattern
```

Risk scenario:

```text
Payment batch may include fraudulent invoice due to new vendor account and abnormal payment details.
```

### 19.5 Reputation / Narrative Risk

Signals:

```text
Negative claim spike
Influential account amplification
Contradictory official response
Media pickup
Low trust source spread
```

Risk scenario:

```text
Brand reputation may be affected by rapidly spreading claim with high amplification but uncertain factual basis.
```

### 19.6 Infrastructure Risk

Signals:

```text
Utility outage
Road closure
Facility dependency
Cloud region degradation
Telecom outage
Cascading service impact
```

Risk scenario:

```text
Facility operations may be disrupted due to power outage affecting dependent systems and staffing access.
```

---

## 20. Database Table Ideas

### 20.1 `risk_sources`

```sql
create table risk_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null,
  url text,
  publisher text,
  collected_at timestamptz default now(),
  published_at timestamptz,
  reliability_score int,
  freshness_score int,
  access_level text default 'public',
  summary text,
  raw_text text
);
```

### 20.2 `risk_entities`

```sql
create table risk_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  name text not null,
  aliases text[],
  description text,
  confidence int default 50,
  created_at timestamptz default now()
);
```

### 20.3 `risk_signals`

```sql
create table risk_signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  signal_type text,
  observed_at timestamptz,
  direction text,
  strength int,
  confidence int,
  created_at timestamptz default now()
);
```

### 20.4 `risk_scenarios`

```sql
create table risk_scenarios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  likelihood int,
  impact int,
  exposure int,
  control_weakness int,
  urgency int,
  confidence int,
  priority_score numeric,
  priority_label text,
  status text default 'new',
  recommended_treatment text,
  evidence_summary text,
  assumptions text[],
  alternative_explanations text[],
  information_gaps text[],
  recommended_actions text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  review_by timestamptz
);
```

### 20.5 `risk_relationships`

```sql
create table risk_relationships (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null,
  to_id uuid not null,
  relationship_type text not null,
  confidence int default 50,
  notes text,
  created_at timestamptz default now()
);
```

---

## 21. Useful Risk Intelligence Functions

### 21.1 Priority Score Utility

```ts
export function getConfidenceMultiplier(confidence: number) {
  if (confidence <= 1) return 0.6;
  if (confidence === 2) return 0.75;
  if (confidence === 3) return 1.0;
  if (confidence === 4) return 1.1;
  return 1.2;
}

export function calculateRiskPriority({
  likelihood,
  impact,
  exposure,
  controlWeakness,
  urgency,
  confidence,
}: {
  likelihood: number;
  impact: number;
  exposure: number;
  controlWeakness: number;
  urgency: number;
  confidence: number;
}) {
  const multiplier = getConfidenceMultiplier(confidence);

  const score =
    ((likelihood * impact) + exposure + controlWeakness + urgency) * multiplier;

  let label: "low" | "medium" | "high" | "critical" = "low";

  if (score >= 31) label = "critical";
  else if (score >= 21) label = "high";
  else if (score >= 11) label = "medium";

  return {
    score: Number(score.toFixed(1)),
    label,
  };
}
```

### 21.2 Risk Scenario Statement Builder

```ts
export function buildScenarioStatement({
  cause,
  asset,
  impact,
  timeWindow,
  exposure,
  signals,
}: {
  cause: string;
  asset: string;
  impact: string;
  timeWindow: string;
  exposure: string;
  signals: string[];
}) {
  return `Due to ${cause}, ${asset} may experience ${impact} within ${timeWindow}, because ${exposure}, supported by ${signals.join(", ")}.`;
}
```

---

## 22. Ethics and Safety Guardrails

Risk intelligence can easily become overreach if designed poorly.

OSIRIS should follow these boundaries:

```text
Do not use risk scores as proof.
Do not accuse individuals based on weak patterns.
Do not automate punitive action.
Do not hide evidence behind black-box scoring.
Do not use private personal data without authorization.
Do not treat protected activity as suspicious by default.
Do not treat correlation as causation.
Do not remove alternative explanations.
Do not inflate confidence to make outputs feel more decisive.
```

Good OSIRIS behavior:

```text
Explain evidence.
Show uncertainty.
Show source quality.
Show alternative explanations.
Require human review.
Track audit history.
Respect privacy.
Prefer aggregate/system-level analysis.
```

---

## 23. Final OSIRIS Framing

Risk intelligence should be the decision layer of OSIRIS.

The best project framing:

> OSIRIS does not predict the future. OSIRIS connects signals, explains uncertainty, scores risk, and helps users decide what to validate, monitor, mitigate, or ignore.

That is stronger, safer, and more useful than pretending to have a crystal ball.

Risk intelligence is where OSIRIS becomes less of a feed reader and more of a decision-support engine.

---

## 24. References

- NIST Risk Management Framework: https://csrc.nist.gov/projects/risk-management
- ISO 31000 Risk Management Guidelines: https://www.iso.org/standard/65694.html
- COSO Enterprise Risk Management: https://www.coso.org/guidance-erm
- FAIR Institute Risk Quantification: https://www.fairinstitute.org/
- NIST SP 800-30 Risk Assessment resources: https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
