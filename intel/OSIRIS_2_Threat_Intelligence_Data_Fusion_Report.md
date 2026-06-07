# OSIRIS 2.0 Threat Intelligence Data Fusion Report

**Purpose:** Explain how OSIRIS can collect, structure, analyze, and explain threat intelligence from disconnected data sources.

**Project framing:** OSIRIS should not be framed as a magic prediction engine. It should be framed as a **local-first intelligence synthesis system** that converts raw signals into explainable, source-backed intelligence objects.

**Threat intelligence focus:** Cybersecurity threats, hostile infrastructure, vulnerabilities, suspicious campaigns, malicious indicators, adversary behavior, emerging risks, and defensive recommendations.

---

# Table of Contents

1. Executive Summary
2. What Threat Intelligence Is
3. Threat Intelligence vs Event Intelligence
4. Core Concepts
5. Threat Intelligence Lifecycle
6. Data Sources OSIRIS Can Ingest
7. Extraction Process
8. Entity Resolution Process
9. Threat Graph Model
10. Threat Cluster Analysis
11. Indicator Analysis
12. TTP Analysis with MITRE ATT&CK
13. Vulnerability Intelligence
14. Actor / Campaign Intelligence
15. Confidence Scoring
16. Risk Scoring
17. Analyst Output Types
18. OSIRIS Data Structures
19. AI Chatbot Prompt Pretext
20. Example Data Payload
21. Example ChatGPT Output
22. Local-First Implementation Strategy
23. Ethical and Safety Guardrails
24. Public Reference Sources

---

# 1. Executive Summary

Threat intelligence is the process of collecting, structuring, analyzing, and explaining information about potential or active threats. In OSIRIS, threat intelligence should be handled as a pipeline:

```text
raw sources
  ↓
normalized source records
  ↓
extracted indicators, entities, vulnerabilities, behaviors, and events
  ↓
resolved identities and relationships
  ↓
threat clusters and timelines
  ↓
confidence-scored assessments
  ↓
recommended defensive actions
```

The goal is not to claim certainty. The goal is to produce **explainable leads** such as:

- Possible phishing campaign
- Possible credential stuffing attempt
- Possible ransomware precursor activity
- Possible exploitation of a known CVE
- Possible suspicious infrastructure reuse
- Possible supply-chain compromise risk
- Possible botnet activity
- Possible insider-risk signal
- Possible exposed asset issue

Each output should clearly show:

- What data was used
- What entities were connected
- What pattern was detected
- Why the pattern matters
- What alternative explanations exist
- How confident the system is
- What action should be taken next

---

# 2. What Threat Intelligence Is

Threat intelligence is security-relevant information that has been collected, processed, analyzed, and contextualized so it can support a decision.

Raw data by itself is not intelligence.

```text
Raw data:
192.0.2.50 attempted login 37 times.

Information:
The IP attempted 37 failed logins against three admin accounts.

Intelligence:
This may indicate password spraying because the attempts targeted privileged accounts, occurred within a short window, and used a pattern seen in previous campaigns.
```

Threat intelligence should answer practical questions:

- What is happening?
- Who or what may be involved?
- What systems, users, or assets are affected?
- What evidence supports the assessment?
- How confident are we?
- What should be done next?

---

# 3. Threat Intelligence vs Event Intelligence

Event intelligence asks:

```text
What event may be happening based on disconnected signals?
```

Threat intelligence asks:

```text
What hostile, risky, suspicious, vulnerable, or malicious condition may exist based on disconnected signals?
```

They overlap, but they are not identical.

| Category | Event Intelligence | Threat Intelligence |
|---|---|---|
| Main question | What might be happening? | What might threaten an asset, person, system, or organization? |
| Main object | Event | Threat, actor, campaign, vulnerability, indicator, tactic |
| Output | Possible event report | Threat assessment / defensive lead |
| Typical use | News, operations, public safety, logistics | Cybersecurity, fraud, physical security, infrastructure risk |
| Confidence logic | Source agreement + time/place clustering | Source agreement + indicator quality + exploitability + behavior match |
| Action | Monitor, verify, brief, prepare | Block, patch, hunt, alert, investigate, mitigate |

---

# 4. Core Concepts

## 4.1 Indicator

An indicator is a technical or observable clue associated with suspicious or malicious activity.

Examples:

- IP address
- Domain
- URL
- File hash
- Email address
- User agent
- Registry key
- Process name
- Command line pattern
- Malware family name
- CVE ID
- ASN
- TLS certificate fingerprint
- Wallet address

Indicators are useful, but weak by themselves. A single IP address can be reused, spoofed, shared, proxied, or misclassified.

## 4.2 Observable

An observable is something that was actually seen.

```text
Observable:
User jsmith had 14 failed login attempts from 203.0.113.10 between 02:01 and 02:06.
```

An observable becomes more useful when connected to context.

## 4.3 TTP

TTP means:

```text
Tactics, Techniques, and Procedures
```

This describes adversary behavior.

Examples:

- Credential phishing
- Password spraying
- Command and scripting interpreter
- Lateral movement
- Defense evasion
- Data exfiltration

TTPs are usually more valuable than raw indicators because infrastructure changes quickly but behavior often repeats.

## 4.4 Threat Actor

A threat actor is an individual, group, criminal organization, state-sponsored unit, insider, botnet operator, hacktivist, or automated system that may cause harm.

OSIRIS should avoid over-attribution unless the evidence is strong. It is safer to say:

```text
The activity resembles patterns associated with known ransomware intrusion behavior.
```

than:

```text
This was definitely Group X.
```

## 4.5 Campaign

A campaign is a related set of activities that share infrastructure, tooling, targets, timing, themes, or behavior.

Example:

```text
A supplier-themed phishing campaign targeting procurement users across multiple organizations.
```

## 4.6 Vulnerability

A vulnerability is a weakness in software, hardware, configuration, process, or human workflow that can be exploited.

Examples:

- CVE-2025-XXXXX
- Publicly exposed admin panel
- Default password
- Missing MFA
- Unpatched VPN appliance
- Misconfigured cloud storage bucket

## 4.7 Asset

An asset is something that could be affected.

Examples:

- Website
- API endpoint
- Database
- Employee account
- Laptop
- Cloud tenant
- VPN gateway
- Email domain
- SaaS app
- DNS zone

## 4.8 Intelligence Product

A threat intelligence product is the final output.

Examples:

- Threat bulletin
- Vulnerability advisory
- Campaign assessment
- Indicator package
- Executive summary
- Incident timeline
- Detection engineering note
- Hunt package
- Risk brief

---

# 5. Threat Intelligence Lifecycle

The threat intelligence lifecycle can be modeled in OSIRIS as:

```text
1. Direction
2. Collection
3. Processing
4. Analysis
5. Dissemination
6. Feedback
```

## 5.1 Direction

Define what you care about.

Examples:

```text
- Protect company email users from phishing.
- Monitor newly exploited vulnerabilities in software we use.
- Identify suspicious login behavior.
- Track exposed assets.
- Watch for domains impersonating our brand.
```

OSIRIS should support intelligence requirements.

```ts
interface IntelligenceRequirement {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  assetScope: string[];
  threatScope: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 5.2 Collection

Collect from trusted, legal, authorized sources.

Examples:

- RSS feeds
- Vendor security advisories
- CISA alerts
- NVD CVE feeds
- MITRE ATT&CK mappings
- Internal logs
- Email security alerts
- Endpoint alerts
- Firewall logs
- DNS logs
- Web server logs
- Manual analyst notes
- Public malware reports
- GitHub security advisories

## 5.3 Processing

Convert messy data into normalized objects.

Processing includes:

- Deduplication
- Date normalization
- URL parsing
- Domain extraction
- CVE extraction
- IP extraction
- Entity tagging
- Source reliability tagging
- Language cleanup
- Attachment metadata extraction

## 5.4 Analysis

Connect facts into assessments.

Analysis includes:

- Indicator enrichment
- Entity resolution
- Timeline clustering
- TTP mapping
- Vulnerability prioritization
- Actor/campaign comparison
- Impact estimation
- Confidence scoring
- Alternative explanation generation

## 5.5 Dissemination

Send the right output to the right audience.

Examples:

| Audience | Output |
|---|---|
| Executive | Business risk summary |
| IT ops | Patch priority list |
| SOC analyst | Indicators, hunt query, timeline |
| Help desk | User warning signs and escalation path |
| Developer | Affected dependency or API risk |
| Manager | Operational impact and next action |

## 5.6 Feedback

After action, improve the model.

Examples:

- Was the alert useful?
- Was the confidence score accurate?
- Did the recommendation help?
- Was the source reliable?
- Was the cluster a false positive?
- Should a rule be adjusted?

---

# 6. Data Sources OSIRIS Can Ingest

## 6.1 External Open Sources

| Source type | Examples | Use |
|---|---|---|
| Security advisories | CISA, vendor advisories, GitHub advisories | Vulnerability and exploitation tracking |
| Threat reports | Vendor blogs, research reports | TTPs, campaigns, indicators |
| CVE databases | NVD, vendor CVE pages | Vulnerability metadata |
| Exploitability scores | EPSS | Estimate exploitation likelihood |
| ATT&CK references | MITRE ATT&CK | Behavior mapping |
| Abuse reports | AbuseIPDB-style feeds, spam blocklists | Indicator reputation |
| Certificate transparency | CT logs | Lookalike domains, infrastructure |
| DNS data | Passive DNS, DNS logs | Domain relationships |
| WHOIS/RDAP | Domain registration context | Infrastructure ownership clues |

## 6.2 Internal Authorized Sources

| Source type | Examples | Use |
|---|---|---|
| Authentication logs | Failed/successful logins, MFA prompts | Credential attacks |
| Email logs | Sender, subject, links, attachments | Phishing analysis |
| Endpoint alerts | EDR, antivirus, process execution | Malware and post-compromise behavior |
| Firewall logs | Denied/allowed connections | Network threat detection |
| DNS logs | Queried domains | Malware callback and phishing detection |
| Web server logs | HTTP requests, user agents, paths | Scanning and exploitation attempts |
| Asset inventory | Hosts, software, owners | Impact and exposure analysis |
| Vulnerability scans | Missing patches, misconfigurations | Risk prioritization |
| Ticketing notes | User reports, incidents | Human context |

## 6.3 Manual Sources

Manual analyst entries matter. OSIRIS should support human notes.

```ts
interface AnalystNote {
  id: string;
  title: string;
  body: string;
  relatedEntityIds: string[];
  relatedThreatIds: string[];
  sourceIds: string[];
  confidence: number;
  createdAt: string;
  createdBy: string;
}
```

---

# 7. Extraction Process

Extraction turns raw content into structured objects.

## 7.1 Extract Basic Metadata

For every source item:

```ts
interface SourceRecord {
  id: string;
  sourceType: "rss" | "advisory" | "log" | "email" | "manual" | "report" | "ticket";
  title: string;
  url?: string;
  author?: string;
  publisher?: string;
  collectedAt: string;
  publishedAt?: string;
  rawText: string;
  reliabilityScore: number;
  handlingTags: string[];
}
```

## 7.2 Extract Indicators

Use regex and parsers for:

```text
- IPv4
- IPv6
- Domains
- URLs
- Email addresses
- File hashes: MD5, SHA1, SHA256
- CVE IDs
- MITRE ATT&CK technique IDs
- Malware family names
- File names
- Registry paths
- Process names
- Command line strings
```

Example regex targets:

```text
CVE pattern:
CVE-\d{4}-\d{4,7}

MITRE technique pattern:
T\d{4}(\.\d{3})?

SHA256 rough pattern:
\b[A-Fa-f0-9]{64}\b
```

## 7.3 Extract Entities

Entities are higher-level concepts.

```ts
interface ThreatEntity {
  id: string;
  type:
    | "ip"
    | "domain"
    | "url"
    | "file_hash"
    | "email"
    | "cve"
    | "software"
    | "organization"
    | "threat_actor"
    | "malware"
    | "campaign"
    | "asset"
    | "user"
    | "location"
    | "technique";
  value: string;
  aliases: string[];
  firstSeen?: string;
  lastSeen?: string;
  confidence: number;
  sourceIds: string[];
}
```

## 7.4 Extract Events

Threat events are time-bound observations.

```ts
interface ThreatEvent {
  id: string;
  eventType:
    | "login_failure"
    | "phishing_email"
    | "malware_detection"
    | "vulnerability_disclosure"
    | "exploit_attempt"
    | "domain_registration"
    | "dns_query"
    | "network_connection"
    | "file_execution"
    | "user_report"
    | "patch_release"
    | "public_advisory";
  title: string;
  description: string;
  occurredAt: string;
  observedAt: string;
  entityIds: string[];
  sourceIds: string[];
  severity: "info" | "low" | "medium" | "high" | "critical";
  confidence: number;
}
```

---

# 8. Entity Resolution Process

Entity resolution decides whether two records refer to the same thing.

Examples:

```text
login.company-security.com
company-security.com
https://login.company-security.com/reset
```

These may all relate to the same suspicious domain cluster.

## 8.1 Exact Matching

Exact matching is safest.

```text
Same SHA256 hash = same file content.
Same CVE ID = same vulnerability.
Same domain = same domain.
```

## 8.2 Normalized Matching

Normalize before matching.

```text
HTTPS://Example.com/Login
https://example.com/login
example.com/login
```

These may refer to the same URL after normalization.

## 8.3 Fuzzy Matching

Fuzzy matching helps with names, brands, organizations, and lookalike domains.

Examples:

```text
microsoft-login.com
micros0ft-login.com
microsoftlogin-security.com
```

Fuzzy matching should never be treated as proof. It should create leads.

## 8.4 Relationship Matching

Two entities may be related even if not identical.

```text
Domain A and Domain B use the same name server.
Domain A and Domain B resolve to the same IP.
Two phishing emails use the same attachment hash.
Two IPs belong to the same ASN.
```

---

# 9. Threat Graph Model

OSIRIS should model threat intelligence as a graph.

```text
ThreatActor
  → uses Malware
  → uses Technique
  → controls Infrastructure
  → targets Organization
  → exploits Vulnerability
  → impacts Asset
```

## 9.1 Relationship Types

```ts
interface ThreatRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType:
    | "resolves_to"
    | "hosts"
    | "downloads"
    | "communicates_with"
    | "uses"
    | "targets"
    | "exploits"
    | "impacts"
    | "attributed_to"
    | "similar_to"
    | "same_as"
    | "mentions"
    | "observed_with"
    | "registered_by"
    | "belongs_to_asn"
    | "mapped_to_attack_technique";
  confidence: number;
  sourceIds: string[];
  firstSeen?: string;
  lastSeen?: string;
}
```

## 9.2 Why Graphs Matter

A table can tell you:

```text
IP 203.0.113.10 appeared in a firewall log.
```

A graph can tell you:

```text
IP 203.0.113.10
  → hosted domain payroll-update-example.com
  → linked in phishing email
  → targeted finance users
  → produced failed Microsoft 365 login attempts
  → resembles credential phishing behavior
```

The graph is where disconnected data starts becoming intelligence.

---

# 10. Threat Cluster Analysis

A threat cluster is a group of related observations that may represent one campaign, incident, vulnerability risk, or adversary behavior pattern.

## 10.1 Cluster Inputs

Cluster by:

- Same indicator
- Same domain root
- Same ASN
- Same CVE
- Same affected software
- Same target group
- Same email subject theme
- Same attachment hash
- Same MITRE technique
- Same time window
- Same user group
- Same geography
- Same source report

## 10.2 Cluster Example

```text
Signal 1:
New domain registered: vpn-company-support.com

Signal 2:
Email sent to IT admins: "VPN certificate renewal required"

Signal 3:
Failed logins against VPN users from same ASN

Signal 4:
CISA advisory mentions active VPN exploitation campaign
```

Possible cluster:

```text
Possible VPN-targeted phishing/exploitation campaign.
```

## 10.3 Cluster Object

```ts
interface ThreatCluster {
  id: string;
  title: string;
  clusterType:
    | "phishing_campaign"
    | "credential_attack"
    | "malware_activity"
    | "vulnerability_exploitation"
    | "suspicious_infrastructure"
    | "brand_impersonation"
    | "data_exfiltration_risk"
    | "insider_risk"
    | "supply_chain_risk"
    | "unknown";
  entityIds: string[];
  eventIds: string[];
  sourceIds: string[];
  firstSeen: string;
  lastSeen: string;
  summary: string;
  confidence: number;
  severity: "info" | "low" | "medium" | "high" | "critical";
  recommendedActions: string[];
  alternativeExplanations: string[];
}
```

---

# 11. Indicator Analysis

Indicators are not equal. OSIRIS should score indicator quality.

## 11.1 Indicator Types by Strength

| Indicator | Typical strength | Notes |
|---|---:|---|
| SHA256 hash | High | Strong file identity, but malware can recompile/change hash |
| URL | Medium-high | More precise than domain, but can expire |
| Domain | Medium | Can be shared, parked, hijacked, or reused |
| IP address | Low-medium | Often shared, proxied, cloud-hosted, or reassigned |
| Email subject | Low-medium | Useful for clustering, weak for attribution |
| User agent | Low | Easy to spoof |
| CVE ID | High for vulnerability identity | Does not prove exploitation |
| ATT&CK technique | Medium-high | Good behavior context, often subjective mapping |

## 11.2 Indicator Object

```ts
interface Indicator {
  id: string;
  indicatorType:
    | "ip"
    | "domain"
    | "url"
    | "email"
    | "file_hash_md5"
    | "file_hash_sha1"
    | "file_hash_sha256"
    | "cve"
    | "attack_technique"
    | "user_agent"
    | "process"
    | "registry_key"
    | "command_line";
  value: string;
  status: "unknown" | "benign" | "suspicious" | "malicious" | "expired";
  firstSeen?: string;
  lastSeen?: string;
  sourceIds: string[];
  confidence: number;
  tags: string[];
}
```

## 11.3 Indicator Enrichment

Enrichment adds context.

Examples:

```text
IP address:
- ASN
- Country
- Reverse DNS
- Abuse reports
- Passive DNS
- Cloud provider
- First seen / last seen

Domain:
- Registration date
- Name servers
- WHOIS/RDAP data
- Certificate transparency
- Similarity to protected brands
- Passive DNS
- Hosting IPs

CVE:
- CVSS score
- EPSS probability
- Affected products
- Known exploited status
- Public exploit availability
- Patch availability
```

---

# 12. TTP Analysis with MITRE ATT&CK

MITRE ATT&CK is a public knowledge base of adversary tactics and techniques based on real-world observations.

OSIRIS should use ATT&CK as a defensive taxonomy.

## 12.1 Tactic vs Technique

```text
Tactic = Why the attacker is doing something.
Technique = How the attacker does it.
```

Example:

```text
Tactic:
Credential Access

Technique:
Phishing
Password Spraying
Credential Dumping
```

## 12.2 Why TTPs Matter More Than Indicators

Indicators change quickly.

```text
IP address changes.
Domain changes.
Hash changes.
```

Behavior is harder to change.

```text
The actor still needs to phish, exploit, move laterally, persist, evade detection, or exfiltrate data.
```

## 12.3 OSIRIS ATT&CK Mapping Object

```ts
interface AttackMapping {
  id: string;
  techniqueId: string;
  techniqueName: string;
  tactic: string;
  evidence: string;
  sourceIds: string[];
  confidence: number;
  relatedEventIds: string[];
  defensiveUse:
    | "detection"
    | "hunting"
    | "prevention"
    | "response"
    | "awareness";
}
```

## 12.4 Example Mapping

```text
Observed:
Multiple users received emails linking to a fake login page.

Possible ATT&CK mapping:
Initial Access → Phishing
Credential Access → Input Capture / Credential harvesting pattern

Confidence:
Medium, because the link destination resembled a login portal and targeted several employees.
```

---

# 13. Vulnerability Intelligence

Vulnerability intelligence answers:

```text
Which vulnerabilities actually matter to me right now?
```

A vulnerability with a high severity score is not automatically the top priority. OSIRIS should combine multiple factors.

## 13.1 Useful Vulnerability Factors

| Factor | Meaning |
|---|---|
| CVSS | Technical severity |
| EPSS | Probability of exploitation in the wild in the next 30 days |
| Known exploited status | Whether exploitation is publicly known or listed by trusted sources |
| Asset exposure | Whether the vulnerable asset is internet-facing or sensitive |
| Patch availability | Whether a fix exists |
| Compensating controls | WAF, VPN, segmentation, EDR, MFA, etc. |
| Business criticality | How important the affected system is |
| Exploit complexity | How easy it is to exploit |
| Required privileges | Whether attacker needs access first |

## 13.2 Vulnerability Object

```ts
interface VulnerabilityIntel {
  id: string;
  cveId: string;
  title: string;
  affectedProducts: string[];
  cvssScore?: number;
  epssScore?: number;
  knownExploited?: boolean;
  publicExploitAvailable?: boolean;
  patchAvailable?: boolean;
  affectedAssetIds: string[];
  exposure: "unknown" | "internal" | "external" | "public_internet";
  priority: "low" | "medium" | "high" | "critical";
  confidence: number;
  sourceIds: string[];
}
```

## 13.3 Vulnerability Priority Logic

Example scoring idea:

```text
priority_score =
  technical_severity
  + exploitation_probability
  + exposure_score
  + asset_criticality
  + known_exploitation_bonus
  - compensating_controls
```

Example interpretation:

```text
High CVSS + low EPSS + internal-only asset = watch/patch normally.
Medium CVSS + high EPSS + internet-facing asset = patch urgently.
High CVSS + known exploited + public-facing VPN = critical.
```

---

# 14. Actor / Campaign Intelligence

Actor and campaign intelligence tries to connect activity patterns over time.

## 14.1 Be Careful with Attribution

OSIRIS should avoid definitive attribution unless strong evidence exists.

Preferred language:

```text
This activity resembles patterns reported in ransomware affiliate intrusions.
```

Avoid:

```text
This was definitely Group X.
```

## 14.2 Campaign Object

```ts
interface ThreatCampaign {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  suspectedActorIds: string[];
  targetedSectors: string[];
  targetedRegions: string[];
  techniqueIds: string[];
  indicatorIds: string[];
  sourceIds: string[];
  firstSeen?: string;
  lastSeen?: string;
  confidence: number;
  status: "active" | "inactive" | "unknown";
}
```

## 14.3 Campaign Clues

Campaigns may be connected by:

- Reused infrastructure
- Similar phishing themes
- Similar malware loader
- Shared command-and-control behavior
- Same exploit chain
- Same victim profile
- Similar timing
- Same language artifacts
- Same tool marks
- Same TTP sequence

---

# 15. Confidence Scoring

Confidence scoring should answer:

```text
How strongly does the available evidence support this assessment?
```

Confidence is not severity.

```text
High confidence + low severity = likely true but not dangerous.
Low confidence + critical severity = uncertain but worth checking quickly.
```

## 15.1 Confidence Inputs

| Input | Question |
|---|---|
| Source reliability | Has this source been accurate before? |
| Source independence | Are multiple sources truly independent? |
| Indicator strength | Is the indicator specific or weak? |
| Entity match strength | Are we sure the entities match? |
| Time proximity | Did the signals happen close enough together? |
| Behavior match | Does it match known TTPs? |
| Asset relevance | Does this apply to assets we actually have? |
| Corroboration | Do multiple signals support the same hypothesis? |
| Alternative explanations | Are there innocent explanations? |

## 15.2 Example Confidence Formula

```text
confidence_score =
  (source_reliability * 0.20)
+ (source_independence * 0.15)
+ (indicator_quality * 0.15)
+ (entity_match_quality * 0.15)
+ (time_proximity * 0.10)
+ (ttp_match * 0.10)
+ (asset_relevance * 0.10)
+ (alternative_explanation_penalty * -0.05)
```

Score range:

```text
0.00 - 0.29 = Low confidence
0.30 - 0.59 = Moderate-low confidence
0.60 - 0.79 = Moderate confidence
0.80 - 0.94 = High confidence
0.95 - 1.00 = Very high confidence
```

## 15.3 Confidence Object

```ts
interface ConfidenceBreakdown {
  score: number;
  label:
    | "low"
    | "moderate_low"
    | "moderate"
    | "high"
    | "very_high";
  reasonsIncreasingConfidence: string[];
  reasonsReducingConfidence: string[];
  keyAssumptions: string[];
  evidenceNeededToIncreaseConfidence: string[];
}
```

---

# 16. Risk Scoring

Risk asks:

```text
How bad could this be for us?
```

Risk combines:

```text
likelihood × impact
```

## 16.1 Likelihood Inputs

- Exploitation observed
- EPSS score
- Similar activity in logs
- Public exploit availability
- Targeted sector relevance
- Asset exposure
- Weak controls
- Active campaign references

## 16.2 Impact Inputs

- Asset criticality
- Data sensitivity
- Business function
- User privilege level
- Blast radius
- Recovery difficulty
- Compliance exposure
- Operational downtime potential

## 16.3 Risk Object

```ts
interface ThreatRiskAssessment {
  id: string;
  title: string;
  threatClusterId: string;
  likelihood: "low" | "medium" | "high" | "critical";
  impact: "low" | "medium" | "high" | "critical";
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number;
  affectedAssetIds: string[];
  recommendedActions: string[];
  urgency: "monitor" | "investigate" | "mitigate_soon" | "mitigate_now";
}
```

---

# 17. Analyst Output Types

OSIRIS should support multiple output views.

## 17.1 Threat Card

```text
Possible Threat:
Supplier-themed credential phishing campaign

Confidence:
Moderate

Risk:
High

Why this surfaced:
- New lookalike domain resembles trusted supplier portal.
- Multiple procurement users received vendor-themed emails.
- Failed logins increased against procurement accounts.
- Email links point to the same newly registered domain.

Recommended action:
- Block domain.
- Warn procurement users.
- Review email headers.
- Check for successful logins.
- Confirm MFA prompts.
```

## 17.2 Vulnerability Advisory

```text
Vulnerability:
CVE-XXXX-YYYY in Product Z

Priority:
Critical

Why:
- Internet-facing asset is affected.
- Public exploit is available.
- EPSS is high.
- Vendor patch exists.
- Similar scanning is visible in web logs.

Recommended action:
Patch immediately or remove external exposure until patched.
```

## 17.3 Hunt Package

```text
Hypothesis:
Attackers may be attempting password spraying against admin users.

Look for:
- Many failed logins from one IP against many users
- Failed attempts across a short window
- Successful login after repeated failures
- MFA fatigue prompts
- Unusual ASN or geography

Suggested fields:
source_ip, username, timestamp, auth_result, user_agent, mfa_result
```

## 17.4 Executive Brief

```text
Summary:
There is a moderate-confidence indication of a phishing campaign targeting procurement staff. No confirmed compromise has been identified, but the pattern is consistent with credential theft attempts.

Business risk:
Compromise of procurement accounts could expose supplier communication, invoices, and payment workflows.

Recommended decision:
Approve immediate domain blocking, targeted user warning, and audit of recent procurement logins.
```

---

# 18. OSIRIS Data Structures

## 18.1 Source Record

```ts
export interface SourceRecord {
  id: string;
  sourceType:
    | "rss"
    | "vendor_advisory"
    | "cisa_alert"
    | "nvd_cve"
    | "github_advisory"
    | "internal_log"
    | "email_alert"
    | "endpoint_alert"
    | "firewall_log"
    | "dns_log"
    | "manual_note"
    | "threat_report";
  title: string;
  url?: string;
  publisher?: string;
  author?: string;
  collectedAt: string;
  publishedAt?: string;
  rawText: string;
  summary?: string;
  reliabilityScore: number;
  tags: string[];
}
```

## 18.2 Threat Entity

```ts
export interface ThreatEntity {
  id: string;
  type:
    | "ip"
    | "domain"
    | "url"
    | "file_hash"
    | "email_address"
    | "cve"
    | "software"
    | "organization"
    | "asset"
    | "user"
    | "threat_actor"
    | "malware"
    | "campaign"
    | "attack_technique"
    | "asn";
  value: string;
  normalizedValue: string;
  aliases: string[];
  firstSeen?: string;
  lastSeen?: string;
  confidence: number;
  sourceIds: string[];
}
```

## 18.3 Threat Event

```ts
export interface ThreatEvent {
  id: string;
  eventType:
    | "indicator_observed"
    | "phishing_email_observed"
    | "login_anomaly"
    | "malware_alert"
    | "cve_disclosed"
    | "exploit_reported"
    | "asset_exposed"
    | "suspicious_dns_query"
    | "network_connection"
    | "vulnerability_scan_result"
    | "user_report"
    | "patch_available";
  title: string;
  description: string;
  occurredAt: string;
  observedAt: string;
  entityIds: string[];
  sourceIds: string[];
  severity: "info" | "low" | "medium" | "high" | "critical";
  confidence: number;
}
```

## 18.4 Threat Cluster

```ts
export interface ThreatCluster {
  id: string;
  title: string;
  clusterType:
    | "phishing_campaign"
    | "credential_attack"
    | "malware_activity"
    | "vulnerability_exploitation"
    | "suspicious_infrastructure"
    | "brand_impersonation"
    | "supply_chain_risk"
    | "insider_risk"
    | "unknown";
  summary: string;
  entityIds: string[];
  eventIds: string[];
  sourceIds: string[];
  firstSeen: string;
  lastSeen: string;
  confidence: number;
  severity: "info" | "low" | "medium" | "high" | "critical";
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedActions: string[];
  alternativeExplanations: string[];
}
```

## 18.5 Threat Assessment

```ts
export interface ThreatAssessment {
  id: string;
  title: string;
  assessmentType:
    | "threat_brief"
    | "vulnerability_advisory"
    | "campaign_assessment"
    | "hunt_package"
    | "executive_summary"
    | "incident_lead";
  executiveSummary: string;
  technicalSummary: string;
  confidence: ConfidenceBreakdown;
  risk: ThreatRiskAssessment;
  evidence: EvidenceItem[];
  relatedEntityIds: string[];
  relatedEventIds: string[];
  relatedSourceIds: string[];
  recommendedActions: RecommendedAction[];
  alternativeExplanations: string[];
  createdAt: string;
}

export interface EvidenceItem {
  id: string;
  description: string;
  sourceId: string;
  supportsConclusion: boolean;
  confidenceImpact: "raises" | "lowers" | "neutral";
}

export interface RecommendedAction {
  id: string;
  action: string;
  priority: "low" | "medium" | "high" | "critical";
  ownerType: "soc" | "it" | "helpdesk" | "security_engineering" | "management" | "developer";
  reason: string;
}
```

---

# 19. AI Chatbot Prompt Pretext

Use this as the giant pretext message before providing structured data to ChatGPT or another AI model.

The safest and most useful workflow is:

```text
[Prompt pretext]
[Structured data payload]
[Specific output request]
```

The AI should not be asked to magically discover truth. It should be asked to produce **hypotheses, confidence scores, evidence chains, alternative explanations, and recommended defensive actions**.

## 19.1 Giant Prompt Pretext

```text
You are acting as a defensive threat intelligence analyst for a local-first intelligence synthesis system called OSIRIS.

Your job is to analyze the structured data I provide and identify possible cybersecurity or operational threat patterns. You must be careful, skeptical, and evidence-based.

Do not claim certainty unless the data strongly supports it. Do not invent facts, sources, actors, malware families, CVEs, indicators, or timelines that are not present in the provided data. If the data is incomplete, say what is missing.

You are allowed to produce hypotheses, but every hypothesis must include:

1. A plain-English title
2. A threat category
3. A concise summary
4. The specific evidence used
5. The entities involved
6. The timeline of relevant observations
7. The reasoning chain
8. A confidence score from 0.00 to 1.00
9. A confidence label using one of:
   - low
   - moderate-low
   - moderate
   - high
   - very-high
10. Reasons confidence increased
11. Reasons confidence decreased
12. Alternative benign or less severe explanations
13. Potential impact
14. Recommended defensive actions
15. What additional data would improve the assessment
16. Whether the output should be treated as:
   - informational
   - monitor
   - investigate
   - mitigate soon
   - mitigate now

Your analysis should prioritize defensive use cases such as:

- phishing detection
- credential attack detection
- suspicious infrastructure analysis
- vulnerability prioritization
- malware or endpoint alert correlation
- suspicious DNS or network activity
- exposed asset risk
- supply-chain or vendor-related cyber risk
- brand impersonation
- possible campaign clustering
- incident lead generation

Use the following analysis process:

STEP 1: Parse the provided data.
Identify all source records, indicators, entities, assets, users, vulnerabilities, events, relationships, and timestamps.

STEP 2: Normalize the data.
Normalize domains, URLs, IPs, CVE IDs, dates, usernames, software names, and organization names where possible.

STEP 3: Resolve entities carefully.
Connect records only when the evidence supports it. Use exact matches when available. Use fuzzy or similarity matches only as weak evidence.

STEP 4: Build a threat graph mentally.
Connect entities using relationships such as:
- resolves_to
- hosted_on
- linked_in_email
- observed_in_log
- targets
- exploits
- affects_asset
- maps_to_attack_technique
- similar_to
- same_as
- co_occurs_with

STEP 5: Identify clusters.
Look for observations that share indicators, entities, timing, target groups, infrastructure, vulnerabilities, software, tactics, or behavior.

STEP 6: Determine possible threat hypotheses.
A hypothesis should explain multiple data points better than treating them as unrelated.

STEP 7: Score confidence.
Use this scoring logic:

- Source reliability: Are the sources reliable?
- Source independence: Are multiple independent sources present?
- Indicator quality: Are indicators specific or weak?
- Entity match quality: Are the connected entities clearly the same or only similar?
- Time proximity: Did events happen close together?
- Behavior/TTP match: Does the pattern match known defensive threat behavior?
- Asset relevance: Does this affect the assets, users, or systems in the data?
- Alternative explanations: Are there plausible benign explanations?

Suggested confidence ranges:

0.00 - 0.29 = low
0.30 - 0.59 = moderate-low
0.60 - 0.79 = moderate
0.80 - 0.94 = high
0.95 - 1.00 = very-high

STEP 8: Score risk separately from confidence.
Confidence means how strongly the evidence supports the assessment.
Risk means how much harm could occur if the assessment is true.

Risk should consider:
- affected asset criticality
- user privilege
- internet exposure
- exploitation likelihood
- sensitive data exposure
- blast radius
- patch availability
- defensive controls
- business impact

STEP 9: Generate outputs.
Return possible threat assessments in this structure:

# Threat Intelligence Assessment

## Executive Summary
Brief summary of the most important findings.

## Possible Threats
For each possible threat:

### Threat 1: [Title]

**Category:** [phishing / credential attack / vulnerability exploitation / malware / suspicious infrastructure / brand impersonation / supply-chain risk / exposed asset / unknown]

**Assessment:**
[Plain-English explanation]

**Confidence:**
[score] — [label]

**Risk:**
[low / medium / high / critical]

**Why this surfaced:**
- [evidence point]
- [evidence point]
- [evidence point]

**Entities involved:**
- [entity]
- [entity]

**Timeline:**
- [timestamp] — [observation]
- [timestamp] — [observation]

**Reasoning chain:**
1. [reasoning step]
2. [reasoning step]
3. [reasoning step]

**Alternative explanations:**
- [benign or less severe explanation]
- [benign or less severe explanation]

**Potential impact:**
- [impact]

**Recommended defensive actions:**
- [action]
- [action]

**Additional data needed:**
- [data that would confirm or reject the hypothesis]

**Disposition:**
[informational / monitor / investigate / mitigate soon / mitigate now]

## Indicator Summary
List indicators grouped by type:
- IPs
- Domains
- URLs
- Hashes
- CVEs
- Email addresses
- ATT&CK techniques

For each indicator, include:
- value
- status if known
- related source IDs
- confidence
- notes

## Vulnerability Priority Summary
If CVEs are present, prioritize them based on:
- CVSS if provided
- EPSS if provided
- known exploited status if provided
- asset exposure
- affected asset criticality
- patch availability

## ATT&CK / TTP Mapping
Map observed behavior to ATT&CK-style tactics and techniques only when supported by evidence. If uncertain, label it as tentative.

## Evidence Gaps
Explain what is missing or uncertain.

## Final Analyst Notes
Summarize what a human analyst should verify next.

Important rules:
- Do not provide offensive instructions.
- Do not explain how to exploit a vulnerability.
- Do not provide malware code, credential theft instructions, evasion tactics, or unauthorized access guidance.
- Keep recommendations defensive.
- Be skeptical of weak indicators.
- Separate facts from assumptions.
- Separate confidence from risk.
- Include alternative explanations.
- Cite source IDs from the provided data whenever possible.

Now analyze the following OSIRIS threat intelligence data payload:
```

After the pretext, paste the JSON or structured markdown data. Then close the data block and ask the model to produce the assessment.

---

# 20. Example Data Payload

```json
{
  "sourceRecords": [
    {
      "id": "src-001",
      "sourceType": "email_alert",
      "title": "Suspicious vendor-themed email reported by user",
      "publisher": "Internal Email Security Gateway",
      "collectedAt": "2026-06-06T14:15:00-07:00",
      "publishedAt": "2026-06-06T14:10:00-07:00",
      "reliabilityScore": 0.85,
      "rawText": "Three procurement users received an email with subject 'Vendor invoice portal update'. The email linked to hxxps://vendor-payments-secure.example/login.",
      "tags": ["phishing", "procurement", "vendor-theme"]
    },
    {
      "id": "src-002",
      "sourceType": "dns_log",
      "title": "DNS query observed for suspicious domain",
      "publisher": "Internal DNS Logs",
      "collectedAt": "2026-06-06T14:35:00-07:00",
      "publishedAt": "2026-06-06T14:32:00-07:00",
      "reliabilityScore": 0.90,
      "rawText": "Workstation FIN-LAP-014 queried vendor-payments-secure.example five times after receiving email.",
      "tags": ["dns", "suspicious-domain"]
    },
    {
      "id": "src-003",
      "sourceType": "authentication_log",
      "title": "Failed login attempts against procurement accounts",
      "publisher": "Identity Provider Logs",
      "collectedAt": "2026-06-06T15:05:00-07:00",
      "publishedAt": "2026-06-06T15:00:00-07:00",
      "reliabilityScore": 0.95,
      "rawText": "12 failed login attempts were observed against procurement users from IP 203.0.113.50 between 14:40 and 14:55. No successful login observed.",
      "tags": ["identity", "failed-login", "procurement"]
    }
  ],
  "entities": [
    {
      "id": "ent-001",
      "type": "domain",
      "value": "vendor-payments-secure.example",
      "normalizedValue": "vendor-payments-secure.example",
      "aliases": [],
      "firstSeen": "2026-06-06T14:10:00-07:00",
      "lastSeen": "2026-06-06T14:32:00-07:00",
      "confidence": 0.90,
      "sourceIds": ["src-001", "src-002"]
    },
    {
      "id": "ent-002",
      "type": "ip",
      "value": "203.0.113.50",
      "normalizedValue": "203.0.113.50",
      "aliases": [],
      "firstSeen": "2026-06-06T14:40:00-07:00",
      "lastSeen": "2026-06-06T14:55:00-07:00",
      "confidence": 0.80,
      "sourceIds": ["src-003"]
    },
    {
      "id": "ent-003",
      "type": "asset",
      "value": "FIN-LAP-014",
      "normalizedValue": "FIN-LAP-014",
      "aliases": [],
      "confidence": 0.95,
      "sourceIds": ["src-002"]
    },
    {
      "id": "ent-004",
      "type": "user_group",
      "value": "Procurement Users",
      "normalizedValue": "procurement_users",
      "aliases": ["procurement"],
      "confidence": 0.90,
      "sourceIds": ["src-001", "src-003"]
    }
  ],
  "events": [
    {
      "id": "evt-001",
      "eventType": "phishing_email_observed",
      "title": "Vendor-themed email delivered to procurement users",
      "description": "Three procurement users received vendor invoice portal themed emails.",
      "occurredAt": "2026-06-06T14:10:00-07:00",
      "observedAt": "2026-06-06T14:15:00-07:00",
      "entityIds": ["ent-001", "ent-004"],
      "sourceIds": ["src-001"],
      "severity": "medium",
      "confidence": 0.85
    },
    {
      "id": "evt-002",
      "eventType": "suspicious_dns_query",
      "title": "Finance workstation queried suspicious vendor-themed domain",
      "description": "FIN-LAP-014 queried the domain after phishing email delivery.",
      "occurredAt": "2026-06-06T14:32:00-07:00",
      "observedAt": "2026-06-06T14:35:00-07:00",
      "entityIds": ["ent-001", "ent-003"],
      "sourceIds": ["src-002"],
      "severity": "medium",
      "confidence": 0.90
    },
    {
      "id": "evt-003",
      "eventType": "login_anomaly",
      "title": "Failed login attempts against procurement users",
      "description": "12 failed login attempts from one IP against procurement accounts.",
      "occurredAt": "2026-06-06T14:40:00-07:00",
      "observedAt": "2026-06-06T15:05:00-07:00",
      "entityIds": ["ent-002", "ent-004"],
      "sourceIds": ["src-003"],
      "severity": "high",
      "confidence": 0.90
    }
  ],
  "assets": [
    {
      "id": "asset-001",
      "name": "FIN-LAP-014",
      "assetType": "laptop",
      "ownerGroup": "Finance",
      "criticality": "medium",
      "internetFacing": false,
      "containsSensitiveData": true
    }
  ]
}
```

---

# 21. Example ChatGPT Output

```text
# Threat Intelligence Assessment

## Executive Summary
There is a moderate-confidence indication of a supplier/vendor-themed credential phishing attempt targeting procurement users. The strongest evidence is the close timing between phishing email delivery, DNS queries to the linked domain, and failed login attempts against the same user group.

## Possible Threats

### Threat 1: Vendor-Themed Credential Phishing Targeting Procurement Users

Category: phishing / credential attack

Assessment:
The provided data suggests a possible credential phishing attempt. Procurement users received vendor-themed emails linking to a suspicious domain, one workstation queried the domain shortly after delivery, and failed login attempts against procurement users followed within roughly 30–45 minutes.

Confidence:
0.72 — moderate

Risk:
high

Why this surfaced:
- src-001 reports vendor-themed emails sent to procurement users.
- src-002 shows DNS queries to the same domain from FIN-LAP-014.
- src-003 shows failed login attempts against procurement users shortly afterward.
- The same user group appears across the email and authentication observations.

Entities involved:
- vendor-payments-secure.example
- 203.0.113.50
- FIN-LAP-014
- Procurement Users

Timeline:
- 2026-06-06 14:10 — Vendor-themed emails delivered.
- 2026-06-06 14:32 — FIN-LAP-014 queried linked domain.
- 2026-06-06 14:40–14:55 — Failed logins occurred against procurement users.

Reasoning chain:
1. Vendor-themed email delivery creates an initial phishing signal.
2. DNS activity shows at least one endpoint interacted with the linked domain.
3. Failed login attempts against the same business group soon afterward suggest possible credential harvesting or password spraying.
4. No successful login is reported, which lowers immediate compromise confidence but does not remove the threat.

Alternative explanations:
- The domain may be a legitimate but poorly named vendor portal.
- Failed logins may be unrelated password mistakes.
- Procurement users may have been targeted by unrelated automated login noise.

Potential impact:
- Compromise of procurement accounts.
- Exposure of supplier communication or invoices.
- Fraudulent payment workflow risk.

Recommended defensive actions:
- Block vendor-payments-secure.example at DNS/web gateway.
- Review email headers and sender infrastructure.
- Check whether any users submitted credentials.
- Review identity logs for successful logins after the failed attempts.
- Force password reset for affected users if credential entry is confirmed.
- Warn procurement users.

Additional data needed:
- Domain registration age and owner.
- Full email headers.
- Web proxy logs showing page visits.
- MFA prompt logs.
- Successful login records after the phishing email.

Disposition:
investigate
```

---

# 22. Local-First Implementation Strategy

OSIRIS can start simple without expensive AI calls.

## 22.1 Phase 1: Store Sources

Start with a local database table for source records.

```text
source_records
entities
indicators
events
relationships
clusters
assessments
```

## 22.2 Phase 2: Extract Indicators Locally

Use regex and deterministic parsers first.

```text
- CVE extraction
- IP extraction
- domain extraction
- URL extraction
- hash extraction
- ATT&CK technique ID extraction
```

## 22.3 Phase 3: Build Entity Graph

Every extracted object gets an entity ID.

```text
source → mentions → entity
entity → related_to → entity
event → involves → entity
cluster → contains → event
```

## 22.4 Phase 4: Cluster by Rules

Examples:

```text
If same domain appears in email alert + DNS log within 24 hours:
  create suspicious domain cluster.

If phishing email targets same group + failed logins follow within 2 hours:
  create credential attack lead.

If CVE affects known asset + EPSS high + patch available:
  create vulnerability priority item.
```

## 22.5 Phase 5: Add AI Only at the Explanation Layer

Do not use AI to replace the database or core logic.

Use AI for:

- summarizing clusters
- explaining reasoning
- generating alternative explanations
- creating analyst-ready reports
- converting technical output for executives

Avoid using AI for:

- secret storage
- source of truth
- unsupervised blocking decisions
- direct attribution
- autonomous enforcement

---

# 23. Ethical and Safety Guardrails

Threat intelligence can easily become surveillance if boundaries are not clear.

OSIRIS should follow these rules:

1. Use only legal, authorized, and appropriate data.
2. Keep recommendations defensive.
3. Avoid doxxing, stalking, or targeting private people.
4. Do not treat protest, speech, or association as a threat without specific safety/security indicators.
5. Separate facts from assumptions.
6. Separate confidence from risk.
7. Avoid unsupported actor attribution.
8. Require source links or source IDs for all major claims.
9. Provide alternative explanations.
10. Preserve audit logs for generated assessments.
11. Allow human review before escalation.
12. Do not generate exploit instructions, malware, credential theft workflows, or evasion guidance.

---

# 24. Public Reference Sources

These references are useful for grounding OSIRIS threat intelligence design.

## CISA / NICE Threat Analysis

CISA's NICE Framework describes threat analysis as collecting, processing, analyzing, and disseminating cybersecurity threat assessments, plus developing cybersecurity indicators to maintain awareness.

- https://niccs.cisa.gov/tools/nice-framework/work-role/threat-analysis

## MITRE ATT&CK

MITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques based on real-world observations.

- https://attack.mitre.org/
- https://attack.mitre.org/resources/faq/

## OASIS STIX / TAXII

STIX is a language and serialization format for sharing cyber threat intelligence. TAXII is commonly used for automated exchange of that intelligence.

- https://www.oasis-open.org/standard/6426/
- https://oasis-open.github.io/cti-documentation/stix/intro.html
- https://www.oasis-open.org/2021/06/23/stix-v2-1-and-taxii-v2-1-oasis-standards-are-published/

## FIRST CVSS

CVSS provides a standard way to capture the principal characteristics of a vulnerability and produce a numerical severity score.

- https://www.first.org/cvss/
- https://www.first.org/cvss/v3.1/specification-document

## FIRST EPSS

EPSS estimates the probability that a published CVE will be exploited in the wild in the next 30 days.

- https://www.first.org/epss/

## Palantir Foundry Ontology / Entity Resolution

Palantir's public docs describe ontology-based object/link modeling and entity resolution concepts that are useful for understanding how disconnected data can be structured into real-world entities and relationships.

- https://palantir.com/docs/foundry/ontology/overview/
- https://www.palantir.com/foundry-entity-resolution/

---

# Final Project Note

For OSIRIS, threat intelligence should be built as an explainable pipeline:

```text
source data
  → extracted indicators
  → resolved entities
  → graph relationships
  → clustered observations
  → possible threats
  → confidence/risk scoring
  → defensive recommendations
```

The most important design principle is this:

```text
OSIRIS should not say “this is definitely a threat.”
OSIRIS should say “these signals may indicate this threat, here is the evidence, here are the alternatives, here is the confidence, and here is what to verify next.”
```

That makes the system useful, honest, defensible, and much less likely to become a fancy false-positive machine.
