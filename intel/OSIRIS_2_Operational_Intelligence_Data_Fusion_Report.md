# OSIRIS 2.0 — Operational Intelligence Data Fusion Report

```text
Document Type: Project Research / Implementation Guide
Project: OSIRIS 2.0
Intelligence Type: Operational Intelligence / OI
Primary Goal: Turn live operational data into explainable, confidence-rated assessments, bottleneck detection, incident context, and recommended next actions.
Recommended Use: Local-first OSIRIS module, project planning, product design, data modeling, and AI prompt scaffolding.
```

---

## 1. Executive Summary

Operational Intelligence, often shortened to **OI**, is the discipline of understanding what is happening inside an operation **right now**, why it is happening, what it may affect, and what action should be taken next.

For OSIRIS, operational intelligence should be treated as the system layer that turns scattered operational signals into useful working knowledge:

```text
logs + tickets + alerts + queues + assets + staffing + SLAs + workflows
  ↓
normalized operational signals
  ↓
entities, relationships, timelines, metrics, and anomalies
  ↓
possible operational issues, bottlenecks, risks, and recommended actions
```

Where event intelligence asks, “What event may be emerging?” and cyber intelligence asks, “What cyber condition or incident may be happening?”, operational intelligence asks:

> “What is the current state of the operation, what is degrading, what is blocked, what is overloaded, what is risky, and what should be handled first?”

Operational Intelligence is especially useful for IT service desks, logistics teams, support queues, field operations, incident response, manufacturing operations, infrastructure operations, and business process monitoring.

The big idea is not to create a magical prediction machine. The correct design is an **explainable operational reasoning system** that can say:

```text
This looks like a queue bottleneck.
Here are the signals.
Here are the affected services and teams.
Here is why confidence is moderate.
Here are alternative explanations.
Here are recommended actions.
Here is what data would confirm or disprove the assessment.
```

That is the practical, useful version. No crystal ball. Just good receipts.

---

## 2. Operational Intelligence vs Other Intelligence Types

Operational intelligence overlaps with many other intelligence types, but it has a different center of gravity.

| Intelligence Type | Main Question | Example Output |
|---|---|---|
| Event Intelligence | What event is emerging from disconnected signals? | “Possible logistics disruption near Terminal A.” |
| Threat Intelligence | Who or what may threaten us, and how? | “Actor using phishing against procurement users.” |
| Cyber Intelligence | What is happening across cyber systems and assets? | “Possible credential attack path against cloud admin accounts.” |
| Business / Market Intelligence | What is changing in the market or business environment? | “Competitor hiring suggests expansion into healthcare vertical.” |
| Geospatial Intelligence | What does location, movement, terrain, and spatial context reveal? | “Congestion is clustered around three critical routes.” |
| **Operational Intelligence** | What is happening in the operation right now, and what should we do? | “Support queue is overloaded due to device provisioning failures.” |

Operational intelligence is usually closer to the ground. It is about **workflow reality**, not just strategy.

---

## 3. Public Reference Concepts

This report is grounded in public, defensive, and business-safe concepts:

- **Operational Intelligence platforms** monitor, alert, and support interactive decision-making using data and analytics about current conditions. Gartner describes operations intelligence platforms as tools that monitor, alert, support decision-making, detect threats/opportunities, process rules, provide dashboards, and trigger responses in applications or workflows.
- **Real-time analytics** involves collecting, analyzing, and using data as it is generated to support timely decisions.
- **Incident response** and operational handling benefit from preparation, detection, response, recovery, and lessons learned. NIST SP 800-61 Rev. 3 aligns incident response with the NIST Cybersecurity Framework 2.0 and emphasizes improving detection, response, and recovery efficiency.
- **IT service management / ITIL-style thinking** connects operations, services, incidents, requests, changes, problems, capacity, availability, service desk processes, and customer impact.
- **Observability** commonly uses metrics, events, logs, and traces to understand system state.

Useful public references for the project:

```text
Gartner — Operations Intelligence Platforms
https://www.gartner.com/reviews/market/operations-intelligence-platforms

Splunk — Operational Intelligence
https://www.splunk.com/en_us/blog/learn/oi-operational-intelligence.html

Splunk — Real-Time Analytics
https://www.splunk.com/en_us/blog/learn/real-time-analytics.html

NIST — Incident Response Project / SP 800-61 Rev. 3
https://csrc.nist.gov/projects/incident-response

NIST Cybersecurity Framework 2.0
https://www.nist.gov/cyberframework

ITIL 4 overview concepts
https://www.axelos.com/certifications/itil-service-management
```

---

## 4. What Operational Intelligence Should Detect

Operational intelligence is not only about outages. It should detect anything that affects the ability of an operation to function.

### 4.1 Queue Bottlenecks

Examples:

- Ticket queue suddenly grows faster than normal.
- Average wait time rises above baseline.
- A specific support category dominates new tickets.
- Tickets are bouncing between teams.
- A small group of agents is overloaded while others are underutilized.

Possible OSIRIS finding:

```text
Possible Bottleneck:
Device provisioning queue is degrading.

Why:
- New tickets increased 62% above same-time baseline.
- 47% of tickets mention Jamf enrollment, Intune sync, or device setup.
- Assignment age is rising faster than closure rate.
- Two agents own 70% of active provisioning tickets.
```

---

### 4.2 Service Degradation

Examples:

- Application response time increases.
- Error rate rises.
- User complaints increase.
- Monitoring alerts begin firing.
- Vendor status page shows partial degradation.

Possible OSIRIS finding:

```text
Possible Service Degradation:
SSO authentication may be unstable for remote users.

Why:
- Helpdesk tickets mentioning login failure increased within 90 minutes.
- Identity provider logs show elevated failed auth attempts.
- Remote office users are overrepresented.
- Vendor status page reports delayed authentication processing.
```

---

### 4.3 Staffing / Capacity Risk

Examples:

- More work is arriving than the team can process.
- Scheduled absences overlap with known peak load.
- Queue size exceeds available staffing.
- Specialized tasks depend on one person.

Possible OSIRIS finding:

```text
Possible Capacity Risk:
Morning walk-up support may exceed staffing capacity.

Why:
- Appointment volume is 35% above normal.
- Two technicians are marked unavailable.
- Device pickup volume is concentrated from 9:00–11:00.
- Historical average service time suggests backlog formation by 10:15.
```

---

### 4.4 Process Failure

Examples:

- Tickets repeat the same handoff pattern.
- A workflow stage has unusual dwell time.
- Approvals are stuck with one team.
- A known SOP step is often skipped.
- Tasks are reopened after closure.

Possible OSIRIS finding:

```text
Possible Process Failure:
Access request approvals are stalling at manager confirmation.

Why:
- 41 open requests are waiting on the same approval stage.
- Average stage age is 3.2x normal.
- Reassignment notes mention missing approval context.
- Similar pattern appeared during previous org-change cycle.
```

---

### 4.5 Incident Coordination Risk

Examples:

- Multiple teams are working the same problem without a shared incident.
- Different reports describe the same issue differently.
- Duplicate tickets are not being grouped.
- Communications are inconsistent.

Possible OSIRIS finding:

```text
Possible Coordination Issue:
Multiple teams may be investigating the same SSO degradation separately.

Why:
- Network, identity, and service desk tickets mention overlapping symptoms.
- Three separate Slack threads reference the same user-facing issue.
- No master incident ticket is linked.
- Duplicate symptoms appear across two regions.
```

---

## 5. The Operational Intelligence Pipeline

Operational intelligence should follow a clear pipeline.

```text
1. Ingest operational data
2. Normalize raw records
3. Extract operational entities
4. Resolve duplicate entities
5. Build operational relationships
6. Create time-series and workflow views
7. Detect anomalies and bottlenecks
8. Generate hypotheses
9. Score confidence and impact
10. Recommend actions
11. Track outcomes and learn from results
```

---

## 6. Data Sources for Operational Intelligence

OSIRIS should treat operational data as a stream of signals, not as one giant blob.

### 6.1 IT / Service Desk Sources

```text
- Tickets
- Incidents
- Service requests
- Change requests
- Problem records
- Assignment groups
- SLA clocks
- Ticket comments
- Ticket categories
- Reopen counts
- Escalations
- Knowledge-base usage
```

### 6.2 System / Application Sources

```text
- Logs
- Metrics
- Events
- Traces
- Uptime checks
- API status
- Error rates
- Latency
- Resource usage
- Deployment events
```

### 6.3 People / Staffing Sources

```text
- Shift schedules
- Availability
- Skill coverage
- On-call status
- Absences
- Workload by person
- Queue ownership
- Escalation paths
```

### 6.4 Asset / Inventory Sources

```text
- Devices
- Locations
- Owners
- Assignment status
- Repair status
- Warranty status
- Lifecycle stage
- Stock counts
- Configuration state
```

### 6.5 Business Process Sources

```text
- Orders
- Fulfillment steps
- Approvals
- Vendor updates
- Shipping records
- Customer support cases
- Workflow stage transitions
- Process audit logs
```

### 6.6 External Context Sources

```text
- Vendor status pages
- Weather alerts
- Transit disruptions
- Public infrastructure notices
- Regulatory notices
- Known outage reports
- Supply chain delay notices
```

---

## 7. Core Operational Objects

Operational Intelligence needs structured objects.

The major object types are:

```text
OperationalSignal
OperationalEntity
OperationalMetric
OperationalEvent
WorkflowStage
QueueState
SLAState
OperationalRelationship
OperationalHypothesis
OperationalAssessment
RecommendedAction
```

---

## 8. OSIRIS TypeScript Data Models

These are starting-point models. They are intentionally practical for a Vite/React/Zustand/Supabase-style project.

### 8.1 Source Record

```ts
export type OperationalSourceType =
  | "ticket"
  | "incident"
  | "service_request"
  | "change_request"
  | "problem_record"
  | "log"
  | "metric"
  | "alert"
  | "schedule"
  | "asset_record"
  | "inventory_record"
  | "vendor_status"
  | "manual_note"
  | "external_context";

export interface OperationalSourceRecord {
  id: string;
  sourceType: OperationalSourceType;
  sourceSystem: string;
  externalId?: string;
  title: string;
  rawText?: string;
  url?: string;
  createdAt: string;
  updatedAt?: string;
  observedAt?: string;
  reliabilityScore: number; // 0 to 1
  freshnessScore: number; // 0 to 1
  metadata?: Record<string, unknown>;
}
```

---

### 8.2 Operational Entity

```ts
export type OperationalEntityType =
  | "person"
  | "team"
  | "queue"
  | "service"
  | "application"
  | "device"
  | "location"
  | "vendor"
  | "workflow"
  | "ticket"
  | "incident"
  | "asset"
  | "sla"
  | "category"
  | "business_unit";

export interface OperationalEntity {
  id: string;
  type: OperationalEntityType;
  name: string;
  aliases?: string[];
  description?: string;
  sourceIds: string[];
  confidence: number; // 0 to 1
  attributes?: Record<string, unknown>;
}
```

---

### 8.3 Operational Signal

```ts
export type OperationalSignalType =
  | "queue_growth"
  | "sla_risk"
  | "service_degradation"
  | "staffing_shortage"
  | "asset_shortage"
  | "workflow_delay"
  | "error_spike"
  | "duplicate_reports"
  | "handoff_loop"
  | "vendor_issue"
  | "capacity_pressure"
  | "manual_observation";

export interface OperationalSignal {
  id: string;
  signalType: OperationalSignalType;
  title: string;
  summary: string;
  sourceIds: string[];
  entityIds: string[];
  observedAt: string;
  locationId?: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  confidence: number; // 0 to 1
  tags: string[];
  metrics?: Record<string, number>;
}
```

---

### 8.4 Operational Metric

```ts
export interface OperationalMetric {
  id: string;
  name: string;
  entityId?: string;
  sourceId?: string;
  value: number;
  unit: string;
  measuredAt: string;
  baselineValue?: number;
  deviationPercent?: number;
  direction?: "up" | "down" | "flat";
  threshold?: {
    warning?: number;
    critical?: number;
  };
}
```

---

### 8.5 Queue State

```ts
export interface QueueState {
  id: string;
  queueEntityId: string;
  measuredAt: string;
  openCount: number;
  newCount: number;
  inProgressCount: number;
  waitingCount: number;
  closedCountLastHour?: number;
  averageAgeMinutes?: number;
  averageWaitMinutes?: number;
  slaAtRiskCount?: number;
  slaBreachedCount?: number;
  assignedUserCounts?: Record<string, number>;
  categoryCounts?: Record<string, number>;
}
```

---

### 8.6 Workflow Stage

```ts
export interface WorkflowStageState {
  id: string;
  workflowEntityId: string;
  stageName: string;
  itemCount: number;
  averageDwellMinutes: number;
  baselineDwellMinutes?: number;
  measuredAt: string;
  blockedCount?: number;
  ownerTeamId?: string;
}
```

---

### 8.7 Operational Relationship

```ts
export type OperationalRelationshipType =
  | "assigned_to"
  | "owned_by"
  | "depends_on"
  | "affects"
  | "located_at"
  | "part_of"
  | "blocked_by"
  | "duplicates"
  | "escalated_to"
  | "caused_by_claim"
  | "correlated_with"
  | "resolved_by";

export interface OperationalRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: OperationalRelationshipType;
  sourceIds: string[];
  confidence: number; // 0 to 1
  firstObservedAt: string;
  lastObservedAt?: string;
  notes?: string;
}
```

---

### 8.8 Operational Hypothesis

```ts
export interface OperationalHypothesis {
  id: string;
  title: string;
  hypothesisType:
    | "bottleneck"
    | "service_degradation"
    | "capacity_risk"
    | "process_failure"
    | "coordination_issue"
    | "asset_shortage"
    | "vendor_dependency_issue"
    | "incident_candidate";
  summary: string;
  supportingSignalIds: string[];
  relatedEntityIds: string[];
  sourceIds: string[];
  confidenceScore: number; // 0 to 100
  impactScore: number; // 0 to 100
  urgencyScore: number; // 0 to 100
  priorityScore: number; // 0 to 100
  alternativeExplanations: string[];
  assumptions: string[];
  evidenceGaps: string[];
  recommendedActionIds: string[];
  createdAt: string;
  updatedAt?: string;
}
```

---

### 8.9 Recommended Action

```ts
export interface RecommendedAction {
  id: string;
  title: string;
  actionType:
    | "investigate"
    | "escalate"
    | "communicate"
    | "reassign"
    | "pause_change"
    | "increase_staffing"
    | "create_master_incident"
    | "check_vendor"
    | "run_report"
    | "update_knowledge_base"
    | "monitor";
  description: string;
  ownerTeamId?: string;
  suggestedDueAt?: string;
  expectedOutcome?: string;
  riskIfIgnored?: string;
  confidence: number; // 0 to 1
}
```

---

## 9. How OSIRIS Should Extract Operational Data

### 9.1 Text Extraction

For tickets, notes, incident summaries, comments, and vendor posts, extract:

```text
- Service or application names
- Affected locations
- Error messages
- Reported symptoms
- User groups
- Assignment groups
- Dates and times
- Severity words
- Repeated phrases
- Status changes
- Escalation language
- Blocker language
```

Example:

```text
Raw ticket:
"Users at the Portland office cannot enroll new MacBooks through Jamf. Setup Assistant hangs after SSO. Three devices affected this morning."

Extracted:
- Location: Portland office
- Service: Jamf
- Device type: MacBook
- Workflow: device enrollment
- Symptom: Setup Assistant hangs after SSO
- Count: 3 devices
- Time context: this morning
- Operational signal: device provisioning issue
```

---

### 9.2 Metric Extraction

For metrics, extract:

```text
- Current value
- Baseline value
- Thresholds
- Percent change
- Time window
- Affected entity
- Unit of measurement
```

Example:

```json
{
  "metric": "open_ticket_count",
  "entity": "Device Provisioning Queue",
  "currentValue": 84,
  "baselineValue": 43,
  "deviationPercent": 95.3,
  "window": "last_4_hours"
}
```

---

### 9.3 Workflow Extraction

For workflow data, extract:

```text
- Stage name
- Stage owner
- Time in stage
- Number of items in stage
- Previous stage
- Next stage
- Reopen count
- Handoff count
- Blocker reason
```

Workflow intelligence is critical because many operational failures are not caused by one broken system. They are caused by work getting stuck between teams.

---

## 10. Entity Resolution for Operations

Entity resolution means deciding whether different records refer to the same real-world thing.

Examples:

```text
"Jamf enrollment"
"JAMF setup"
"Mac provisioning"
"Apple device enrollment"
```

These may all refer to the same operational workflow.

OSIRIS should resolve entities using:

```text
1. Exact name matching
2. Alias matching
3. Case-insensitive matching
4. Fuzzy string matching
5. Known service catalog mappings
6. Ticket category mappings
7. User/team ownership mappings
8. Manual correction history
```

A practical local-first version can start with aliases and fuzzy matching. Do not overbuild this first. Get the obvious wins.

---

## 11. Operational Relationship Mapping

Operational intelligence becomes useful when it maps relationships.

Examples:

```text
Ticket → affects → Service
Service → depends_on → Vendor
Queue → owned_by → Team
Workflow Stage → blocked_by → Approval
Incident → duplicates → Ticket
Asset → located_at → Location
Person → assigned_to → Ticket
```

A graph view makes it easier to answer:

```text
What services are affected?
Which team owns the work?
Which queue is overloaded?
Which asset group is involved?
Which vendor or dependency keeps appearing?
What changed right before the issue started?
```

---

## 12. Operational Scoring

Operational intelligence should separate **confidence**, **impact**, **urgency**, and **priority**.

They are not the same thing.

### 12.1 Confidence Score

Confidence asks:

> How sure are we that this assessment is true?

Inputs:

```text
- Number of independent sources
- Source reliability
- Entity match strength
- Metric deviation strength
- Recency
- Historical pattern similarity
- Directness of evidence
```

Example formula:

```text
confidence =
  (sourceCorroboration * 0.25) +
  (sourceReliability * 0.20) +
  (entityMatchConfidence * 0.20) +
  (metricDeviationStrength * 0.15) +
  (recency * 0.10) +
  (historicalSimilarity * 0.10)
```

---

### 12.2 Impact Score

Impact asks:

> How bad is this if it is true?

Inputs:

```text
- Number of affected users
- Business criticality
- Customer impact
- Revenue impact
- SLA exposure
- Service dependency depth
- Executive visibility
- Safety or compliance implications
```

---

### 12.3 Urgency Score

Urgency asks:

> How soon does someone need to act?

Inputs:

```text
- Time to SLA breach
- Rate of degradation
- Active incident status
- Queue growth speed
- Number of blocked items
- Time-sensitive external dependency
```

---

### 12.4 Priority Score

Priority combines confidence, impact, and urgency.

```text
priority =
  (impact * 0.45) +
  (urgency * 0.35) +
  (confidence * 0.20)
```

This prevents a low-confidence issue from automatically becoming top priority unless impact and urgency are severe.

---

## 13. Operational Hypothesis Types

OSIRIS should generate structured hypotheses instead of vague alerts.

### 13.1 Bottleneck Hypothesis

```text
A queue, workflow stage, person, team, vendor, or system is slowing down the operation.
```

### 13.2 Service Degradation Hypothesis

```text
A service is still functioning but performing below normal baseline.
```

### 13.3 Capacity Risk Hypothesis

```text
Demand is likely to exceed available staffing, assets, or system capacity.
```

### 13.4 Process Failure Hypothesis

```text
The defined workflow is failing, being skipped, looping, or stalling.
```

### 13.5 Coordination Issue Hypothesis

```text
Multiple teams or systems are handling related work without shared context.
```

### 13.6 Asset Shortage Hypothesis

```text
A shortage of devices, parts, licenses, inventory, vehicles, or equipment may block work.
```

### 13.7 Vendor Dependency Issue Hypothesis

```text
An external provider, supplier, SaaS tool, or contractor dependency is affecting operations.
```

---

## 14. Example Operational Intelligence Scenario

### Raw Signals

```text
Signal 1:
Tickets mentioning "Mac enrollment stuck" increase from 2 per day to 19 in four hours.

Signal 2:
Jamf admin dashboard shows elevated failed enrollment events.

Signal 3:
Device pickup appointments are scheduled heavily between 9:00 AM and 12:00 PM.

Signal 4:
Two technicians with Mac provisioning experience are out today.

Signal 5:
Slack messages mention that Setup Assistant hangs after SSO.
```

### OSIRIS Assessment

```text
Possible Operational Issue:
Mac device provisioning workflow degradation.

Confidence:
High

Impact:
Medium-High

Urgency:
High

Why:
- Multiple independent sources mention the same workflow.
- Ticket volume is far above baseline.
- Monitoring data supports the user-reported symptoms.
- Staffing coverage is reduced for the affected specialty.
- Appointment volume makes the issue time-sensitive.

Alternative Explanations:
- User training issue during onboarding.
- Misconfigured batch of devices.
- Temporary identity provider delay.
- Jamf cloud service issue.

Recommended Actions:
1. Create a master incident or operational issue record.
2. Group duplicate tickets under the master record.
3. Check Jamf service status and recent configuration changes.
4. Temporarily reassign Mac-provisioning tickets to available skilled staff.
5. Post a short internal update to reduce duplicate tickets.
6. Track whether new enrollment failures continue after workaround.
```

---

## 15. AI Chatbot Prompt Pretext

Use this as the giant pretext message before sending structured operational data to ChatGPT or another AI model.

The purpose is to force the AI to behave like an operational intelligence analyst: grounded, cautious, explainable, and action-oriented.

```text
You are an Operational Intelligence Analyst for a system called OSIRIS.

Your job is to analyze structured operational data and produce possible operational assessments. You must identify bottlenecks, service degradation, process failures, staffing risks, capacity risks, incident candidates, duplicate reports, vendor dependency issues, asset shortages, and workflow coordination problems.

You are not allowed to invent facts. Use only the data provided. If the data is incomplete, say what is missing. Do not claim certainty unless the evidence strongly supports it. Distinguish facts, assumptions, inferences, and unknowns.

You must produce explainable assessments with confidence scores, impact scores, urgency scores, priority scores, supporting evidence, alternative explanations, recommended actions, and evidence gaps.

Definitions:

- Confidence score means how likely the assessment is to be true based on the provided data.
- Impact score means how serious the operational effect may be if the assessment is true.
- Urgency score means how quickly action may be needed.
- Priority score means the combined importance of handling the issue now.
- Supporting evidence must cite specific source IDs, signal IDs, metric IDs, ticket IDs, or entity IDs from the provided data.
- Alternative explanations must explain what else could fit the same data.
- Evidence gaps must describe what data would confirm, disprove, or clarify the assessment.

Use the following scoring scale:

0-20 = Very Low
21-40 = Low
41-60 = Moderate
61-80 = High
81-100 = Very High

When analyzing operational data, look for:

1. Queue growth above baseline
2. SLA risk or SLA breach patterns
3. Repeated symptoms across tickets or alerts
4. Same service appearing across multiple source types
5. Staffing shortages relative to demand
6. Workflow stages with abnormal dwell time
7. Items stuck between teams
8. Reopened tickets or repeated failed resolutions
9. Duplicate reports that may indicate one larger issue
10. Vendor or dependency issues
11. Asset or inventory shortages
12. Location-specific operational problems
13. Time-window clustering
14. Recent changes before degradation
15. High-impact services with low current visibility

Return your answer in the following structure:

# Operational Intelligence Assessment

## 1. Executive Summary
- Summarize the most important operational findings in plain English.
- Include the top 3 issues, if any exist.
- If no meaningful issue is found, say so and explain why.

## 2. Possible Operational Issues
For each issue, include:

### Issue Title
- Type: bottleneck | service_degradation | capacity_risk | process_failure | coordination_issue | asset_shortage | vendor_dependency_issue | incident_candidate | other
- Confidence Score: 0-100
- Impact Score: 0-100
- Urgency Score: 0-100
- Priority Score: 0-100
- Plain-English Summary:
- Supporting Evidence:
  - sourceId / signalId / metricId / entityId: explanation
- Reasoning Chain:
  - Step-by-step explanation of how the data supports the assessment.
- Alternative Explanations:
  - List plausible non-alarming explanations.
- Evidence Gaps:
  - List missing data that would help confirm or reject the assessment.
- Recommended Actions:
  - Immediate actions
  - Follow-up actions
  - Monitoring actions

## 3. Entity and Relationship Map
- List important entities.
- List important relationships.
- Explain why those relationships matter operationally.

## 4. Timeline
- Create a timeline from the provided timestamps.
- Highlight what changed first, what followed, and what may be connected.

## 5. Metrics and Baseline Deviations
- List metrics that are above or below baseline.
- Explain whether the deviation appears operationally meaningful.

## 6. Priority Queue
Create a ranked action queue:
1. Highest priority action
2. Second priority action
3. Third priority action

For each action, explain why it is ranked there.

## 7. What Would Change the Assessment
- What evidence would increase confidence?
- What evidence would decrease confidence?
- What evidence would change the priority?

## 8. JSON Summary
Return a compact JSON object containing:
- issues[]
- entities[]
- relationships[]
- recommendedActions[]
- evidenceGaps[]

Important rules:

- Do not overstate the data.
- Do not assume malicious activity unless the data directly supports it.
- Do not treat correlation as causation.
- Do not recommend invasive surveillance or privacy-violating actions.
- Prefer operational fixes, validation steps, communication, routing, and monitoring.
- Be practical, direct, and evidence-based.

The operational data begins after this line:
---BEGIN OPERATIONAL DATA---
```

---

## 16. Recommended Data Payload Structure for AI Analysis

The data sent after the prompt should be structured. JSON is best.

```json
{
  "analysisContext": {
    "organizationName": "Example Company",
    "analysisWindowStart": "2026-06-06T08:00:00-07:00",
    "analysisWindowEnd": "2026-06-06T12:00:00-07:00",
    "timezone": "America/Los_Angeles",
    "goal": "Detect operational bottlenecks, service degradation, capacity risk, and recommended actions."
  },
  "sources": [
    {
      "id": "src_001",
      "sourceType": "ticket",
      "sourceSystem": "ServiceNow",
      "title": "Mac enrollment stuck after SSO",
      "rawText": "Users report new MacBooks hanging after SSO during setup.",
      "createdAt": "2026-06-06T08:35:00-07:00",
      "reliabilityScore": 0.85
    }
  ],
  "entities": [
    {
      "id": "ent_001",
      "type": "service",
      "name": "Jamf Enrollment",
      "aliases": ["Mac provisioning", "Apple device enrollment"],
      "sourceIds": ["src_001"],
      "confidence": 0.9
    }
  ],
  "signals": [
    {
      "id": "sig_001",
      "signalType": "workflow_delay",
      "title": "Mac enrollment failures rising",
      "summary": "Ticket volume for Mac enrollment issues rose above baseline.",
      "sourceIds": ["src_001"],
      "entityIds": ["ent_001"],
      "observedAt": "2026-06-06T09:00:00-07:00",
      "severity": "medium",
      "confidence": 0.82,
      "tags": ["mac", "jamf", "device-provisioning"]
    }
  ],
  "metrics": [
    {
      "id": "met_001",
      "name": "mac_enrollment_ticket_count",
      "entityId": "ent_001",
      "value": 19,
      "unit": "tickets_per_4_hours",
      "measuredAt": "2026-06-06T12:00:00-07:00",
      "baselineValue": 4,
      "deviationPercent": 375
    }
  ],
  "queueStates": [
    {
      "id": "queue_001",
      "queueEntityId": "ent_queue_001",
      "measuredAt": "2026-06-06T12:00:00-07:00",
      "openCount": 84,
      "newCount": 31,
      "inProgressCount": 28,
      "waitingCount": 25,
      "averageAgeMinutes": 142,
      "slaAtRiskCount": 12,
      "slaBreachedCount": 3
    }
  ],
  "relationships": [
    {
      "id": "rel_001",
      "fromEntityId": "ent_001",
      "toEntityId": "ent_queue_001",
      "type": "affects",
      "sourceIds": ["src_001"],
      "confidence": 0.78,
      "firstObservedAt": "2026-06-06T08:35:00-07:00"
    }
  ]
}
```

---

## 17. Example AI Output

```text
# Operational Intelligence Assessment

## 1. Executive Summary
The provided data suggests a high-confidence operational degradation in the Mac device provisioning workflow. The strongest issue is a sharp increase in Mac enrollment failures tied to Jamf Enrollment, with related ticket growth, queue aging, and SLA exposure.

Top issues:
1. Mac provisioning workflow degradation
2. Device provisioning queue bottleneck
3. SLA risk from rising unresolved ticket volume

## 2. Possible Operational Issues

### Mac Provisioning Workflow Degradation
- Type: service_degradation
- Confidence Score: 86
- Impact Score: 74
- Urgency Score: 82
- Priority Score: 79
- Plain-English Summary: Mac enrollment appears to be failing or slowing during setup, especially after SSO.

Supporting Evidence:
- src_001: Ticket text directly reports MacBooks hanging after SSO.
- sig_001: Extracted signal identifies workflow delay for Mac enrollment.
- met_001: Ticket count is 375% above baseline.
- rel_001: Jamf Enrollment is connected to the affected operational queue.

Reasoning Chain:
1. The same service/workflow appears in the ticket, entity, signal, metric, and relationship data.
2. The metric shows a major increase over baseline.
3. The issue is recent and active within the analysis window.
4. Queue data shows accumulating work and SLA risk.
5. Together, this supports a likely operational degradation rather than isolated user error.

Alternative Explanations:
- A small onboarding wave created unusual ticket volume.
- A bad batch of devices is causing localized setup issues.
- Users are misreporting a training issue as a technical failure.
- An identity provider delay is causing symptoms that appear to be Jamf-related.

Evidence Gaps:
- Jamf admin logs for failed enrollment attempts.
- Identity provider logs for SSO latency or errors.
- Recent change/deployment records.
- Device serial/batch correlation.
- Whether failures affect all users or only one location/group.

Recommended Actions:
1. Create a master incident for Mac enrollment degradation.
2. Link duplicate tickets to the master incident.
3. Check Jamf and identity provider logs.
4. Reassign Mac provisioning tickets to available skilled technicians.
5. Send an internal update to reduce duplicate reports.
6. Monitor ticket volume and enrollment success rate hourly.
```

---

## 18. Local-First OSIRIS Implementation Strategy

A strong OSIRIS operational intelligence implementation can be built without expensive AI calls on every item.

### Phase 1 — Store and Normalize

```text
- Store source records.
- Extract basic entities.
- Normalize dates, teams, services, queues, locations, and statuses.
- Add source reliability and freshness fields.
```

### Phase 2 — Simple Rules

```text
- Detect queue growth above threshold.
- Detect SLA-at-risk count increases.
- Detect repeated keywords.
- Detect same entity appearing across multiple records.
- Detect stage dwell time above baseline.
```

### Phase 3 — Relationship Graph

```text
- Connect tickets to services.
- Connect services to teams.
- Connect teams to queues.
- Connect queues to SLAs.
- Connect incidents to duplicate tickets.
```

### Phase 4 — Hypothesis Generation

```text
- Group related signals.
- Generate operational hypotheses.
- Score confidence, impact, urgency, and priority.
- Create explanation objects.
```

### Phase 5 — AI-Assisted Assessment

```text
- Only send clustered summaries to AI.
- Do not send every raw record unless necessary.
- Use AI to explain, rank, and challenge hypotheses.
- Save AI output as an assessment, not as truth.
```

### Phase 6 — Feedback Loop

```text
- Let users mark assessments as useful, false positive, confirmed, or resolved.
- Use that feedback to tune aliases, thresholds, and scoring.
- Track which recommendations actually helped.
```

---

## 19. Suggested OSIRIS UI Pages

### 19.1 Operations Dashboard

Shows:

```text
- Current operational health
- Top active issues
- Queue pressure
- SLA risk
- Service degradation candidates
- Staffing/capacity warnings
```

### 19.2 Queue Intelligence Page

Shows:

```text
- Queue size over time
- New vs closed rate
- Average age
- SLA risk
- Category breakdown
- Owner distribution
- Bottleneck explanation
```

### 19.3 Service Health Page

Shows:

```text
- Affected services
- Related tickets
- Related alerts
- Vendor status
- Recent changes
- Historical baseline
```

### 19.4 Workflow Intelligence Page

Shows:

```text
- Process stages
- Stage dwell time
- Blocked items
- Handoff loops
- Reopen patterns
- Stage owner/team
```

### 19.5 Operational Dossier Page

Shows:

```text
- Main assessment
- Supporting evidence
- Timeline
- Entities
- Relationships
- Metrics
- Recommended actions
- Alternative explanations
- Evidence gaps
```

---

## 20. Safety, Privacy, and Ethics Guardrails

Operational intelligence can become invasive if handled carelessly.

OSIRIS should follow these boundaries:

```text
- Prefer team/process/service-level analysis over individual surveillance.
- Do not rank employees as "bad" based only on ticket volume or queue ownership.
- Do not infer intent from operational delay.
- Do not treat workload imbalance as individual failure without context.
- Do not expose private user data unnecessarily.
- Do not use operational intelligence to punish workers without human review.
- Make scoring explainable and challengeable.
- Show source evidence and uncertainty.
- Keep audit logs for AI-assisted assessments.
```

The safest framing is:

> OSIRIS should improve operations, reduce bottlenecks, protect teams from overload, and help people make better decisions — not become a creepy productivity panopticon.

That line belongs on the wall. Maybe in neon.

---

## 21. Practical Design Principles

### 21.1 Show the Receipts

Every assessment should show:

```text
- Which sources contributed
- Which signals were extracted
- Which entities were connected
- Which metrics changed
- Which assumptions were made
- Which data is missing
```

### 21.2 Separate Alerts from Assessments

An alert says:

```text
CPU is above 90%.
```

An assessment says:

```text
The payment service may be degrading because CPU is elevated, error rate increased, checkout tickets rose, and the issue started after a deployment.
```

OSIRIS should focus on assessments.

### 21.3 Confidence Is Not Priority

A low-confidence issue can still be urgent if the impact is huge.

A high-confidence issue can still be low priority if the impact is tiny.

Keep these separate.

### 21.4 Always Include Alternative Explanations

This prevents the system from becoming a pattern-matching drama queen.

### 21.5 AI Should Explain, Not Decide

The AI can help generate an assessment, but the system should keep humans in control of decisions.

---

## 22. Final OSIRIS Framing

Operational Intelligence should become the OSIRIS module that answers:

```text
What is happening right now?
What is abnormal?
What is affected?
Who or what owns it?
What evidence supports the assessment?
What else could explain it?
How confident are we?
How urgent is it?
What should be done next?
```

This makes OSIRIS feel powerful without needing to pretend it is psychic.

The best version is not a giant blinking alert board. It is a calm operational analyst that says:

```text
Here is the issue.
Here is why I think it matters.
Here is the evidence.
Here is what might disprove it.
Here is what I would do first.
```

That is real operational intelligence.

---

## 23. Suggested File Placement

Recommended project location:

```text
/docs/intelligence-types/OSIRIS_2_Operational_Intelligence_Data_Fusion_Report.md
```

Recommended related files:

```text
/docs/intelligence-types/OSIRIS_2_Event_Intelligence_Data_Fusion_Report.md
/docs/intelligence-types/OSIRIS_2_Threat_Intelligence_Data_Fusion_Report.md
/docs/intelligence-types/OSIRIS_2_Cyber_Intelligence_Data_Fusion_Report.md
/docs/intelligence-types/OSIRIS_2_Business_Market_Intelligence_Data_Fusion_Report.md
/docs/intelligence-types/OSIRIS_2_Geospatial_Intelligence_Data_Fusion_Report.md
/docs/intelligence-types/OSIRIS_2_Operational_Intelligence_Data_Fusion_Report.md
```

---

## 24. One-Line Summary

Operational Intelligence for OSIRIS is the process of turning live operational signals into explainable assessments about bottlenecks, degradation, capacity, workflow failures, and recommended actions — with evidence, confidence, impact, urgency, and alternatives clearly shown.
