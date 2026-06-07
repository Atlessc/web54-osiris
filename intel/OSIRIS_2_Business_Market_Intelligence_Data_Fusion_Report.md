# OSIRIS 2.0 — Business / Market Intelligence Data Fusion Report

**Purpose:**  
This report explains how OSIRIS 2.0 can collect, structure, connect, and analyze business and market data to generate explainable intelligence assessments about companies, markets, competitors, products, customers, economic conditions, risks, and opportunities.

**Scope:**  
This report is focused on **business intelligence** and **market intelligence**, including competitive intelligence, demand intelligence, pricing intelligence, hiring/workforce signals, financial signals, product signals, macroeconomic indicators, supply chain indicators, customer sentiment, and strategic opportunity/risk detection.

**Important framing:**  
Business/market intelligence should not be treated as prophecy. The system should produce **confidence-rated assessments**, not absolute claims. The correct output is:

> “Based on these sources and signals, this may indicate X. Here is the evidence, confidence level, alternative explanations, and what data would increase or lower confidence.”

---

## 1. Business Intelligence vs Market Intelligence vs Competitive Intelligence

These terms overlap, but they are not the same.

```text
Business Intelligence:
Internal operational and performance data.
Examples: revenue, sales funnel, support tickets, customer churn, inventory, website analytics.

Market Intelligence:
External market conditions and demand signals.
Examples: customer demand, economic indicators, search trends, industry news, pricing trends.

Competitive Intelligence:
External competitor behavior and strategy.
Examples: competitor launches, hiring, pricing, partnerships, patents, funding, messaging, product changes.
```

For OSIRIS, the best framing is:

```text
Business / Market Intelligence =
Internal + external data fusion that explains business risk, opportunity, market movement, and competitive positioning.
```

---

## 2. What Business / Market Intelligence Tries To Answer

A useful system should answer questions like:

```text
What changed?
Why might it matter?
Who is affected?
Which companies or markets are connected?
Is the signal normal or abnormal?
Is this a risk, opportunity, or neutral development?
How confident are we?
What evidence supports it?
What evidence contradicts it?
What should be monitored next?
```

Examples:

```text
- Is demand rising for a product category?
- Is a competitor preparing to launch a new product?
- Is a company showing signs of financial stress?
- Is a market becoming more saturated?
- Are pricing changes spreading across competitors?
- Are customers shifting language, complaints, or preferences?
- Are suppliers or logistics issues creating market pressure?
- Are hiring patterns revealing strategic direction?
- Are new regulations changing the business landscape?
```

---

## 3. Common Business / Market Intelligence Sources

### 3.1 Internal Sources

```text
- Sales records
- CRM data
- Customer support tickets
- Product usage analytics
- Website analytics
- Conversion funnels
- Inventory levels
- Vendor data
- Procurement data
- Billing/payment data
- Customer churn records
- Internal project/task data
- Support chat transcripts
- Survey responses
```

### 3.2 External Sources

```text
- Company websites
- Competitor websites
- Pricing pages
- Product pages
- Press releases
- SEC filings
- Earnings reports
- Investor presentations
- Job postings
- Patent filings
- Trademark filings
- App store reviews
- Social media posts
- News articles
- RSS feeds
- Industry reports
- Public economic data
- Government datasets
- Google Trends / search interest
- Business formation statistics
- Import/export data
- Real estate / construction permits
- Marketplace listings
- Product reviews
- Public customer forums
```

### 3.3 Economic and Market Data

```text
- Consumer confidence
- Business confidence
- Inflation data
- Producer price data
- Employment data
- Wage data
- Interest rates
- Retail sales
- New business formation
- Housing starts
- Manufacturing activity
- Commodity prices
- Currency exchange rates
```

---

## 4. The Core Pipeline

```text
Raw Sources
  ↓
Source Collection
  ↓
Data Cleaning / Normalization
  ↓
Entity Extraction
  ↓
Metric Extraction
  ↓
Signal Extraction
  ↓
Entity Resolution
  ↓
Relationship Mapping
  ↓
Trend / Anomaly Detection
  ↓
Hypothesis Generation
  ↓
Confidence + Risk Scoring
  ↓
Business Intelligence Report
```

---

## 5. Source Collection

The system starts by collecting source items.

A source item can be:

```text
- A webpage
- A news article
- A company filing
- A pricing page snapshot
- A job posting
- A review
- A social media post
- A spreadsheet row
- A support ticket
- A sales record
- A public economic indicator
```

Minimum source structure:

```ts
export interface BusinessSource {
  id: string;
  sourceType:
    | "company_website"
    | "pricing_page"
    | "press_release"
    | "sec_filing"
    | "earnings_call"
    | "job_posting"
    | "news_article"
    | "rss_item"
    | "review"
    | "social_post"
    | "economic_indicator"
    | "internal_sales"
    | "internal_support"
    | "internal_analytics"
    | "manual_note";

  title: string;
  url?: string;
  publisher?: string;
  author?: string;
  capturedAt: string;
  publishedAt?: string;

  rawText?: string;
  summary?: string;

  reliabilityScore: number; // 0-100
  freshnessScore: number; // 0-100
  accessLevel: "public" | "internal" | "restricted";
}
```

---

## 6. Data Cleaning and Normalization

Raw business data is messy.

The system needs to normalize:

```text
- Company names
- Product names
- Prices
- Dates
- Locations
- Currencies
- Job titles
- Units of measurement
- Industry labels
- Customer segments
- Revenue periods
- Fiscal quarters
- Product categories
- Source timestamps
```

Examples:

```text
"Microsoft Corp."
"Microsoft Corporation"
"MSFT"
"microsoft.com"

May all refer to the same entity, depending on context.
```

Normalization prevents the system from treating the same company, product, or market as separate things.

---

## 7. Business Entity Extraction

Business intelligence depends heavily on extracting entities.

Core entity types:

```text
Company
Product
Market
Industry
Customer Segment
Competitor
Supplier
Partner
Executive
Location
Technology
Regulation
Economic Indicator
Price Point
Job Role
Revenue Metric
Risk Factor
Opportunity
```

TypeScript model:

```ts
export interface BusinessEntity {
  id: string;
  entityType:
    | "company"
    | "product"
    | "market"
    | "industry"
    | "customer_segment"
    | "competitor"
    | "supplier"
    | "partner"
    | "executive"
    | "location"
    | "technology"
    | "regulation"
    | "economic_indicator"
    | "price_point"
    | "job_role"
    | "financial_metric"
    | "risk_factor"
    | "opportunity";

  name: string;
  aliases: string[];
  description?: string;

  sourceIds: string[];
  confidence: number; // 0-100

  firstSeenAt?: string;
  lastSeenAt?: string;

  metadata?: Record<string, unknown>;
}
```

---

## 8. Metric Extraction

Business/market intelligence is partly qualitative, but metrics matter.

Extractable metrics include:

```text
- Price
- Discount
- Revenue
- Profit
- Margin
- Customer count
- Review rating
- Review volume
- Search interest
- Job posting count
- Hiring growth
- Layoff count
- Funding amount
- Market share
- Website traffic estimate
- Product inventory
- Delivery delay
- Inflation rate
- Business formation count
- Consumer confidence
- Business confidence
```

TypeScript model:

```ts
export interface BusinessMetric {
  id: string;
  metricType:
    | "price"
    | "discount"
    | "revenue"
    | "profit"
    | "margin"
    | "customer_count"
    | "review_rating"
    | "review_volume"
    | "search_interest"
    | "job_posting_count"
    | "hiring_growth"
    | "layoff_count"
    | "funding_amount"
    | "market_share"
    | "traffic_estimate"
    | "inventory_level"
    | "delivery_delay"
    | "inflation_rate"
    | "business_formation_count"
    | "consumer_confidence"
    | "business_confidence";

  entityId?: string;
  sourceId: string;

  value: number;
  unit?: string;
  currency?: string;

  periodStart?: string;
  periodEnd?: string;
  capturedAt: string;

  confidence: number; // 0-100
}
```

---

## 9. Signal Extraction

A **signal** is a potentially meaningful observation.

Examples:

```text
- Competitor increased prices by 12%
- Company posted 18 new AI engineering jobs
- Customer reviews mention “battery drain” 4x more than baseline
- SEC filing risk section added new language about supplier concentration
- Search interest for “budget meal prep app” rose 60% in a region
- Business formations in a category rose quarter-over-quarter
- Multiple companies launched similar pricing changes in the same week
```

TypeScript model:

```ts
export interface BusinessSignal {
  id: string;

  signalType:
    | "pricing_change"
    | "demand_change"
    | "competitor_launch"
    | "hiring_signal"
    | "financial_stress"
    | "customer_sentiment_shift"
    | "supply_chain_pressure"
    | "regulatory_change"
    | "market_expansion"
    | "market_contraction"
    | "product_quality_issue"
    | "partnership_signal"
    | "funding_signal"
    | "macro_pressure"
    | "strategic_positioning_change";

  title: string;
  summary: string;

  entityIds: string[];
  metricIds?: string[];
  sourceIds: string[];

  observedAt: string;
  location?: string;
  market?: string;
  industry?: string;

  severity: "low" | "medium" | "high";
  direction: "positive" | "negative" | "neutral" | "mixed";

  confidence: number; // 0-100
}
```

---

## 10. Entity Resolution

Entity resolution decides whether multiple records point to the same real-world thing.

Example:

```text
"OpenAI"
"Open AI"
"OpenAI, Inc."
"openai.com"
"ChatGPT maker"

Likely entity:
Company: OpenAI
```

Business entity resolution can use:

```text
- Exact name match
- Alias table
- Website/domain match
- Stock ticker match
- Address match
- Executive name overlap
- Product portfolio overlap
- Filing identifier match
- Fuzzy string similarity
- Industry/category overlap
```

For OSIRIS, entity resolution should always include a confidence score.

```ts
export interface EntityResolutionMatch {
  id: string;
  candidateEntityId: string;
  matchedEntityId: string;

  matchReasons: string[];
  matchConfidence: number; // 0-100

  sourceIds: string[];
  reviewedByHuman: boolean;
}
```

---

## 11. Relationship Mapping

Once entities and signals exist, OSIRIS can create relationships.

Relationship examples:

```text
Company → sells → Product
Company → competes_with → Company
Company → supplies → Company
Company → partners_with → Company
Company → hiring_for → JobRole
Product → belongs_to → Market
Market → affected_by → Regulation
Market → affected_by → EconomicIndicator
CustomerSegment → complains_about → Product
Company → increased_price_for → Product
Company → disclosed_risk → RiskFactor
```

TypeScript model:

```ts
export interface BusinessRelationship {
  id: string;

  fromEntityId: string;
  toEntityId: string;

  relationshipType:
    | "sells"
    | "competes_with"
    | "supplies"
    | "partners_with"
    | "hiring_for"
    | "belongs_to_market"
    | "affected_by"
    | "complains_about"
    | "increased_price_for"
    | "decreased_price_for"
    | "disclosed_risk"
    | "launched"
    | "acquired"
    | "invested_in"
    | "expanded_into"
    | "exited_market";

  sourceIds: string[];
  confidence: number; // 0-100
  firstSeenAt?: string;
  lastSeenAt?: string;
}
```

---

## 12. Trend Detection

Trend detection compares signals over time.

Common trend types:

```text
- Rising demand
- Falling demand
- Price increases
- Price compression
- Hiring expansion
- Hiring slowdown
- Customer dissatisfaction
- New competitor activity
- Supply chain stress
- Regulatory pressure
- Market consolidation
- Product category growth
- Product category decline
```

Simple trend logic:

```text
Current period value
minus
Previous period baseline
equals
Change amount

Change amount / baseline
equals
Percent change
```

Example:

```text
Competitor AI job postings:
Previous 30 days: 8
Current 30 days: 27

Change:
+19 postings
+237.5%

Possible signal:
Competitor may be expanding AI product investment.
```

---

## 13. Anomaly Detection

An anomaly is something outside the normal baseline.

Examples:

```text
- Price changes after months of stability
- Sudden hiring spike in one function
- Sudden increase in negative reviews
- Competitor quietly removes a product page
- Unusual rise in business formations in a small category
- Sudden increase in “refund” or “cancel” support tickets
- A company adds new risk language in a filing
```

Simple anomaly model:

```ts
export interface BusinessAnomaly {
  id: string;
  entityIds: string[];
  metricIds: string[];
  sourceIds: string[];

  anomalyType:
    | "volume_spike"
    | "volume_drop"
    | "price_spike"
    | "price_drop"
    | "sentiment_shift"
    | "language_change"
    | "new_risk_disclosure"
    | "hiring_spike"
    | "demand_spike"
    | "demand_drop";

  baselineDescription: string;
  observedDescription: string;

  deviationScore: number; // 0-100
  confidence: number; // 0-100

  observedAt: string;
}
```

---

## 14. Hypothesis Generation

Signals become useful when the system forms hypotheses.

A hypothesis should be phrased carefully.

Bad:

```text
Competitor is definitely launching an AI product.
```

Better:

```text
Competitor may be preparing an AI-related product expansion based on increased AI hiring, new AI-related website copy, and a recent executive statement.
```

Hypothesis model:

```ts
export interface BusinessHypothesis {
  id: string;

  hypothesisType:
    | "market_opportunity"
    | "competitive_threat"
    | "pricing_pressure"
    | "demand_shift"
    | "financial_stress"
    | "product_launch_likely"
    | "customer_churn_risk"
    | "supply_chain_risk"
    | "regulatory_risk"
    | "strategic_expansion"
    | "market_saturation";

  title: string;
  assessment: string;

  supportingSignalIds: string[];
  contradictingSignalIds?: string[];

  affectedEntityIds: string[];
  affectedMarkets?: string[];

  confidence: number; // 0-100
  riskScore?: number; // 0-100
  opportunityScore?: number; // 0-100

  alternativeExplanations: string[];
  intelligenceGaps: string[];

  createdAt: string;
}
```

---

## 15. Confidence Scoring

Confidence answers:

```text
How likely is it that the assessment is supported by the available evidence?
```

Confidence should not be based on vibes.

Recommended confidence factors:

```text
Source reliability
+ source freshness
+ independent corroboration
+ entity match confidence
+ metric quality
+ baseline strength
+ consistency across signals
- contradiction strength
- missing critical data
- ambiguity
```

Example scoring formula:

```text
confidence =
  sourceReliability * 0.20
+ sourceFreshness * 0.10
+ corroboration * 0.20
+ entityResolution * 0.15
+ metricQuality * 0.15
+ baselineStrength * 0.10
+ signalConsistency * 0.10
- contradictionPenalty
- ambiguityPenalty
```

Confidence bands:

```text
0-24: Very Low
25-44: Low
45-64: Moderate
65-84: High
85-100: Very High
```

Important:

```text
High confidence does not mean high impact.
Low confidence does not mean low impact.
```

---

## 16. Risk Scoring

Risk answers:

```text
If the assessment is true, how much could it hurt us?
```

Risk factors:

```text
Impact
Likelihood
Time sensitivity
Exposure
Dependency
Ability to respond
Financial impact
Reputational impact
Operational impact
Strategic impact
```

Simple formula:

```text
riskScore =
  likelihood * 0.25
+ impact * 0.30
+ exposure * 0.15
+ timeSensitivity * 0.15
+ responseDifficulty * 0.15
```

Risk bands:

```text
0-24: Minimal
25-44: Low
45-64: Moderate
65-84: High
85-100: Critical
```

---

## 17. Opportunity Scoring

Opportunity answers:

```text
If this assessment is true, how useful could it be?
```

Opportunity factors:

```text
Market size
Timing advantage
Demand strength
Competitive weakness
Execution difficulty
Revenue potential
Strategic fit
Customer pain intensity
```

Simple formula:

```text
opportunityScore =
  demandStrength * 0.20
+ marketSize * 0.15
+ timingAdvantage * 0.15
+ competitiveGap * 0.15
+ strategicFit * 0.15
+ revenuePotential * 0.10
+ executionFeasibility * 0.10
```

Opportunity bands:

```text
0-24: Minimal
25-44: Low
45-64: Moderate
65-84: High
85-100: Major
```

---

## 18. Example Intelligence Assessment

### Raw Signals

```text
Signal 1:
Competitor increased pricing for its team plan from $19/user to $24/user.

Signal 2:
Customer reviews increasingly mention “too expensive” and “switching tools.”

Signal 3:
Search interest for “affordable project management software” increased in the same region.

Signal 4:
A smaller competitor launched a lower-cost plan with migration support.
```

### Possible Assessment

```text
Possible Market Intelligence Assessment:
Price sensitivity may be increasing in the project management software market.

Supporting Evidence:
- Competitor price increase created a higher market price point.
- Customer complaints about price increased after the change.
- Search interest for affordable alternatives increased.
- A smaller competitor is positioning directly around lower-cost migration.

Confidence:
Moderate

Opportunity Score:
High

Risk Score:
Moderate

Alternative Explanations:
- Seasonal budget planning may be driving searches.
- Reviews may overrepresent unhappy customers.
- Search trend may be caused by a viral post or ad campaign.
- Smaller competitor launch may have been planned before the price increase.

Recommended Monitoring:
- Track competitor pricing pages weekly.
- Track review keywords for 30 days.
- Track customer churn reasons.
- Watch whether other competitors copy the lower-cost positioning.
```

---

## 19. OSIRIS Business Intelligence Object Model

A full OSIRIS object could look like this:

```ts
export interface BusinessIntelligenceAssessment {
  id: string;

  title: string;
  summary: string;

  assessmentType:
    | "market_opportunity"
    | "competitive_threat"
    | "pricing_pressure"
    | "demand_shift"
    | "customer_sentiment_shift"
    | "financial_stress"
    | "supply_chain_risk"
    | "regulatory_risk"
    | "strategic_positioning"
    | "market_expansion"
    | "market_contraction";

  affectedEntities: BusinessEntity[];
  supportingSignals: BusinessSignal[];
  contradictingSignals?: BusinessSignal[];

  confidenceScore: number;
  confidenceLabel: "very_low" | "low" | "moderate" | "high" | "very_high";

  riskScore?: number;
  riskLabel?: "minimal" | "low" | "moderate" | "high" | "critical";

  opportunityScore?: number;
  opportunityLabel?: "minimal" | "low" | "moderate" | "high" | "major";

  explanation: string;
  reasoningSteps: string[];

  alternativeExplanations: string[];
  intelligenceGaps: string[];

  recommendedActions: string[];
  recommendedMonitoring: string[];

  sourceIds: string[];

  createdAt: string;
  updatedAt: string;
}
```

---

## 20. Intelligence Report Output Format

Each OSIRIS report should include:

```text
1. Title
2. Executive Summary
3. Assessment Type
4. Confidence Score
5. Risk Score and/or Opportunity Score
6. Key Supporting Signals
7. Contradicting Signals
8. Entities Involved
9. Timeline
10. Explanation of Reasoning
11. Alternative Explanations
12. Intelligence Gaps
13. Recommended Monitoring
14. Recommended Actions
15. Sources
```

---

## 21. Local-First Implementation Strategy

For OSIRIS, a local-first system should avoid expensive always-on AI calls.

Recommended approach:

```text
Use code first.
Use AI only after structured data is ready.
```

### 21.1 Cheap First-Pass Processing

```text
- RSS collection
- HTML parsing
- Keyword extraction
- Named entity extraction
- Fuzzy matching
- TF-IDF word clouds
- Date extraction
- Source deduplication
- Price extraction
- Job count tracking
- Review keyword counts
- Basic trend calculations
- Baseline comparisons
```

### 21.2 When To Use AI

Use AI for:

```text
- Explaining why signals may connect
- Generating alternative explanations
- Turning structured signals into readable reports
- Summarizing large source groups
- Extracting uncertain entities from messy text
- Assigning human-readable confidence reasoning
```

Do not use AI for:

```text
- Raw scraping
- Every source item
- High-volume ingestion
- Simple keyword counts
- Simple metric calculations
- Anything requiring deterministic repeatability
```

---

## 22. AI Chatbot Prompt Pretext

Use the following giant prompt before sending structured business/market data to ChatGPT or another LLM.

```markdown
# Role

You are an analytical business and market intelligence assistant for OSIRIS 2.0.

Your job is to analyze structured business, market, competitor, customer, economic, and operational data. You must identify possible risks, opportunities, market shifts, competitor activity, demand changes, pricing pressure, customer sentiment changes, financial stress indicators, supply chain concerns, and strategic signals.

You must not make unsupported claims. You must not treat correlation as causation. You must explain your reasoning clearly and identify uncertainty.

# Core Rules

1. Use only the data provided in the payload unless explicitly told otherwise.
2. Do not invent facts, sources, companies, metrics, or events.
3. Separate facts from analysis.
4. Separate confidence from impact.
5. Always include alternative explanations.
6. Always include intelligence gaps.
7. Always include what would increase or decrease confidence.
8. Do not claim that something is definitely happening unless the data directly proves it.
9. Use cautious language such as:
   - may indicate
   - could suggest
   - is consistent with
   - appears to
   - possible
   - likely only if strongly supported
10. Treat weak, single-source, stale, or ambiguous data as low confidence.
11. Treat multi-source, recent, independently corroborated data as higher confidence.
12. Penalize confidence when data is contradictory, stale, biased, or missing context.
13. Do not provide investment advice. You may provide business intelligence analysis, but not instructions to buy, sell, or trade securities.
14. Avoid personal data analysis unless the data is authorized and relevant.
15. Do not recommend unethical competitive intelligence tactics.

# Your Analysis Goals

Given the data payload, identify:

- Possible market opportunities
- Possible competitive threats
- Possible pricing pressure
- Possible demand shifts
- Possible customer sentiment changes
- Possible financial stress indicators
- Possible supply chain risks
- Possible regulatory risks
- Possible strategic positioning changes
- Possible market expansion or contraction
- Possible product quality issues
- Possible hiring/workforce signals
- Possible partnership, acquisition, or funding signals

# Required Reasoning Process

For each possible assessment:

1. Identify the connected signals.
2. Explain why those signals may be related.
3. Identify the entities involved.
4. Identify the timeline.
5. Compare against any baseline provided.
6. Identify supporting evidence.
7. Identify contradicting evidence.
8. Generate alternative explanations.
9. Assign a confidence score from 0-100.
10. Assign a confidence label:
   - 0-24: Very Low
   - 25-44: Low
   - 45-64: Moderate
   - 65-84: High
   - 85-100: Very High
11. Assign risk score if the assessment represents a downside risk.
12. Assign opportunity score if the assessment represents a possible upside.
13. Explain how you calculated or reasoned about the score.
14. List intelligence gaps.
15. Recommend what should be monitored next.
16. Recommend safe, ethical, business-appropriate actions.

# Confidence Scoring Guidance

Use this general weighting:

- Source reliability: 20%
- Source freshness: 10%
- Independent corroboration: 20%
- Entity resolution confidence: 15%
- Metric quality: 15%
- Baseline strength: 10%
- Signal consistency: 10%

Subtract confidence for:

- Contradictory signals
- Single-source claims
- Stale data
- Unclear entity matches
- Missing baseline
- Overly broad or vague source language
- Possible marketing exaggeration
- Review/sample bias

# Risk Scoring Guidance

Risk score should estimate potential downside if the assessment is true.

Use these factors:

- Likelihood
- Business impact
- Exposure
- Time sensitivity
- Response difficulty
- Financial impact
- Operational impact
- Reputational impact
- Strategic impact

Risk labels:

- 0-24: Minimal
- 25-44: Low
- 45-64: Moderate
- 65-84: High
- 85-100: Critical

# Opportunity Scoring Guidance

Opportunity score should estimate potential upside if the assessment is true.

Use these factors:

- Demand strength
- Market size
- Timing advantage
- Competitive gap
- Strategic fit
- Revenue potential
- Execution feasibility
- Customer pain intensity

Opportunity labels:

- 0-24: Minimal
- 25-44: Low
- 45-64: Moderate
- 65-84: High
- 85-100: Major

# Required Output Format

Return your answer in this exact structure:

## Executive Summary

Briefly summarize the most important possible business/market intelligence findings.

## Top Assessments

For each assessment:

### Assessment Title

**Assessment Type:**  
market opportunity / competitive threat / pricing pressure / demand shift / customer sentiment shift / financial stress / supply chain risk / regulatory risk / strategic positioning / market expansion / market contraction / other

**Summary:**  
Explain the possible finding in plain language.

**Confidence Score:**  
0-100

**Confidence Label:**  
Very Low / Low / Moderate / High / Very High

**Risk Score:**  
0-100 or N/A

**Risk Label:**  
Minimal / Low / Moderate / High / Critical / N/A

**Opportunity Score:**  
0-100 or N/A

**Opportunity Label:**  
Minimal / Low / Moderate / High / Major / N/A

**Connected Signals:**  
List the signals that support this assessment.

**Entities Involved:**  
List companies, products, markets, customer segments, indicators, or other entities.

**Timeline:**  
Explain the order and timing of relevant signals.

**Reasoning:**  
Explain step-by-step how the data supports the assessment.

**Alternative Explanations:**  
List plausible alternative explanations.

**Contradicting Evidence:**  
List any evidence that weakens or contradicts the assessment.

**Intelligence Gaps:**  
List missing data that prevents higher confidence.

**What Would Increase Confidence:**  
List specific data that would strengthen the assessment.

**What Would Decrease Confidence:**  
List specific data that would weaken the assessment.

**Recommended Monitoring:**  
List what should be watched next.

**Recommended Actions:**  
List safe, ethical, business-appropriate next steps.

**Sources Used:**  
List source IDs and titles.

## Cross-Entity Patterns

Identify patterns across multiple companies, products, markets, regions, or customer segments.

## Weak Signals Worth Watching

List low-confidence signals that may become important later.

## Data Quality Notes

Explain source reliability, missing data, stale data, bias, or ambiguity issues.

## Final Notes

Summarize the most important takeaways and caution against overclaiming.
```

---

## 23. Example Data Payload For AI Analysis

```json
{
  "analysis_context": {
    "project": "OSIRIS 2.0",
    "analysis_type": "business_market_intelligence",
    "generated_at": "2026-06-06T12:00:00-07:00",
    "analyst_goal": "Identify possible market opportunities, competitive threats, pricing pressure, and demand shifts."
  },
  "sources": [
    {
      "id": "src_001",
      "sourceType": "pricing_page",
      "title": "Competitor A Pricing Page Snapshot",
      "url": "https://example.com/pricing",
      "capturedAt": "2026-06-01T09:00:00-07:00",
      "summary": "Competitor A increased team plan pricing from $19/user to $24/user.",
      "reliabilityScore": 85,
      "freshnessScore": 95
    },
    {
      "id": "src_002",
      "sourceType": "review",
      "title": "App Store Reviews - Competitor A",
      "capturedAt": "2026-06-03T10:00:00-07:00",
      "summary": "Recent reviews increasingly mention price, expensive, and switching.",
      "reliabilityScore": 65,
      "freshnessScore": 90
    },
    {
      "id": "src_003",
      "sourceType": "search_interest",
      "title": "Search Interest Snapshot",
      "capturedAt": "2026-06-04T08:00:00-07:00",
      "summary": "Searches for affordable project management software increased 42% over baseline.",
      "reliabilityScore": 60,
      "freshnessScore": 90
    },
    {
      "id": "src_004",
      "sourceType": "competitor_website",
      "title": "Competitor B New Migration Offer",
      "capturedAt": "2026-06-05T11:00:00-07:00",
      "summary": "Competitor B launched a low-cost plan with free migration support.",
      "reliabilityScore": 80,
      "freshnessScore": 95
    }
  ],
  "entities": [
    {
      "id": "ent_001",
      "entityType": "company",
      "name": "Competitor A",
      "aliases": ["Comp A"],
      "sourceIds": ["src_001", "src_002"],
      "confidence": 90
    },
    {
      "id": "ent_002",
      "entityType": "company",
      "name": "Competitor B",
      "aliases": ["Comp B"],
      "sourceIds": ["src_004"],
      "confidence": 90
    },
    {
      "id": "ent_003",
      "entityType": "market",
      "name": "Project Management Software",
      "aliases": ["PM software"],
      "sourceIds": ["src_001", "src_003", "src_004"],
      "confidence": 85
    },
    {
      "id": "ent_004",
      "entityType": "customer_segment",
      "name": "Small Teams",
      "aliases": ["SMB teams", "small businesses"],
      "sourceIds": ["src_002", "src_003", "src_004"],
      "confidence": 70
    }
  ],
  "metrics": [
    {
      "id": "met_001",
      "metricType": "price",
      "entityId": "ent_001",
      "sourceId": "src_001",
      "value": 24,
      "currency": "USD",
      "unit": "per user per month",
      "capturedAt": "2026-06-01T09:00:00-07:00",
      "confidence": 90
    },
    {
      "id": "met_002",
      "metricType": "search_interest",
      "entityId": "ent_003",
      "sourceId": "src_003",
      "value": 42,
      "unit": "percent above baseline",
      "capturedAt": "2026-06-04T08:00:00-07:00",
      "confidence": 70
    }
  ],
  "signals": [
    {
      "id": "sig_001",
      "signalType": "pricing_change",
      "title": "Competitor A increased team pricing",
      "summary": "Competitor A increased team pricing from $19/user to $24/user.",
      "entityIds": ["ent_001", "ent_003"],
      "metricIds": ["met_001"],
      "sourceIds": ["src_001"],
      "observedAt": "2026-06-01T09:00:00-07:00",
      "severity": "medium",
      "direction": "negative",
      "confidence": 85
    },
    {
      "id": "sig_002",
      "signalType": "customer_sentiment_shift",
      "title": "Reviews increasingly mention price concerns",
      "summary": "Recent reviews for Competitor A increasingly mention price, expensive, and switching.",
      "entityIds": ["ent_001", "ent_004"],
      "sourceIds": ["src_002"],
      "observedAt": "2026-06-03T10:00:00-07:00",
      "severity": "medium",
      "direction": "negative",
      "confidence": 65
    },
    {
      "id": "sig_003",
      "signalType": "demand_change",
      "title": "Search interest increased for affordable alternatives",
      "summary": "Search interest for affordable project management software increased 42% over baseline.",
      "entityIds": ["ent_003", "ent_004"],
      "metricIds": ["met_002"],
      "sourceIds": ["src_003"],
      "observedAt": "2026-06-04T08:00:00-07:00",
      "severity": "medium",
      "direction": "positive",
      "confidence": 70
    },
    {
      "id": "sig_004",
      "signalType": "competitor_launch",
      "title": "Competitor B launched low-cost migration offer",
      "summary": "Competitor B launched a lower-cost plan with free migration support.",
      "entityIds": ["ent_002", "ent_003", "ent_004"],
      "sourceIds": ["src_004"],
      "observedAt": "2026-06-05T11:00:00-07:00",
      "severity": "medium",
      "direction": "positive",
      "confidence": 80
    }
  ]
}
```

---

## 24. Example Expected AI Output

```markdown
## Executive Summary

The provided data suggests a moderate-confidence market opportunity around price-sensitive small teams in the project management software market. The strongest pattern is the sequence of Competitor A increasing prices, customers mentioning price concerns, increased search interest for affordable alternatives, and Competitor B launching a low-cost migration offer.

## Top Assessments

### Price Sensitivity May Be Increasing In Project Management Software

**Assessment Type:**  
pricing pressure / market opportunity

**Summary:**  
The data may indicate that small-team buyers are becoming more sensitive to project management software pricing, creating an opportunity for lower-cost or migration-friendly positioning.

**Confidence Score:**  
62

**Confidence Label:**  
Moderate

**Risk Score:**  
48

**Risk Label:**  
Moderate

**Opportunity Score:**  
74

**Opportunity Label:**  
High

**Connected Signals:**  
- sig_001: Competitor A increased team pricing
- sig_002: Reviews increasingly mention price concerns
- sig_003: Search interest increased for affordable alternatives
- sig_004: Competitor B launched low-cost migration offer

**Entities Involved:**  
- Competitor A
- Competitor B
- Project Management Software
- Small Teams

**Timeline:**  
Competitor A increased pricing on June 1. Review concerns appeared by June 3. Search interest for affordable alternatives was observed on June 4. Competitor B launched a low-cost migration offer on June 5.

**Reasoning:**  
The sequence is consistent with a pricing-pressure pattern. A competitor increased prices, customers began mentioning price-related dissatisfaction, search demand for affordable alternatives rose, and another competitor positioned around low-cost migration. These signals are connected by market, customer segment, and timing.

**Alternative Explanations:**  
- Search interest may be seasonal or caused by unrelated marketing.
- Reviews may overrepresent unhappy customers.
- Competitor B's offer may have been planned before Competitor A's price change.
- The price increase may affect only a small subset of customers.

**Contradicting Evidence:**  
No churn data, sales data, or broader competitor pricing data was provided.

**Intelligence Gaps:**  
- No actual customer churn data
- No conversion data from lower-cost competitors
- No historical review baseline
- No data showing whether other competitors changed pricing
- No segmentation by company size or region

**What Would Increase Confidence:**  
- Confirmed increase in cancellations or migrations
- Multiple competitors responding with lower-cost offers
- Sustained search trend over several weeks
- Internal sales calls mentioning price objections

**What Would Decrease Confidence:**  
- Reviews returning to normal baseline
- Search interest dropping quickly
- Competitor A retaining growth despite price increase
- Evidence that Competitor B's offer was unrelated

**Recommended Monitoring:**  
- Track competitor pricing pages weekly
- Track review keywords for price, expensive, switch, cancel
- Track search interest for affordable alternatives
- Track competitor landing pages and migration messaging

**Recommended Actions:**  
- Test positioning around affordability and easy migration
- Create comparison content focused on total cost
- Interview customers about price sensitivity
- Watch for competitor discounting or plan changes

**Sources Used:**  
- src_001: Competitor A Pricing Page Snapshot
- src_002: App Store Reviews - Competitor A
- src_003: Search Interest Snapshot
- src_004: Competitor B New Migration Offer
```

---

## 25. Safety, Ethics, and Legal Boundaries

Business/market intelligence should be legal, ethical, and transparent.

Do:

```text
- Use public sources
- Use authorized internal data
- Respect privacy
- Respect robots.txt and terms where applicable
- Label uncertainty
- Preserve source attribution
- Avoid deception
- Avoid impersonation
- Avoid scraping private systems
- Avoid collecting personal data without a valid purpose
```

Do not:

```text
- Misrepresent yourself to obtain competitor information
- Use stolen data
- Use breached data
- Use private employee/customer data without authorization
- Encourage harassment of competitors or employees
- Present speculation as fact
- Use the system to dox individuals
- Use illegal surveillance tactics
```

SCIP's competitive and market intelligence ethics guidance emphasizes integrity, respect, legal conduct, and ethical collection practices.

---

## 26. Source Quality Levels

Recommended OSIRIS source reliability guide:

```text
90-100:
Official company filing, verified government dataset, direct internal authorized system.

75-89:
Company website, pricing page, official press release, official investor deck, reputable news source.

60-74:
Review platforms, job boards, app store reviews, industry blogs, search trend tools.

40-59:
Social posts, anonymous claims, forum posts, unverified commentary.

0-39:
Rumor, unsourced claim, outdated repost, scraped content with unclear origin.
```

---

## 27. Recommended OSIRIS UI Pages

For business/market intelligence, OSIRIS could include:

```text
/dashboard
  Overview of risks, opportunities, and monitored markets.

/markets
  List of markets being monitored.

/markets/:marketId
  Market dossier with trends, competitors, signals, pricing, demand, and sources.

/companies
  Tracked companies and competitors.

/companies/:companyId
  Company dossier with products, pricing, filings, hiring, news, reviews, and signals.

/products
  Product/category monitoring.

/pricing-intelligence
  Pricing changes and competitor positioning.

/customer-sentiment
  Reviews, complaints, support themes, and sentiment shifts.

/economic-signals
  Macro indicators connected to markets.

/assessments
  AI/human-generated intelligence assessments.

/assessments/:assessmentId
  Full report with evidence, scores, alternatives, and sources.

/sources
  Source library and ingestion status.

/settings/sources
  RSS feeds, websites, APIs, and manual source configuration.
```

---

## 28. Suggested Local-First Feature Stack

```text
Storage:
SQLite, IndexedDB, Supabase, or local JSON for early prototype.

Parsing:
RSS parser, Readability parser, HTML-to-text, CSV import, JSON import.

Entity Extraction:
Keyword rules, regex, dictionary matching, lightweight NLP.

Scoring:
Deterministic scoring functions.

Visualization:
Timeline, entity graph, source table, trend line, word cloud, confidence badge.

AI:
Only run after data is clustered and structured.
```

---

## 29. Business / Market Intelligence Compared To Other OSIRIS Intelligence Types

```text
Event Intelligence:
What happened or may be happening?

Threat Intelligence:
Who or what may cause harm?

Cyber Intelligence:
What cyber assets, alerts, vulnerabilities, and incidents matter?

Business / Market Intelligence:
What business conditions, competitors, customers, markets, and economic signals matter?

Risk Intelligence:
What could hurt us and how badly?

Opportunity Intelligence:
Where can we gain advantage?
```

Business/market intelligence overlaps with risk and opportunity intelligence the most.

---

## 30. Public Reference Links

These are useful public references for grounding the business/market intelligence report:

```text
Gartner — Analytics and Business Intelligence Platforms
https://www.gartner.com/reviews/market/analytics-business-intelligence-platforms

SCIP — Competitive & Market Intelligence Ethics
https://www.scip.org/page/Ethical-Intelligence

SEC — How to Read a 10-K
https://www.sec.gov/answers/reada10k.htm

SEC Investor Bulletin — How to Read a 10-K / 10-Q
https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/how-read

OECD — Business Confidence Index
https://www.oecd.org/en/data/indicators/business-confidence-index-bci.html

OECD — Consumer Confidence Index
https://www.oecd.org/en/data/indicators/consumer-confidence-index-cci.html

U.S. Census Bureau — Business Formation Statistics
https://www.census.gov/econ/bfs/index.html

FRED — Federal Reserve Economic Data
https://fred.stlouisfed.org/

U.S. Bureau of Labor Statistics
https://www.bls.gov/
```

---

## 31. Final Practical Summary

For OSIRIS, business/market intelligence should work like this:

```text
Collect sources.
Extract entities.
Extract metrics.
Extract signals.
Resolve entities.
Link relationships.
Compare against baselines.
Detect trends and anomalies.
Generate hypotheses.
Score confidence, risk, and opportunity.
Explain reasoning.
Show sources.
Suggest what to monitor next.
```

The goal is not to make OSIRIS pretend it can predict the market.

The goal is to make OSIRIS say:

> “These separate business signals may connect. Here is why they matter, how confident we are, what else could explain them, and what should be watched next.”

That is the useful version.
That is the ethical version.
That is the version that can actually be built without lighting money on fire.
