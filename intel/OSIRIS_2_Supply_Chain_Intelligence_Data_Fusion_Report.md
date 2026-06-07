# OSIRIS 2.0 — Supply Chain Intelligence Data Fusion Report

**Document type:** Project implementation report  
**Focus area:** Supply Chain Intelligence / Supply Chain Risk Intelligence / Logistics Intelligence  
**Project context:** OSIRIS 2.0 local-first intelligence synthesis system  
**Purpose:** Explain how disconnected supply chain data can be extracted, normalized, linked, analyzed, scored, and turned into confidence-rated supply chain assessments.

---

## 1. Executive Summary

Supply chain intelligence is the process of turning fragmented signals about suppliers, inventory, production, logistics, trade, transportation, demand, pricing, infrastructure, weather, labor, regulation, and geopolitical conditions into explainable assessments about possible disruptions, dependencies, risks, bottlenecks, opportunities, and recovery paths.

For OSIRIS, supply chain intelligence should not be treated as a single dashboard of shipment statuses. It should be modeled as an intelligence graph where suppliers, products, facilities, routes, ports, carriers, commodities, regions, documents, alerts, and events are connected through evidence.

A strong supply chain intelligence system answers questions like:

- Which suppliers, products, ports, lanes, or regions are becoming risky?
- Which small signals may combine into an early warning of disruption?
- Which products depend on a fragile supplier, region, route, or raw material?
- Which alternative suppliers or routes may reduce risk?
- Which delays are isolated noise and which are part of a larger pattern?
- Which supply chain risks are operational, financial, geopolitical, cyber, environmental, or regulatory?
- How confident is the assessment, and what evidence supports it?

The core workflow is:

```text
raw source data
  -> extract supply chain entities
  -> normalize units, dates, locations, products, and identifiers
  -> resolve entities across sources
  -> build supplier/product/logistics graph
  -> detect disruptions, dependencies, anomalies, and chokepoints
  -> score confidence, risk, urgency, and business impact
  -> generate an explainable supply chain intelligence assessment
```

The goal is not to magically predict the future. The goal is to surface patterns that humans would likely miss when looking at disconnected data one source at a time.

---

## 2. What Supply Chain Intelligence Is

Supply chain management includes sourcing, procurement, conversion, logistics, and coordination with suppliers, intermediaries, third-party providers, and customers. The Council of Supply Chain Management Professionals defines supply chain management as integrating supply and demand management within and across companies.

Supply chain intelligence builds on that idea but focuses on evidence, risk, dependency, disruption, and decision support.

### 2.1 Simple Definition

Supply chain intelligence is the process of collecting, connecting, and analyzing supply chain signals to understand what is happening, what may happen next, what could be affected, and what action may reduce risk.

### 2.2 What Makes It Different From Basic Supply Chain Analytics

Basic analytics might say:

```text
Supplier A is late by 4 days.
```

Supply chain intelligence asks:

```text
Supplier A is late by 4 days.
Supplier A uses Port X.
Port X has vessel congestion.
The affected component is used in Product Y.
Product Y has low inventory coverage.
Customer demand for Product Y is rising.
Therefore, Product Y has a moderate-confidence fulfillment risk within 10–21 days.
```

That shift from metric reporting to connected explanation is the intelligence layer.

---

## 3. Supply Chain Intelligence Compared With Related Intelligence Types

| Intelligence Type | Main Question | Supply Chain Relationship |
|---|---|---|
| Event Intelligence | What event may be happening? | Detects incidents like port closures, strikes, shortages, recalls, or weather disruptions. |
| Threat Intelligence | Who or what may cause harm? | Identifies threats to suppliers, routes, facilities, software, logistics, or critical materials. |
| Cyber Intelligence | What cyber activity affects systems? | Tracks risks to logistics platforms, supplier systems, OT, ERP, EDI, cloud, and vendor access. |
| Business / Market Intelligence | What market or business trend matters? | Tracks demand, pricing, competitors, substitution, and customer effects. |
| Geospatial Intelligence | Where is the activity and how does location matter? | Tracks ports, routes, weather zones, chokepoints, shipping lanes, and regional dependencies. |
| Operational Intelligence | What is happening inside current operations? | Tracks inventory, orders, backlog, staffing, service levels, and process bottlenecks. |
| Supply Chain Intelligence | What dependencies, disruptions, and flow risks affect supply, production, logistics, or fulfillment? | Combines all of the above into supply chain-specific assessments. |

Supply chain intelligence is naturally cross-domain. It is where business, cyber, logistics, weather, geopolitical, infrastructure, finance, and operations all crash into each other wearing hard hats.

---

## 4. Key Supply Chain Intelligence Objects

OSIRIS should treat supply chain intelligence as a graph of objects.

### 4.1 Core Objects

```text
Supplier
Product
Component
Material
Facility
Warehouse
Factory
Port
Carrier
Route
Lane
Shipment
PurchaseOrder
InventoryItem
CustomerOrder
Commodity
Region
Regulation
DisruptionEvent
RiskSignal
Source
Assessment
```

### 4.2 Example Relationships

```text
Supplier -> produces -> Component
Component -> used_in -> Product
Supplier -> located_in -> Region
Shipment -> travels_through -> Port
Carrier -> operates_on -> Route
Warehouse -> stores -> Product
DisruptionEvent -> affects -> Port
Port -> handles -> Commodity
Commodity -> price_impacts -> Product
Regulation -> constrains -> ImportRoute
CyberIncident -> affects -> SupplierSystem
WeatherEvent -> disrupts -> TransportationLane
```

### 4.3 Why This Matters

The system should not only store records. It should understand that a supplier, a shipment, a port, and a product are connected.

That lets OSIRIS answer:

```text
If this port slows down, which suppliers, shipments, products, orders, and customers might be affected?
```

That is the difference between a spreadsheet and an intelligence system.

---

## 5. Supply Chain Data Sources

Supply chain intelligence works best when it combines many weak signals.

### 5.1 Internal Sources

| Source | Example Data | Intelligence Use |
|---|---|---|
| ERP | purchase orders, suppliers, invoices, materials | Dependency and exposure mapping |
| WMS | warehouse inventory, pick/pack/ship status | Inventory risk and stockout detection |
| TMS | shipments, carriers, lanes, ETAs | Logistics delay and route analysis |
| Procurement systems | contracts, vendor terms, spend | Supplier criticality and concentration risk |
| Supplier portals | confirmations, ASN, production updates | Early warning of supplier delays |
| Customer orders | demand, backorders, cancellations | Demand pressure and fulfillment exposure |
| Service desk / operations tickets | vendor incidents, system outages | Operational disruption signals |
| Finance systems | costs, payment delays, invoice changes | Financial stress and cost pressure |
| Quality systems | defects, returns, recalls | Quality risk and supplier performance |
| Cyber/security logs | vendor access, supplier incidents, EDI errors | Technology and supplier compromise risk |

### 5.2 External Sources

| Source | Example Data | Intelligence Use |
|---|---|---|
| Port authority notices | congestion, closures, labor issues | Port disruption detection |
| Carrier notices | delays, reroutes, service alerts | Logistics risk |
| AIS vessel data | vessel position, speed, port calls | Maritime flow monitoring |
| Weather alerts | storms, flooding, wildfire, heat | Regional disruption forecasting |
| Trade data | import/export flows, HS codes | Dependency and market exposure |
| Commodity prices | fuel, metals, grains, semiconductors | Cost and input risk |
| News/RSS | strikes, sanctions, factory fires, recalls | Event detection |
| Government advisories | sanctions, export controls, customs changes | Compliance and route risk |
| Supplier websites | outage notices, production updates | Supplier status signals |
| Social/public reports | local disruption clues | Weak signal detection |
| Economic datasets | inflation, shipping pressure, logistics indicators | Macro context |

### 5.3 Public Reference Data Sources Worth Supporting

OSIRIS can support source adapters for:

- UN Comtrade for global merchandise trade flows.
- World Bank Logistics Performance Index for country-level logistics benchmarking.
- New York Fed Global Supply Chain Pressure Index for macro supply chain pressure context.
- NOAA AIS tools for U.S. vessel traffic data.
- CISA ICT Supply Chain Risk Management resources for cyber/technology supply chain risk framing.
- DHS Supply Chain Resilience Center concepts for integrated supply chain risk analysis.

---

## 6. Extraction Process

Supply chain intelligence starts by extracting useful objects from messy source material.

### 6.1 Source Input Examples

```text
Port notice:
"Terminal 4 is experiencing elevated dwell times due to equipment maintenance."

Carrier notice:
"Expect 2–4 day delays for westbound freight through Lane A."

Supplier message:
"Component X production is temporarily reduced due to upstream material constraints."

Weather alert:
"Flooding risk is elevated near Region Y over the next 72 hours."

Inventory report:
"Product Z has 9 days of coverage remaining."
```

### 6.2 Extracted Entities

From those inputs, OSIRIS should extract:

```text
Terminal 4 -> Facility / PortTerminal
Lane A -> Route / LogisticsLane
Component X -> Component
Region Y -> Region
Product Z -> Product
2–4 day delay -> DelayEstimate
9 days coverage -> InventoryMetric
flooding risk -> EnvironmentalRiskSignal
material constraints -> SupplyConstraintSignal
```

### 6.3 Extracted Events

```text
PortDelayEvent
CarrierDelayEvent
SupplierProductionReductionEvent
WeatherDisruptionRiskEvent
InventoryCoverageRiskEvent
```

### 6.4 Extracted Metrics

```text
shipment_delay_days: 2-4
inventory_coverage_days: 9
risk_window_hours: 72
production_reduction: unknown quantity
```

### 6.5 Extracted Relationships

```text
Component X -> supplied_by -> Supplier A
Component X -> used_in -> Product Z
Supplier A -> located_in -> Region Y
Shipment Route -> passes_through -> Terminal 4
Weather Risk -> affects -> Region Y
Product Z -> has_inventory_coverage -> 9 days
```

---

## 7. Normalization Process

Raw data is messy. Normalization makes records comparable.

### 7.1 What to Normalize

| Field | Normalize Into |
|---|---|
| Supplier names | canonical supplier entity + aliases |
| Product names | canonical SKU/product/component entity |
| Dates/times | ISO timestamp + timezone |
| Locations | latitude/longitude + region/country hierarchy |
| Ports | UN/LOCODE where possible |
| Products/materials | SKU, HS code, NAICS, internal category |
| Measures | standard units: kg, tons, containers, days, USD |
| Delay language | numeric range when possible |
| Risk words | controlled taxonomy |
| Source names | canonical source record |

### 7.2 Example

Raw:

```text
"LA port delay may impact inbound parts next week."
```

Normalized:

```json
{
  "location": {
    "raw": "LA port",
    "canonical_name": "Port of Los Angeles",
    "type": "port",
    "country": "US",
    "region": "California"
  },
  "risk_type": "logistics_delay",
  "time_window": {
    "raw": "next week",
    "normalized_start": "2026-06-08",
    "normalized_end": "2026-06-14"
  },
  "affected_entity_type": "inbound_parts"
}
```

---

## 8. Entity Resolution

Entity resolution decides when multiple records refer to the same real-world thing.

### 8.1 Supplier Resolution

```text
ACME Components LLC
Acme Components
ACME Comp.
Vendor ID 00421
acmecomponents.com
```

These may all refer to the same supplier.

### 8.2 Product Resolution

```text
Lithium battery module
Battery module LBM-220
SKU LBM220
Component ID C-8821
```

These may all refer to the same component.

### 8.3 Location Resolution

```text
LA port
Port of LA
Los Angeles Harbor
USLAX
```

These may all refer to the Port of Los Angeles.

### 8.4 Resolution Confidence

OSIRIS should never pretend every match is certain.

```ts
export type ResolutionConfidence = "low" | "medium" | "high";

export interface EntityResolutionCandidate {
  rawName: string;
  canonicalEntityId: string;
  matchMethod: "exact" | "alias" | "fuzzy" | "identifier" | "manual";
  confidence: ResolutionConfidence;
  evidence: string[];
}
```

Entity resolution failures can create terrible analysis. If two suppliers get merged incorrectly, OSIRIS may invent a fake dependency chain. Keep resolution evidence visible.

---

## 9. Supply Chain Graph Model

The supply chain graph is the core of OSIRIS supply chain intelligence.

### 9.1 Graph Example

```text
Supplier A
  -> produces Component X
  -> located in Region Y
  -> ships through Port P

Component X
  -> used in Product Z

Product Z
  -> stored at Warehouse W
  -> has 9 days inventory coverage
  -> has high customer demand

Port P
  -> has elevated dwell time
  -> affected by labor shortage

Region Y
  -> has flood risk
```

### 9.2 Intelligence Question

```text
Could Product Z face fulfillment risk?
```

### 9.3 Graph-Based Answer

```text
Possibly. Product Z depends on Component X from Supplier A. Supplier A is in Region Y, where flooding risk is increasing. Shipments from Supplier A also pass through Port P, which has elevated dwell time. Product Z has only 9 days of inventory coverage while demand is high.
```

That is supply chain intelligence.

---

## 10. Signal Types

OSIRIS should classify supply chain signals into a controlled taxonomy.

### 10.1 Disruption Signals

```text
port_delay
carrier_delay
factory_shutdown
supplier_production_reduction
material_shortage
labor_strike
customs_delay
weather_disruption
geopolitical_disruption
cyber_disruption
quality_issue
recall
regulatory_change
sanction_or_export_control
commodity_price_spike
fuel_price_spike
capacity_shortage
inventory_shortfall
demand_spike
route_closure
```

### 10.2 Dependency Signals

```text
single_source_supplier
sole_source_component
country_concentration
port_concentration
carrier_concentration
commodity_dependency
long_lead_time_dependency
fragile_subtier_dependency
critical_customer_dependency
```

### 10.3 Performance Signals

```text
late_delivery
lead_time_increase
fill_rate_decline
order_backlog_growth
inventory_coverage_decline
cost_increase
quality_defect_rate_increase
supplier_score_decline
```

### 10.4 Opportunity Signals

```text
alternative_supplier_available
route_recovery
inventory_replenishment
price_decline
lead_time_improvement
capacity_opening
nearshoring_opportunity
supplier_diversification_opportunity
```

---

## 11. Supply Chain Intelligence Assessments

An assessment should be an explainable object, not just text.

### 11.1 Assessment Types

```text
Supplier Risk Assessment
Product Fulfillment Risk Assessment
Route / Lane Risk Assessment
Port Disruption Assessment
Commodity Exposure Assessment
Inventory Risk Assessment
Supplier Concentration Assessment
Customer Impact Assessment
Production Continuity Assessment
Procurement Opportunity Assessment
Recovery / Mitigation Assessment
```

### 11.2 Required Assessment Fields

```text
title
summary
assessment_type
affected_entities
supporting_signals
key_relationships
confidence_score
risk_score
impact_score
urgency_score
alternative_explanations
recommended_next_steps
what_would_increase_confidence
what_would_decrease_confidence
source_list
created_at
```

### 11.3 Example Assessment

```text
Possible Product Z Fulfillment Risk

Assessment:
Product Z may face a moderate fulfillment risk within 10–21 days.

Why:
- Product Z depends on Component X.
- Component X is supplied by Supplier A.
- Supplier A reported reduced production.
- Shipments from Supplier A often route through Port P.
- Port P has elevated dwell time.
- Product Z inventory coverage is below 10 days.

Confidence:
Moderate

Risk:
High

Alternative explanations:
- Supplier message may only affect one product line.
- Port delay may not affect this exact shipment lane.
- Inventory report may be stale.
```

---

## 12. Confidence Scoring

Confidence is not the same as risk.

Confidence means:

```text
How sure are we that this assessment is supported by the evidence?
```

Risk means:

```text
How bad could this be if the assessment is true?
```

### 12.1 Confidence Inputs

| Factor | Meaning |
|---|---|
| Source reliability | Is the source trusted and historically accurate? |
| Source independence | Are multiple independent sources confirming the signal? |
| Data freshness | Is the data recent enough to matter? |
| Entity resolution confidence | Are entities matched correctly? |
| Relationship confidence | Are links between supplier/product/route actually known? |
| Metric quality | Are numbers precise or vague? |
| Historical pattern match | Has this pattern preceded similar disruptions before? |
| Contradictory evidence | Are there sources that weaken the claim? |

### 12.2 Example Confidence Formula

```text
confidence_score =
  (source_reliability * 0.20) +
  (source_independence * 0.15) +
  (data_freshness * 0.15) +
  (entity_resolution_confidence * 0.15) +
  (relationship_confidence * 0.15) +
  (metric_quality * 0.10) +
  (historical_pattern_match * 0.10) -
  (contradiction_penalty * 0.20)
```

### 12.3 Confidence Labels

```text
0–24   Very Low
25–44  Low
45–64  Moderate
65–84  High
85–100 Very High
```

### 12.4 Confidence Example

```json
{
  "source_reliability": 80,
  "source_independence": 65,
  "data_freshness": 90,
  "entity_resolution_confidence": 75,
  "relationship_confidence": 70,
  "metric_quality": 55,
  "historical_pattern_match": 60,
  "contradiction_penalty": 10,
  "final_confidence_score": 69,
  "confidence_label": "High"
}
```

---

## 13. Risk Scoring

Risk is about potential impact, not certainty.

### 13.1 Risk Inputs

| Factor | Meaning |
|---|---|
| Business criticality | How important is the affected product/component/customer? |
| Inventory coverage | How many days before shortage? |
| Supplier substitutability | Are alternatives available? |
| Lead time | How long would recovery or replenishment take? |
| Geographic concentration | Is the dependency concentrated in one region? |
| Route concentration | Does freight depend on one port/lane/carrier? |
| Financial exposure | How much revenue or cost is at stake? |
| Customer impact | Will customers feel it? |
| Regulatory/compliance impact | Could legal obligations be affected? |
| Recovery complexity | How hard is mitigation? |

### 13.2 Example Risk Formula

```text
risk_score =
  (business_criticality * 0.20) +
  (inventory_shortage_pressure * 0.15) +
  (supplier_concentration * 0.15) +
  (lead_time_risk * 0.10) +
  (route_concentration * 0.10) +
  (financial_exposure * 0.10) +
  (customer_impact * 0.10) +
  (recovery_complexity * 0.10)
```

### 13.3 Risk Labels

```text
0–24   Minimal
25–44  Low
45–64  Moderate
65–84  High
85–100 Critical
```

---

## 14. Urgency Scoring

Urgency answers:

```text
How soon does someone need to act?
```

### 14.1 Urgency Inputs

```text
inventory days remaining
shipment ETA slippage
customer order due dates
production schedule dependency
perishability
regulatory deadline
recovery lead time
known event window
```

### 14.2 Example

```text
A high-risk supplier issue with 90 days of inventory may not be urgent.
A moderate-risk supplier issue with 3 days of inventory is urgent.
```

Do not confuse risk with urgency. They overlap, but they are not the same animal. One is a bear; the other is the bear currently running at you.

---

## 15. Supply Chain Pattern Detection

### 15.1 Chokepoint Detection

Find where many products, suppliers, shipments, or customers depend on one node.

```text
Many products -> same component
Many components -> same supplier
Many suppliers -> same region
Many shipments -> same port
Many orders -> same warehouse
```

### 15.2 Cascading Risk Detection

Identify when one disruption can spread.

```text
Port delay -> delayed component -> production slowdown -> inventory drop -> customer backlog
```

### 15.3 Concentration Risk Detection

Identify overdependence.

```text
80% of Component X comes from Supplier A.
Supplier A is in one region.
That region has weather, geopolitical, or regulatory risk.
```

### 15.4 Lead Time Drift Detection

Track gradual increases.

```text
Average lead time:
Week 1: 12 days
Week 2: 14 days
Week 3: 17 days
Week 4: 21 days
```

Even if no single shipment looks catastrophic, the trend may be a warning.

### 15.5 Bullwhip / Demand Distortion Signal

Look for sudden mismatches between demand, orders, and inventory.

```text
customer demand rises 8%
procurement orders rise 35%
supplier lead times rise 20%
inventory falls 15%
```

This may indicate overreaction, shortage expectation, or planning distortion.

### 15.6 Supplier Stress Detection

Weak signals:

```text
late replies
missed ASN updates
invoice changes
partial shipments
quality defects
production notices
credit/payment concern
layoff/hiring changes
local disruption near facility
```

Together, these can suggest supplier stress.

---

## 16. Example: Three Benign Signals Become a Supply Chain Lead

### Signal 1

A carrier posts a routine notice about 2–3 day delays on a shipping lane.

### Signal 2

A supplier updates delivery estimates for a component used in several products.

### Signal 3

Inventory coverage for one affected finished product drops below 10 days.

### Assessment

```text
Possible Fulfillment Risk for Product Group A
```

### Explanation

Individually, each signal may be normal. Together, they form a connected dependency chain:

```text
carrier delay
  -> affects lane
  -> lane used by supplier shipments
  -> supplier provides component
  -> component used in product group
  -> product inventory is low
```

### Confidence

Moderate.

### Risk

High if the product group is high-demand or high-margin.

### What Would Increase Confidence

- Actual shipment IDs confirm the affected lane.
- Supplier confirms component-specific delay.
- Inventory report is current.
- Customer order backlog is rising.

### What Would Decrease Confidence

- Delayed carrier lane is not used by current shipments.
- Supplier delay affects a different component.
- Inventory was replenished after the report.

---

## 17. OSIRIS TypeScript Data Models

### 17.1 Source

```ts
export type SupplyChainSourceType =
  | "erp"
  | "wms"
  | "tms"
  | "procurement"
  | "supplier_portal"
  | "carrier_notice"
  | "port_notice"
  | "weather_alert"
  | "government_advisory"
  | "trade_data"
  | "commodity_price"
  | "news_rss"
  | "manual_note"
  | "cyber_alert"
  | "operations_ticket";

export interface SupplyChainSource {
  id: string;
  sourceType: SupplyChainSourceType;
  title: string;
  url?: string;
  publisher?: string;
  collectedAt: string;
  publishedAt?: string;
  reliabilityScore: number; // 0-100
  rawText?: string;
  structuredPayload?: Record<string, unknown>;
}
```

### 17.2 Entity

```ts
export type SupplyChainEntityType =
  | "supplier"
  | "manufacturer"
  | "carrier"
  | "product"
  | "component"
  | "material"
  | "commodity"
  | "facility"
  | "factory"
  | "warehouse"
  | "port"
  | "route"
  | "lane"
  | "shipment"
  | "purchase_order"
  | "customer_order"
  | "region"
  | "regulation"
  | "risk_event";

export interface SupplyChainEntity {
  id: string;
  type: SupplyChainEntityType;
  name: string;
  aliases?: string[];
  identifiers?: {
    sku?: string;
    vendorId?: string;
    hsCode?: string;
    unlocode?: string;
    trackingNumber?: string;
    purchaseOrderNumber?: string;
  };
  location?: {
    lat?: number;
    lng?: number;
    country?: string;
    region?: string;
    city?: string;
  };
  confidence: number;
  sourceIds: string[];
}
```

### 17.3 Relationship

```ts
export type SupplyChainRelationshipType =
  | "supplies"
  | "produces"
  | "used_in"
  | "ships_through"
  | "stored_at"
  | "located_in"
  | "operates_on"
  | "depends_on"
  | "affected_by"
  | "substitutable_by"
  | "owned_by"
  | "contracted_with"
  | "delivered_by"
  | "ordered_by"
  | "constrained_by";

export interface SupplyChainRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: SupplyChainRelationshipType;
  confidence: number;
  sourceIds: string[];
  firstSeenAt?: string;
  lastSeenAt?: string;
}
```

### 17.4 Signal

```ts
export type SupplyChainSignalType =
  | "port_delay"
  | "carrier_delay"
  | "supplier_delay"
  | "production_reduction"
  | "inventory_shortfall"
  | "demand_spike"
  | "commodity_price_spike"
  | "weather_disruption"
  | "labor_disruption"
  | "regulatory_change"
  | "cyber_disruption"
  | "quality_issue"
  | "route_closure"
  | "capacity_shortage"
  | "supplier_financial_stress"
  | "geopolitical_risk";

export interface SupplyChainSignal {
  id: string;
  type: SupplyChainSignalType;
  title: string;
  summary: string;
  entityIds: string[];
  sourceIds: string[];
  observedAt: string;
  timeWindow?: {
    start?: string;
    end?: string;
  };
  location?: {
    lat?: number;
    lng?: number;
    label?: string;
  };
  metrics?: Record<string, number | string>;
  severity: number; // 0-100
  confidence: number; // 0-100
}
```

### 17.5 Assessment

```ts
export type SupplyChainAssessmentType =
  | "supplier_risk"
  | "product_fulfillment_risk"
  | "route_risk"
  | "port_disruption"
  | "inventory_risk"
  | "commodity_exposure"
  | "concentration_risk"
  | "customer_impact"
  | "recovery_opportunity";

export interface SupplyChainAssessment {
  id: string;
  type: SupplyChainAssessmentType;
  title: string;
  summary: string;
  affectedEntityIds: string[];
  supportingSignalIds: string[];
  keyRelationshipIds: string[];
  confidenceScore: number;
  riskScore: number;
  urgencyScore: number;
  impactScore: number;
  alternativeExplanations: string[];
  recommendedActions: string[];
  confidenceDrivers: string[];
  uncertaintyDrivers: string[];
  createdAt: string;
  sourceIds: string[];
}
```

---

## 18. Suggested Local-First OSIRIS Architecture

### 18.1 Pipeline

```text
Data Sources
  -> Source Collector
  -> Text/Structured Parser
  -> Entity Extractor
  -> Metric Extractor
  -> Normalizer
  -> Entity Resolver
  -> Relationship Builder
  -> Signal Classifier
  -> Graph Store
  -> Pattern Detector
  -> Assessment Generator
  -> Dossier UI
```

### 18.2 Local-First Storage Tables

```text
sources
entities
relationships
signals
metrics
assessments
assessment_evidence
entity_aliases
source_reliability_profiles
watchlists
manual_notes
```

### 18.3 Useful UI Pages

```text
Supply Chain Overview
Supplier Dossiers
Product Dependency Graph
Route / Port Risk Map
Inventory Risk Feed
Disruption Timeline
Commodity Exposure Dashboard
Assessment Detail Page
Alternative Supplier Explorer
Source Evidence Viewer
```

### 18.4 Minimal MVP

Start small:

```text
1. Add source items manually or from RSS/API.
2. Extract supplier/product/location/date/risk terms.
3. Store entities and signals.
4. Cluster signals by entity + time window.
5. Generate an assessment card with confidence/risk/urgency.
6. Show all source evidence.
```

Do not start with a galaxy-brain global supply chain simulator. That is how projects become fancy graveyards.

---

## 19. AI Chatbot Prompt Pretext

Use the following giant prompt before sending structured data to ChatGPT or another AI model.

```text
You are an intelligence analyst assisting with supply chain intelligence analysis for a local-first project called OSIRIS 2.0.

Your task is to analyze the structured supply chain data provided after this prompt and produce explainable, confidence-rated supply chain intelligence assessments.

You must follow these rules:

1. Do not assume facts not present in the data.
2. Do not claim certainty unless the evidence strongly supports it.
3. Separate facts, inferences, assumptions, and unknowns.
4. Treat correlation as a lead, not proof.
5. Identify alternative explanations for every major assessment.
6. Provide confidence scores and explain how you reached them.
7. Provide risk, urgency, and impact scores separately from confidence.
8. Identify which entities, relationships, signals, and sources support each assessment.
9. Explain what additional evidence would increase or decrease confidence.
10. Prefer cautious language such as "possible," "likely," "indicates," "suggests," or "may" unless the data is definitive.
11. Do not recommend illegal, invasive, or unethical collection methods.
12. Keep the analysis defensive, operational, business-focused, and evidence-based.
13. Do not create accusations against people, suppliers, companies, or regions without strong evidence.
14. If the data is too weak, say so plainly.
15. If multiple explanations fit the same data, rank them.

Analyze the data using this process:

A. Identify key supply chain entities:
- suppliers
- products
- components
- materials
- commodities
- facilities
- factories
- warehouses
- ports
- carriers
- routes
- shipments
- purchase orders
- customer orders
- regions
- regulations
- disruption events

B. Identify key signal types:
- supplier delay
- production reduction
- port delay
- carrier delay
- route closure
- inventory shortfall
- demand spike
- commodity price spike
- weather disruption
- labor disruption
- regulatory change
- cyber disruption
- quality issue
- capacity shortage
- geopolitical risk
- supplier financial stress

C. Build relationship chains:
For each possible assessment, explain the chain of dependency, such as:
Supplier -> Component -> Product -> Inventory -> Customer Order
Port -> Route -> Shipment -> Warehouse -> Product
Weather Event -> Region -> Facility -> Supplier -> Component
Commodity Price -> Material -> Component -> Product Cost

D. Detect possible supply chain intelligence findings:
Look for:
- emerging disruption
- product fulfillment risk
- supplier concentration risk
- route or port chokepoint risk
- commodity exposure
- cascading dependency risk
- inventory shortage risk
- customer impact risk
- supplier stress
- demand/supply mismatch
- mitigation or recovery opportunity

E. Score each finding:
For each finding, provide:
- confidence_score from 0 to 100
- confidence_label: Very Low, Low, Moderate, High, Very High
- risk_score from 0 to 100
- risk_label: Minimal, Low, Moderate, High, Critical
- urgency_score from 0 to 100
- urgency_label: Low, Medium, High, Immediate
- impact_score from 0 to 100
- impact_label: Minimal, Low, Moderate, High, Severe

F. Explain scoring:
For each score, explain the main drivers.

Confidence should be based on:
- source reliability
- source independence
- data freshness
- entity resolution confidence
- relationship confidence
- metric quality
- historical pattern match
- contradictory evidence

Risk should be based on:
- business criticality
- inventory coverage
- supplier substitutability
- lead time
- route concentration
- geographic concentration
- financial exposure
- customer impact
- recovery complexity

Urgency should be based on:
- time until impact
- inventory days remaining
- shipment delay window
- customer order due dates
- recovery lead time
- event time window

Impact should be based on:
- affected products
- affected customers
- revenue or cost exposure
- production dependency
- compliance risk
- operational disruption scale

G. Output format:
Return your answer in the following structure:

# Supply Chain Intelligence Assessment

## Executive Summary
Briefly summarize the most important findings.

## Top Findings
For each finding, include:

### Finding [number]: [title]

**Assessment Type:**  
**Summary:**  
**Confidence Score:**  
**Risk Score:**  
**Urgency Score:**  
**Impact Score:**  

**Why This Surfaced:**
- Explain the connected signals.

**Evidence Chain:**
Use a relationship chain like:
Supplier A -> Component X -> Product Z -> Warehouse W -> Customer Orders

**Supporting Signals:**
- Signal ID / title / short explanation

**Supporting Sources:**
- Source ID / source title / reliability

**Alternative Explanations:**
- Explanation 1
- Explanation 2
- Explanation 3

**What Would Increase Confidence:**
- Evidence needed

**What Would Decrease Confidence:**
- Evidence that would weaken the assessment

**Recommended Next Actions:**
- Defensive, legal, operational, or business actions only

## Entity Relationship Summary
Summarize important suppliers, products, components, locations, routes, and dependencies.

## Possible Cascading Effects
Explain how one disruption could spread through the supply chain.

## Weak Signals Worth Monitoring
List weak signals that are not strong enough for a high-confidence finding but should be watched.

## Data Gaps
List missing data that limits confidence.

## Analyst Notes
Give cautious interpretation and warnings about uncertainty.

Now analyze the following structured supply chain data.
```

---

## 20. Example Data Payload for ChatGPT

```json
{
  "analysis_context": {
    "organization": "Example Company",
    "analysis_window": "2026-06-01 to 2026-06-07",
    "goal": "Identify possible supply chain disruptions, fulfillment risks, and supplier dependencies."
  },
  "sources": [
    {
      "id": "src-001",
      "source_type": "carrier_notice",
      "title": "Carrier delay notice for West Coast lane",
      "published_at": "2026-06-03T14:00:00Z",
      "reliability_score": 82,
      "summary": "Carrier reports 2-4 day delays for freight moving through Lane-WC-17."
    },
    {
      "id": "src-002",
      "source_type": "supplier_portal",
      "title": "Supplier A production update",
      "published_at": "2026-06-04T09:30:00Z",
      "reliability_score": 88,
      "summary": "Supplier A reports reduced output for Component X due to upstream material constraints."
    },
    {
      "id": "src-003",
      "source_type": "inventory_report",
      "title": "Warehouse inventory coverage report",
      "published_at": "2026-06-05T08:00:00Z",
      "reliability_score": 91,
      "summary": "Product Z has 8 days of inventory coverage remaining at Warehouse W."
    }
  ],
  "entities": [
    {
      "id": "ent-supplier-a",
      "type": "supplier",
      "name": "Supplier A",
      "confidence": 95,
      "source_ids": ["src-002"]
    },
    {
      "id": "ent-component-x",
      "type": "component",
      "name": "Component X",
      "confidence": 92,
      "source_ids": ["src-002"]
    },
    {
      "id": "ent-product-z",
      "type": "product",
      "name": "Product Z",
      "confidence": 94,
      "source_ids": ["src-003"]
    },
    {
      "id": "ent-warehouse-w",
      "type": "warehouse",
      "name": "Warehouse W",
      "confidence": 90,
      "source_ids": ["src-003"]
    },
    {
      "id": "ent-lane-wc-17",
      "type": "lane",
      "name": "Lane-WC-17",
      "confidence": 86,
      "source_ids": ["src-001"]
    }
  ],
  "relationships": [
    {
      "id": "rel-001",
      "from_entity_id": "ent-supplier-a",
      "to_entity_id": "ent-component-x",
      "type": "produces",
      "confidence": 88,
      "source_ids": ["src-002"]
    },
    {
      "id": "rel-002",
      "from_entity_id": "ent-component-x",
      "to_entity_id": "ent-product-z",
      "type": "used_in",
      "confidence": 76,
      "source_ids": ["internal-bom"]
    },
    {
      "id": "rel-003",
      "from_entity_id": "ent-product-z",
      "to_entity_id": "ent-warehouse-w",
      "type": "stored_at",
      "confidence": 91,
      "source_ids": ["src-003"]
    },
    {
      "id": "rel-004",
      "from_entity_id": "ent-supplier-a",
      "to_entity_id": "ent-lane-wc-17",
      "type": "ships_through",
      "confidence": 62,
      "source_ids": ["historical-shipping-data"]
    }
  ],
  "signals": [
    {
      "id": "sig-001",
      "type": "carrier_delay",
      "title": "2-4 day delay on Lane-WC-17",
      "entity_ids": ["ent-lane-wc-17"],
      "source_ids": ["src-001"],
      "severity": 58,
      "confidence": 82,
      "metrics": {
        "delay_days_min": 2,
        "delay_days_max": 4
      }
    },
    {
      "id": "sig-002",
      "type": "production_reduction",
      "title": "Supplier A reduced Component X output",
      "entity_ids": ["ent-supplier-a", "ent-component-x"],
      "source_ids": ["src-002"],
      "severity": 72,
      "confidence": 88
    },
    {
      "id": "sig-003",
      "type": "inventory_shortfall",
      "title": "Product Z inventory coverage below 10 days",
      "entity_ids": ["ent-product-z", "ent-warehouse-w"],
      "source_ids": ["src-003"],
      "severity": 79,
      "confidence": 91,
      "metrics": {
        "inventory_coverage_days": 8
      }
    }
  ]
}
```

---

## 21. Example AI Output

```text
# Supply Chain Intelligence Assessment

## Executive Summary
Product Z may face a moderate-to-high fulfillment risk within the next 1–3 weeks. The strongest evidence is the connection between Supplier A's reduced Component X output, Product Z's dependency on Component X, and low inventory coverage at Warehouse W. A carrier delay on Lane-WC-17 may add additional pressure, but the lane relationship has only moderate confidence.

## Top Findings

### Finding 1: Possible Product Z Fulfillment Risk

Assessment Type: Product Fulfillment Risk
Summary: Product Z may face a fulfillment risk if Supplier A's Component X production reduction continues and current inventory coverage is not replenished.
Confidence Score: 72 / High
Risk Score: 78 / High
Urgency Score: 82 / High
Impact Score: 70 / High

Why This Surfaced:
- Supplier A reported reduced output for Component X.
- Component X is used in Product Z.
- Product Z has only 8 days of inventory coverage.
- Lane-WC-17 delays may affect Supplier A shipments, but that relationship is weaker.

Evidence Chain:
Supplier A -> Component X -> Product Z -> Warehouse W -> 8 days inventory coverage

Supporting Signals:
- sig-002: Supplier A reduced Component X output.
- sig-003: Product Z inventory coverage below 10 days.
- sig-001: Lane-WC-17 carrier delay may worsen replenishment.

Alternative Explanations:
- Supplier A's reduced output may affect only some purchase orders.
- Product Z may have alternative Component X inventory not reflected in Warehouse W.
- Lane-WC-17 may not be used for current inbound shipments.

What Would Increase Confidence:
- Active purchase order ETAs for Component X.
- Confirmation that current Product Z production depends on Supplier A.
- Updated inventory after the latest replenishment cycle.
- Current shipment tracking through Lane-WC-17.

What Would Decrease Confidence:
- Confirmation of alternate supplier capacity.
- Inventory replenishment already in transit.
- Supplier reduction resolved.
- Product Z demand falling below forecast.

Recommended Next Actions:
- Check open purchase orders for Component X.
- Confirm Supplier A production recovery estimate.
- Review Product Z demand and customer backlog.
- Check whether alternative suppliers or substitute components are approved.
- Monitor Lane-WC-17 shipment status for active loads.
```

---

## 22. Safety, Ethics, and Legal Boundaries

Supply chain intelligence can touch sensitive supplier, employee, customer, and operational data. OSIRIS should be designed with boundaries.

### 22.1 Do

```text
Use authorized data.
Track source attribution.
Show confidence and uncertainty.
Separate evidence from inference.
Protect supplier and customer data.
Use aggregation where possible.
Avoid unsupported accusations.
Keep human review in the loop.
```

### 22.2 Do Not

```text
Scrape private systems without permission.
Dox employees or supplier staff.
Use personal tracking to infer labor activity.
Treat rumors as facts.
Create automated blacklists without review.
Hide source uncertainty.
Make defamatory claims about suppliers.
Use supply chain intelligence as a cover for invasive surveillance.
```

### 22.3 Design Rule

Every assessment should answer:

```text
What evidence supports this?
How confident are we?
What else could explain it?
What would prove us wrong?
Who is affected?
What action is reasonable and legal?
```

---

## 23. Practical MVP Feature List for OSIRIS

### Phase 1 — Manual Source Capture

```text
Add source item form.
Add source reliability score.
Add tags for supplier/product/location/risk type.
```

### Phase 2 — Entity Extraction

```text
Extract suppliers, products, components, ports, carriers, routes, dates, and metrics.
Allow manual correction.
Store aliases.
```

### Phase 3 — Relationship Graph

```text
Create relationship records.
Show dependency chains.
Add product/supplier/route dossier pages.
```

### Phase 4 — Signal Feed

```text
Classify signals.
Group signals by entity and time window.
Show weak signal clusters.
```

### Phase 5 — Assessment Generator

```text
Generate confidence-rated findings.
Show risk, urgency, and impact separately.
Show source evidence and alternative explanations.
```

### Phase 6 — Watchlists

```text
Watch suppliers.
Watch ports/routes.
Watch products/components.
Watch commodities.
Watch regions.
```

### Phase 7 — AI-Assisted Analysis

```text
Send structured data to AI only when needed.
Require AI output to cite source IDs and signal IDs.
Never let AI modify source records without review.
```

---

## 24. Recommended Source References

- Council of Supply Chain Management Professionals — supply chain management definition and glossary: https://cscmp.org/CSCMP/CSCMP/Educate/SCM_Definitions_and_Glossary_of_Terms.aspx
- World Bank Logistics Performance Index: https://lpi.worldbank.org/en/home
- New York Fed Global Supply Chain Pressure Index: https://www.newyorkfed.org/research/policy/gscpi
- UN Comtrade: https://comtrade.un.org/
- NOAA AccessAIS: https://coast.noaa.gov/digitalcoast/tools/ais.html
- CISA ICT Supply Chain Risk Management: https://www.cisa.gov/information-and-communications-technology-supply-chain-risk-management
- CISA ICT Supply Chain Resource Library: https://www.cisa.gov/ict-supply-chain-resource-library
- NIST Cybersecurity Supply Chain Risk Management: https://csrc.nist.gov/projects/cyber-supply-chain-risk-management
- NIST SP 1305 — CSF 2.0 Quick-Start Guide for Cybersecurity Supply Chain Risk Management: https://csrc.nist.gov/pubs/sp/1305/final
- DHS Supply Chain Resilience Center: https://www.dhs.gov/scrc

---

## 25. Final Framing for OSIRIS

Supply chain intelligence in OSIRIS should be framed as:

```text
A local-first intelligence layer that connects suppliers, products, components, routes, facilities, shipments, inventory, sources, and risk signals into explainable assessments about disruption, dependency, exposure, urgency, and mitigation.
```

The best version is not a magic prediction engine. It is a structured reasoning engine with receipts.

If OSIRIS can show:

```text
Here is the possible issue.
Here are the connected signals.
Here are the affected entities.
Here is the evidence chain.
Here is the confidence score.
Here is the risk score.
Here are alternative explanations.
Here is what to check next.
```

Then it becomes genuinely useful.

That is the difference between a dashboard and an intelligence system.
