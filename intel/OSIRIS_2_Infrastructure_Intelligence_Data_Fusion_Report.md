# OSIRIS 2.0 — Infrastructure Intelligence Data Fusion Report

**Document Type:** Project Research / Implementation Guide  
**Intelligence Category:** Infrastructure Intelligence  
**Project Context:** OSIRIS 2.0 local-first intelligence synthesis system  
**Primary Goal:** Explain how disconnected infrastructure-related data can be extracted, normalized, linked, scored, and converted into explainable infrastructure assessments, outage hypotheses, dependency maps, resilience insights, and risk reports.

---

## 1. Executive Summary

Infrastructure intelligence is the process of collecting, structuring, correlating, and interpreting data about the physical, digital, civic, utility, transportation, communications, and service systems that allow a community, business, city, region, or organization to function.

For OSIRIS, infrastructure intelligence should not be framed as “surveillance of infrastructure.” That gets sketchy fast. The better framing is:

> **Infrastructure intelligence helps identify service dependencies, outage patterns, cascading failure risks, weak points, resilience gaps, and operational impacts using public, authorized, and non-sensitive data.**

Infrastructure intelligence is especially valuable because infrastructure failures rarely happen in isolation. A single outage, storm warning, facility issue, vendor disruption, network alert, construction notice, or transportation delay may be harmless by itself. But several weak signals can combine into a meaningful assessment:

```text
power substation issue
+ cellular tower outage
+ traffic signal failures
+ emergency service dispatch delays
= possible cascading infrastructure disruption in a specific area
```

The goal is not to claim certainty. The goal is to produce structured hypotheses with:

- evidence
- linked sources
- affected assets
- dependency paths
- confidence scores
- impact scores
- alternative explanations
- recommended validation steps

This report gives OSIRIS a blueprint for converting infrastructure signals into explainable intelligence objects.

---

## 2. What Infrastructure Intelligence Means

Infrastructure intelligence focuses on assets, systems, dependencies, disruptions, vulnerabilities, service continuity, and resilience.

It answers questions like:

- What systems are currently disrupted?
- Which assets depend on which other assets?
- What services could be affected if one asset fails?
- Which locations have repeated outage patterns?
- Which facilities are single points of failure?
- Which public signals suggest emerging infrastructure stress?
- Which disruptions may cascade across utilities, transport, telecom, public services, or digital systems?
- What data supports the conclusion?
- What are the alternative explanations?

Infrastructure intelligence can be applied to:

- cities
- campuses
- businesses
- data centers
- transportation networks
- utilities
- event venues
- retail/logistics networks
- emergency management
- local-first civic awareness dashboards
- personal/community resilience planning

---

## 3. Infrastructure Intelligence vs Other Intelligence Types

| Intelligence Type | Main Focus | Infrastructure Intelligence Relationship |
|---|---|---|
| Event Intelligence | What happened or may happen | Infrastructure intelligence often explains the systems affected by an event. |
| Cyber Intelligence | Digital systems, logs, vulnerabilities, attacks | Infrastructure intelligence includes cyber-physical and digital infrastructure dependencies. |
| Threat Intelligence | Actors, capabilities, intentions, TTPs | Infrastructure intelligence may consume threat intel when infrastructure is targeted. |
| Geospatial Intelligence | Location, movement, maps, terrain | Infrastructure intelligence heavily uses maps, asset locations, and service areas. |
| Operational Intelligence | Internal workflows, queues, SLAs, service health | Infrastructure intelligence adds physical/digital dependency context. |
| Supply Chain Intelligence | Suppliers, routes, components, inventory | Infrastructure intelligence tracks ports, roads, rail, utilities, warehouses, and logistics nodes. |
| Financial/Fraud Intelligence | Money movement and fraud risk | Infrastructure intelligence can identify infrastructure-linked financial exposure. |
| Social/Narrative Intelligence | Public discourse and narratives | Public reports and social posts may signal outages or service degradation. |

Infrastructure intelligence is the “systems and dependencies” layer.

---

## 4. Public Reference Concepts

This report is grounded in public defensive and resilience-oriented frameworks:

- **CISA Critical Infrastructure Sectors** — CISA identifies 16 critical infrastructure sectors whose physical or virtual assets, systems, and networks are considered vital to the United States.
- **CISA Critical Infrastructure Security and Resilience** — focuses on reducing risk and strengthening cybersecurity and physical security capacity.
- **NIST Resilience Definition** — resilience includes the ability to prepare for, adapt to, withstand, and recover rapidly from disruptions, attacks, accidents, or naturally occurring incidents.
- **NIST Cybersecurity Framework 2.0** — useful for digital infrastructure governance, identification, protection, detection, response, and recovery.
- **FEMA Community Lifelines** — reframes incident information around essential services such as safety, food/water/shelter, health/medical, energy, communications, transportation, and hazardous materials.
- **DHS Resilience Framework** — focuses on preparedness, mitigation, continuity, and recovery.

These references support the core OSIRIS concept: infrastructure intelligence should be resilience-first, explainable, and action-oriented.

---

## 5. Infrastructure Categories OSIRIS Should Support

OSIRIS should model infrastructure broadly, not only “critical infrastructure.”

### 5.1 Physical Infrastructure

Examples:

- buildings
- campuses
- warehouses
- hospitals
- schools
- ports
- bridges
- tunnels
- roads
- rail stations
- airports
- distribution centers
- shelters
- public facilities

### 5.2 Utility Infrastructure

Examples:

- power substations
- distribution lines
- water treatment plants
- pumping stations
- sewer systems
- natural gas pipelines
- fuel distribution
- backup generators
- battery systems

### 5.3 Telecommunications Infrastructure

Examples:

- cellular towers
- fiber routes
- ISPs
- network exchanges
- public Wi-Fi
- radio repeaters
- emergency communications
- satellite links

### 5.4 Digital Infrastructure

Examples:

- DNS
- cloud regions
- authentication systems
- APIs
- internal networks
- identity providers
- monitoring systems
- SaaS dependencies
- databases
- web services

### 5.5 Transportation Infrastructure

Examples:

- highways
- local roads
- rail routes
- shipping lanes
- public transit
- airport operations
- parking systems
- traffic signals
- fleet routes

### 5.6 Civic and Public Service Infrastructure

Examples:

- emergency services
- dispatch centers
- public works
- hospitals
- schools
- courts
- government facilities
- shelters
- public warning systems

### 5.7 Commercial and Organizational Infrastructure

Examples:

- offices
- retail stores
- warehouses
- IT closets
- help desks
- facilities teams
- access control systems
- vendor-managed systems
- internal service workflows

---

## 6. Core Infrastructure Intelligence Objects

Infrastructure intelligence should be built around structured objects.

### 6.1 Asset

An asset is a physical, digital, service, or organizational object that can be affected, monitored, or depended on.

Examples:

- substation
- water plant
- server
- router
- building
- road segment
- cloud service
- bridge
- warehouse
- data center
- cell tower

### 6.2 System

A system is a collection of assets that provides a function.

Examples:

- city water system
- company identity system
- campus power distribution
- regional transit network
- warehouse fulfillment network

### 6.3 Service

A service is the outcome people or operations rely on.

Examples:

- electricity
- clean water
- internet connectivity
- authentication
- package delivery
- road access
- emergency response
- building access

### 6.4 Dependency

A dependency is a relationship where one asset, system, or service relies on another.

Examples:

```text
hospital depends_on power substation
cell tower depends_on fiber backhaul
warehouse depends_on road access
identity provider depends_on cloud region
traffic signals depend_on municipal power
```

### 6.5 Signal

A signal is an observed piece of information.

Examples:

- outage notice
- maintenance alert
- sensor reading
- traffic delay
- vendor status page update
- social report
- weather warning
- construction notice
- service degradation alert

### 6.6 Incident

An incident is a confirmed or suspected disruption.

Examples:

- power outage
- water main break
- bridge closure
- network outage
- cloud service degradation
- facility access failure
- transit disruption

### 6.7 Impact

Impact describes what the disruption affects.

Examples:

- affected customers
- affected employees
- affected geography
- affected business function
- affected safety function
- affected revenue
- affected response time

### 6.8 Resilience Control

A resilience control reduces the effect of a failure.

Examples:

- backup generator
- redundant fiber path
- alternate supplier
- manual override process
- backup authentication method
- emergency traffic routing
- failover cloud region

---

## 7. Infrastructure Data Source Types

OSIRIS should clearly label every source type and whether it is public, authorized internal, derived, or manually entered.

### 7.1 Public Sources

Examples:

- public outage maps
- transportation alerts
- weather alerts
- utility notices
- city construction bulletins
- public meeting agendas
- public status pages
- agency advisories
- open data portals
- FEMA/CISA/NIST resources
- public GIS layers
- public news articles
- public social posts

### 7.2 Authorized Internal Sources

Examples:

- help desk tickets
- facility work orders
- asset inventory
- monitoring alerts
- cloud provider logs
- network health dashboards
- building management systems
- incident reports
- maintenance records
- vendor contracts
- internal service maps

### 7.3 Derived Sources

Examples:

- detected clusters
- baseline deviations
- calculated outage duration
- dependency impact estimates
- service health scores
- redundancy scores
- confidence scores

### 7.4 Manual Analyst Inputs

Examples:

- analyst notes
- field observations
- confirmed status updates
- local knowledge
- validation comments
- alternative explanations

---

## 8. Data Extraction Process

Infrastructure intelligence begins by extracting structured data from messy inputs.

### 8.1 Extract Asset Mentions

From text, logs, alerts, or documents, identify references to infrastructure assets.

Examples:

```text
“Substation A is undergoing emergency maintenance.”
→ asset: Substation A
→ asset_type: power_substation
→ event_type: emergency_maintenance
```

```text
“Fiber cut reported near Highway 26.”
→ asset: fiber route / telecom line
→ location: Highway 26 area
→ event_type: telecom_disruption
```

### 8.2 Extract Services

Identify what function is affected.

Examples:

- electricity
- water
- internet
- traffic control
- hospital access
- logistics routing
- authentication
- emergency communications

### 8.3 Extract Locations

Locations may be exact or approximate.

Examples:

- address
- facility name
- city
- county
- route
- intersection
- GPS coordinate
- service area
- region
- grid cell

### 8.4 Extract Time

Capture multiple time fields when available.

Examples:

- published_at
- observed_at
- started_at
- ended_at
- expected_restoration_time
- maintenance_window_start
- maintenance_window_end

### 8.5 Extract Severity Language

Common phrases:

- outage
- partial outage
- degradation
- emergency repair
- delayed
- rerouted
- unavailable
- reduced capacity
- intermittent
- restored
- under investigation

### 8.6 Extract Dependency Clues

Dependency clues show that one thing relies on another.

Examples:

```text
“Backup generator failed during power outage.”
→ building depends_on generator
→ generator depends_on fuel/maintenance
```

```text
“Cell service degraded due to fiber backhaul issue.”
→ cellular service depends_on fiber backhaul
```

### 8.7 Extract Impact Clues

Impact clues show who or what is affected.

Examples:

- customers affected
- locations affected
- employees affected
- road closures
- delayed appointments
- emergency response delays
- business interruption
- public safety advisory

---

## 9. Normalization Process

Raw infrastructure data is messy. OSIRIS should normalize it before analysis.

### 9.1 Normalize Asset Names

Examples:

```text
“PGE Substation 12”
“Substation 12”
“Portland General Electric Substation #12”
→ normalized_asset_name: PGE Substation 12
```

### 9.2 Normalize Locations

Examples:

```text
“near Hwy 26 and Murray”
“Highway 26 at Murray Blvd”
“US-26/Murray interchange”
→ normalized_location: US-26 at Murray Blvd
```

### 9.3 Normalize Time

Use ISO timestamps whenever possible.

```ts
observedAt: "2026-06-06T14:35:00-07:00"
```

### 9.4 Normalize Infrastructure Types

Use controlled categories.

```ts
type InfrastructureType =
  | "power"
  | "water"
  | "wastewater"
  | "telecom"
  | "transportation"
  | "digital"
  | "facility"
  | "healthcare"
  | "public_safety"
  | "logistics"
  | "fuel"
  | "unknown";
```

### 9.5 Normalize Event Types

```ts
type InfrastructureEventType =
  | "outage"
  | "degradation"
  | "maintenance"
  | "closure"
  | "capacity_reduction"
  | "reroute"
  | "restoration"
  | "dependency_failure"
  | "safety_advisory"
  | "weather_impact"
  | "unknown";
```

---

## 10. Entity Resolution for Infrastructure

Entity resolution decides whether multiple records refer to the same asset, service, place, or organization.

### 10.1 Infrastructure Entity Matching Fields

| Field | Example |
|---|---|
| name | “Substation 12” |
| aliases | “PGE Substation #12”, “SS12” |
| type | power_substation |
| owner_operator | utility company |
| coordinates | lat/lng |
| service_area | neighborhood, county, grid zone |
| asset_id | internal ID if available |
| source_references | public/internal source IDs |

### 10.2 Matching Rules

OSIRIS can start simple:

```text
same exact name + same type = strong match
same alias + same location = strong match
similar name + same location + same owner = likely match
same type + nearby location only = weak match
```

### 10.3 Confidence Levels

| Match Confidence | Meaning |
|---|---|
| 0.90–1.00 | Almost certainly same asset |
| 0.70–0.89 | Probably same asset |
| 0.50–0.69 | Possible match, needs review |
| below 0.50 | Do not merge automatically |

Bad merges are dangerous. Accidentally merging two different substations, hospitals, cloud services, or road segments can create garbage conclusions. OSIRIS should preserve uncertainty instead of pretending the data is cleaner than it is.

---

## 11. Infrastructure Graph Model

Infrastructure intelligence becomes powerful when modeled as a graph.

### 11.1 Graph Nodes

Examples:

- asset
- system
- service
- organization
- location
- incident
- signal
- dependency
- control
- population_area
- vendor

### 11.2 Graph Relationships

Examples:

```text
asset DEPENDS_ON asset
asset PROVIDES service
service SUPPORTS business_function
asset LOCATED_IN location
incident AFFECTS asset
signal INDICATES incident
organization OPERATES asset
control MITIGATES dependency_failure
route CONNECTS facility
```

### 11.3 Example Graph

```text
Cloud Identity Provider
  PROVIDES → Authentication Service
  SUPPORTS → Employee Login
  SUPPORTS → Help Desk Portal
  DEPENDS_ON → Cloud Region A
  HAS_FAILOVER → Cloud Region B

Cloud Region A Degradation
  AFFECTS → Cloud Identity Provider
  MAY_CAUSE → Employee Login Failures
  MAY_CAUSE → Ticket System Access Issues
```

### 11.4 Why the Graph Matters

Tables tell you what happened.

Graphs help explain what could break next.

```text
single asset failure
→ dependent service disruption
→ business function impact
→ customer/user impact
→ recovery priority
```

---

## 12. Infrastructure Signal Types

### 12.1 Outage Signals

Examples:

- power outage map update
- internet outage reports
- water service interruption notice
- cloud status page incident
- facility system alert

### 12.2 Degradation Signals

Examples:

- intermittent connectivity
- slow authentication
- partial service loss
- reduced transit frequency
- longer queue times
- degraded system health

### 12.3 Maintenance Signals

Examples:

- scheduled maintenance
- emergency maintenance
- lane closure
- utility repair
- system patch window

### 12.4 Capacity Signals

Examples:

- increased load
- limited staffing
- high demand
- overloaded route
- low inventory of replacement parts
- limited generator fuel

### 12.5 Environmental Signals

Examples:

- wind warning
- flood warning
- wildfire risk
- extreme heat
- ice storm
- earthquake report
- landslide risk

### 12.6 Dependency Signals

Examples:

- backup system failure
- vendor outage
- upstream network issue
- fuel shortage
- route closure affecting delivery
- ISP backhaul issue

---

## 13. Analysis Patterns

### 13.1 Spatial Clustering

Multiple signals occur near the same place.

```text
water pressure complaints
+ road construction near water line
+ city repair crew dispatch
= possible localized water infrastructure issue
```

### 13.2 Temporal Clustering

Multiple signals occur close together in time.

```text
cloud status alert at 10:05
+ internal login failures at 10:08
+ help desk tickets spike at 10:12
= likely external identity dependency disruption
```

### 13.3 Dependency Chain Detection

A disruption appears to move through linked systems.

```text
power outage
→ cell tower backup battery depletion
→ mobile data degradation
→ payment terminal failures
```

### 13.4 Cascading Failure Hypothesis

One failure may trigger multiple secondary failures.

```text
fiber cut
→ ISP outage
→ cloud POS system unavailable
→ retail checkout delays
→ customer service ticket spike
```

### 13.5 Single Point of Failure Detection

One asset supports many services without redundancy.

```text
one ISP circuit supports:
- guest Wi-Fi
- POS
- security cameras
- ticketing kiosks
- inventory scanner sync
```

### 13.6 Repeated Degradation Pattern

A location or service repeatedly degrades under similar conditions.

```text
every high-wind event
→ same neighborhood power outage reports
→ same cell tower degradation
→ same traffic signal failures
```

### 13.7 Impact Radius Estimation

Estimate the area, users, services, or functions affected.

```text
affected_asset.service_area
+ dependent_assets
+ reported_impact_locations
= estimated_impact_radius
```

---

## 14. Confidence Scoring

Confidence answers:

> How strongly does the evidence support this assessment?

Confidence is not the same as impact. A low-impact issue can have high confidence. A severe possible issue can have low confidence.

### 14.1 Confidence Inputs

| Factor | Meaning |
|---|---|
| Source reliability | Is the source official, verified, historical, or noisy? |
| Source independence | Are multiple independent sources saying similar things? |
| Entity match confidence | Are we sure the assets/entities are the same? |
| Temporal alignment | Did the signals happen close together? |
| Spatial alignment | Did the signals occur in the same service area? |
| Dependency plausibility | Does the proposed cause/effect relationship make sense? |
| Historical pattern | Has this happened before under similar conditions? |
| Contradictions | Are there sources that dispute the hypothesis? |

### 14.2 Example Confidence Formula

```text
confidence =
  (source_reliability * 0.25) +
  (source_independence * 0.15) +
  (entity_match_confidence * 0.15) +
  (temporal_alignment * 0.10) +
  (spatial_alignment * 0.10) +
  (dependency_plausibility * 0.15) +
  (historical_pattern_match * 0.10) -
  (contradiction_penalty)
```

This should be treated as a transparent heuristic, not sacred math from Mount Spreadsheet.

### 14.3 Confidence Labels

| Score | Label |
|---|---|
| 0.85–1.00 | High confidence |
| 0.65–0.84 | Moderate confidence |
| 0.45–0.64 | Low confidence |
| below 0.45 | Weak lead / needs validation |

---

## 15. Impact Scoring

Impact answers:

> How bad would this be if true or if it continues?

### 15.1 Impact Inputs

| Factor | Meaning |
|---|---|
| Service criticality | Does the service support safety, health, operations, revenue, or access? |
| Population affected | How many people, users, customers, or workers are affected? |
| Asset criticality | Is the asset a hub or single point of failure? |
| Duration | How long has/will the disruption last? |
| Redundancy | Are backups/failovers available? |
| Cascading potential | Could this trigger secondary failures? |
| Recovery difficulty | Is restoration simple or complex? |
| Time sensitivity | Is this during peak operations or emergency conditions? |

### 15.2 Example Impact Formula

```text
impact =
  (service_criticality * 0.25) +
  (affected_population * 0.15) +
  (asset_criticality * 0.15) +
  (duration_severity * 0.10) +
  (cascading_potential * 0.15) +
  (recovery_difficulty * 0.10) +
  (time_sensitivity * 0.10) -
  (redundancy_strength * 0.15)
```

### 15.3 Impact Labels

| Score | Label |
|---|---|
| 0.85–1.00 | Severe |
| 0.65–0.84 | High |
| 0.45–0.64 | Moderate |
| 0.25–0.44 | Low |
| below 0.25 | Minimal |

---

## 16. Risk Scoring

Risk combines likelihood and impact.

```text
risk = confidence_or_likelihood * impact
```

But OSIRIS should show the components separately:

```text
Confidence: Moderate
Impact: High
Risk: Elevated
```

This avoids the common mistake where a system hides weak evidence behind a scary-looking risk score.

---

## 17. Resilience Scoring

Resilience answers:

> How well can this asset, service, or system withstand and recover from disruption?

### 17.1 Resilience Inputs

| Factor | Meaning |
|---|---|
| Redundancy | Are there backups or alternate paths? |
| Recovery time | How quickly can service be restored? |
| Monitoring coverage | Can problems be detected early? |
| Maintenance maturity | Are assets maintained and documented? |
| Dependency visibility | Are dependencies known? |
| Manual fallback | Can people operate without the system temporarily? |
| Vendor diversity | Is there over-reliance on one provider? |
| Historical reliability | Has the system been stable? |

### 17.2 Example Resilience Formula

```text
resilience =
  (redundancy * 0.20) +
  (recovery_speed * 0.15) +
  (monitoring_coverage * 0.15) +
  (maintenance_maturity * 0.10) +
  (dependency_visibility * 0.15) +
  (manual_fallback_strength * 0.10) +
  (vendor_diversity * 0.10) +
  (historical_reliability * 0.05)
```

### 17.3 Resilience Labels

| Score | Label |
|---|---|
| 0.85–1.00 | Strong resilience |
| 0.65–0.84 | Good resilience |
| 0.45–0.64 | Fragile / limited resilience |
| below 0.45 | High fragility |

---

## 18. OSIRIS TypeScript Data Models

These are starter models, not final database gospel. They are meant to give the app a clean structure.

```ts
export type InfrastructureType =
  | "power"
  | "water"
  | "wastewater"
  | "telecom"
  | "transportation"
  | "digital"
  | "facility"
  | "healthcare"
  | "public_safety"
  | "logistics"
  | "fuel"
  | "unknown";

export type SourceAccessLevel =
  | "public"
  | "authorized_internal"
  | "manual"
  | "derived";

export interface InfrastructureSource {
  id: string;
  title: string;
  sourceType:
    | "outage_map"
    | "status_page"
    | "news"
    | "open_data"
    | "ticket"
    | "sensor"
    | "log"
    | "manual_note"
    | "weather_alert"
    | "transportation_alert"
    | "vendor_notice"
    | "other";
  accessLevel: SourceAccessLevel;
  url?: string;
  publisher?: string;
  publishedAt?: string;
  collectedAt: string;
  reliabilityScore: number; // 0 to 1
  rawText?: string;
}

export interface InfrastructureLocation {
  id: string;
  label: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  geohash?: string;
  precision: "exact" | "approximate" | "regional" | "unknown";
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  aliases?: string[];
  infrastructureType: InfrastructureType;
  assetType:
    | "substation"
    | "line"
    | "tower"
    | "fiber_route"
    | "road_segment"
    | "bridge"
    | "facility"
    | "server"
    | "cloud_service"
    | "network_device"
    | "generator"
    | "pump_station"
    | "unknown";
  ownerOperator?: string;
  locationId?: string;
  serviceArea?: string[];
  criticalityScore?: number; // 0 to 1
  resilienceScore?: number; // 0 to 1
  sourceIds: string[];
  confidence: number;
}

export interface InfrastructureService {
  id: string;
  name: string;
  category:
    | "electricity"
    | "water"
    | "internet"
    | "transportation"
    | "authentication"
    | "facility_access"
    | "emergency_response"
    | "logistics"
    | "communications"
    | "other";
  supportedByAssetIds: string[];
  supportedBusinessFunctions?: string[];
  criticalityScore: number;
}

export interface InfrastructureDependency {
  id: string;
  fromId: string;
  fromType: "asset" | "service" | "system" | "organization";
  toId: string;
  toType: "asset" | "service" | "system" | "organization";
  relationshipType:
    | "depends_on"
    | "provides"
    | "supports"
    | "located_in"
    | "operated_by"
    | "mitigated_by"
    | "fails_over_to"
    | "connects_to";
  confidence: number;
  sourceIds: string[];
}

export interface InfrastructureSignal {
  id: string;
  title: string;
  description: string;
  eventType:
    | "outage"
    | "degradation"
    | "maintenance"
    | "closure"
    | "capacity_reduction"
    | "reroute"
    | "restoration"
    | "dependency_failure"
    | "safety_advisory"
    | "weather_impact"
    | "unknown";
  assetIds?: string[];
  serviceIds?: string[];
  locationIds?: string[];
  sourceIds: string[];
  observedAt?: string;
  startedAt?: string;
  endedAt?: string;
  severity: "minimal" | "low" | "moderate" | "high" | "severe" | "unknown";
  confidence: number;
}

export interface InfrastructureAssessment {
  id: string;
  title: string;
  summary: string;
  assessmentType:
    | "possible_outage"
    | "confirmed_outage"
    | "cascading_failure_risk"
    | "single_point_of_failure"
    | "service_degradation"
    | "resilience_gap"
    | "dependency_risk"
    | "recovery_update";
  signalIds: string[];
  assetIds: string[];
  serviceIds: string[];
  dependencyIds: string[];
  affectedLocationIds: string[];
  evidence: string[];
  alternativeExplanations: string[];
  confidenceScore: number;
  impactScore: number;
  riskScore: number;
  resilienceScore?: number;
  recommendedValidationSteps: string[];
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 19. Example Structured JSON Payload for AI Analysis

This is the kind of payload OSIRIS could send to ChatGPT after extracting and structuring source data.

```json
{
  "analysisType": "infrastructure_intelligence",
  "scope": {
    "region": "Example City West District",
    "timeWindow": "2026-06-06T08:00:00-07:00 to 2026-06-06T14:00:00-07:00",
    "goal": "Identify possible infrastructure disruptions, affected services, dependency risks, and confidence-rated explanations."
  },
  "sources": [
    {
      "id": "src_001",
      "title": "Utility outage notice for West District",
      "sourceType": "outage_map",
      "accessLevel": "public",
      "publisher": "Example Electric Utility",
      "publishedAt": "2026-06-06T09:10:00-07:00",
      "reliabilityScore": 0.92,
      "rawText": "Approximately 1,200 customers affected by outage near West District. Crews investigating."
    },
    {
      "id": "src_002",
      "title": "Cellular service degradation reports",
      "sourceType": "status_page",
      "accessLevel": "public",
      "publisher": "Example Mobile Provider",
      "publishedAt": "2026-06-06T10:05:00-07:00",
      "reliabilityScore": 0.85,
      "rawText": "Some users may experience reduced mobile data service in West District due to local site power issues."
    },
    {
      "id": "src_003",
      "title": "Traffic signal outage reports",
      "sourceType": "transportation_alert",
      "accessLevel": "public",
      "publisher": "Example City Transportation Bureau",
      "publishedAt": "2026-06-06T10:22:00-07:00",
      "reliabilityScore": 0.88,
      "rawText": "Traffic signals are out at several intersections in West District. Drivers should treat intersections as four-way stops."
    },
    {
      "id": "src_004",
      "title": "Internal help desk spike for payment terminal connectivity",
      "sourceType": "ticket",
      "accessLevel": "authorized_internal",
      "publisher": "Internal IT Service Desk",
      "publishedAt": "2026-06-06T10:40:00-07:00",
      "reliabilityScore": 0.80,
      "rawText": "Multiple retail locations in West District report payment terminal connectivity failures."
    }
  ],
  "assets": [
    {
      "id": "asset_power_001",
      "name": "West District Power Distribution Area",
      "infrastructureType": "power",
      "assetType": "line",
      "ownerOperator": "Example Electric Utility",
      "serviceArea": ["West District"],
      "criticalityScore": 0.82,
      "confidence": 0.78,
      "sourceIds": ["src_001"]
    },
    {
      "id": "asset_cell_001",
      "name": "West District Cellular Sites",
      "infrastructureType": "telecom",
      "assetType": "tower",
      "ownerOperator": "Example Mobile Provider",
      "serviceArea": ["West District"],
      "criticalityScore": 0.74,
      "confidence": 0.72,
      "sourceIds": ["src_002"]
    },
    {
      "id": "asset_traffic_001",
      "name": "West District Traffic Signals",
      "infrastructureType": "transportation",
      "assetType": "road_segment",
      "ownerOperator": "Example City Transportation Bureau",
      "serviceArea": ["West District"],
      "criticalityScore": 0.69,
      "confidence": 0.76,
      "sourceIds": ["src_003"]
    }
  ],
  "dependencies": [
    {
      "id": "dep_001",
      "fromId": "asset_cell_001",
      "fromType": "asset",
      "toId": "asset_power_001",
      "toType": "asset",
      "relationshipType": "depends_on",
      "confidence": 0.70,
      "sourceIds": ["src_002"]
    },
    {
      "id": "dep_002",
      "fromId": "asset_traffic_001",
      "fromType": "asset",
      "toId": "asset_power_001",
      "toType": "asset",
      "relationshipType": "depends_on",
      "confidence": 0.65,
      "sourceIds": ["src_003"]
    }
  ],
  "signals": [
    {
      "id": "sig_001",
      "title": "Power outage affecting West District",
      "eventType": "outage",
      "assetIds": ["asset_power_001"],
      "sourceIds": ["src_001"],
      "observedAt": "2026-06-06T09:10:00-07:00",
      "severity": "high",
      "confidence": 0.86
    },
    {
      "id": "sig_002",
      "title": "Cellular data degradation in West District",
      "eventType": "degradation",
      "assetIds": ["asset_cell_001"],
      "sourceIds": ["src_002"],
      "observedAt": "2026-06-06T10:05:00-07:00",
      "severity": "moderate",
      "confidence": 0.78
    },
    {
      "id": "sig_003",
      "title": "Traffic signals offline in West District",
      "eventType": "outage",
      "assetIds": ["asset_traffic_001"],
      "sourceIds": ["src_003"],
      "observedAt": "2026-06-06T10:22:00-07:00",
      "severity": "moderate",
      "confidence": 0.82
    },
    {
      "id": "sig_004",
      "title": "Payment terminal connectivity failures",
      "eventType": "degradation",
      "sourceIds": ["src_004"],
      "observedAt": "2026-06-06T10:40:00-07:00",
      "severity": "moderate",
      "confidence": 0.74
    }
  ]
}
```

---

## 20. Giant AI Chatbot Prompt Pretext

Use this as the instruction block before pasting structured infrastructure data into ChatGPT.

```text
You are an infrastructure intelligence analyst helping analyze structured data from a local-first intelligence system called OSIRIS.

Your job is to examine the provided infrastructure-related data and produce explainable, confidence-rated infrastructure assessments.

You must follow these rules:

1. Use only the data provided in the payload unless explicitly told otherwise.
2. Do not invent facts, sources, locations, assets, outages, organizations, or causes.
3. Clearly distinguish confirmed facts from hypotheses.
4. Do not assume malicious activity unless the data specifically supports it.
5. Treat infrastructure intelligence as resilience, dependency, service continuity, and impact analysis.
6. Consider alternative explanations for every assessment.
7. Explain how you reached each conclusion using specific source IDs, signal IDs, asset IDs, and dependency IDs.
8. Provide confidence scores and explain what increased or decreased confidence.
9. Provide impact scores separately from confidence scores.
10. Provide risk scores only after explaining confidence and impact.
11. Highlight possible cascading failures, dependency risks, single points of failure, and affected services.
12. Identify missing information that would improve the assessment.
13. Avoid operationally sensitive or harmful recommendations. Keep recommendations defensive, resilience-focused, and validation-oriented.
14. If the evidence is weak, say so clearly.
15. If multiple explanations fit, rank them by evidence strength.

Analyze the data using this process:

A. Source Review
- List the most important sources.
- Note source reliability and whether sources appear independent.
- Identify any contradictions or uncertainty.

B. Entity and Asset Review
- Identify key infrastructure assets, systems, services, organizations, and locations.
- Note any entity-resolution uncertainty.

C. Signal Review
- Identify outage, degradation, maintenance, closure, restoration, capacity, environmental, or dependency signals.
- Group related signals by time, place, asset, service, or dependency.

D. Dependency and Cascade Review
- Identify dependencies between assets, services, systems, and locations.
- Determine whether one disruption may plausibly affect another.
- Identify possible cascading failure paths.

E. Assessment Generation
For each possible infrastructure assessment, provide:
- title
- assessment type
- summary
- supporting evidence
- linked source IDs
- linked signal IDs
- linked asset IDs
- linked dependency IDs
- affected services
- affected locations
- confidence score from 0.00 to 1.00
- impact score from 0.00 to 1.00
- risk score from 0.00 to 1.00
- confidence explanation
- impact explanation
- alternative explanations
- what evidence would increase confidence
- what evidence would decrease confidence
- recommended validation steps
- recommended defensive/resilience actions

F. Final Summary
- Provide top findings.
- Provide top risks.
- Provide top resilience gaps.
- Provide top data gaps.
- Provide a plain-English explanation suitable for a non-technical project user.

Output format:

# Infrastructure Intelligence Assessment

## 1. Executive Summary

## 2. Source Review

## 3. Key Assets, Services, and Dependencies

## 4. Possible Infrastructure Assessments

For each assessment:

### Assessment [number]: [title]

**Assessment Type:**  
**Confidence:** [score + label]  
**Impact:** [score + label]  
**Risk:** [score + label]  

**Summary:**  

**Supporting Evidence:**  
- Source IDs:
- Signal IDs:
- Asset IDs:
- Dependency IDs:

**Reasoning:**  

**Possible Cascade Path:**  

**Alternative Explanations:**  

**What Would Increase Confidence:**  

**What Would Decrease Confidence:**  

**Recommended Validation Steps:**  

**Recommended Defensive / Resilience Actions:**  

## 5. Cascading Failure and Dependency Map

## 6. Resilience Gaps

## 7. Data Gaps

## 8. Plain-English Summary

Now analyze the following OSIRIS infrastructure intelligence payload:

[PASTE STRUCTURED DATA HERE]
```

---

## 21. Example AI Output

Using the example payload above, the AI should produce something like this:

```text
# Infrastructure Intelligence Assessment

## 1. Executive Summary

The provided data supports a moderate-to-high confidence assessment that a West District power outage is causing or contributing to secondary infrastructure degradation involving cellular service, traffic signals, and possibly payment terminal connectivity.

The strongest evidence is the temporal and geographic clustering of four signals within approximately 90 minutes, all centered on West District. The utility outage notice is the anchor signal. Cellular and traffic signal impacts are plausibly dependent on local power availability. Payment terminal failures may be linked through telecom or power dependencies, but the evidence is weaker because the affected retail systems are not directly mapped to the same telecom or power assets.

## 2. Source Review

Key sources:
- src_001: Utility outage notice, reliability 0.92.
- src_002: Mobile provider degradation notice, reliability 0.85.
- src_003: City transportation alert, reliability 0.88.
- src_004: Internal help desk reports, reliability 0.80.

The sources appear partly independent because they come from a utility, mobile provider, transportation bureau, and internal IT service desk.

## 3. Key Assets, Services, and Dependencies

Key assets:
- asset_power_001: West District Power Distribution Area.
- asset_cell_001: West District Cellular Sites.
- asset_traffic_001: West District Traffic Signals.

Key dependencies:
- dep_001: Cellular sites depend on the power distribution area.
- dep_002: Traffic signals depend on the power distribution area.

## 4. Possible Infrastructure Assessments

### Assessment 1: Power outage likely contributing to cascading local service disruption

**Assessment Type:** cascading_failure_risk  
**Confidence:** 0.78 — Moderate confidence  
**Impact:** 0.72 — High impact  
**Risk:** 0.56 — Elevated risk  

**Summary:**  
A West District power outage appears to be contributing to secondary disruptions in cellular service and traffic signal operations. Payment terminal issues may also be related, but that connection is less certain.

**Supporting Evidence:**  
- Source IDs: src_001, src_002, src_003, src_004
- Signal IDs: sig_001, sig_002, sig_003, sig_004
- Asset IDs: asset_power_001, asset_cell_001, asset_traffic_001
- Dependency IDs: dep_001, dep_002

**Reasoning:**  
The power outage was reported first at 09:10. Cellular degradation followed at 10:05 and explicitly referenced local site power issues. Traffic signal outages followed at 10:22 in the same district. Internal payment terminal connectivity failures followed at 10:40. The timing, shared geography, and dependency relationships support the hypothesis that power disruption is the primary infrastructure stressor.

**Possible Cascade Path:**  
Power distribution outage → cellular site power issues → mobile data degradation → payment terminal connectivity failures.  
Power distribution outage → traffic signal outage → road safety and congestion risk.

**Alternative Explanations:**  
1. Cellular degradation may be caused by unrelated telecom maintenance.
2. Payment terminal failures may be caused by a separate payment processor outage.
3. Traffic signal outages may be caused by local controller faults rather than the broader power outage.

**What Would Increase Confidence:**  
- Utility restoration boundary matching the affected cellular and traffic areas.
- Confirmation that affected retail payment terminals use the degraded mobile provider.
- Additional reports from facilities inside the same power outage area.

**What Would Decrease Confidence:**  
- Mobile provider confirms unrelated maintenance.
- Payment processor reports a separate outage.
- Traffic bureau identifies independent hardware failure at intersections.

**Recommended Validation Steps:**  
- Compare outage map boundary with affected cell sites, intersections, and retail locations.
- Check whether payment terminals rely on mobile data or local ISP circuits.
- Monitor restoration timestamps across power, cellular, traffic, and payment services.

**Recommended Defensive / Resilience Actions:**  
- Prioritize services that affect safety and access first.
- Confirm backup power status for cell sites and traffic controls.
- Prepare alternate payment workflow for affected retail locations.
- Document dependency chain for future resilience planning.
```

---

## 22. Suggested OSIRIS UI Pages

### 22.1 Infrastructure Dashboard

Shows:

- current infrastructure assessments
- active outages
- degraded services
- high-risk dependencies
- resilience gaps
- affected regions

### 22.2 Asset Graph

Shows:

- assets
- systems
- services
- dependencies
- operators
- failover paths
- single points of failure

### 22.3 Service Health Timeline

Shows:

- signal chronology
- outage start/end
- restoration updates
- related incidents
- confidence changes over time

### 22.4 Dependency Risk Page

Shows:

- “if this fails, what breaks?”
- upstream dependencies
- downstream services
- affected people/operations
- redundancy status

### 22.5 Resilience Gaps Page

Shows:

- no backup path
- no monitoring
- unclear ownership
- repeated failure pattern
- weak recovery plan
- dependency unknowns

### 22.6 Assessment Detail Page

Shows:

- executive summary
- evidence list
- confidence score
- impact score
- risk score
- dependency map
- alternative explanations
- validation steps
- recommended actions

---

## 23. Local-First Implementation Strategy

OSIRIS should not require expensive AI calls for everything.

### 23.1 Local/Rule-Based First

Use local logic for:

- keyword extraction
- source normalization
- basic entity matching
- temporal clustering
- spatial clustering
- dependency matching
- confidence pre-scoring
- tag generation
- duplicate detection

### 23.2 AI Only for Higher-Level Interpretation

Use AI for:

- explaining possible cascade paths
- summarizing complex assessments
- ranking alternative explanations
- converting structured evidence into readable reports
- identifying missing data questions
- drafting validation steps

### 23.3 Suggested Pipeline

```text
raw source item
→ extractor
→ normalized infrastructure signal
→ asset/entity resolution
→ dependency graph update
→ local clustering/scoring
→ assessment candidate
→ optional AI explanation
→ human review
→ published OSIRIS dossier
```

### 23.4 Avoid AI for Sensitive Tasks

Do not use AI to:

- infer exact vulnerabilities from sensitive infrastructure details
- recommend exploit paths
- expose restricted facility information
- identify private individuals near infrastructure
- generate attack scenarios
- target infrastructure weaknesses

Keep the system defensive and resilience-focused.

---

## 24. Safety and Ethics Guardrails

Infrastructure intelligence can become sensitive quickly. OSIRIS should include strict guardrails.

### 24.1 Use Public or Authorized Data Only

Do not scrape, ingest, or infer from restricted systems without permission.

### 24.2 Avoid Sensitive Targeting

Do not create reports that help target infrastructure.

Bad:

```text
Here is the weakest substation and how to disrupt it.
```

Good:

```text
This service area has limited redundancy and should be prioritized for resilience planning.
```

### 24.3 Protect Exact Sensitive Details

Exact locations, access details, control systems, security weaknesses, and internal diagrams should be protected or generalized.

### 24.4 Do Not Overstate Confidence

Infrastructure data is often incomplete. OSIRIS should avoid dramatic claims based on weak signals.

### 24.5 Track Source Attribution

Every assessment should trace back to sources.

### 24.6 Preserve Alternative Explanations

Never make a single hypothesis look like the only answer unless the evidence is overwhelming.

### 24.7 Separate Public View from Private View

Public-facing reports should generalize sensitive details.

Internal/private reports may include more detail only when authorized and properly protected.

---

## 25. Final Recommended OSIRIS Framing

Infrastructure intelligence should be one of OSIRIS’s strongest modules because it connects naturally to event intelligence, geospatial intelligence, cyber intelligence, operational intelligence, and supply chain intelligence.

Recommended project framing:

> OSIRIS Infrastructure Intelligence turns disconnected infrastructure signals into explainable assessments of service disruption, dependency risk, cascading failure potential, resilience gaps, and recovery priorities.

A strong OSIRIS infrastructure module should answer:

```text
What is affected?
What does it depend on?
What depends on it?
Where is it happening?
When did it start?
How confident are we?
How bad could it be?
What else could explain it?
What should be checked next?
```

That is the core value: not just a map, not just a feed, not just a dashboard — a structured explanation engine for how systems fail, recover, and depend on each other.

---

## 26. Source References

- CISA — Critical Infrastructure Sectors: https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience/critical-infrastructure-sectors
- CISA — Critical Infrastructure Security and Resilience: https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience
- CISA — Sector Risk Management Agencies: https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience/critical-infrastructure-sectors/sector-risk-management-agencies
- NIST — Resilience Glossary: https://csrc.nist.gov/glossary/term/resilience
- NIST — Cybersecurity Framework 2.0: https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf
- DHS — Resilience: https://www.dhs.gov/topics/resilience
- DHS — Resilience Framework: https://www.dhs.gov/sites/default/files/publications/dhs_resilience_framework_july_2018_508.pdf
- FEMA — Community Lifelines: https://www.fema.gov/emergency-managers/practitioners/lifelines

---

## 27. Implementation Note for OSIRIS

For the MVP, start with these infrastructure intelligence features:

```text
1. Infrastructure source ingestion
2. Asset/entity extraction
3. Location normalization
4. Infrastructure signal model
5. Dependency relationship model
6. Local confidence/impact scoring
7. Assessment candidate generation
8. AI explanation prompt
9. Assessment detail page
10. Dependency graph view
```

Do not start with fancy map animations. That is dessert. The meal is the data model, source attribution, and explainable scoring. Fancy maps without clean source-linked reasoning become a glitter cannon pointed at a spreadsheet.

