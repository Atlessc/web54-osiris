# OSIRIS 2 — Financial / Fraud Intelligence Data Fusion Report

> Project: OSIRIS 2.0  
> Report Type: Financial / Fraud Intelligence  
> Purpose: Explain how OSIRIS can ingest disconnected financial, transactional, identity, behavioral, and public-source signals, then synthesize them into explainable fraud-risk assessments, suspicious-pattern reports, confidence scores, and investigation-ready dossiers.

---

## 1. Executive Summary

Financial / fraud intelligence is the discipline of turning fragmented money-related signals into structured assessments about possible fraud, abuse, laundering, scams, payment risk, account compromise, synthetic identity, procurement fraud, insider misuse, or abnormal financial behavior.

For OSIRIS, the goal is **not** to accuse people or automatically declare wrongdoing. The goal is to surface **explainable leads**:

```text
raw financial / behavioral / identity signals
  → normalized entities
  → transaction graph
  → anomaly detection
  → fraud pattern matching
  → confidence + risk scoring
  → explainable intelligence report
```

A single signal is often benign:

- A user changes their phone number.
- A customer sends a large wire transfer.
- A vendor updates payment details.
- A card is used in a new city.
- A newly created account receives several payments.

Any one of these can be normal. But together, across time, accounts, devices, merchants, identities, geographies, and counterparties, they may indicate a possible fraud pattern.

The important discipline is to separate:

- **Observed facts**
- **Derived signals**
- **Pattern matches**
- **Hypotheses**
- **Alternative explanations**
- **Confidence**
- **Financial / operational risk**
- **Recommended verification steps**

OSIRIS should behave like an intelligence synthesis layer, not a judge, cop, bank regulator, or automated punishment machine.

---

## 2. Financial Intelligence vs Fraud Intelligence

### Financial Intelligence

Financial intelligence focuses on understanding money flows, transaction behavior, financial exposure, account relationships, counterparties, obligations, economic activity, and financial risk.

Examples:

- Cash flow patterns
- Account activity
- Vendor payment changes
- Revenue anomalies
- Expense irregularities
- Counterparty concentration
- Payment timing changes
- Liquidity risk signals
- Unusual money movement

### Fraud Intelligence

Fraud intelligence focuses on detecting, explaining, and prioritizing possible deceptive or unauthorized activity.

Examples:

- Account takeover
- Card-not-present fraud
- Synthetic identity fraud
- Invoice fraud
- Vendor impersonation
- Payroll fraud
- Refund abuse
- Chargeback abuse
- Procurement fraud
- Insider misuse
- Romance/investment scams
- Money mule networks
- Laundering-like transaction patterns

### AML / Financial Crime Intelligence

Anti-money laundering and financial crime intelligence focuses on suspicious financial movement that may involve concealment, layering, structuring, illicit proceeds, sanctions evasion, or terrorist/proliferation financing.

OSIRIS should model this carefully:

```text
Fraud Intelligence:
  Is someone being deceived, abused, impersonated, or exploited?

Financial Intelligence:
  What does the money movement or financial behavior suggest?

AML / Financial Crime Intelligence:
  Does the pattern resemble concealment, layering, suspicious routing, or regulatory red flags?
```

---

## 3. What Makes Financial / Fraud Intelligence Different

Financial/fraud intelligence is different from general event intelligence because it depends heavily on:

1. **Transactions**
2. **Identity**
3. **Behavioral baselines**
4. **Device and access context**
5. **Money movement paths**
6. **Counterparty relationships**
7. **Timing and velocity**
8. **Known typologies**
9. **Regulatory sensitivity**
10. **False-positive control**

A suspicious-looking transaction can be perfectly legitimate. A normal-looking transaction can be part of a larger fraud pattern. The pattern matters more than one isolated action.

---

## 4. Core OSIRIS Concepts

OSIRIS should treat financial/fraud intelligence as a graph of connected objects:

```text
Person / Customer / Employee
  ↕
Account
  ↕
Transaction
  ↕
Merchant / Vendor / Counterparty
  ↕
Payment Instrument
  ↕
Device / Session / IP / Location
  ↕
Document / Invoice / Contract / Claim
  ↕
Alert / Rule Hit / Case
```

### Example

```text
New vendor bank account
  + invoice amount 3x normal
  + requester recently changed email
  + payment requested outside standard workflow
  + vendor domain created recently
  = possible vendor impersonation / business email compromise
```

This is not proof. It is a lead.

---

## 5. Common Source Types

### Internal Sources

| Source | Examples | Intelligence Value |
|---|---|---|
| Transactions | ACH, wires, cards, invoices, refunds, credits, payroll | Shows money movement and behavior. |
| Account records | Customer, employee, vendor, wallet, merchant accounts | Connects identity to activity. |
| Payment instruments | Cards, bank accounts, wallets, crypto addresses | Identifies reuse, change, or routing patterns. |
| Login/session logs | IP, device, user agent, location, MFA events | Helps detect account takeover or suspicious access. |
| Vendor master data | Vendor names, addresses, tax IDs, bank details | Useful for vendor fraud and payment change risk. |
| Invoices / receipts | Amount, vendor, line items, dates, approvals | Useful for invoice fraud, duplicate billing, procurement abuse. |
| Support tickets | Refund requests, account complaints, password resets | Useful for social engineering and abuse signals. |
| Chargebacks | Reason codes, disputes, merchants, customers | Useful for merchant risk and refund abuse. |
| HR/payroll | Employee status, role, direct deposit changes | Useful for payroll diversion and insider-risk context. |
| Case management | Prior alerts, dispositions, investigator notes | Helps avoid duplicate work and calibrate confidence. |

### External Sources

| Source | Examples | Intelligence Value |
|---|---|---|
| Public business registries | Secretary of State, corporate records | Helps validate vendors and shell-company risk. |
| Sanctions / watchlists | OFAC, UN, EU lists | Helps screen counterparties. |
| Court / bankruptcy records | Civil suits, bankruptcies, fraud cases | Provides counterparty risk context. |
| Domain / DNS records | Lookalike domains, new domains | Supports scam/BEC detection. |
| Breach data indicators | Exposed credentials, compromised domains | Supports account takeover risk. |
| News / RSS | Fraud schemes, bankruptcies, enforcement actions | Adds external context. |
| Blockchain explorers | Wallet clustering, transaction flows | Useful for crypto scam and laundering analysis. |
| Geolocation/IP reputation | VPN, proxy, hosting ASN, impossible travel | Supports access-risk analysis. |
| Economic data | inflation, commodity changes, regional stress | Useful for macro fraud pressure and financial risk context. |

---

## 6. Data Extraction Process

Financial/fraud intelligence starts by extracting structured values from messy records.

### 6.1 Transaction Extraction

From transaction data, extract:

```ts
interface FinancialTransaction {
  id: string;
  sourceId: string;
  transactionType:
    | "card"
    | "ach"
    | "wire"
    | "check"
    | "cash"
    | "crypto"
    | "invoice"
    | "refund"
    | "payroll"
    | "transfer"
    | "other";
  amount: number;
  currency: string;
  occurredAt: string;
  postedAt?: string;
  originAccountId?: string;
  destinationAccountId?: string;
  counterpartyId?: string;
  merchantId?: string;
  paymentInstrumentId?: string;
  locationId?: string;
  channel?: "online" | "in_person" | "mobile" | "branch" | "api" | "unknown";
  status?: "pending" | "completed" | "failed" | "reversed" | "disputed";
  memo?: string;
  rawDescription?: string;
  tags: string[];
}
```

### 6.2 Identity Extraction

```ts
interface FinancialIdentity {
  id: string;
  type:
    | "person"
    | "customer"
    | "employee"
    | "vendor"
    | "merchant"
    | "business"
    | "counterparty";
  displayName: string;
  aliases: string[];
  emails: string[];
  phoneNumbers: string[];
  addresses: string[];
  taxIdsMasked?: string[];
  registrationIds?: string[];
  riskFlags: string[];
  confidence: number;
}
```

### 6.3 Account Extraction

```ts
interface FinancialAccount {
  id: string;
  accountType:
    | "bank_account"
    | "card_account"
    | "wallet"
    | "merchant_account"
    | "vendor_account"
    | "payroll_account"
    | "crypto_wallet"
    | "internal_ledger";
  ownerEntityId?: string;
  institution?: string;
  openedAt?: string;
  closedAt?: string;
  status?: "active" | "closed" | "frozen" | "restricted" | "unknown";
  maskedIdentifier?: string;
  country?: string;
  tags: string[];
}
```

### 6.4 Device / Session Extraction

```ts
interface AccessSession {
  id: string;
  userEntityId?: string;
  accountId?: string;
  occurredAt: string;
  ipAddress?: string;
  deviceId?: string;
  userAgent?: string;
  locationId?: string;
  authMethod?: "password" | "mfa" | "sso" | "biometric" | "unknown";
  authResult: "success" | "failed" | "challenged" | "blocked";
  riskSignals: string[];
}
```

### 6.5 Document Extraction

Documents are crucial for invoice fraud, procurement fraud, reimbursement fraud, and vendor impersonation.

```ts
interface FinancialDocument {
  id: string;
  documentType:
    | "invoice"
    | "receipt"
    | "contract"
    | "purchase_order"
    | "statement"
    | "tax_form"
    | "claim"
    | "approval"
    | "email"
    | "other";
  sourceId: string;
  issuerEntityId?: string;
  recipientEntityId?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  issuedAt?: string;
  extractedAccountIds: string[];
  extractedEmails: string[];
  extractedPhoneNumbers: string[];
  extractedAddresses: string[];
  extractedDomains: string[];
  textHash?: string;
  tags: string[];
}
```

---

## 7. Normalization

Financial data is messy. Normalization makes the data comparable.

### Normalize:

- Dates and time zones
- Currency codes
- Amount signs
- Merchant names
- Vendor names
- Account identifiers
- Phone numbers
- Addresses
- IP addresses
- Email casing
- Domain names
- Country names
- Payment channels
- Transaction types
- Status values

Example:

```text
"ACME INC."
"Acme Incorporated"
"ACME, Inc"
"acme-payments.com"

Potentially same business entity, but not guaranteed.
```

OSIRIS should never silently merge financial entities without preserving confidence and source evidence.

---

## 8. Entity Resolution

Entity resolution links records that may refer to the same real-world person, business, vendor, merchant, account, device, or counterparty.

### Strong Match Signals

| Signal | Strength |
|---|---|
| Same verified tax ID | Very strong |
| Same bank account | Very strong |
| Same legal registration ID | Very strong |
| Same verified email domain | Strong |
| Same phone + address | Strong |
| Same device used by same account | Strong |
| Same name only | Weak |
| Similar name only | Very weak |
| Same city only | Very weak |

### Example Resolution Object

```ts
interface EntityResolutionCandidate {
  id: string;
  entityAId: string;
  entityBId: string;
  matchScore: number;
  matchReasons: string[];
  conflictReasons: string[];
  status: "unreviewed" | "accepted" | "rejected" | "needs_review";
  sourceIds: string[];
}
```

### Important Rule

Do not merge two entities just because their names are similar.

Bad:

```text
John Smith = John Smith
```

Better:

```text
John Smith at address A with bank account X may match John A. Smith at address A with same phone number.
```

This keeps OSIRIS from turning into a false-positive confetti cannon. 🎉🚫

---

## 9. Fraud Signal Types

### 9.1 Account Takeover Signals

Examples:

- New device login
- New IP / impossible travel
- MFA reset
- Password reset followed by transfer
- Email changed before payout
- Sudden beneficiary change
- Failed login burst
- Login from known proxy/VPN/hosting ASN
- Session followed by unusual high-risk transaction

### 9.2 Payment Fraud Signals

Examples:

- Transaction amount outside normal range
- First-time counterparty
- High transaction velocity
- Many small transactions below review threshold
- Round-dollar transfers
- Failed authorization bursts
- Refunds to a different instrument
- Same device across many accounts
- Multiple cards to same shipping address
- Repeated chargebacks tied to one merchant/customer/device

### 9.3 Vendor / Invoice Fraud Signals

Examples:

- Vendor bank account changed recently
- Invoice comes from lookalike domain
- Payment urgency language
- Amount larger than vendor baseline
- Missing purchase order
- Duplicate invoice number
- Invoice metadata mismatch
- New vendor created shortly before payment
- Approver outside normal chain
- Vendor address shared by multiple unrelated vendors

### 9.4 Payroll Fraud Signals

Examples:

- Direct deposit change shortly before payroll
- Multiple employees use same bank account
- Employee paid after termination date
- Unusual overtime spike
- Ghost employee pattern
- Payroll account created without HR source record
- Address/phone reused across unrelated employees

### 9.5 Refund / Abuse Signals

Examples:

- Frequent refunds without returns
- High refund ratio
- Multiple accounts sharing device/address/payment method
- Refunds to new instruments
- Policy-edge behavior
- Support-ticket patterns indicating scripted abuse

### 9.6 Scam / Social Engineering Signals

Examples:

- Elderly or vulnerable customer suddenly wires large funds
- New foreign beneficiary
- Transaction inconsistent with historic activity
- Customer coached to avoid details
- Multiple wires after romance/investment contact
- Cryptocurrency transfer after recent account funding
- Urgency + secrecy + unfamiliar counterparty

### 9.7 Money Laundering-Like Signals

Examples:

- Rapid movement through accounts
- Layering through multiple counterparties
- Structured amounts below thresholds
- Circular transactions
- Dormant account suddenly active
- Pass-through account behavior
- High-risk jurisdiction exposure
- Funds in and out with little account purpose
- Use of shell-like entities
- Mixing legitimate and unusual flows

These are not proof of money laundering. They are typology-aligned indicators that require context and review.

---

## 10. Typologies

A typology is a known pattern of fraud or financial crime behavior.

### Examples

```text
Account Takeover:
  login anomaly → credential reset → profile change → new beneficiary → transfer

Vendor Impersonation:
  lookalike domain → payment instruction change → urgent invoice → new bank account

Synthetic Identity:
  thin-file identity → rapid credit build → bust-out behavior

Money Mule:
  new account → incoming deposits from unrelated parties → rapid outgoing transfers

Refund Abuse:
  many small purchases → support complaints → repeated refunds → linked devices/accounts

Payroll Diversion:
  employee email compromise → direct deposit change → payroll payout → account abandoned
```

Typologies help OSIRIS explain why a set of signals may matter.

---

## 11. Graph Modeling

Financial/fraud intelligence should be graph-first.

### Core Nodes

```ts
type FinancialGraphNodeType =
  | "person"
  | "business"
  | "employee"
  | "customer"
  | "vendor"
  | "merchant"
  | "account"
  | "transaction"
  | "payment_instrument"
  | "device"
  | "session"
  | "ip_address"
  | "location"
  | "document"
  | "domain"
  | "case"
  | "alert";
```

### Core Edges

```ts
type FinancialGraphEdgeType =
  | "owns"
  | "controls"
  | "transacted_with"
  | "paid"
  | "received_from"
  | "logged_in_from"
  | "used_device"
  | "used_payment_instrument"
  | "changed_to"
  | "shares_identifier_with"
  | "issued_document"
  | "approved"
  | "disputed"
  | "refunded"
  | "mentioned_in"
  | "same_as"
  | "similar_to";
```

### Example Graph

```text
Employee A
  → changed direct deposit to Bank Account Z
  → same Bank Account Z used by Employee B
  → change occurred 1 day before payroll
  → login came from new device
  → MFA reset occurred 30 minutes before change

Possible pattern:
  payroll diversion / account compromise
```

---

## 12. Anomaly Detection

An anomaly is a deviation from baseline.

### Baseline Dimensions

| Dimension | Example |
|---|---|
| Amount | Is this amount unusual for this entity? |
| Frequency | Is this number of transactions unusual? |
| Velocity | Did many actions happen too quickly? |
| Counterparty | Is the recipient new or unusual? |
| Geography | Is the location unexpected? |
| Device | Is the device new or shared? |
| Time | Is activity happening at abnormal hours? |
| Workflow | Did approval or process order change? |
| Channel | Is the payment channel unusual? |
| Document | Does the invoice differ from prior vendor templates? |

### Example

```text
Vendor normally invoices $3,000–$6,000 monthly.
New invoice arrives for $48,000.
Payment instructions changed 2 days earlier.
Sender domain is one character different from normal.
```

This is not just an amount anomaly. It is a multi-signal fraud hypothesis.

---

## 13. Rule-Based Detection vs Intelligence Synthesis

### Rule-Based Detection

```text
IF transaction_amount > 10000
AND destination_country IN high_risk_countries
THEN alert
```

Rules are useful but rigid.

### Intelligence Synthesis

```text
This transaction is notable because:
- The amount is 8.5x the customer baseline.
- The beneficiary is new.
- The customer changed phone/email 24 hours earlier.
- Login came from a new device.
- The transfer memo resembles known investment-scam language.
- However, there is no chargeback history and the customer passed MFA.
```

OSIRIS should support both:

```text
Rules generate signals.
Synthesis connects signals.
Reports explain the conclusion.
```

---

## 14. Confidence Scoring

Confidence answers:

> How strongly does the evidence support the hypothesis?

It is not the same as risk.

### Confidence Inputs

| Factor | Meaning |
|---|---|
| Source reliability | Is the data source trusted? |
| Signal quality | Is the signal specific or vague? |
| Corroboration | Do independent signals support the same hypothesis? |
| Entity match strength | Are identities/accounts/devices confidently linked? |
| Pattern fit | Does the sequence match a known typology? |
| Recency | Is the signal fresh? |
| Contradictions | Is there evidence against the hypothesis? |
| Baseline quality | Is there enough history to know what is normal? |

### Example Formula

```text
confidence =
  sourceReliability * 0.20
+ signalSpecificity * 0.15
+ corroboration * 0.20
+ entityResolutionStrength * 0.15
+ typologyFit * 0.15
+ baselineQuality * 0.10
- contradictionPenalty * 0.15
```

### Confidence Labels

| Score | Label |
|---:|---|
| 0–24 | Very Low |
| 25–44 | Low |
| 45–64 | Moderate |
| 65–84 | High |
| 85–100 | Very High |

---

## 15. Risk Scoring

Risk answers:

> How bad could this be if the hypothesis is true?

Risk is about impact, not certainty.

### Risk Inputs

| Factor | Meaning |
|---|---|
| Dollar amount | Potential loss or exposure. |
| Account privilege | Admin/vendor/payroll/treasury access increases risk. |
| Reversibility | Can the transaction be stopped or recovered? |
| Customer harm | Could a person be financially exploited? |
| Regulatory exposure | SAR/AML/sanctions/reporting implications. |
| Pattern severity | Does it resemble known high-impact schemes? |
| Repeatability | Can the same weakness be exploited again? |
| Spread | How many entities/accounts are connected? |

### Example Formula

```text
risk =
  financialExposure * 0.25
+ irreversibility * 0.15
+ regulatoryExposure * 0.15
+ vulnerablePartyImpact * 0.10
+ privilegeLevel * 0.10
+ patternSeverity * 0.15
+ networkSpread * 0.10
```

### Important Difference

```text
High confidence + low risk:
  Small confirmed refund abuse.

Low confidence + high risk:
  Weak signals around a very large outgoing wire.

Moderate confidence + high risk:
  Needs human review quickly.
```

---

## 16. Priority Scoring

Priority combines confidence, risk, and urgency.

```text
priority =
  (risk * 0.45)
+ (confidence * 0.30)
+ (urgency * 0.25)
```

### Priority Labels

| Score | Label |
|---:|---|
| 0–24 | Monitor |
| 25–44 | Review |
| 45–64 | Investigate |
| 65–84 | Escalate |
| 85–100 | Immediate Action |

---

## 17. OSIRIS Financial / Fraud Intelligence Data Model

```ts
interface FraudSignal {
  id: string;
  signalType:
    | "account_takeover"
    | "payment_anomaly"
    | "vendor_change"
    | "invoice_anomaly"
    | "refund_abuse"
    | "chargeback_pattern"
    | "payroll_anomaly"
    | "identity_risk"
    | "money_movement_pattern"
    | "scam_indicator"
    | "aml_red_flag"
    | "sanctions_screening"
    | "device_anomaly"
    | "location_anomaly"
    | "workflow_anomaly";
  title: string;
  description: string;
  entityIds: string[];
  transactionIds: string[];
  accountIds: string[];
  documentIds: string[];
  sourceIds: string[];
  occurredAt?: string;
  detectedAt: string;
  severity: number;
  confidence: number;
  tags: string[];
}
```

```ts
interface FraudHypothesis {
  id: string;
  hypothesisType:
    | "account_takeover"
    | "business_email_compromise"
    | "vendor_impersonation"
    | "invoice_fraud"
    | "payroll_diversion"
    | "refund_abuse"
    | "chargeback_abuse"
    | "synthetic_identity"
    | "money_mule_activity"
    | "laundering_like_activity"
    | "investment_scam"
    | "romance_scam"
    | "insider_misuse"
    | "unknown_financial_anomaly";
  title: string;
  summary: string;
  supportingSignalIds: string[];
  contradictingSignalIds: string[];
  involvedEntityIds: string[];
  involvedTransactionIds: string[];
  involvedAccountIds: string[];
  confidenceScore: number;
  riskScore: number;
  urgencyScore: number;
  priorityScore: number;
  confidenceLabel: "very_low" | "low" | "moderate" | "high" | "very_high";
  priorityLabel: "monitor" | "review" | "investigate" | "escalate" | "immediate_action";
  alternativeExplanations: string[];
  recommendedVerificationSteps: string[];
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
}
```

```ts
interface FraudCaseDossier {
  id: string;
  title: string;
  status: "open" | "under_review" | "escalated" | "closed_true_positive" | "closed_false_positive" | "closed_inconclusive";
  hypothesisIds: string[];
  entityIds: string[];
  transactionIds: string[];
  accountIds: string[];
  documentIds: string[];
  sourceIds: string[];
  timeline: FraudTimelineItem[];
  analystNotes: string[];
  finalDisposition?: string;
  createdAt: string;
  updatedAt: string;
}
```

```ts
interface FraudTimelineItem {
  id: string;
  occurredAt: string;
  title: string;
  description: string;
  relatedEntityIds: string[];
  relatedTransactionIds: string[];
  relatedSignalIds: string[];
  sourceIds: string[];
  confidence: number;
}
```

---

## 18. Example Financial / Fraud Intelligence Scenario

### Data Points

```text
1. Vendor bank account changed on Monday.
2. Invoice for same vendor arrives Tuesday.
3. Invoice is 4.8x larger than normal.
4. Email sender domain is "acrne-payments.com" instead of "acme-payments.com".
5. Payment requested by Friday with urgent language.
6. Approver is outside the vendor's normal approval chain.
```

### OSIRIS Hypothesis

```text
Possible Vendor Impersonation / Business Email Compromise
```

### Why

```text
The signals form a known BEC-like sequence:
  payment instruction change
  → unusual invoice
  → lookalike domain
  → urgency
  → workflow deviation
```

### Alternative Explanations

```text
- Legitimate vendor banking update.
- Real annual contract renewal.
- Vendor changed billing provider.
- Internal approval workflow changed.
- Domain belongs to authorized payment processor.
```

### Confidence

Moderate to high, depending on source quality and whether the domain is confirmed unauthorized.

### Risk

High if the payment is large and irreversible.

---

## 19. AI Chatbot Prompt Pretext

The following prompt is designed to be pasted into ChatGPT before a structured data payload. It tells the AI how to analyze the data and produce explainable financial/fraud intelligence.

```text
You are an OSIRIS Financial / Fraud Intelligence Analyst.

Your job is to analyze the structured data I provide and generate explainable, confidence-rated financial/fraud intelligence assessments.

You must follow these rules:

1. Do not accuse any person, company, vendor, customer, employee, or counterparty of fraud or crime.
2. Use cautious language such as "possible", "potential", "may indicate", "resembles", or "requires review".
3. Separate facts from analysis.
4. Identify the specific data points that support each assessment.
5. Identify alternative benign explanations.
6. Assign confidence scores based on evidence quality, source reliability, corroboration, entity resolution strength, baseline quality, typology fit, and contradictions.
7. Assign risk scores based on financial exposure, irreversibility, regulatory exposure, potential customer harm, privilege level, pattern severity, and network spread.
8. Assign urgency scores based on timing, transaction status, recoverability window, active exploitation, and upcoming deadlines.
9. Do not recommend illegal, invasive, discriminatory, or privacy-violating actions.
10. Recommend defensive, verification, compliance, or review steps only.
11. If the evidence is weak, say so clearly.
12. If the data is insufficient, list what additional data would improve the assessment.
13. Prefer structured output.
14. Be careful with false positives.
15. Never treat demographic attributes as fraud indicators.
16. Never use protected class, nationality, religion, race, gender, sexuality, disability, or political belief as a risk factor.
17. Do not provide instructions for committing fraud, bypassing controls, laundering money, evading detection, or exploiting financial systems.

Analyze the data using this structure:

A. Executive Summary
- Give a short overview of the most important possible financial/fraud patterns.
- Mention the top 3 highest-priority findings.

B. Detected Hypotheses
For each possible hypothesis, provide:
- Hypothesis title
- Hypothesis type
- Priority label
- Confidence score from 0–100
- Confidence label
- Risk score from 0–100
- Urgency score from 0–100
- Summary
- Supporting facts
- Pattern logic
- Timeline of relevant events
- Involved entities
- Involved accounts
- Involved transactions
- Involved documents
- Alternative explanations
- Contradicting or missing evidence
- Recommended verification steps
- Recommended defensive actions

C. Entity / Relationship Graph Summary
- Identify important entities.
- Identify shared accounts, devices, locations, payment instruments, domains, documents, or counterparties.
- Explain why each relationship matters.
- Include relationship confidence.

D. Transaction / Money Movement Summary
- Identify notable transaction flows.
- Identify unusual amounts, velocity, routing, reversals, disputes, refunds, or counterparties.
- Explain whether each is normal, abnormal, or unknown based on available data.

E. Typology Matches
- Identify whether the data resembles known fraud/financial crime typologies, such as:
  - account takeover
  - vendor impersonation
  - business email compromise
  - invoice fraud
  - payroll diversion
  - refund abuse
  - chargeback abuse
  - money mule behavior
  - laundering-like activity
  - investment scam
  - romance scam
  - synthetic identity
  - insider misuse
- Explain the match strength and limitations.

F. Confidence Explanation
- Explain exactly how confidence was calculated.
- Mention source quality, signal specificity, corroboration, entity match strength, baseline quality, typology fit, and contradictions.

G. Risk Explanation
- Explain exactly why risk is low, moderate, high, or severe.
- Distinguish financial exposure from confidence.

H. Recommended Next Steps
- Provide practical verification steps.
- Provide defensive actions.
- Provide monitoring steps.
- Provide escalation criteria.
- Do not recommend punitive action based only on the assessment.

I. Data Quality Problems
- List missing fields, ambiguous entities, weak matches, stale data, duplicate records, or normalization issues.

J. Final JSON Summary
Return a JSON summary with this shape:

{
  "topFindings": [
    {
      "title": "",
      "hypothesisType": "",
      "priorityLabel": "",
      "confidenceScore": 0,
      "riskScore": 0,
      "urgencyScore": 0,
      "summary": "",
      "keyEvidence": [],
      "alternativeExplanations": [],
      "recommendedNextSteps": []
    }
  ],
  "entitiesOfInterest": [],
  "relationshipsOfInterest": [],
  "transactionsOfInterest": [],
  "dataQualityIssues": [],
  "overallAssessment": ""
}

Now analyze the following OSIRIS financial/fraud intelligence payload:
```

---

## 20. Example Structured Payload

```json
{
  "sources": [
    {
      "id": "src_email_001",
      "type": "email",
      "title": "Payment instruction update from ACME vendor",
      "reliabilityScore": 72,
      "collectedAt": "2026-06-01T09:15:00Z"
    },
    {
      "id": "src_invoice_001",
      "type": "invoice",
      "title": "ACME Invoice 7721",
      "reliabilityScore": 80,
      "collectedAt": "2026-06-02T10:05:00Z"
    },
    {
      "id": "src_vendor_master_001",
      "type": "vendor_master",
      "title": "Vendor bank account update log",
      "reliabilityScore": 90,
      "collectedAt": "2026-06-01T08:45:00Z"
    }
  ],
  "entities": [
    {
      "id": "ent_vendor_acme",
      "type": "vendor",
      "displayName": "ACME Payments",
      "aliases": ["ACME Inc.", "Acme Payments LLC"],
      "riskFlags": []
    },
    {
      "id": "ent_domain_suspect",
      "type": "domain",
      "displayName": "acrne-payments.com",
      "aliases": [],
      "riskFlags": ["lookalike_domain"]
    },
    {
      "id": "ent_employee_requester",
      "type": "employee",
      "displayName": "Internal Requester",
      "aliases": [],
      "riskFlags": []
    }
  ],
  "accounts": [
    {
      "id": "acct_vendor_old",
      "accountType": "bank_account",
      "ownerEntityId": "ent_vendor_acme",
      "maskedIdentifier": "****2231",
      "status": "active"
    },
    {
      "id": "acct_vendor_new",
      "accountType": "bank_account",
      "ownerEntityId": "ent_vendor_acme",
      "maskedIdentifier": "****9910",
      "status": "active",
      "tags": ["recently_added"]
    }
  ],
  "transactions": [
    {
      "id": "txn_invoice_7721",
      "transactionType": "invoice",
      "amount": 48000,
      "currency": "USD",
      "occurredAt": "2026-06-02T10:00:00Z",
      "originAccountId": "internal_ap_account",
      "destinationAccountId": "acct_vendor_new",
      "counterpartyId": "ent_vendor_acme",
      "status": "pending",
      "memo": "Urgent processing requested by Friday",
      "tags": ["unusual_amount", "urgent_language", "new_destination_account"]
    }
  ],
  "documents": [
    {
      "id": "doc_invoice_7721",
      "documentType": "invoice",
      "sourceId": "src_invoice_001",
      "issuerEntityId": "ent_vendor_acme",
      "recipientEntityId": "internal_company",
      "amount": 48000,
      "currency": "USD",
      "issuedAt": "2026-06-02T10:00:00Z",
      "extractedDomains": ["acrne-payments.com"],
      "tags": ["invoice_amount_above_baseline", "lookalike_domain_detected"]
    }
  ],
  "signals": [
    {
      "id": "sig_bank_change",
      "signalType": "vendor_change",
      "title": "Vendor bank account changed before large invoice",
      "description": "Vendor destination account changed one day before a large pending invoice.",
      "entityIds": ["ent_vendor_acme"],
      "transactionIds": ["txn_invoice_7721"],
      "accountIds": ["acct_vendor_new"],
      "documentIds": [],
      "sourceIds": ["src_vendor_master_001"],
      "detectedAt": "2026-06-02T10:10:00Z",
      "severity": 75,
      "confidence": 82,
      "tags": ["payment_instruction_change", "timing_risk"]
    },
    {
      "id": "sig_lookalike_domain",
      "signalType": "invoice_anomaly",
      "title": "Lookalike domain detected in invoice correspondence",
      "description": "Invoice references acrne-payments.com, visually similar to acme-payments.com.",
      "entityIds": ["ent_vendor_acme", "ent_domain_suspect"],
      "transactionIds": ["txn_invoice_7721"],
      "accountIds": [],
      "documentIds": ["doc_invoice_7721"],
      "sourceIds": ["src_email_001", "src_invoice_001"],
      "detectedAt": "2026-06-02T10:11:00Z",
      "severity": 80,
      "confidence": 76,
      "tags": ["lookalike_domain", "bec_indicator"]
    }
  ]
}
```

---

## 21. Example AI Output

```json
{
  "topFindings": [
    {
      "title": "Possible Vendor Impersonation / Business Email Compromise",
      "hypothesisType": "vendor_impersonation",
      "priorityLabel": "escalate",
      "confidenceScore": 78,
      "riskScore": 86,
      "urgencyScore": 82,
      "summary": "The data resembles a vendor impersonation or BEC-style payment diversion pattern. The strongest indicators are a recent vendor bank account change, a pending high-value invoice, urgent payment language, and a lookalike domain associated with invoice correspondence.",
      "keyEvidence": [
        "Vendor destination account changed one day before the pending invoice.",
        "Invoice amount is tagged as above baseline.",
        "Invoice references a lookalike domain: acrne-payments.com.",
        "Payment memo includes urgent processing language.",
        "Transaction is still pending, increasing urgency and recoverability value."
      ],
      "alternativeExplanations": [
        "The vendor may have legitimately changed banks.",
        "The lookalike domain may be an authorized payment processor or typo in extracted data.",
        "The invoice may be part of a legitimate annual renewal or exceptional project."
      ],
      "recommendedNextSteps": [
        "Pause or hold payment pending verification if policy allows.",
        "Verify bank account change using a known trusted vendor contact, not the contact info in the suspicious email.",
        "Compare invoice template, metadata, and payment instructions against prior known-good invoices.",
        "Check domain registration age and ownership.",
        "Review approval workflow for deviations."
      ]
    }
  ],
  "entitiesOfInterest": [
    "ent_vendor_acme",
    "ent_domain_suspect",
    "acct_vendor_new"
  ],
  "relationshipsOfInterest": [
    "ent_vendor_acme -> changed_to -> acct_vendor_new",
    "doc_invoice_7721 -> mentions -> ent_domain_suspect",
    "txn_invoice_7721 -> pays -> acct_vendor_new"
  ],
  "transactionsOfInterest": [
    "txn_invoice_7721"
  ],
  "dataQualityIssues": [
    "No prior invoice baseline values were included directly in the payload.",
    "No trusted vendor domain was included as a structured entity for direct comparison.",
    "No approval-chain history was included."
  ],
  "overallAssessment": "Moderate-to-high confidence and high-risk possible vendor impersonation/BEC pattern. Human verification is recommended before payment completion."
}
```

---

## 22. Local-First Implementation Strategy

### Phase 1 — Data Model

Build the core tables:

```text
sources
financial_entities
financial_accounts
financial_transactions
financial_documents
financial_signals
financial_relationships
fraud_hypotheses
fraud_case_dossiers
fraud_timeline_items
```

### Phase 2 — Normalization

Create local utilities for:

```text
normalizeAmount()
normalizeCurrency()
normalizeDate()
normalizeMerchantName()
normalizeVendorName()
normalizeEmail()
normalizeDomain()
normalizePhone()
normalizeAddress()
normalizeTransactionType()
```

### Phase 3 — Basic Rules

Start with transparent rules:

```text
recent_account_change + high_value_payment
lookalike_domain + invoice
new_device + password_reset + transfer
multiple_accounts + same_bank_account
refund_ratio_above_threshold
duplicate_invoice_number
amount_above_vendor_baseline
first_time_counterparty + high_value_transfer
```

### Phase 4 — Graph View

Build a simple graph around:

```text
entity → account → transaction → counterparty → document → source
```

### Phase 5 — Dossier Pages

Each dossier should include:

```text
Summary
Timeline
Entities
Transactions
Accounts
Documents
Signals
Relationships
Confidence Explanation
Risk Explanation
Alternative Explanations
Recommended Verification Steps
Source List
```

### Phase 6 — AI-Assisted Analysis

The AI should receive only the structured payload, not raw private financial data unless needed and authorized.

Prefer:

```text
masked accounts
hashed identifiers
summarized transactions
sanitized names
limited date ranges
minimum necessary data
```

---

## 23. Suggested OSIRIS UI Pages

### Financial Intelligence Dashboard

Shows:

- Top risk hypotheses
- Pending high-value anomalies
- Recent account/payment changes
- Fraud typology matches
- Open dossiers
- High-risk entities
- Trend charts

### Transaction Graph Page

Shows:

- Accounts
- Transactions
- Counterparties
- Payment instruments
- Shared identifiers
- Flow paths

### Fraud Signal Feed

Shows:

- Detected signal
- Entity
- Severity
- Confidence
- Risk
- Source
- Status

### Case Dossier Page

Shows:

- Narrative summary
- Evidence cards
- Timeline
- Graph
- Alternative explanations
- Recommended next steps
- Analyst notes

### Entity Profile Page

Shows:

- Entity aliases
- Linked accounts
- Transactions
- Documents
- Devices
- Signals
- Cases
- Relationship confidence

---

## 24. Guardrails

Financial/fraud intelligence needs strict guardrails.

### Do

- Use explainable scoring.
- Preserve source attribution.
- Mask sensitive data where possible.
- Require human review.
- Separate risk from proof.
- Track false positives.
- Document assumptions.
- Protect personal and financial data.
- Use least-privilege data access.
- Keep audit logs.

### Do Not

- Automatically accuse people.
- Use protected attributes as risk signals.
- Make punitive decisions solely from AI output.
- Store unnecessary sensitive data.
- Expose full account numbers.
- Use scraped private data unlawfully.
- Provide instructions for committing fraud.
- Optimize for avoiding detection.
- Treat weak correlation as proof.

---

## 25. Public Reference Anchors

Use these as conceptual grounding while building OSIRIS financial/fraud intelligence:

- FinCEN Suspicious Activity Report guidance and SAR narrative expectations
- FFIEC authentication and access risk management guidance
- FATF Recommendations and risk-based AML approach
- FFIEC BSA/AML Manual red flags
- COSO / ACFE Fraud Risk Management Guide
- OCC fraud risk management principles
- OFAC sanctions screening resources
- SEC and FINRA financial crime enforcement examples
- NIST privacy and cybersecurity frameworks for data protection

---

## 26. Final Takeaway

Financial / fraud intelligence is about explaining suspicious money-related patterns without jumping to unsupported conclusions.

The OSIRIS model should be:

```text
Collect signals.
Normalize entities.
Build transaction relationships.
Detect anomalies.
Match typologies.
Score confidence separately from risk.
Generate a dossier.
Require human verification.
Preserve source attribution.
```

The best version of OSIRIS does not say:

```text
This is fraud.
```

It says:

```text
This may indicate vendor impersonation because these five signals align with that typology.
Here are the exact supporting facts.
Here are benign explanations.
Here is the confidence.
Here is the financial risk.
Here is what to verify next.
```

That is useful, careful, and defensible.
