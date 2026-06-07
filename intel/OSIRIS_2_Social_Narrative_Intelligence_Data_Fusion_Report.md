# OSIRIS 2.0 — Social / Narrative Intelligence Data Fusion Report

**Project:** OSIRIS 2.0  
**Report Type:** Social / Narrative Intelligence  
**Purpose:** Explain how OSIRIS can collect, structure, connect, analyze, and explain social discourse and narrative signals from public or authorized data sources.  
**Primary Output:** Confidence-rated narrative assessments, discourse clusters, claim maps, influence patterns, source behavior summaries, and risk/opportunity explanations.

---

## 1. Executive Summary

Social / Narrative Intelligence is the process of understanding how information, claims, stories, beliefs, emotions, and public narratives appear, spread, mutate, and influence behavior across communities, platforms, organizations, media ecosystems, and time.

For OSIRIS, this does **not** mean building a manipulation engine or a surveillance tool. The safer and more useful version is an explainable analysis layer that answers:

```text
What are people saying?
Where did the claim or narrative appear?
How is it spreading?
Which communities or sources are repeating it?
What evidence supports or disputes it?
How confident are we?
What are the possible explanations?
What changed compared to normal baseline?
What should a human review next?
```

Social / Narrative Intelligence connects heavily with:

- Event Intelligence
- Threat Intelligence
- Cyber Intelligence
- Business / Market Intelligence
- Geospatial Intelligence
- Operational Intelligence
- Financial / Fraud Intelligence
- Supply Chain Intelligence
- Risk Intelligence

The goal is to convert messy discourse into structured intelligence objects:

```text
Raw Post / Article / Comment / Transcript
  → Source
  → Author / Publisher
  → Claim
  → Topic
  → Narrative
  → Sentiment / Emotion
  → Entities Mentioned
  → Evidence / Counter-Evidence
  → Spread Pattern
  → Confidence / Risk / Impact
  → Analyst Assessment
```

---

## 2. What Social / Narrative Intelligence Is

Social / Narrative Intelligence focuses on the meaning, movement, and impact of information.

It studies:

| Area | Meaning |
|---|---|
| **Narratives** | Larger storylines that organize claims and emotions into a repeated explanation of events. |
| **Claims** | Specific factual or interpretive statements that can be checked, supported, disputed, or left uncertain. |
| **Sentiment** | Positive, negative, neutral, mixed, angry, fearful, hopeful, sarcastic, or urgent tone. |
| **Emotion signals** | Fear, anger, disgust, pride, optimism, distrust, grief, panic, excitement, etc. |
| **Source behavior** | Who posts, repeats, amplifies, corrects, disputes, or reframes information. |
| **Diffusion** | How a post, topic, claim, or narrative spreads over time. |
| **Communities** | Clusters of accounts, organizations, forums, audiences, or publications interacting around the same narrative. |
| **Influence patterns** | Which entities appear to start, bridge, or amplify conversations. |
| **Narrative shifts** | How wording, tone, target, or interpretation changes as it spreads. |
| **Manipulation risk** | Signs of coordinated, misleading, deceptive, automated, or inauthentic activity. |

This kind of intelligence is useful for:

- Crisis monitoring
- Public safety communication
- Brand reputation
- Market sentiment
- Election integrity monitoring
- Misinformation response
- Community trend detection
- Cyber influence operations monitoring
- Scam and fraud narrative detection
- Customer support trend detection
- Public policy and regulatory monitoring

---

## 3. Important Boundary: Intelligence vs Manipulation

OSIRIS should be designed to **understand narratives**, not to manipulate people.

Allowed / constructive uses:

```text
Detect emerging claims.
Summarize discourse.
Identify evidence gaps.
Track narrative spread.
Compare source reliability.
Flag uncertainty.
Show competing explanations.
Support human review.
```

Avoid / do not build toward:

```text
Targeting specific private people.
Generating propaganda.
Suppressing lawful speech.
Coordinating harassment.
Microtargeting based on sensitive traits.
Automated reputation attacks.
Political persuasion operations.
Doxxing or exposure of private identities.
```

The ethical OSIRIS version should act like:

> “Here is what appears to be happening in the information environment, here is the evidence, here is the uncertainty, and here are safer next steps.”

Not:

> “Here is how to steer people’s beliefs.”

That line matters. A lot.

---

## 4. Social / Narrative Intelligence vs Other Intelligence Types

| Intelligence Type | Main Question | Social / Narrative Overlap |
|---|---|---|
| **Event Intelligence** | What happened or may happen? | Social signals can reveal early reports, rumors, and eyewitness claims. |
| **Threat Intelligence** | Who or what may cause harm? | Narratives can reveal extremist, scam, or influence patterns. |
| **Cyber Intelligence** | What is happening in networks/systems? | Cyber campaigns often use phishing themes, impersonation, and social engineering narratives. |
| **Business / Market Intelligence** | What is changing in a market? | Customer sentiment, competitor narratives, review trends, and public demand signals matter. |
| **Geospatial Intelligence** | Where is something happening? | Posts, check-ins, local reports, and geotagged media can cluster around places. |
| **Operational Intelligence** | What is affecting operations? | Employee/customer complaints and support chatter can reveal bottlenecks. |
| **Financial / Fraud Intelligence** | Is money movement suspicious? | Scam narratives, impersonation scripts, and fake investment claims spread socially. |
| **Supply Chain Intelligence** | What affects availability and movement? | Public complaints, vendor posts, port chatter, and labor narratives can signal disruption. |

---

## 5. Public Source Context and Research Grounding

The concepts in this report are grounded in public, defensive, and analytic frameworks.

### 5.1 Misinformation, Disinformation, and Malinformation

CISA and related public guidance commonly distinguish:

```text
Misinformation:
False or inaccurate information shared without necessarily intending harm.

Disinformation:
False information deliberately created or spread to mislead, manipulate, or cause harm.

Malinformation:
Information based on reality but used out of context or weaponized to cause harm.
```

OSIRIS should avoid automatically assigning intent unless there is strong evidence. A safer label is often:

```text
Unverified claim
Disputed claim
Unsupported claim
Misleading framing
Coordinated amplification suspected
Manipulation risk observed
```

Intent is hard. Observable behavior is easier.

### 5.2 Strategic Communication and Narrative Framing

Strategic communication research focuses on how messages, audiences, channels, and actions interact. For OSIRIS, this means the system should not only read text. It should analyze:

```text
who said it
what they said
when they said it
where it appeared
which audience received it
how it changed
who amplified it
which evidence was cited
which counter-claims appeared
```

### 5.3 Media Literacy and Truth Decay

RAND’s “Truth Decay” work frames the problem as a decline in the role of facts and analysis in public life. For OSIRIS, this supports a design principle:

> Do not only summarize popular narratives. Separate popularity from evidence quality.

A narrative can be viral and wrong. It can also be unpopular and true. The system must not confuse volume with validity.

### 5.4 Journalism, Verification, and Fact-Checking

UNESCO’s journalism and disinformation work emphasizes verification, source checking, context, and media literacy. OSIRIS should treat source attribution as a first-class object, not a footnote.

Every generated assessment should answer:

```text
Which sources support this?
Which sources dispute this?
Which sources are unknown or low-quality?
What is still unverified?
```

---

## 6. Core OSIRIS Concept: Narrative as an Intelligence Object

Instead of treating social posts and articles as isolated text blobs, OSIRIS should model narratives as connected objects.

```text
Narrative
  ├── Claims
  ├── Sources
  ├── Authors / Publishers
  ├── Entities Mentioned
  ├── Communities
  ├── Time Windows
  ├── Locations
  ├── Evidence
  ├── Counter-Evidence
  ├── Amplification Signals
  ├── Sentiment / Emotion
  ├── Confidence Score
  └── Risk / Impact Score
```

Example:

```text
Narrative:
"Company X is secretly shutting down Product Y."

Claims:
- Product Y support tickets increased.
- Several employees changed LinkedIn roles.
- A user forum reports cancelled renewals.
- Company X has not issued a public statement.

Possible Explanations:
1. Product sunset is being prepared.
2. Normal internal reorganization.
3. Customer misunderstanding.
4. Competitor-driven rumor.
5. False pattern caused by incomplete data.
```

---

## 7. Social / Narrative Data Sources

OSIRIS can ingest public, authorized, or user-provided sources.

### 7.1 Public Web Sources

| Source Type | Examples | Use |
|---|---|---|
| News articles | Local, national, industry media | Formal reporting and narrative framing |
| Press releases | Company/government/org statements | Official position and source attribution |
| Blogs | Analysts, companies, experts | Early opinions and niche analysis |
| Public forums | Reddit-style posts, product forums, community boards | Ground-level discourse and complaints |
| Public social posts | Public posts only | Emerging narratives, sentiment, spread |
| Video transcripts | Public videos, hearings, livestreams | Spoken claims and narratives |
| Podcasts/transcripts | Publicly available transcripts | Long-form narratives and framing |
| Reviews | Product/service reviews | Customer sentiment and recurring pain points |
| Public records | Court filings, regulatory docs, filings | Verification layer |
| Fact-check sites | Fact-check articles | Claim validation and dispute mapping |

### 7.2 Internal / Authorized Sources

| Source Type | Examples | Use |
|---|---|---|
| Support tickets | Zendesk, ServiceNow, Jira Service Management | Customer or employee issue narratives |
| Incident reports | Ops/security/business incidents | Internal event explanations |
| Surveys | Employee/customer surveys | Sentiment and recurring themes |
| Sales notes | CRM call notes | Market objections and demand patterns |
| Chat logs | Authorized workspace channels | Internal coordination and morale signals |
| Call transcripts | Support/sales/customer calls | Voice-of-customer narrative extraction |
| Knowledge base search logs | Internal help center searches | Confusion patterns and unmet needs |

### 7.3 Do Not Ingest by Default

Avoid or heavily restrict:

```text
Private DMs
Private personal profiles
Sensitive personal attributes
Data obtained by scraping against platform rules
Doxxing databases
Leaked private data
Children/minors' information
Medical, sexual, religious, political identity details unless explicitly necessary and lawful
```

---

## 8. Extraction Process

### 8.1 Raw Item Ingestion

Every source item should become a normalized record.

```ts
export interface SocialSourceItem {
  id: string;
  sourceType:
    | "news_article"
    | "press_release"
    | "public_post"
    | "forum_post"
    | "blog"
    | "review"
    | "transcript"
    | "internal_ticket"
    | "survey_response"
    | "manual_note";

  title?: string;
  body: string;
  url?: string;

  publishedAt?: string;
  collectedAt: string;

  authorId?: string;
  publisherId?: string;
  platform?: string;

  language?: string;
  locationHint?: string;

  engagement?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    replies?: number;
    reposts?: number;
  };

  rawMetadata?: Record<string, unknown>;
}
```

### 8.2 Text Cleaning

Normalize messy content before analysis.

```text
Remove duplicate boilerplate.
Preserve original text.
Extract title, body, author, date, source.
Normalize Unicode and whitespace.
Strip tracking parameters from URLs.
Detect language.
Preserve quotes separately from commentary.
Detect whether text is original, quoted, reposted, summarized, or copied.
```

Important: always preserve the raw source because cleaning can accidentally remove meaningful context.

### 8.3 Entity Extraction

Extract named and conceptual entities.

```ts
export interface NarrativeEntity {
  id: string;
  type:
    | "person"
    | "organization"
    | "place"
    | "product"
    | "brand"
    | "event"
    | "policy"
    | "platform"
    | "community"
    | "hashtag"
    | "url"
    | "claim"
    | "topic";

  name: string;
  aliases: string[];
  description?: string;

  confidence: number;
  sourceItemIds: string[];
}
```

Entity extraction should identify:

```text
People
Organizations
Brands
Products
Government agencies
Locations
Events
Hashtags
URLs
Claims
Named communities
Media outlets
Documents
Policies
Dates
Numbers
```

### 8.4 Claim Extraction

Claims are specific statements that can be supported, disputed, or left unverified.

```ts
export interface ClaimSignal {
  id: string;

  text: string;
  normalizedClaim: string;

  claimType:
    | "factual"
    | "prediction"
    | "opinion"
    | "accusation"
    | "causal"
    | "statistical"
    | "quote"
    | "rumor"
    | "instruction"
    | "call_to_action";

  entities: string[];
  sourceItemIds: string[];

  evidenceStatus:
    | "supported"
    | "disputed"
    | "unverified"
    | "unsupported"
    | "misleading_context_possible"
    | "satire_or_joke_possible";

  confidence: number;
}
```

Examples:

```text
"Company X is laying off 20% of staff."
→ factual/statistical claim

"Product Y is dead."
→ interpretive/opinion claim unless supported by specific evidence

"Do not buy from Vendor Z."
→ call-to-action / reputational narrative

"The outage happened because of a cyberattack."
→ causal claim
```

### 8.5 Topic and Narrative Extraction

Topics are broad. Narratives are structured storylines.

```ts
export interface NarrativeCluster {
  id: string;

  title: string;
  summary: string;

  topics: string[];
  narrativeFrame:
    | "crisis"
    | "blame"
    | "corruption"
    | "coverup"
    | "failure"
    | "success"
    | "fear"
    | "opportunity"
    | "identity"
    | "conflict"
    | "economic_pressure"
    | "public_safety"
    | "unknown";

  claimIds: string[];
  entityIds: string[];
  sourceItemIds: string[];

  firstSeenAt?: string;
  lastSeenAt?: string;

  confidence: number;
  riskScore?: number;
  impactScore?: number;
}
```

Examples:

```text
Topic:
"EV charging"

Narrative:
"EV charging networks are unreliable and hurting adoption."

Topic:
"Company layoffs"

Narrative:
"Company leadership is cutting staff while executives receive bonuses."

Topic:
"Public health"

Narrative:
"Officials are hiding the real cause of illness reports."
```

---

## 9. Narrative Relationship Mapping

Social / Narrative Intelligence gets powerful when OSIRIS maps relationships.

```ts
export interface NarrativeRelationship {
  id: string;

  fromId: string;
  toId: string;

  relationshipType:
    | "mentions"
    | "supports"
    | "disputes"
    | "amplifies"
    | "quotes"
    | "reframes"
    | "originates_from"
    | "similar_to"
    | "contradicts"
    | "uses_evidence"
    | "links_to"
    | "targets"
    | "blames"
    | "calls_for_action"
    | "appears_before"
    | "appears_after";

  sourceItemIds: string[];
  confidence: number;
}
```

Example:

```text
Post A originates Claim 1.
Article B disputes Claim 1.
Influencer C amplifies Article B.
Forum Thread D reframes Claim 1 as a cover-up.
Official Statement E contradicts Claim 1.
```

This lets OSIRIS build a claim/narrative graph instead of a flat feed.

---

## 10. Diffusion and Spread Analysis

Diffusion analysis looks at how a claim or narrative moves through time and sources.

### 10.1 Spread Signals

| Signal | Meaning |
|---|---|
| **First seen** | Earliest known appearance in OSIRIS data |
| **Velocity** | Rate of new mentions over time |
| **Acceleration** | Whether mentions are increasing faster than normal |
| **Reach proxy** | Engagement, outlet size, reposts, shares, replies |
| **Cross-platform spread** | Movement across sources/platforms |
| **Community jump** | Narrative moves from niche group to mainstream group |
| **Influencer amplification** | High-reach account/source repeats the claim |
| **Copy/paste similarity** | Same wording appears across multiple sources |
| **Semantic mutation** | Meaning changes while retaining core story |
| **Counter-narrative emergence** | Disputes or corrections appear |

### 10.2 Diffusion Object

```ts
export interface NarrativeDiffusion {
  id: string;
  narrativeClusterId: string;

  firstSeenAt?: string;
  peakSeenAt?: string;
  lastSeenAt?: string;

  mentionCount: number;
  sourceCount: number;
  platformCount: number;
  communityCount: number;

  velocityScore: number;
  accelerationScore: number;
  crossPlatformScore: number;
  amplificationScore: number;
  mutationScore: number;

  spreadPattern:
    | "single_source"
    | "slow_burn"
    | "viral_spike"
    | "coordinated_burst_possible"
    | "cross_platform_migration"
    | "mainstream_pickup"
    | "counter_narrative_emerging"
    | "declining";

  confidence: number;
}
```

---

## 11. Sentiment, Emotion, and Framing

### 11.1 Sentiment

Sentiment should be treated as approximate, not truth.

```ts
export interface SentimentSignal {
  id: string;
  sourceItemId: string;

  sentiment: "positive" | "negative" | "neutral" | "mixed" | "unclear";
  sentimentScore: number;

  emotions: Array<
    | "anger"
    | "fear"
    | "disgust"
    | "sadness"
    | "hope"
    | "trust"
    | "joy"
    | "urgency"
    | "confusion"
    | "sarcasm"
    | "mockery"
    | "pride"
  >;

  confidence: number;
}
```

### 11.2 Narrative Frame

Framing is how a story tells the audience what the event means.

```text
"This was a mistake."
"This was corruption."
"This was incompetence."
"This was an attack."
"This was justice."
"This was a cover-up."
"This was a warning sign."
```

Same facts, different frames.

OSIRIS should detect frames but avoid accepting them as fact.

---

## 12. Source Reliability and Behavior

Source reliability should be transparent and adjustable.

```ts
export interface NarrativeSource {
  id: string;

  name: string;
  type:
    | "official"
    | "news"
    | "independent_journalist"
    | "expert"
    | "anonymous"
    | "forum_user"
    | "influencer"
    | "company"
    | "government"
    | "research_org"
    | "unknown";

  url?: string;
  platform?: string;

  reliabilityProfile: {
    historicalAccuracy?: number;
    transparencyScore?: number;
    correctionHistory?: number;
    primarySourceAccess?: number;
    expertiseScore?: number;
    conflictOfInterestRisk?: number;
  };

  notes?: string;
}
```

### 12.1 Reliability Principles

Do not use one fixed “truth score.” Use visible factors:

```text
Is it a primary source?
Does it cite evidence?
Does it correct errors?
Is the author identified?
Is the outlet transparent?
Does it have direct access?
Is there a conflict of interest?
Is it repeating another source?
Is the claim corroborated independently?
```

### 12.2 Behavior Signals

```ts
export interface SourceBehaviorSignal {
  id: string;
  sourceId: string;

  behaviorType:
    | "originates_claims"
    | "amplifies_claims"
    | "frequently_reposts"
    | "uses_copy_paste_language"
    | "deletes_or_edits_often"
    | "posts_in_bursts"
    | "links_to_same_domain"
    | "bridges_communities"
    | "cites_primary_sources"
    | "posts_uncorroborated_claims"
    | "issues_corrections";

  observedAt: string;
  evidenceItemIds: string[];
  confidence: number;
}
```

---

## 13. Coordination and Manipulation Risk

OSIRIS can flag possible coordination, but it should not overclaim.

Use language like:

```text
Possible coordinated amplification
Inauthentic behavior indicators observed
Copy/paste behavior detected
Synchronized posting pattern
Shared URL burst
New-account amplification pattern
Unusual cross-platform timing
```

Avoid unsupported claims like:

```text
Bot network confirmed
Foreign operation confirmed
Paid propaganda confirmed
Coordinated campaign confirmed
```

Unless the evidence is actually strong.

### 13.1 Coordination Risk Indicators

| Indicator | Meaning |
|---|---|
| Same phrase repeated across sources | Possible copy/paste or shared messaging |
| Many posts within a narrow time window | Possible burst coordination |
| Same URL shared by many new accounts | Possible amplification attempt |
| Narrative jumps platforms quickly | Possible organized spread or high salience |
| Low-originality content | Reposting rather than independent discussion |
| Account creation clustering | Suspicious only if data is available and lawful |
| Engagement mismatch | High engagement with low normal audience |
| Repeated target selection | Narrative repeatedly targets same entity/group |
| Media reuse | Same image/video used across contexts |

### 13.2 Manipulation Risk Object

```ts
export interface ManipulationRiskAssessment {
  id: string;
  narrativeClusterId: string;

  indicators: Array<{
    type:
      | "copy_paste_similarity"
      | "synchronized_posting"
      | "new_account_cluster"
      | "cross_platform_burst"
      | "url_amplification"
      | "reused_media"
      | "misleading_context"
      | "coordinated_hashtag_use"
      | "engagement_anomaly";
    description: string;
    evidenceItemIds: string[];
    confidence: number;
  }>;

  overallRisk:
    | "none_observed"
    | "low"
    | "moderate"
    | "high"
    | "critical";

  confidence: number;
  caveats: string[];
}
```

---

## 14. Confidence Scoring

Confidence is **not** the same as risk.

Confidence answers:

> How strongly does the available evidence support this assessment?

Risk answers:

> How much harm or impact could happen if this is real?

### 14.1 Confidence Factors

```text
Source reliability
Number of independent sources
Primary-source support
Direct evidence quality
Entity resolution confidence
Claim extraction confidence
Cross-source corroboration
Timeliness
Consistency across sources
Presence of counter-evidence
Historical baseline comparison
```

### 14.2 Suggested Formula

```text
confidence =
  (sourceReliability * 0.20)
+ (corroboration * 0.20)
+ (evidenceDirectness * 0.20)
+ (entityResolutionConfidence * 0.10)
+ (timelineConsistency * 0.10)
+ (claimSpecificity * 0.10)
+ (counterEvidencePenaltyAdjusted * 0.10)
```

Where:

```text
counterEvidencePenaltyAdjusted =
  1.0 if no strong counter-evidence exists
  0.7 if mixed evidence exists
  0.4 if major unresolved contradictions exist
  0.1 if strong counter-evidence exists
```

### 14.3 Confidence Labels

| Score | Label |
|---:|---|
| 0.00–0.19 | Very Low |
| 0.20–0.39 | Low |
| 0.40–0.59 | Moderate-Low |
| 0.60–0.74 | Moderate |
| 0.75–0.89 | High |
| 0.90–1.00 | Very High |

---

## 15. Risk / Impact Scoring

Risk is about possible consequences.

### 15.1 Risk Factors

```text
Potential harm
Audience size
Velocity of spread
Target sensitivity
Public safety relevance
Financial/reputational impact
Likelihood of offline action
Presence of calls-to-action
Manipulation indicators
Uncertainty level
```

### 15.2 Suggested Formula

```text
risk =
  (potentialHarm * 0.25)
+ (spreadVelocity * 0.15)
+ (audienceReach * 0.15)
+ (targetSensitivity * 0.15)
+ (callToActionIntensity * 0.10)
+ (manipulationRisk * 0.10)
+ (uncertaintyPenalty * 0.10)
```

High uncertainty can raise review priority without increasing factual confidence.

---

## 16. OSIRIS Social / Narrative Intelligence Data Model

### 16.1 Unified Social Intelligence Record

```ts
export interface SocialNarrativeAssessment {
  id: string;

  title: string;
  summary: string;

  assessmentType:
    | "emerging_narrative"
    | "claim_assessment"
    | "sentiment_shift"
    | "manipulation_risk"
    | "reputation_risk"
    | "community_concern"
    | "rumor_tracking"
    | "counter_narrative_tracking"
    | "public_confusion"
    | "information_gap";

  narrativeClusterIds: string[];
  claimIds: string[];
  entityIds: string[];
  sourceItemIds: string[];

  keyFindings: string[];
  evidence: Array<{
    sourceItemId: string;
    description: string;
    relevance: string;
  }>;

  competingExplanations: Array<{
    explanation: string;
    supportingEvidenceIds: string[];
    confidence: number;
  }>;

  confidenceScore: number;
  confidenceLabel:
    | "very_low"
    | "low"
    | "moderate_low"
    | "moderate"
    | "high"
    | "very_high";

  riskScore: number;
  riskLabel: "minimal" | "low" | "moderate" | "high" | "critical";

  recommendedActions: string[];
  caveats: string[];

  createdAt: string;
  updatedAt: string;
}
```

---

## 17. Example OSIRIS JSON Payload

This is the kind of structured payload OSIRIS could send to ChatGPT after local extraction and clustering.

```json
{
  "analysis_type": "social_narrative_intelligence",
  "analysis_goal": "Identify possible emerging narratives, disputed claims, manipulation risks, and confidence-rated explanations.",
  "time_window": {
    "start": "2026-06-01T00:00:00Z",
    "end": "2026-06-06T23:59:59Z"
  },
  "source_items": [
    {
      "id": "src_001",
      "sourceType": "forum_post",
      "title": "People are saying Vendor A is cancelling renewals",
      "body": "Multiple users in our industry forum say Vendor A has stopped renewing small accounts.",
      "publishedAt": "2026-06-02T13:22:00Z",
      "platform": "public_forum",
      "engagement": {
        "comments": 42,
        "shares": 7
      }
    },
    {
      "id": "src_002",
      "sourceType": "news_article",
      "title": "Vendor A updates enterprise pricing page",
      "body": "Vendor A removed small-business pricing language from its public page this week.",
      "publishedAt": "2026-06-03T09:00:00Z",
      "platform": "industry_news"
    },
    {
      "id": "src_003",
      "sourceType": "public_post",
      "title": "Competitor B offers migration discount",
      "body": "Competitor B posted a limited migration discount for Vendor A customers.",
      "publishedAt": "2026-06-03T15:30:00Z",
      "platform": "public_social"
    },
    {
      "id": "src_004",
      "sourceType": "press_release",
      "title": "Vendor A says it remains committed to all customers",
      "body": "Vendor A states that no current customer contracts are being cancelled and says pricing updates are part of a packaging refresh.",
      "publishedAt": "2026-06-04T18:00:00Z",
      "platform": "company_site"
    }
  ],
  "entities": [
    {
      "id": "ent_vendor_a",
      "type": "organization",
      "name": "Vendor A",
      "aliases": ["VendorA"],
      "confidence": 0.98,
      "sourceItemIds": ["src_001", "src_002", "src_004"]
    },
    {
      "id": "ent_competitor_b",
      "type": "organization",
      "name": "Competitor B",
      "aliases": [],
      "confidence": 0.95,
      "sourceItemIds": ["src_003"]
    }
  ],
  "claims": [
    {
      "id": "claim_001",
      "text": "Vendor A is cancelling renewals for small accounts.",
      "claimType": "factual",
      "entities": ["ent_vendor_a"],
      "sourceItemIds": ["src_001"],
      "evidenceStatus": "unverified",
      "confidence": 0.38
    },
    {
      "id": "claim_002",
      "text": "Vendor A removed small-business pricing language.",
      "claimType": "factual",
      "entities": ["ent_vendor_a"],
      "sourceItemIds": ["src_002"],
      "evidenceStatus": "supported",
      "confidence": 0.72
    },
    {
      "id": "claim_003",
      "text": "Vendor A says contracts are not being cancelled.",
      "claimType": "quote",
      "entities": ["ent_vendor_a"],
      "sourceItemIds": ["src_004"],
      "evidenceStatus": "supported",
      "confidence": 0.81
    }
  ],
  "observed_signals": {
    "mention_count": 4,
    "source_count": 4,
    "platform_count": 4,
    "cross_platform_spread": true,
    "velocity_score": 0.58,
    "sentiment": "negative",
    "dominant_emotions": ["uncertainty", "frustration", "urgency"],
    "manipulation_indicators": [
      {
        "type": "none_observed",
        "description": "No strong copy/paste, synchronized posting, or suspicious amplification pattern observed in the provided dataset.",
        "confidence": 0.67
      }
    ]
  }
}
```

---

## 18. Giant AI Chatbot Prompt Pretext

Use this as the large pretext message before the structured data payload.

```text
You are an intelligence analysis assistant helping analyze public or authorized data for Social / Narrative Intelligence.

Your job is to identify possible narratives, claims, discourse shifts, sentiment patterns, source behavior, amplification patterns, manipulation risks, and confidence-rated explanations from the structured data provided.

Important safety and analytic rules:

1. Do not claim certainty unless the data strongly supports it.
2. Do not infer intent, coordination, manipulation, or deception unless there are observable indicators.
3. Distinguish clearly between:
   - facts
   - claims
   - opinions
   - rumors
   - unsupported interpretations
   - official statements
   - disputed claims
4. Do not treat popularity, engagement, virality, or repetition as proof.
5. Do not identify private individuals or expose personal information.
6. Do not produce propaganda, persuasion strategy, harassment guidance, or targeting advice.
7. Do not recommend suppressing lawful speech.
8. Prefer neutral analytic language.
9. Always include alternative explanations.
10. Always include source IDs supporting each conclusion.
11. Always explain how confidence was calculated.
12. If the data is weak, say so clearly.
13. If a narrative may be satire, sarcasm, joke, fandom behavior, marketing, normal criticism, or misunderstanding, include that as an alternative explanation.
14. If the dataset is too small, biased, or incomplete, say that the assessment is limited.
15. Treat sensitive identity, political, religious, medical, or personal attributes with extra caution. Do not profile people based on protected or sensitive traits.

Definitions:

- A claim is a specific statement that can be supported, disputed, or remain unverified.
- A topic is a broad subject area.
- A narrative is a repeated storyline or frame that gives meaning to events or claims.
- Sentiment is emotional polarity or tone, not factual accuracy.
- Manipulation risk means observable signs that information spread may be coordinated, deceptive, synthetic, or misleading.
- Confidence means how strongly the provided evidence supports the assessment.
- Risk means the possible impact if the assessment is correct.

Analyze the data and return the following sections:

1. Executive Summary
   - Give a short summary of the most important narrative findings.
   - Include whether the dataset supports strong conclusions or only weak leads.

2. Detected Narratives
   For each detected narrative:
   - Title
   - Summary
   - Narrative frame
   - Supporting source IDs
   - Related claim IDs
   - Related entity IDs
   - First seen / last seen if available
   - Confidence score from 0.00 to 1.00
   - Confidence label
   - Why this confidence score was assigned

3. Claims Assessment
   For each major claim:
   - Claim text
   - Claim type
   - Evidence status: supported, disputed, unverified, unsupported, misleading-context-possible, or satire/joke-possible
   - Supporting sources
   - Disputing sources
   - Missing evidence
   - Confidence score
   - Explanation

4. Sentiment and Emotion Analysis
   - Overall sentiment
   - Dominant emotions
   - Evidence from source IDs
   - Whether sentiment appears broad or isolated
   - Confidence score

5. Diffusion / Spread Assessment
   - Whether the narrative is single-source, slow-burn, viral spike, cross-platform migration, mainstream pickup, counter-narrative emerging, or declining
   - Mention count, source count, platform count if available
   - Velocity and acceleration notes
   - Any notable amplification
   - Confidence score

6. Manipulation / Coordination Risk
   - State whether indicators are observed, not observed, or insufficient data.
   - List observable indicators only.
   - Do not infer actors or intent without evidence.
   - Include confidence and caveats.

7. Competing Explanations
   Provide at least 3 possible explanations for the observed data.
   For each:
   - Explanation
   - Supporting evidence
   - Weaknesses
   - Confidence score

8. Risk / Impact Assessment
   - Risk score from 0.00 to 1.00
   - Risk label: minimal, low, moderate, high, critical
   - Potential affected entities
   - Possible harms or operational impacts
   - Reasons for the score

9. Recommended Human Review Steps
   - What a human analyst should check next
   - What evidence would increase confidence
   - What evidence would lower confidence
   - What sources should be reviewed before taking action

10. Final Assessment
   - One paragraph conclusion
   - Include confidence, risk, uncertainty, and the most likely explanation.

Use the following scoring labels:

Confidence:
0.00–0.19 = Very Low
0.20–0.39 = Low
0.40–0.59 = Moderate-Low
0.60–0.74 = Moderate
0.75–0.89 = High
0.90–1.00 = Very High

Risk:
0.00–0.19 = Minimal
0.20–0.39 = Low
0.40–0.59 = Moderate
0.60–0.79 = High
0.80–1.00 = Critical

Return the answer in clear Markdown.
Do not invent source IDs.
Do not invent unavailable data.
If the input is insufficient, say exactly what is missing.
```

---

## 19. Example AI Output

Given the sample payload above, a useful AI output would look like:

```markdown
# Social / Narrative Intelligence Assessment

## Executive Summary

A moderate-low confidence narrative is emerging that Vendor A may be reducing support for small-business customers. The strongest evidence is the removal of small-business pricing language and forum discussion from affected users. However, the official company statement disputes the more severe claim that current contracts are being cancelled. The dataset supports a reputational concern and customer uncertainty narrative, but not a confirmed cancellation event.

## Detected Narrative

### Narrative 1: Vendor A may be moving away from small-business customers

**Frame:** business model shift / customer abandonment  
**Supporting Sources:** src_001, src_002, src_003  
**Disputing / Context Sources:** src_004  
**Related Claims:** claim_001, claim_002, claim_003  
**Related Entities:** ent_vendor_a, ent_competitor_b  
**Confidence:** 0.56 — Moderate-Low

**Why:** The pricing page change is a concrete signal, and forum discussion shows customer concern. However, the strongest claim about cancelled renewals is not directly verified and is disputed by Vendor A's statement.

## Claims Assessment

### Claim: Vendor A is cancelling renewals for small accounts.

**Status:** Unverified  
**Supporting Sources:** src_001  
**Disputing Sources:** src_004  
**Missing Evidence:** Direct customer notice, contract language, official policy change, multiple named customer confirmations  
**Confidence:** 0.34 — Low

## Sentiment and Emotion

The dominant sentiment is negative, with uncertainty, frustration, and urgency. This is mostly concentrated around forum discussion and competitor migration framing.

## Diffusion Assessment

The narrative shows early cross-platform spread but not enough evidence for a viral spike or coordinated campaign.

## Manipulation / Coordination Risk

No strong manipulation indicators are observed in the provided dataset. There is no evidence of synchronized posting, copy/paste language, bot-like behavior, or coordinated hashtag use.

## Competing Explanations

1. Vendor A is repositioning toward larger customers.
2. Vendor A is only refreshing packaging and messaging.
3. Customers are misinterpreting pricing page changes.
4. Competitor B is opportunistically marketing to uncertain customers.

## Risk / Impact

**Risk:** 0.48 — Moderate

The risk is reputational and commercial, not public safety related. If the narrative continues, Vendor A may face customer churn, support volume increases, or competitor migration pressure.

## Final Assessment

The most likely explanation is that Vendor A made a public packaging or pricing-positioning change that created customer uncertainty. There is moderate-low confidence that the company is shifting away from smaller customers, but low confidence that existing contracts are being cancelled.
```

---

## 20. Local-First OSIRIS Implementation Strategy

### 20.1 Phase 1 — Ingest and Store Source Items

Start simple.

```text
RSS feeds
Manual notes
Public URLs
Imported CSV/JSON
Internal ticket exports
Saved article text
```

Create `source_items`.

### 20.2 Phase 2 — Extract Entities and Claims

Without AI, start with:

```text
capitalized phrase extraction
known organization dictionary
hashtag extraction
URL/domain extraction
date extraction
keyword topic matching
simple claim cue detection
```

Claim cue examples:

```text
"is accused of"
"announced"
"claims"
"reported"
"denied"
"confirmed"
"alleged"
"will"
"plans to"
"caused by"
"because"
```

### 20.3 Phase 3 — Cluster Similar Items

Cheap clustering:

```text
same entities
same keywords
same URLs
same hashtags
same source domain
close timestamps
high text similarity
same claim phrase
```

### 20.4 Phase 4 — Build Narrative Pages

Each narrative page should show:

```text
Narrative title
Summary
Claims
Source timeline
Entity graph
Sentiment over time
Evidence for / against
Confidence score
Risk score
Alternative explanations
Human review checklist
```

### 20.5 Phase 5 — Add AI Review

Use AI only after OSIRIS structures the data.

Do not send raw junk if you can avoid it. Send:

```text
source items
entities
claims
relationships
engagement metadata
timeline
detected clusters
known caveats
```

This makes the AI cheaper, more consistent, and less likely to hallucinate.

---

## 21. Suggested OSIRIS UI Pages

| Page | Purpose |
|---|---|
| **Narrative Feed** | Shows emerging narratives with confidence/risk labels. |
| **Narrative Dossier** | Deep page for one narrative cluster. |
| **Claim Map** | Shows claims, evidence, disputes, and source links. |
| **Source Behavior Page** | Shows source reliability and posting behavior. |
| **Sentiment Timeline** | Shows emotional tone changes over time. |
| **Diffusion Timeline** | Shows where/when a narrative appeared. |
| **Manipulation Risk Panel** | Shows observable coordination indicators. |
| **Community Cluster View** | Shows groups of sources discussing the same narrative. |
| **Evidence Board** | Source-by-source review panel. |
| **AI Assessment Output** | ChatGPT-style confidence-rated analysis. |

---

## 22. Suggested Database Tables

```sql
social_source_items
narrative_sources
narrative_entities
claim_signals
narrative_clusters
narrative_relationships
sentiment_signals
narrative_diffusion
source_behavior_signals
manipulation_risk_assessments
social_narrative_assessments
```

---

## 23. Example Table Shapes

### 23.1 `social_source_items`

```sql
create table social_source_items (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  title text,
  body text not null,
  url text,
  platform text,
  author_id uuid,
  publisher_id uuid,
  published_at timestamptz,
  collected_at timestamptz default now(),
  engagement jsonb,
  raw_metadata jsonb
);
```

### 23.2 `claim_signals`

```sql
create table claim_signals (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  normalized_claim text not null,
  claim_type text not null,
  evidence_status text not null default 'unverified',
  confidence numeric not null default 0,
  source_item_ids uuid[] not null default '{}',
  entity_ids uuid[] not null default '{}',
  created_at timestamptz default now()
);
```

### 23.3 `narrative_clusters`

```sql
create table narrative_clusters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  topics text[] not null default '{}',
  narrative_frame text,
  claim_ids uuid[] not null default '{}',
  entity_ids uuid[] not null default '{}',
  source_item_ids uuid[] not null default '{}',
  first_seen_at timestamptz,
  last_seen_at timestamptz,
  confidence numeric not null default 0,
  risk_score numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 24. Cheap Non-AI Methods That Still Work

### 24.1 Keyword Frequency

Track repeated terms.

```text
"layoff"
"cancelled"
"unsafe"
"boycott"
"lawsuit"
"outage"
"fraud"
"cover-up"
"scam"
```

### 24.2 TF-IDF

Use TF-IDF to find unusually important words in a cluster compared to the rest of the dataset.

### 24.3 Fuzzy Matching

Match:

```text
"Acme Corp"
"ACME"
"Acme Corporation"
"acme.com"
```

### 24.4 Text Similarity

Use cosine similarity or simple n-gram overlap to cluster posts that say basically the same thing.

### 24.5 Timeline Spikes

Detect if mention volume is unusually high compared to baseline.

### 24.6 Source Diversity

A claim repeated by 20 accounts but all citing the same article is not 20 independent confirmations. It is one source amplified 20 times.

### 24.7 Evidence Diversity

Better corroboration comes from independent source types:

```text
official statement
primary document
eyewitness report
reputable news article
data source
expert analysis
```

---

## 25. Anti-Hallucination Rules for AI Analysis

When sending data to ChatGPT or another model:

```text
Only analyze provided data.
Do not invent sources.
Do not infer private facts.
Do not claim coordination without observable indicators.
Do not claim intent without evidence.
Always list evidence IDs.
Always provide competing explanations.
Always label confidence.
Always state missing evidence.
Always separate popularity from truth.
```

A good AI assessment should be boringly honest. If it sounds too spicy, it may be overclaiming.

---

## 26. Report Output Template

OSIRIS should generate social/narrative reports like this:

```markdown
# Social / Narrative Intelligence Report

## 1. Summary
[Short summary]

## 2. Key Narratives
| Narrative | Confidence | Risk | Sources |
|---|---:|---:|---|

## 3. Major Claims
| Claim | Status | Confidence | Sources |
|---|---|---:|---|

## 4. Sentiment / Emotion
[Observed sentiment and emotions]

## 5. Spread / Diffusion
[How the narrative moved]

## 6. Manipulation Risk
[Observable indicators only]

## 7. Evidence For
[Source-linked evidence]

## 8. Evidence Against / Caveats
[Disputes, contradictions, missing data]

## 9. Competing Explanations
[At least 3]

## 10. Confidence Explanation
[How the score was derived]

## 11. Recommended Review
[What to check next]

## 12. Final Assessment
[Conclusion]
```

---

## 27. Safety, Privacy, and Legal Guardrails

OSIRIS should include guardrails at the system level.

### 27.1 Required Guardrails

```text
Use public or authorized data only.
Do not expose private individuals.
Avoid sensitive personal profiling.
Avoid political persuasion targeting.
Avoid harassment or intimidation use cases.
Avoid automated claims of guilt, deception, or coordination.
Preserve source attribution.
Show uncertainty.
Require human review before action.
```

### 27.2 High-Risk Output Labels

OSIRIS should force careful wording for:

```text
bot
coordinated
foreign influence
disinformation
propaganda
extremist
fraud
scam
harassment
threat
```

Suggested wording:

```text
"Possible coordination indicators were observed."
"The dataset is insufficient to identify intent."
"The claim remains unverified."
"The pattern may also be explained by organic amplification."
```

---

## 28. Final Takeaway

Social / Narrative Intelligence is not about deciding what people are allowed to say. It is about understanding how claims, emotions, sources, and storylines move through an information environment.

For OSIRIS, the winning design is:

```text
Collect public/authorized discourse.
Extract entities, claims, and topics.
Cluster them into narratives.
Map evidence, disputes, sources, and spread.
Score confidence separately from risk.
Generate neutral, explainable assessments.
Require human review.
```

The most important principle:

> OSIRIS should explain the information environment, not manipulate it.

That is the difference between a useful intelligence synthesis tool and a digital bullhorn with a trench coat.

---

## 29. Public References

These are useful public references for grounding OSIRIS Social / Narrative Intelligence design:

1. CISA — Tactics of Disinformation  
   https://www.cisa.gov/sites/default/files/publications/tactics-of-disinformation_508.pdf

2. CISA / CIS — Managing Mis-, Dis-, and Malinformation  
   https://essentialguide.docs.cisecurity.org/en/v1.41/bp/mdm_info.html

3. CISA — Disinformation Stops With You Infographic Set  
   https://www.cisa.gov/resources-tools/resources/disinformation-stops-you-infographic-set

4. RAND — Countering Truth Decay  
   https://www.rand.org/research/projects/truth-decay.html

5. RAND — Media Literacy Standards to Counter Truth Decay  
   https://www.rand.org/pubs/research_reports/RRA112-12.html

6. UNESCO — Journalism, Fake News & Disinformation  
   https://www.unesco.org/en/articles/journalism-fake-news-disinformation

7. UNESCO Digital Library — Journalism, Fake News & Disinformation Handbook  
   https://unesdoc.unesco.org/ark:/48223/pf0000265552

8. NATO — NATO’s Approach to Counter Information Threats  
   https://www.nato.int/en/what-we-do/wider-activities/natos-approach-to-counter-information-threats

9. NATO StratCom COE — Capability Framework for Countering Disinformation, Information Influence, and Foreign Interference  
   https://stratcomcoe.org/publications/a-capability-definition-and-assessment-framework-for-countering-disinformation-information-influence-and-foreign-interference/255

10. NATO / UK MOD — Allied Joint Doctrine for Strategic Communications  
    https://assets.publishing.service.gov.uk/media/6525459d244f8e00138e7343/AJP_10_Strat_Comm_Change_1_web.pdf

11. Rosenfeld, Szanto, Parkes — A Kernel of Truth: Determining Rumor Veracity on Twitter by Diffusion Pattern Alone  
    https://arxiv.org/abs/2002.00850

12. Inman — Studying Disinformation Narratives on Social Media with LLMs and Semantic Similarity  
    https://arxiv.org/abs/2507.20066

13. Malkamäki et al. — Beyond Disinformation: Strategic Misrepresentation across Content, Actors, Processes, and Covertness  
    https://arxiv.org/abs/2603.25883

---

## 30. Suggested Filename

```text
OSIRIS_2_Social_Narrative_Intelligence_Data_Fusion_Report.md
```
