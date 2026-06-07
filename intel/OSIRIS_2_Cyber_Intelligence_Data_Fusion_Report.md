# OSIRIS 2.0 Cyber Intelligence Data Fusion Report

> Project framing: **OSIRIS as a local-first cyber intelligence synthesis layer** that turns security telemetry, cyber reports, asset data, vulnerability information, detections, logs, and analyst notes into explainable cyber assessments.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Cyber Intelligence vs Threat Intelligence vs Event Intelligence](#2-cyber-intelligence-vs-threat-intelligence-vs-event-intelligence)
3. [Core Cyber Intelligence Questions](#3-core-cyber-intelligence-questions)
4. [The Cyber Intelligence Pipeline](#4-the-cyber-intelligence-pipeline)
5. [Data Sources](#5-data-sources)
6. [Data Extraction Process](#6-data-extraction-process)
7. [Entity Extraction](#7-entity-extraction)
8. [Cyber Entity Resolution](#8-cyber-entity-resolution)
9. [Cyber Graph Modeling](#9-cyber-graph-modeling)
10. [Signal Clustering](#10-signal-clustering)
11. [Detection Correlation](#11-detection-correlation)
12. [Attack Path Analysis](#12-attack-path-analysis)
13. [Vulnerability Intelligence](#13-vulnerability-intelligence)
14. [Exposure Intelligence](#14-exposure-intelligence)
15. [Incident Intelligence](#15-incident-intelligence)
16. [Risk Scoring vs Confidence Scoring](#16-risk-scoring-vs-confidence-scoring)
17. [Analytic Tradecraft for Cyber Intelligence](#17-analytic-tradecraft-for-cyber-intelligence)
18. [OSIRIS Cyber Intelligence Data Model](#18-osiris-cyber-intelligence-data-model)
19. [Cyber Intelligence Report Object](#19-cyber-intelligence-report-object)
20. [AI Chatbot Prompt Pretext](#20-ai-chatbot-prompt-pretext)
21. [How to Structure Data for ChatGPT](#21-how-to-structure-data-for-chatgpt)
22. [Example Data Payload](#22-example-data-payload)
23. [Example AI Output](#23-example-ai-output)
24. [Local-First Implementation Strategy](#24-local-first-implementation-strategy)
25. [Safety and Ethics Guardrails](#25-safety-and-ethics-guardrails)
26. [Recommended OSIRIS Features](#26-recommended-osiris-features)
27. [References](#27-references)

---

# 1. Purpose

This report explains how OSIRIS 2.0 can analyze cyber-related data in a structured, explainable way.

The goal is not to build a hacking tool.

The goal is to build a **defensive cyber intelligence system** that can:

- ingest messy security data,
- extract cyber-relevant entities,
- connect indicators and assets,
- identify suspicious patterns,
- group related cyber signals,
- generate possible incidents or risks,
- explain why those conclusions were reached,
- assign confidence scores,
- suggest defensive next steps,
- preserve source attribution.

Cyber intelligence is the broader process of understanding what is happening across systems, users, networks, applications, vulnerabilities, assets, detections, and adversary behavior.

It is not limited to threat actor reports.

It includes:

- internal telemetry,
- external threat intelligence,
- vulnerability intelligence,
- asset exposure intelligence,
- incident intelligence,
- detection engineering intelligence,
- business risk context,
- operational impact.

The OSIRIS version should be transparent, local-first, source-attributed, and careful about uncertainty.

---

# 2. Cyber Intelligence vs Threat Intelligence vs Event Intelligence

These terms overlap, but they are not exactly the same.

## Event Intelligence

Event intelligence asks:

> What appears to be happening?

Examples:

- possible outage,
- possible protest,
- possible logistics disruption,
- possible breach event,
- possible campaign starting.

## Threat Intelligence

Threat intelligence asks:

> Who or what may pose a threat, how do they operate, and what indicators or behaviors are associated with them?

Examples:

- malware family,
- threat actor,
- command-and-control infrastructure,
- phishing kit,
- observed tactics, techniques, and procedures.

## Cyber Intelligence

Cyber intelligence asks:

> What does the available cyber data say about the security state of our systems, users, assets, risks, detections, and possible incidents?

Examples:

- repeated failed logins against privileged accounts,
- exposed service with a high-risk vulnerability,
- endpoint alert plus suspicious PowerShell activity,
- suspicious domain plus mail telemetry plus login anomaly,
- vulnerable public-facing asset that matches an actively exploited CVE,
- internal host showing lateral movement signals.

Cyber intelligence can include event intelligence and threat intelligence, but it is broader.

Cyber intelligence connects:

```text
Assets
  + Users
  + Identities
  + Logs
  + Vulnerabilities
  + Alerts
  + Network activity
  + External indicators
  + Business context
  = Explainable cyber assessment
```

---

# 3. Core Cyber Intelligence Questions

A good cyber intelligence system should help answer these questions:

## System State

- What assets exist?
- Which assets are critical?
- Which assets are exposed to the internet?
- Which users or identities are privileged?
- What normal activity looks like for a given user, device, or application?

## Detection

- What unusual behavior happened?
- Which alerts may be related?
- Which alerts are probably noise?
- Which alerts form a meaningful chain?
- What source evidence supports each finding?

## Vulnerability and Exposure

- Which systems are vulnerable?
- Which vulnerabilities are known to be exploited?
- Which vulnerable assets are internet-facing?
- Which assets are business-critical?
- Which vulnerabilities should be patched first?

## Incident Understanding

- What likely happened?
- When did it start?
- Which assets and users were involved?
- What sequence of activity was observed?
- What is confirmed vs assumed?
- What evidence would increase or decrease confidence?

## Defensive Action

- What should be investigated first?
- What should be blocked, patched, reset, isolated, or monitored?
- What should be escalated?
- What should be documented?

---

# 4. The Cyber Intelligence Pipeline

The core process is:

```text
Raw cyber data
  ↓
Normalize fields
  ↓
Extract cyber entities
  ↓
Resolve duplicate entities
  ↓
Build cyber graph
  ↓
Cluster related signals
  ↓
Map behaviors and detections
  ↓
Score risk and confidence
  ↓
Generate cyber assessment
  ↓
Recommend defensive actions
  ↓
Store report with source evidence
```

This is similar to event intelligence, but cyber intelligence has more technical entity types.

Cyber intelligence cares heavily about:

- accounts,
- devices,
- IP addresses,
- domains,
- URLs,
- files,
- hashes,
- processes,
- commands,
- registry keys,
- ports,
- protocols,
- vulnerabilities,
- alerts,
- authentication events,
- network connections,
- cloud resources,
- permissions,
- detections.

---

# 5. Data Sources

Cyber intelligence can use internal and external data.

## Internal Sources

| Source | Examples | Why it matters |
|---|---|---|
| Endpoint logs | EDR alerts, process starts, file writes | Shows activity on devices. |
| Authentication logs | SSO, Active Directory, Entra ID, Okta | Shows login patterns and account abuse. |
| Network logs | DNS, proxy, firewall, VPN, NetFlow | Shows communication and traffic behavior. |
| Email logs | sender, subject, links, attachments | Helps identify phishing and delivery paths. |
| Cloud logs | AWS, Azure, GCP audit logs | Shows cloud control-plane actions. |
| Vulnerability scans | CVEs, affected hosts, severity | Helps prioritize patching and exposure. |
| Asset inventory | hostname, owner, OS, criticality | Gives context to technical alerts. |
| Ticketing data | incidents, changes, outages | Helps separate expected from unexpected behavior. |
| CMDB | services, dependencies, owners | Connects assets to business impact. |
| Detection rules | Sigma, YARA, SIEM rules | Explains why activity triggered alerts. |

## External Sources

| Source | Examples | Why it matters |
|---|---|---|
| CISA advisories | exploited vulnerabilities, mitigations | High-value defensive guidance. |
| Vendor advisories | patches, affected products | Confirms vulnerability scope. |
| MITRE ATT&CK | tactics and techniques | Maps behavior to adversary methods. |
| CVE/NVD | vulnerability metadata | Standard vulnerability identifiers. |
| EPSS | exploitation probability estimate | Helps prioritize likely exploitation. |
| Malware reports | IOCs, TTPs, infrastructure | Connects internal signals to known campaigns. |
| OSINT | domains, certificates, WHOIS, DNS | Helps investigate suspicious infrastructure. |
| Sharing formats | STIX/TAXII | Standardizes exchange of threat intelligence. |

---

# 6. Data Extraction Process

Raw data is often messy. OSIRIS should extract consistent fields from many source types.

## Step 1: Ingest

Each item enters OSIRIS as a `SourceRecord`.

Examples:

- SIEM alert,
- firewall log,
- vulnerability scanner result,
- phishing email metadata,
- CISA advisory,
- EDR event,
- manual analyst note,
- RSS article,
- GitHub security advisory,
- vendor bulletin.

## Step 2: Normalize

Normalize the fields so unrelated tools can still talk to each other.

Examples:

```text
src_ip, sourceIp, source_ip, client_ip → source_ip
userPrincipalName, username, account, user → user_id
host, hostname, deviceName, endpoint → asset_id
```

Normalize:

- timestamps,
- severity,
- usernames,
- hostnames,
- domains,
- URLs,
- IP addresses,
- hashes,
- file paths,
- process names,
- CVE IDs,
- ATT&CK technique IDs.

## Step 3: Extract Entities

Extract entities from each source item.

Example input:

```text
Multiple failed logins for j.smith@example.com from 185.199.108.153 followed by a successful login from an unusual ASN.
```

Extracted entities:

```json
{
  "users": ["j.smith@example.com"],
  "ip_addresses": ["185.199.108.153"],
  "event_types": ["failed_login", "successful_login"],
  "signals": ["unusual_asn", "multiple_failed_logins"]
}
```

## Step 4: Preserve Source Evidence

Every extracted entity and relationship should keep a reference back to the original source.

This matters because the system should always be able to answer:

> “Why did you think this?”

Bad cyber dashboards say:

> Suspicious activity detected.

Good cyber intelligence says:

> This was flagged because the same user had 17 failed logins, one successful login from a new ASN, and a mail rule created within 12 minutes. Here are the source records.

---

# 7. Entity Extraction

Cyber intelligence depends on accurate extraction of cyber entities.

## Common Cyber Entities

| Entity Type | Examples |
|---|---|
| User | email address, username, account ID |
| Identity | SSO account, service account, privileged role |
| Asset | laptop, server, VM, container, cloud resource |
| IP Address | source IP, destination IP, internal IP |
| Domain | example.com, login-example.com |
| URL | full link from email/proxy logs |
| File | filename, path, hash |
| Process | powershell.exe, curl, node, ssh |
| Command | command-line string |
| Vulnerability | CVE ID, product, affected version |
| Alert | EDR alert, SIEM alert, IDS alert |
| Technique | MITRE ATT&CK ID, tactic, behavior |
| Detection Rule | Sigma/YARA/SIEM rule |
| Business Service | app, department, owner, criticality |
| Cloud Resource | bucket, VM, function, IAM role |

## Extraction Methods

OSIRIS can use cheap local-first extraction before using AI.

| Method | Use |
|---|---|
| Regex | IPs, CVEs, hashes, domains, emails, URLs |
| Keyword matching | process names, event types, tactics |
| Fuzzy matching | hostnames, usernames, vendor names |
| Dictionary matching | known assets, users, departments |
| Rule mapping | alert name → technique → tactic |
| Lightweight NLP | extract entities from reports and notes |
| AI assist | summarize, classify, explain, generate hypotheses |

## Example Regex Targets

```text
CVE: CVE-\d{4}-\d{4,7}
IPv4: \b(?:\d{1,3}\.){3}\d{1,3}\b
SHA256: \b[A-Fa-f0-9]{64}\b
Email: [A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}
MITRE ATT&CK: T\d{4}(?:\.\d{3})?
```

---

# 8. Cyber Entity Resolution

Entity resolution is the process of deciding whether different records refer to the same real-world thing.

Cyber examples:

```text
j.smith
jsmith
j.smith@example.com
EXAMPLE\jsmith
Okta user 00u123
```

These may all refer to the same identity.

Another example:

```text
LAPTOP-123
laptop-123.example.local
10.0.4.25
EDR device id abc-123
Intune device id def-456
```

These may all refer to the same endpoint.

## Why this matters

Without entity resolution, the system sees separate events.

With entity resolution, the system sees a chain:

```text
User j.smith
  → receives suspicious email
  → clicks URL
  → failed login attempts occur
  → successful login from unusual IP
  → mailbox rule created
```

That chain is much more meaningful than each isolated item.

## Resolution Confidence

Entity resolution should not be all-or-nothing.

Example:

```json
{
  "entity_a": "j.smith@example.com",
  "entity_b": "EXAMPLE\\jsmith",
  "relationship": "same_as",
  "confidence": 0.86,
  "reason": "matching username pattern and same employee record"
}
```

Confidence should be lower when matching is weak.

---

# 9. Cyber Graph Modeling

A cyber graph connects entities and evidence.

## Basic Cyber Graph

```text
User
  → uses Asset
  → authenticates from IP
  → accesses Application
  → triggers Alert
  → matches Detection Rule
  → maps to ATT&CK Technique
  → relates to Possible Incident
```

## Example

```text
j.smith@example.com
  → logged in from 185.199.108.153
  → created inbox rule
  → accessed payroll app
  → triggered impossible travel alert
  → maps to Valid Accounts / Email Collection
  → possible account compromise
```

## Why graphs are useful

Graphs make it easier to answer:

- What else touched this IP?
- Which users accessed this domain?
- Which assets have this vulnerable service?
- Which alerts happened before this event?
- Which source confirms this relationship?
- Which business system is affected?

---

# 10. Signal Clustering

Cyber intelligence looks for related signals.

A signal is an observed fact that may matter.

Examples:

- failed login spike,
- new admin role assignment,
- suspicious PowerShell command,
- DNS query to rare domain,
- vulnerability detected on public-facing server,
- new mailbox forwarding rule,
- endpoint alert,
- unusual cloud API call.

## Clustering Dimensions

| Dimension | Example |
|---|---|
| Same user | multiple alerts involving one account |
| Same asset | vulnerability + process + network beacon |
| Same IP/domain | multiple systems contacting same suspicious domain |
| Same time window | related activity within 10 minutes |
| Same tactic | multiple credential access signals |
| Same business service | alerts clustered around payroll app |
| Same vulnerability | multiple exposed hosts with same CVE |

## Example Cluster

```text
Signal 1: User receives vendor-themed email.
Signal 2: User clicks lookalike domain.
Signal 3: Failed login attempts begin.
Signal 4: Successful login from new ASN.
Signal 5: Mailbox forwarding rule created.

Possible Cyber Assessment:
Account compromise via phishing.
```

---

# 11. Detection Correlation

Security tools generate too many alerts.

Cyber intelligence should reduce alert noise by correlating alerts into stories.

## Bad Alert View

```text
Alert 1: Suspicious login
Alert 2: Mail rule created
Alert 3: Impossible travel
Alert 4: OAuth consent granted
Alert 5: Suspicious inbox access
```

## Better Intelligence View

```text
Possible Incident: Business Email Compromise

Supporting evidence:
- suspicious login from new ASN,
- impossible travel alert,
- mailbox forwarding rule created,
- OAuth consent granted to unknown app,
- inbox accessed shortly after login.
```

## Correlation Rules

A simple local-first correlation engine can use rules like:

```text
IF same user
AND suspicious login
AND mailbox rule created within 30 minutes
THEN possible account compromise
```

```text
IF public-facing asset
AND high-risk CVE
AND exploit activity observed externally
THEN urgent exposure risk
```

```text
IF endpoint alert
AND suspicious command
AND outbound connection to rare domain
THEN possible malware execution
```

---

# 12. Attack Path Analysis

Attack path analysis asks:

> If an attacker starts here, what could they reach?

This is not about attacking.

It is about understanding defensive exposure.

## Example

```text
Internet-facing VPN server
  → vulnerable software version
  → domain admin logs in occasionally
  → server can reach internal file share
  → file share contains scripts with credentials
```

This path creates risk because multiple weak things connect.

Each individual thing might not be catastrophic.

Together, they form an attack path.

## OSIRIS Attack Path Object

```ts
export interface CyberAttackPath {
  id: string;
  title: string;
  startEntityId: string;
  endEntityId?: string;
  steps: CyberAttackPathStep[];
  riskScore: number;
  confidenceScore: number;
  sourceIds: string[];
  recommendedActions: string[];
}

export interface CyberAttackPathStep {
  order: number;
  fromEntityId: string;
  toEntityId: string;
  relationshipType: string;
  evidenceSourceIds: string[];
  confidenceScore: number;
}
```

---

# 13. Vulnerability Intelligence

Vulnerability intelligence is about understanding which vulnerabilities matter most.

A CVE with a scary score is not automatically your top priority.

Priority depends on:

- severity,
- exploitability,
- whether exploitation is observed in the wild,
- whether the vulnerable asset is internet-facing,
- whether the asset is business-critical,
- whether compensating controls exist,
- whether the vulnerable system has sensitive access,
- whether patching is available.

## CVSS vs EPSS vs Context

| Score | Meaning | Limitation |
|---|---|---|
| CVSS | Technical severity | Does not always reflect real-world exploitation likelihood. |
| EPSS | Probability of exploitation | Does not know your internal business context. |
| Asset Criticality | Business importance | Does not measure exploitability by itself. |
| Exposure | Reachability | Does not prove compromise. |

## OSIRIS Prioritization Logic

```text
Risk priority increases when:
- CVSS is high,
- EPSS is high,
- asset is internet-facing,
- asset is critical,
- exploit is known active,
- no mitigation exists,
- related alerts are observed.
```

## Example

```text
CVE on internal test server:
  CVSS: 9.8
  EPSS: high
  Internet-facing: no
  Criticality: low
  Observed exploitation: no
  Priority: medium

Same CVE on public VPN:
  CVSS: 9.8
  EPSS: high
  Internet-facing: yes
  Criticality: high
  Observed exploitation: yes
  Priority: critical
```

The vulnerability is the same.

The risk is not.

---

# 14. Exposure Intelligence

Exposure intelligence focuses on what can be reached, discovered, or abused from outside or across trust boundaries.

## Exposure Entities

- public IP,
- open port,
- exposed service,
- cloud storage bucket,
- DNS record,
- certificate,
- login portal,
- VPN gateway,
- remote access tool,
- web application,
- API endpoint.

## Exposure Questions

- What assets are internet-facing?
- What services are exposed?
- Are exposed systems patched?
- Are admin panels exposed?
- Are old domains still pointing to live infrastructure?
- Are certificates or DNS records revealing hidden systems?
- Are exposed systems tied to critical business services?

## OSIRIS Exposure Assessment

```text
Public Asset
  + Open Service
  + Vulnerable Version
  + Known Exploitation
  + Business Criticality
  = Exposure Risk Assessment
```

---

# 15. Incident Intelligence

Incident intelligence is the structured understanding of a possible or confirmed cyber incident.

## Incident Intelligence Should Include

- what happened,
- when it started,
- what is affected,
- what evidence supports it,
- what is confirmed,
- what is assumed,
- what is unknown,
- likely attack stage,
- mapped tactics/techniques,
- confidence score,
- business impact,
- containment recommendations,
- next investigative steps.

## Example Incident Chain

```text
08:03 - Phishing email delivered
08:05 - User clicked link
08:06 - Login attempt from new IP
08:07 - MFA challenge approved
08:09 - Mailbox rule created
08:12 - Inbox searched for invoices
08:18 - External forwarding observed
```

## Possible Assessment

```text
Possible business email compromise.

Confidence: High
Risk: High
Reasoning:
- phishing delivery and click occurred before suspicious login,
- login came from unusual IP/ASN,
- mailbox rule and inbox search followed quickly,
- behavior matches common BEC pattern.
```

---

# 16. Risk Scoring vs Confidence Scoring

These are different and must not be mixed.

## Confidence Score

Confidence answers:

> How sure are we that this assessment is correct?

Confidence depends on:

- source reliability,
- number of supporting signals,
- signal quality,
- directness of evidence,
- consistency between sources,
- alternative explanations,
- entity-resolution certainty.

## Risk Score

Risk answers:

> How bad could this be if the assessment is true?

Risk depends on:

- asset criticality,
- privilege level,
- exposure,
- data sensitivity,
- exploitability,
- blast radius,
- business impact,
- active exploitation.

## Example

```text
Assessment: Possible compromise of a critical payroll admin account.
Confidence: Medium
Risk: Critical
```

That means:

> We are not fully sure yet, but if true, it matters a lot.

Another example:

```text
Assessment: Confirmed malware on isolated test VM.
Confidence: High
Risk: Low
```

That means:

> We are sure it happened, but the blast radius appears limited.

---

# 17. Analytic Tradecraft for Cyber Intelligence

OSIRIS should force good analytic habits.

## Every Assessment Should Separate

| Category | Meaning |
|---|---|
| Facts | Directly supported by evidence. |
| Assumptions | Believed but not directly proven. |
| Inferences | Reasoned conclusions from facts. |
| Alternatives | Other explanations that may fit. |
| Unknowns | Missing information. |
| Confidence | How strongly the evidence supports the assessment. |
| Risk | Potential impact if true. |

## Avoid These Mistakes

- treating correlation as proof,
- assuming every anomaly is malicious,
- trusting one weak source,
- ignoring business context,
- ignoring false positives,
- merging entities too aggressively,
- overusing scary language,
- hiding uncertainty,
- failing to cite evidence.

Cyber intelligence should be useful, not dramatic.

No “red skull alert of doom” unless doom actually brought receipts.

---

# 18. OSIRIS Cyber Intelligence Data Model

Below are suggested TypeScript interfaces for OSIRIS.

```ts
export type CyberEntityType =
  | "user"
  | "identity"
  | "asset"
  | "ip_address"
  | "domain"
  | "url"
  | "file"
  | "hash"
  | "process"
  | "command"
  | "vulnerability"
  | "alert"
  | "detection_rule"
  | "attack_technique"
  | "business_service"
  | "cloud_resource"
  | "incident"
  | "source";

export interface CyberSourceRecord {
  id: string;
  sourceType:
    | "siem_alert"
    | "edr_event"
    | "auth_log"
    | "network_log"
    | "dns_log"
    | "email_log"
    | "vulnerability_scan"
    | "asset_inventory"
    | "cloud_audit_log"
    | "external_advisory"
    | "manual_note"
    | "rss_article"
    | "vendor_bulletin";
  title: string;
  rawText?: string;
  rawJson?: unknown;
  url?: string;
  collectedAt: string;
  occurredAt?: string;
  sourceReliabilityScore: number;
  tags: string[];
}

export interface CyberEntity {
  id: string;
  type: CyberEntityType;
  name: string;
  aliases: string[];
  properties: Record<string, unknown>;
  firstSeen?: string;
  lastSeen?: string;
  confidenceScore: number;
  sourceIds: string[];
}

export interface CyberRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType:
    | "same_as"
    | "uses"
    | "owns"
    | "logged_in_from"
    | "connected_to"
    | "resolved_to"
    | "downloaded"
    | "executed"
    | "triggered"
    | "affected_by"
    | "exposes"
    | "maps_to"
    | "part_of"
    | "communicated_with"
    | "created"
    | "modified"
    | "accessed";
  occurredAt?: string;
  confidenceScore: number;
  sourceIds: string[];
}

export interface CyberSignal {
  id: string;
  title: string;
  description: string;
  signalType:
    | "authentication_anomaly"
    | "endpoint_suspicion"
    | "network_anomaly"
    | "email_suspicion"
    | "vulnerability_exposure"
    | "cloud_misconfiguration"
    | "privilege_change"
    | "data_access_anomaly"
    | "malware_indicator"
    | "policy_violation"
    | "asset_exposure";
  severity: "info" | "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  entityIds: string[];
  sourceIds: string[];
  occurredAt?: string;
  tags: string[];
}

export interface CyberAssessment {
  id: string;
  title: string;
  assessmentType:
    | "possible_incident"
    | "confirmed_incident"
    | "exposure_risk"
    | "vulnerability_priority"
    | "account_compromise"
    | "malware_activity"
    | "lateral_movement"
    | "data_exfiltration_risk"
    | "cloud_risk"
    | "detection_gap";
  summary: string;
  confidenceScore: number;
  riskScore: number;
  severity: "info" | "low" | "medium" | "high" | "critical";
  supportingSignalIds: string[];
  involvedEntityIds: string[];
  sourceIds: string[];
  facts: string[];
  assumptions: string[];
  alternativeExplanations: string[];
  unknowns: string[];
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

# 19. Cyber Intelligence Report Object

A report should be structured and explainable.

```ts
export interface CyberIntelligenceReport {
  id: string;
  title: string;
  generatedAt: string;
  scope: string;
  executiveSummary: string;
  assessments: CyberAssessment[];
  timeline: CyberTimelineEntry[];
  entities: CyberEntity[];
  relationships: CyberRelationship[];
  sourceRecords: CyberSourceRecord[];
  confidenceMethod: string;
  riskMethod: string;
  limitations: string[];
}

export interface CyberTimelineEntry {
  id: string;
  occurredAt: string;
  title: string;
  description: string;
  entityIds: string[];
  sourceIds: string[];
  confidenceScore: number;
}
```

---

# 20. AI Chatbot Prompt Pretext

Use this giant message before giving ChatGPT your cyber data payload.

The goal is to force the model to behave like a careful defensive cyber analyst instead of a spooky speculation machine.

```text
You are acting as a defensive cyber intelligence analyst for a local-first intelligence synthesis system called OSIRIS.

Your task is to analyze the structured cyber data I provide after this prompt and generate possible cyber intelligence assessments.

You must follow these rules:

1. Defensive purpose only.
   - Do not provide offensive exploitation steps.
   - Do not provide instructions for hacking, persistence, evasion, credential theft, malware deployment, or unauthorized access.
   - Focus on detection, triage, defensive interpretation, containment, mitigation, and investigation.

2. Evidence first.
   - Every assessment must cite the source record IDs and signal IDs that support it.
   - Do not invent facts that are not in the data.
   - If something is uncertain, label it as uncertain.
   - Separate facts, assumptions, inferences, and unknowns.

3. Generate possible cyber assessments.
   - Look for connected activity across users, assets, IPs, domains, vulnerabilities, alerts, logs, and time windows.
   - Identify possible incidents, account compromises, malware activity, exposure risks, vulnerability priorities, cloud risks, data access anomalies, or detection gaps.
   - Multiple small signals may become meaningful when they involve the same entity, same time window, same asset, same IP/domain, same vulnerability, or same behavior chain.

4. Use confidence scoring.
   - Confidence is how strongly the evidence supports the assessment.
   - Use a 0-100 score.
   - Low confidence: 0-39.
   - Medium confidence: 40-69.
   - High confidence: 70-89.
   - Very high confidence: 90-100.
   - Explain why confidence is not higher if there are missing sources, weak entity matches, incomplete timelines, or plausible alternatives.

5. Use risk scoring separately.
   - Risk is the potential impact if the assessment is true.
   - Use a 0-100 score.
   - Consider asset criticality, user privilege, internet exposure, vulnerability exploitability, sensitive data access, business impact, and blast radius.
   - A finding can be low confidence but high risk.
   - A finding can be high confidence but low risk.

6. Look for cyber intelligence patterns.
   Consider these patterns:
   - suspicious login followed by mailbox rule creation,
   - failed login spike followed by successful login from unusual location,
   - endpoint alert followed by outbound connection to rare domain,
   - public-facing asset with high-risk CVE and known exploitation,
   - privileged role change followed by unusual access,
   - suspicious email followed by click and authentication anomaly,
   - DNS queries to newly observed domain from multiple hosts,
   - vulnerable asset connected to critical business service,
   - multiple alerts mapped to the same ATT&CK tactic or technique,
   - cloud API activity inconsistent with normal behavior,
   - data access spike after account anomaly.

7. Map to defensive frameworks when possible.
   - If the data includes MITRE ATT&CK techniques or behaviors, mention relevant tactics/techniques.
   - If the data includes vulnerabilities, discuss CVE, severity, exposure, exploitability, and patch/mitigation priority.
   - If the data includes incident stages, describe likely phase such as initial access, execution, persistence, privilege escalation, defense evasion, credential access, discovery, lateral movement, collection, command and control, exfiltration, or impact.

8. Provide alternative explanations.
   - For every assessment, list plausible non-malicious or lower-severity explanations.
   - Examples: user travel, VPN exit node, maintenance window, software update, admin change, scanner activity, expected automation, false positive, known business process.

9. Provide recommended defensive actions.
   - Actions should be safe and defensive.
   - Examples: review logs, verify user activity, reset password, revoke sessions, check MFA events, isolate endpoint, block domain, patch system, validate change ticket, contact asset owner, tune detection, increase monitoring.
   - Do not recommend destructive actions unless clearly framed as containment and authorized.

10. Output format.
   Return your answer in markdown with these sections:

   # Cyber Intelligence Assessment

   ## Executive Summary
   - Short plain-English summary of the most important findings.

   ## Priority Findings
   For each finding include:
   - Title
   - Assessment Type
   - Confidence Score
   - Risk Score
   - Severity
   - Involved Entities
   - Supporting Evidence
   - Reasoning Chain
   - Facts
   - Assumptions
   - Alternative Explanations
   - Unknowns
   - Recommended Defensive Actions
   - What Would Increase Confidence
   - What Would Decrease Confidence

   ## Timeline
   - Chronological event sequence using timestamps from the data.

   ## Entity Relationship Summary
   - Explain important relationships between users, assets, IPs, domains, alerts, vulnerabilities, and business services.

   ## Vulnerability and Exposure Notes
   - Prioritize vulnerable assets based on severity, exploitability, exposure, and business criticality.

   ## Detection and Logging Gaps
   - Identify missing fields, missing logs, weak evidence, or detection blind spots.

   ## Final Notes
   - Summarize limitations and confidence caveats.

11. Be careful with language.
   - Use “possible,” “likely,” “confirmed,” or “not enough evidence” accurately.
   - Do not accuse a person of malicious behavior based only on weak technical signals.
   - Do not overstate conclusions.
   - Prefer clear defensive analysis over dramatic wording.

Now analyze the cyber data payload that follows.
```

---

# 21. How to Structure Data for ChatGPT

ChatGPT works best when the data is structured.

Do not paste random logs with no explanation if you can avoid it.

Use this format:

```json
{
  "analysis_scope": {
    "organization_context": "Small business / lab / personal OSIRIS project / enterprise SOC",
    "time_window": "2026-06-01T00:00:00Z to 2026-06-02T00:00:00Z",
    "goal": "Identify possible cyber incidents, exposure risks, and priority investigation items"
  },
  "assets": [],
  "users": [],
  "source_records": [],
  "signals": [],
  "relationships": [],
  "vulnerabilities": [],
  "detections": [],
  "known_context": [],
  "questions_for_analysis": []
}
```

## Recommended Fields

### Assets

```json
{
  "id": "asset-001",
  "hostname": "vpn-01",
  "type": "server",
  "internet_facing": true,
  "criticality": "high",
  "owner": "IT",
  "business_service": "Remote Access",
  "os": "Linux",
  "tags": ["vpn", "public"]
}
```

### Users

```json
{
  "id": "user-001",
  "username": "j.smith@example.com",
  "role": "Finance Manager",
  "privilege_level": "standard",
  "mfa_enabled": true,
  "department": "Finance"
}
```

### Source Records

```json
{
  "id": "src-001",
  "source_type": "auth_log",
  "title": "Unusual login from new ASN",
  "occurred_at": "2026-06-01T08:07:00Z",
  "source_reliability_score": 0.9,
  "summary": "Successful login for j.smith@example.com from a new ASN after multiple failed attempts."
}
```

### Signals

```json
{
  "id": "sig-001",
  "signal_type": "authentication_anomaly",
  "title": "Failed login spike followed by success",
  "entity_ids": ["user-001", "ip-001"],
  "source_ids": ["src-001", "src-002"],
  "severity": "high",
  "confidence_score": 0.78,
  "occurred_at": "2026-06-01T08:07:00Z"
}
```

### Vulnerabilities

```json
{
  "id": "vuln-001",
  "cve": "CVE-202X-12345",
  "asset_id": "asset-001",
  "cvss": 9.8,
  "epss": 0.91,
  "known_exploited": true,
  "patch_available": true,
  "internet_facing": true
}
```

---

# 22. Example Data Payload

```json
{
  "analysis_scope": {
    "organization_context": "Small business lab environment using OSIRIS for defensive cyber analysis",
    "time_window": "2026-06-01T08:00:00Z to 2026-06-01T10:00:00Z",
    "goal": "Identify possible cyber incidents, exposure risks, and priority investigation items"
  },
  "assets": [
    {
      "id": "asset-001",
      "hostname": "mail-01",
      "type": "cloud_mailbox",
      "internet_facing": true,
      "criticality": "high",
      "owner": "IT",
      "business_service": "Email"
    },
    {
      "id": "asset-002",
      "hostname": "vpn-01",
      "type": "server",
      "internet_facing": true,
      "criticality": "high",
      "owner": "IT",
      "business_service": "Remote Access"
    }
  ],
  "users": [
    {
      "id": "user-001",
      "username": "j.smith@example.com",
      "role": "Finance Manager",
      "privilege_level": "standard",
      "mfa_enabled": true,
      "department": "Finance"
    }
  ],
  "source_records": [
    {
      "id": "src-001",
      "source_type": "email_log",
      "title": "Vendor themed email delivered",
      "occurred_at": "2026-06-01T08:03:00Z",
      "source_reliability_score": 0.85,
      "summary": "User received email claiming to be from a known invoice vendor. Message contained link to login-example-payments.com."
    },
    {
      "id": "src-002",
      "source_type": "proxy_log",
      "title": "User clicked vendor-like domain",
      "occurred_at": "2026-06-01T08:05:00Z",
      "source_reliability_score": 0.9,
      "summary": "User browser requested https://login-example-payments.com/session. Domain was first observed today."
    },
    {
      "id": "src-003",
      "source_type": "auth_log",
      "title": "Failed login spike followed by success",
      "occurred_at": "2026-06-01T08:07:00Z",
      "source_reliability_score": 0.92,
      "summary": "17 failed login attempts for j.smith@example.com followed by successful login from IP 185.199.108.153, an ASN not previously seen for this user."
    },
    {
      "id": "src-004",
      "source_type": "mail_audit_log",
      "title": "Mailbox forwarding rule created",
      "occurred_at": "2026-06-01T08:09:00Z",
      "source_reliability_score": 0.95,
      "summary": "Mailbox rule created to forward invoice-related messages to external address."
    },
    {
      "id": "src-005",
      "source_type": "vulnerability_scan",
      "title": "VPN server has critical vulnerability",
      "occurred_at": "2026-06-01T09:00:00Z",
      "source_reliability_score": 0.88,
      "summary": "vpn-01 is internet-facing and affected by CVE-202X-12345. CVSS 9.8. EPSS 0.91. Known exploitation reported. Patch available."
    }
  ],
  "signals": [
    {
      "id": "sig-001",
      "signal_type": "email_suspicion",
      "title": "Vendor-themed suspicious email",
      "entity_ids": ["user-001", "domain-001"],
      "source_ids": ["src-001"],
      "severity": "medium",
      "confidence_score": 0.64,
      "occurred_at": "2026-06-01T08:03:00Z"
    },
    {
      "id": "sig-002",
      "signal_type": "network_anomaly",
      "title": "Click to newly observed domain",
      "entity_ids": ["user-001", "domain-001"],
      "source_ids": ["src-002"],
      "severity": "medium",
      "confidence_score": 0.72,
      "occurred_at": "2026-06-01T08:05:00Z"
    },
    {
      "id": "sig-003",
      "signal_type": "authentication_anomaly",
      "title": "Failed login spike followed by success",
      "entity_ids": ["user-001", "ip-001"],
      "source_ids": ["src-003"],
      "severity": "high",
      "confidence_score": 0.82,
      "occurred_at": "2026-06-01T08:07:00Z"
    },
    {
      "id": "sig-004",
      "signal_type": "data_access_anomaly",
      "title": "External mailbox forwarding rule",
      "entity_ids": ["user-001", "asset-001"],
      "source_ids": ["src-004"],
      "severity": "high",
      "confidence_score": 0.88,
      "occurred_at": "2026-06-01T08:09:00Z"
    },
    {
      "id": "sig-005",
      "signal_type": "vulnerability_exposure",
      "title": "Internet-facing VPN affected by exploited critical CVE",
      "entity_ids": ["asset-002", "vuln-001"],
      "source_ids": ["src-005"],
      "severity": "critical",
      "confidence_score": 0.86,
      "occurred_at": "2026-06-01T09:00:00Z"
    }
  ],
  "relationships": [
    {
      "from": "user-001",
      "to": "domain-001",
      "type": "accessed",
      "source_ids": ["src-002"],
      "confidence_score": 0.9
    },
    {
      "from": "user-001",
      "to": "ip-001",
      "type": "logged_in_from",
      "source_ids": ["src-003"],
      "confidence_score": 0.92
    },
    {
      "from": "asset-002",
      "to": "vuln-001",
      "type": "affected_by",
      "source_ids": ["src-005"],
      "confidence_score": 0.88
    }
  ],
  "entities": [
    {
      "id": "domain-001",
      "type": "domain",
      "name": "login-example-payments.com",
      "properties": {
        "first_seen": "2026-06-01T08:05:00Z",
        "reputation": "unknown"
      }
    },
    {
      "id": "ip-001",
      "type": "ip_address",
      "name": "185.199.108.153",
      "properties": {
        "asn_seen_before_for_user": false
      }
    },
    {
      "id": "vuln-001",
      "type": "vulnerability",
      "name": "CVE-202X-12345",
      "properties": {
        "cvss": 9.8,
        "epss": 0.91,
        "known_exploited": true,
        "patch_available": true
      }
    }
  ],
  "known_context": [
    "No approved travel for j.smith@example.com during this window.",
    "Finance team handles invoice approvals.",
    "No change ticket was found for the mailbox forwarding rule.",
    "vpn-01 supports remote access for staff."
  ],
  "questions_for_analysis": [
    "Are there possible incidents in this data?",
    "Which findings should be prioritized?",
    "What evidence supports each assessment?",
    "What are the likely false-positive explanations?",
    "What defensive actions should be taken first?"
  ]
}
```

---

# 23. Example AI Output

```markdown
# Cyber Intelligence Assessment

## Executive Summary

Two priority findings were identified:

1. Possible business email compromise affecting j.smith@example.com.
2. Critical exposure risk on internet-facing VPN server vpn-01.

The account compromise assessment has high confidence because the suspicious email, link click, authentication anomaly, and mailbox forwarding rule occurred in a tight sequence involving the same user.

The VPN exposure finding has high risk because the asset is internet-facing, critical, affected by a high-severity vulnerability, and the vulnerability is reportedly exploited.

## Priority Finding 1

### Title
Possible Business Email Compromise for j.smith@example.com

### Assessment Type
possible_incident / account_compromise

### Confidence Score
84 / 100

### Risk Score
88 / 100

### Severity
High

### Supporting Evidence
- src-001: vendor-themed suspicious email
- src-002: click to newly observed domain
- src-003: failed login spike followed by success from new ASN
- src-004: mailbox forwarding rule created
- sig-001 through sig-004

### Reasoning Chain
A suspicious vendor-themed email was delivered to a finance user. The user clicked a newly observed domain. Shortly afterward, the same user experienced repeated failed logins followed by a successful login from a new ASN. Within minutes, a mailbox forwarding rule was created for invoice-related messages. This sequence is consistent with possible phishing-driven mailbox compromise.

### Facts
- The user received a vendor-themed email.
- The user accessed the linked domain.
- The account had 17 failed logins followed by one successful login from a new ASN.
- A mailbox forwarding rule was created.
- No change ticket was found for the forwarding rule.

### Assumptions
- The domain may be suspicious because it was newly observed and vendor-like.
- The successful login may be related to the earlier click.
- The mailbox rule may not have been created by the legitimate user.

### Alternative Explanations
- The user intentionally created the mailbox rule.
- The login came from a legitimate VPN or travel location.
- The email was legitimate but poorly recognized by available reputation tools.

### Unknowns
- Whether MFA was approved by the user.
- Whether the external forwarding address is known or trusted.
- Whether the domain has confirmed malicious reputation.
- Whether inbox messages were accessed or exported.

### Recommended Defensive Actions
- Contact the user to verify activity.
- Revoke active sessions.
- Reset password.
- Review MFA events.
- Remove or disable suspicious mailbox rule.
- Search for similar mailbox rules across users.
- Block or monitor the suspicious domain.
- Review inbox access and forwarding activity.

### What Would Increase Confidence
- Confirmed malicious reputation for the domain.
- MFA approval from unusual location.
- Evidence of inbox search or exfiltration.
- Same domain targeting other users.

### What Would Decrease Confidence
- User confirms legitimate travel and rule creation.
- Domain is verified as a legitimate vendor domain.
- Login IP is a known corporate VPN endpoint.

## Priority Finding 2

### Title
Critical Exposure Risk on Internet-Facing VPN Server

### Assessment Type
exposure_risk / vulnerability_priority

### Confidence Score
86 / 100

### Risk Score
95 / 100

### Severity
Critical

### Supporting Evidence
- src-005: vulnerability scan showing vpn-01 affected by CVE-202X-12345
- sig-005: internet-facing VPN affected by exploited critical CVE

### Reasoning Chain
The VPN server is internet-facing, business-critical, and affected by a critical vulnerability with high exploitation probability and known exploitation. Because VPN servers often provide access into internal environments, this exposure should be prioritized even without confirmed compromise.

### Recommended Defensive Actions
- Patch immediately or apply vendor mitigation.
- Restrict access by IP allowlist if possible.
- Review VPN authentication logs.
- Check for suspicious successful logins.
- Search for related indicators on internal systems.
- Validate whether exploit attempts have occurred.
```

---

# 24. Local-First Implementation Strategy

OSIRIS can do a lot before calling AI.

## Phase 1: Local Normalization

- parse JSON/CSV/log text,
- normalize fields,
- extract IPs, domains, CVEs, emails, hashes,
- deduplicate source records,
- store source attribution.

## Phase 2: Cyber Entity Store

- create entity tables,
- store aliases,
- link entities to source records,
- assign confidence to entity matches.

## Phase 3: Relationship Graph

- user logged in from IP,
- asset affected by CVE,
- process executed command,
- domain resolved to IP,
- alert maps to technique,
- vulnerability affects asset.

## Phase 4: Rule-Based Correlation

Start with simple rules:

```text
same user + suspicious email + click + unusual login + mailbox rule = possible BEC
```

```text
internet-facing + critical CVE + known exploited + patch available = urgent exposure
```

```text
endpoint alert + suspicious process + outbound rare domain = possible malware activity
```

## Phase 5: Dossier Pages

Create pages for:

- user,
- asset,
- domain,
- IP,
- vulnerability,
- possible incident,
- business service.

Each page should show:

- timeline,
- relationships,
- source records,
- related signals,
- confidence/risk notes,
- recommended actions.

## Phase 6: AI-Assisted Assessment

Only send AI:

- relevant cluster,
- source summaries,
- structured entities,
- relationships,
- known context,
- questions.

Do not send everything.

This keeps costs down and improves quality.

---

# 25. Safety and Ethics Guardrails

Cyber intelligence must stay defensive.

## Allowed Focus

- detection,
- triage,
- investigation,
- patch prioritization,
- exposure reduction,
- incident understanding,
- risk scoring,
- log review,
- containment recommendations,
- defensive reporting.

## Avoid

- exploit instructions,
- stealth guidance,
- persistence methods,
- credential theft instructions,
- malware building,
- evasion advice,
- unauthorized access workflows,
- doxxing individuals,
- accusations without evidence.

## Human Review Required

OSIRIS should not automatically accuse people or declare incidents without review.

Use language like:

- possible,
- likely,
- confirmed,
- not enough evidence,
- requires validation,
- confidence limited by missing data.

This prevents the system from becoming a false-positive cannon with a trench coat.

---

# 26. Recommended OSIRIS Features

## Core Views

| View | Purpose |
|---|---|
| Cyber Feed | Stream of cyber signals and possible assessments. |
| Incident Dossier | Deep-dive page for possible incidents. |
| Asset Dossier | Asset history, vulnerabilities, alerts, owners. |
| User Dossier | Login history, alerts, risky behavior, related entities. |
| Vulnerability Board | Prioritized CVEs by exposure and risk. |
| Exposure Map | Internet-facing assets and open services. |
| Detection Gaps | Missing logs, missing controls, weak alert coverage. |
| Timeline View | Chronological event chain. |
| Relationship Graph | Entity links between users, assets, IPs, domains, alerts. |

## Cheap Features That Feel Powerful

- regex-based IOC extraction,
- local fuzzy matching,
- confidence badges,
- source reliability score,
- timeline grouping,
- related entity cards,
- word clouds for alert/report summaries,
- MITRE ATT&CK tag chips,
- CVE prioritization cards,
- “why this surfaced” explanation box,
- alternative explanations section,
- recommended defensive action checklist.

## Suggested Assessment Types

```text
possible_account_compromise
possible_malware_activity
possible_lateral_movement
possible_data_exfiltration
possible_business_email_compromise
critical_vulnerability_exposure
cloud_misconfiguration_risk
privilege_escalation_risk
detection_gap
asset_inventory_gap
high_noise_alert_cluster
```

---

# 27. References

These public references are useful for grounding OSIRIS cyber intelligence design.

## NIST Cybersecurity Framework 2.0

NIST CSF 2.0 organizes cybersecurity outcomes around the functions Govern, Identify, Protect, Detect, Respond, and Recover.

- https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf

## CISA Incident Response

CISA provides resources to help organizations prevent, detect, and respond to cyber incidents.

- https://www.cisa.gov/topics/cyber-threats-and-response/incident-response

## CISA Cybersecurity Advisories

CISA advisories provide information on recent, ongoing, or high-impact cyber threats, with mitigations, workarounds, or detections.

- https://www.cisa.gov/news-events/cybersecurity-advisories

## MITRE ATT&CK

MITRE ATT&CK organizes adversary behavior by tactics and techniques. MITRE describes tactics as the adversary's tactical goal or reason for performing an action.

- https://attack.mitre.org/tactics/

## OASIS STIX and TAXII

STIX is used to exchange cyber threat intelligence. TAXII is a protocol for exchanging cyber threat intelligence over HTTPS.

- https://oasis-open.github.io/cti-documentation/
- https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=cti

## OASIS STIX 2.1 and TAXII 2.1 Standards

OASIS announced STIX Version 2.1 and TAXII Version 2.1 as OASIS Standards in June 2021.

- https://www.oasis-open.org/2021/06/23/stix-v2-1-and-taxii-v2-1-oasis-standards-are-published/

## MITRE ATT&CK Research Context

Academic research discusses automated extraction of ATT&CK tactics and techniques from cyber threat reports and the use of ATT&CK as a knowledge base for adversary behavior.

- https://arxiv.org/abs/2004.14322
- https://arxiv.org/abs/2308.14016
- https://arxiv.org/abs/2211.06495

---

# Final Project Framing

Cyber intelligence for OSIRIS should not be framed as “AI finds hackers.”

A better framing is:

> OSIRIS turns cyber telemetry, asset context, vulnerability data, alerts, and external advisories into explainable defensive intelligence objects: signals, entities, relationships, timelines, exposure risks, possible incidents, and confidence-rated assessments.

The best version is not a magic cyber oracle.

It is a source-attributed cyber reasoning system that helps a human analyst see what connects, what matters, what might be noise, and what should happen next.

