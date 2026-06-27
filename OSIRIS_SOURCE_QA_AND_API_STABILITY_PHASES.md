# OSIRIS Source QA And API Stability Phases

Created: 2026-06-27

This checklist tracks the work needed to improve RSS collection, article QA, signal summarization, API call discipline, and flight data reliability.

## Phase 0 - Baseline And Safety Rails

- [x] Record the current source health snapshot: enabled sources, online sources, accepted items, rejected items, and top rejection reasons.
- [x] Record the current `/api/gdelt` response shape, payload size, response time, and cache metadata.
- [x] Record the current `/api/source-health` response shape, payload size, response time, and cache metadata.
- [x] Record the current `/api/flights` response behavior, upstream ADS-B timings, and timeout/failure mode.
- [x] Identify every UI and server route that calls `/api/gdelt`, `/api/source-health`, `/api/news`, `/api/flights`, and AI endpoints.
- [x] Define acceptance targets for each feed lane: world events, local events, cyber, structured observations, and context.
- [x] Keep the live source of truth in project-root `osiris-data/*.json`; avoid hiding source policy changes in code-only constants.

### Phase 0 Baseline Snapshot - 2026-06-27T02:32:22Z

Source health baseline:

| Metric | Value |
| --- | ---: |
| Enabled sources | 70 |
| Disabled sources | 0 |
| Online sources | 31 |
| Warning/stale sources | 39 |
| Offline sources | 0 |
| Failed sources | 0 |
| Cached sources | 70 |
| Stale sources | 39 |
| Accepted items | 148 |
| Rejected items | 2468 |

Top rejection reasons:

| Reason | Count |
| --- | ---: |
| `no_keyword_match` | 608 |
| `source_lane_structured_observation` | 590 |
| `source_lane_context` | 281 |
| `no_location_match` | 274 |
| `outside_freshness_window` | 233 |
| `source_lane_cyber` | 163 |
| `no_event_action` | 129 |
| `non_event_article` | 111 |
| `no_event_location_cooccurrence` | 26 |
| `missing_title_or_link` | 20 |
| `below_severity_threshold` | 12 |
| `historical_reference` | 8 |

Lane mix:

| Lane | Source Count |
| --- | ---: |
| `world-events` | 39 |
| `local-events` | 9 |
| `cyber` | 6 |
| `context` | 12 |
| `structured-observation` | 4 |

API response baseline:

| Endpoint | HTTP | Time | Payload | Cache Mode | Key Notes |
| --- | ---: | ---: | ---: | --- | --- |
| `/api/source-health` | 200 | 0.176s | 58,418 bytes | `live` | Shape includes `ok`, `checkedAt`, `cache`, `summary`, `topRejectionReasons`, and per-source diagnostics. |
| `/api/gdelt` | 200 | 16.760s | 764,400 bytes | `live` | Shape includes `events`, `derivedSignals`, `total`, `derivedTotal`, `timestamp`, `source`, `sourceNote`, and `metadata`. |
| `/api/flights` | 200 | 17.526s | 4,339 bytes | `live` | Partial success worked; 3 regions succeeded and 3 failed during this sample. |

`/api/gdelt` metadata baseline:

| Metric | Value |
| --- | ---: |
| Feed count | 70 |
| Keyword count | 838 |
| Location count | 335 |
| Promoted events | 147 |
| Map-eligible events | 147 |
| Signal-eligible events | 147 |
| Cache hits during collection | 31 |
| Stale cache count during collection | 0 |
| Failed feed count | 0 |
| Total processed items | 2615 |
| Accepted items | 147 |
| Rejected items | 2468 |
| Derived signals | 21 |

`/api/flights` baseline:

| Metric | Value |
| --- | ---: |
| Total aircraft returned | 11 |
| Commercial aircraft | 10 |
| Private aircraft | 1 |
| Private jets | 0 |
| Military aircraft | 0 |
| GPS jamming points | 0 |
| Successful ADS-B regions | 3 |
| Failed ADS-B regions | 3 |
| Upstream duration | 17.526s |

Flight region notes:

| Region | Status | Notes |
| --- | --- | --- |
| `south-america` | Success | Returned 11 aircraft. |
| `australia` | Success | Returned 0 aircraft. |
| `africa` | Success | Returned 0 aircraft. |
| `north-america` | Failed | Region timed out. |
| `europe` | Failed | Region timed out. |
| `east-asia` | Failed | ADS-B upstream returned HTTP 420. |

API caller inventory:

| Caller | Endpoint(s) |
| --- | --- |
| `src/features/home/pages/HomePage.tsx` | `/api/gdelt` |
| `src/features/signals/SignalsPage.tsx` | `/api/gdelt` |
| `src/lib/local-config/client.ts` | `/api/source-health` |
| `src/app/map/MapPage.tsx` | `/api/news`, `/api/flights`, `/api/gdelt` |
| `src/app/api/stats/route.ts` | `/api/flights`, `/api/gdelt` |
| `src/app/api/health/route.ts` | `/api/flights`, `/api/news`, `/api/gdelt` |
| `src/app/api/scm-suppliers/route.ts` | `/api/gdelt` through hard-coded localhost |
| `src/components/AiAnalyst.tsx` | `/api/ai/analyze`, `/api/ai/briefing` |
| `src/features/settings/developer/DeveloperSettingsPage.tsx` | Links to `/api/gdelt` |

Acceptance targets before tuning:

| Lane | Target |
| --- | --- |
| `world-events` | Keep a focused incident acceptance rate around 8-20% after excluding intentional non-map lanes. Require clear event action, usable location, freshness, and enough severity to justify map promotion. |
| `local-events` | Start around 3-12% acceptance. Prefer precise city, county, port, facility, or regional matches; avoid promoting broad local general-news mentions without an actionable incident. |
| `cyber` | Do not count as failed map QA by default. Route to cyber-specific signals or a future cyber layer unless the item also describes a physical-world operational impact. |
| `structured-observation` | Do not count as failed article QA. Treat as data-layer input for dedicated mappers such as earthquakes, weather, aviation, maritime, or jamming overlays. |
| `context` | Do not count as failed article QA by default. Use for analyst context, briefings, background confidence, and source enrichment unless an explicit promotion policy marks it as event-promotable. |

Source-of-truth rule:

- Project-root `osiris-data/*.json` files are the editable policy and source configuration authority.
- Project-root `osiris-data/cache/*` files are derived runtime state and should not become the policy authority.
- Code constants should be fallback defaults, normalizers, and validators only; source policy changes belong in the JSON config path whenever possible.

## Phase 1 - Ingestion Metrics Cleanup

- [x] Split ingestion diagnostics into `processedItems`, `acceptedItems`, `candidateRejectedItems`, and `excludedItems`.
- [x] Stop counting intentional lane exclusions as article rejections.
- [x] Add `excludedReasons` separately from `rejectionReasons`.
- [x] Add lane-level rollups to diagnostics: world events, local events, cyber, structured observations, and context.
- [x] Add category-level rollups to diagnostics so low-yield categories are visible without digging through source cards.
- [x] Update `/api/source-health` summary totals to show accepted, candidate rejected, excluded, stale, and failed counts.
- [x] Update the Sources UI ingestion card to show honest labels instead of a single scary rejected total.
- [x] Add a small explanation in source diagnostics for "excluded by lane" versus "rejected by QA."
- [x] Verify the dashboard no longer reports structured/cyber/context feeds as failed article QA.

### Phase 1 Verification Snapshot - 2026-06-27T02:43:14Z

Runtime API split after the cleanup:

| Metric | Value |
| --- | ---: |
| Processed items | 2613 |
| Accepted items | 147 |
| QA rejected candidate items | 1393 |
| Intentionally excluded items | 1073 |
| Failed sources | 0 |
| Stale sources | 0 |

Top QA rejection reasons:

| Reason | Count |
| --- | ---: |
| `no_keyword_match` | 604 |
| `no_location_match` | 271 |
| `outside_freshness_window` | 231 |
| `no_event_action` | 129 |
| `non_event_article` | 78 |
| `no_event_location_cooccurrence` | 27 |
| `missing_title_or_link` | 20 |
| `below_severity_threshold` | 12 |

Top intentional exclusions:

| Reason | Count |
| --- | ---: |
| `source_lane_structured_observation` | 592 |
| `source_lane_context` | 316 |
| `source_lane_cyber` | 165 |

Lane rollups:

| Lane | Sources | Processed | Accepted | QA Rejected | Excluded |
| --- | ---: | ---: | ---: | ---: | ---: |
| `world-events` | 39 | 1226 | 133 | 1093 | 0 |
| `local-events` | 9 | 314 | 14 | 300 | 0 |
| `cyber` | 6 | 165 | 0 | 0 | 165 |
| `structured-observation` | 4 | 592 | 0 | 0 | 592 |
| `context` | 12 | 316 | 0 | 0 | 316 |

Verification notes:

- `/api/gdelt` returned HTTP 200 in 13.040s with `metadata.diagnosticTotals` split into QA rejections and exclusions.
- `/api/source-health` returned HTTP 200 in 0.067s with the same split in `summary`, `topRejectionReasons`, `topExcludedReasons`, and lane/category rollups.
- Browser-side fetch from `/sources` confirmed the corrected `/api/source-health` JSON shape.
- Playwright could load `/sources`, but the existing long-running dev server reported broken HMR websocket handshakes and did not settle the client-side loading state during the smoke test. Next refused a second clean dev server because the existing repo dev server is already running on port 3000.

## Phase 2 - API Call Discipline

- [x] Build a route caller inventory for Home, Map, Signals, Sources, Stats, SCM suppliers, and developer tools.
- [x] Make `/api/gdelt` cache-first by default and reserve live collection for `?refresh=true`, stale cache, or explicit background refresh.
- [x] Add an in-flight collection lock for `/api/gdelt` so simultaneous Home, Map, Signals, and Stats requests share one job.
- [x] Change Home and Signals to prefer cached normalized events unless the user explicitly refreshes.
- [x] Change Map global incidents loading to use cached incidents first, then refresh only when the global incidents layer is active and stale.
- [x] Fix `/api/stats` so it reads `events.length` from `/api/gdelt`, or better, reads the derived cache directly without triggering collection.
- [x] Remove hard-coded `http://127.0.0.1:3000` internal API calls from server routes.
- [x] Add debug metadata to API responses showing whether data came from live network, fresh local cache, stale cache, or fallback.
- [x] Verify opening Home, Map, Sources, and Signals does not cause surprise duplicate collection work.

### Phase 2 Verification Snapshot - 2026-06-27T03:01:20Z

`/api/gdelt` cache-first behavior:

| Request | HTTP | Time | Total | Derived Signals | Cache Mode | Served From | Request Reason | Shared Job |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| First default `/api/gdelt` | 200 | 17.007s | 146 | 22 | `live` | `live-network` | `cache-miss` | `false` |
| Second default `/api/gdelt` | 200 | 0.031s | 146 | 22 | `fresh-cache` | `fresh-local-cache` | `default` | `false` |

Concurrent manual refresh verification:

| Request | HTTP | Cache Mode | Request Reason | Shared Job |
| --- | ---: | --- | --- | --- |
| Refresh A `/api/gdelt?refresh=true` | 200 | `live` | `manual-refresh` | `false` |
| Refresh B `/api/gdelt?refresh=true` | 200 | `live` | `manual-refresh` | `true` |

Server route verification:

| Route | Result |
| --- | --- |
| `/api/stats` | Returned `incidents: 146` from local cache without triggering live GDELT collection. |
| `/api/scm-suppliers` | Returned HTTP 200 after switching internal calls to request-derived origin URLs. |
| `/api/markets` | Returned HTTP 200 after switching internal maritime call to request-derived origin URL. |
| Internal localhost sweep | No hard-coded `127.0.0.1:3000/api/*` calls remain in `src/app` or `src/lib`. |

Implementation notes:

- Phase 0 already captured the caller inventory, and this phase used that inventory to update Home, Signals, Stats, SCM suppliers, Markets, and the GDELT route.
- Home and Signals now use cached `/api/gdelt` on normal load and only append `?refresh=true` on explicit user refresh.
- Map global incidents already call `/api/gdelt` without an explicit refresh flag, so the route-level cache-first behavior now keeps that layer cache-first as well.
- Developer tools now track the dedicated `gdelt-response` derived cache alongside normalized events, generated signals, and source health.

## Phase 3 - Article QA Tuning

- [x] Add sampled rejected items to diagnostics: title, URL, source, reason, matched keywords, matched location, and matched sentence when available.
- [x] Add per-reason sample caps so diagnostics stay compact and safe to render.
- [x] Expand roundup detection to catch source-specific digest titles such as `Headlines for June 26, 2026`.
- [x] Reject or de-prioritize multi-topic articles that mention many unrelated places and events in one feed item.
- [x] Add a QA rule that requires the selected signal headline to come from a single-event article, not a digest item.
- [x] Review the `no_keyword_match` samples and add missing operational terms only when they improve real incident capture.
- [x] Review the `no_location_match` samples and add important missing locations, aliases, ports, chokepoints, and regions to `osiris-data/location-registry.json`.
- [x] Review the `no_event_action` samples and add narrowly scoped event verbs only when they describe real changes or incidents.
- [ ] Review the `outside_freshness_window` sources and decide whether each feed needs a different `promotionPolicy.maxAgeHours`.
- [ ] Add feed-level QA overrides in `promotionPolicy` where category defaults are too blunt.
- [x] Verify the accepted set improves without flooding the map with weak single-keyword/country-level matches.

### Phase 3 Verification Snapshot - 2026-06-27T03:18:32Z

- `src/app/api/gdelt/route.ts` now stores bounded `rejectedSamples` in per-feed diagnostics, rejects digest and multi-topic items earlier, and only lets a digest-style article become a signal headline when no cleaner article exists in the cluster.
- `src/features/sources/SourcesPage.tsx` now renders sample QA rejects directly from source-health so feed tuning can use real titles, locations, keywords, and matched sentences instead of counters alone.
- `src/lib/event-pipeline/keywordMatching.ts` now catches digest patterns such as `Headlines for June 26, 2026`, `live blog`, and `as it happened`, and adds present-tense event actions such as `kills`, `halts`, `declares`, `approves`, and `vetoes`.
- `osiris-data/location-registry.json` gained `U.K.` and `DR Congo` aliases plus `Rwanda` and `Zimbabwe` country entries after reviewing live `no_location_match` samples.
- `no_keyword_match` review did not justify expanding keyword packs in this pass; sampled misses were still mostly commentary, product, sports, legal, or evergreen pieces.
- Live `/api/gdelt?refresh=true` before the location/action tuning produced `114` accepted items and `18` derived signals, with top QA reasons: `no_keyword_match 600`, `no_location_match 272`, `no_event_action 126`, `multi_topic_article 35`, `multi_event_roundup 29`.
- Live `/api/gdelt?refresh=true` after the location/action tuning produced `121` accepted items and `19` derived signals, with top QA reasons: `no_keyword_match 597`, `no_location_match 270`, `no_event_action 112`, `multi_topic_article 38`, `multi_event_roundup 29`.
- Fresh `/api/source-health?refresh=true` now reports `121` accepted, `1424` QA rejected, and bounded per-source rejection samples (for example `guardian-world` at `18` samples and `aljazeera-world` at `15`) without unbounded payload growth.
- `outside_freshness_window` still needs a deliberate per-feed policy pass. The heaviest current offenders are stale or analysis-heavy feeds such as `war-on-the-rocks`, `cnn-top`, `who-news`, `sfgate-news`, and `democracy-now`, so any `promotionPolicy.maxAgeHours` override should be handled as a feed audit rather than widened blindly.

## Phase 4 - Signal Summaries And Titles

- [ ] Replace generic cluster titles with generated deterministic titles based on location, event type, source count, and strongest event action.
- [ ] Use the primary article headline as evidence, not necessarily as the signal title.
- [ ] Add a digest-headline penalty so roundup articles cannot become primary evidence unless no cleaner article exists.
- [ ] Rewrite signal explanations to include the concrete trigger: event action, location, timeframe, corroborating source count, and strongest uncertainty.
- [ ] Add source-specific evidence snippets that are short, non-generic, and tied to the matched sentence.
- [ ] Show why a cluster exists using the exact shared keys: location, event type, keyword family, and time bucket.
- [ ] Include what changed since the prior cache snapshot when possible.
- [ ] Verify sample signals read like analyst notes rather than template prose.

## Phase 5 - AI Analyst Context Upgrade

- [ ] Update `AiAnalyst` event mapping to use current OSIRIS event fields: `severityLevel`, `severityScore`, `confidenceScore`, `publishedAt`, `knownFacts`, `uncertainty`, and `watchNext`.
- [ ] Stop deriving threat severity from legacy `tone` fields that current `/api/gdelt` events do not provide.
- [ ] Include derived signals in the AI context, not only raw events.
- [ ] Include cache freshness and source QA metadata in the AI context so the model can state data limitations accurately.
- [ ] Add a compact context serializer for signal evidence that preserves source names, titles, URLs, severity, confidence, and timestamps.
- [ ] Add an AI endpoint request guard so model calls only happen from explicit user actions.
- [ ] Verify AI briefings reference real current event titles and source names from the context.

## Phase 6 - Flight Data Recovery

- [x] Reproduce the current `/api/flights` timeout locally and capture response behavior.
- [x] Test ADS-B upstream regions at current `dist` values and record bytes, aircraft counts, and response times.
- [x] Reduce region radius or split large regions into smaller prioritized tiles so each upstream request can finish inside the timeout.
- [ ] Increase timeout only after payload size is reduced; avoid masking oversized upstream pulls.
- [x] Add partial-success responses so one slow region cannot block all flight data.
- [x] Add route metadata listing successful regions, failed regions, timeout counts, and total upstream duration.
- [x] Add stale flight cache fallback so the map can keep showing last-known aircraft when live ADS-B pulls fail.
- [ ] Consider using OpenSky OAuth credentials when configured, with ADS-B as fallback.
- [x] Verify `/api/flights` returns useful aircraft counts within a predictable time budget.
- [ ] Verify Map flight layers render commercial, private, private jet, military, and GPS-jamming overlays after recovery.

## Phase 7 - Source Configuration Pass

- [ ] Audit all 70 RSS sources for category, lane, refresh interval, and promotion policy.
- [ ] Mark cyber, finance, technology, good-news, weather, and structured feeds as intentionally excluded from map promotion unless a dedicated mapper exists.
- [ ] Add explicit `promotionPolicy` to feeds where the category default is not clear enough.
- [ ] Review high-volume low-yield feeds such as USGS month feeds, broad Google News feeds, stale analysis feeds, and local general-news feeds.
- [ ] Adjust source freshness windows by feed type: breaking news, analysis, official structured feeds, local feeds, and slow-moving reports.
- [ ] Disable or downgrade feeds that consistently add noise without useful events.
- [ ] Verify settings save/read flows preserve every policy field.

## Phase 8 - Verification And Regression Checks

- [ ] Add or update focused tests for source policy resolution.
- [ ] Add or update focused tests for roundup detection.
- [ ] Add or update focused tests for event sentence matching.
- [ ] Add or update focused tests for diagnostics rollups.
- [ ] Add or update focused tests for `/api/gdelt` cache-first behavior.
- [ ] Add or update focused tests for `/api/flights` partial-success and stale-cache fallback.
- [ ] Run lint and type checks.
- [ ] Run a local dev smoke test for Home, Map, Sources, Signals, and AI Analyst.
- [ ] Capture before/after metrics for accepted, candidate rejected, excluded, and signal counts.
- [ ] Update this checklist as each phase is implemented and verified.

## Phase 9 - Upstream Flight Provider Fusion

- [ ] Add a provider-fusion plan for `/api/flights` that combines current ADS-B coverage with upstream-style multi-provider pulls.
- [ ] Test direct OpenSky global traffic coverage against current ADS-B regional coverage and record count, latency, and failure behavior.
- [ ] Test `airplanes.live` military and LADD/private endpoints as additive sources for military and private-jet coverage.
- [ ] Add provider precedence and dedupe rules keyed by `hex` / `icao24` so higher-confidence military and private records win cleanly.
- [ ] Preserve current partial-success behavior, stale fallback, and route metadata while adding provider-level metadata.
- [ ] Add response metadata showing which providers contributed aircraft and how many records each provider added.
- [ ] Verify the fused route improves military and private jet coverage without reintroducing timeout-heavy global pulls.
- [ ] Verify GPS-jamming overlays still compute correctly after provider fusion.

## Phase 10 - Direct GDELT Geo Supplement

- [ ] Evaluate upstream-style direct GDELT GeoJSON queries as a secondary incident input, not a replacement for the local RSS promotion pipeline.
- [ ] Define a narrow set of direct GDELT geo queries for protest, conflict, coup, emergency, and similar event families that overlap with OSIRIS watch priorities.
- [ ] Add a disabled-by-default experiment path that can pull direct GDELT geo events into a separate enrichment bucket.
- [ ] Compare direct GDELT geo hits against promoted RSS incidents for coordinate quality, duplication rate, false positives, and lead time.
- [ ] Decide whether direct GDELT geo should be used for corroboration, fallback when RSS collection fails, or not at all.
- [ ] If adopted, keep direct GDELT geo evidence visually and diagnostically separate from promoted RSS incidents so operators can see provenance clearly.

## Phase 11 - Upstream Compare Notes

- [x] Compare current checkout map ingestion against `simplifaisoul/osiris`.
- [x] Confirm the largest architectural split is incident ingestion: upstream uses direct GDELT geo queries, while this checkout uses local config-driven RSS promotion plus derived signals and source QA.
- [x] Confirm upstream still has hard-coded localhost self-fetches in `markets` and `scm-suppliers`, while this checkout already removed them.
- [x] Confirm upstream `stats` still fans out into `/api/gdelt`, while this checkout now reads incident totals from local derived cache.
- [x] Confirm upstream does not expose an equivalent to `/api/source-health` with per-feed diagnostics and bounded reject samples.
- [x] Confirm upstream flight ingestion is stronger on provider breadth because it combines OpenSky with `airplanes.live` military and LADD/private feeds.

### Phase 11 Verification Snapshot - 2026-06-27T03:27:50Z

- Upstream `/api/gdelt` is a direct GDELT GeoJSON pull with a few broad queries and simple proximity dedupe; this checkout’s `/api/gdelt` is a local-first RSS promotion pipeline with source policies, rejection diagnostics, cache metadata, and derived signals.
- Upstream dashboard map loading still mixes direct client pulls and API pulls, including direct client-side earthquake ingestion and raw `/api/gdelt` event usage; this checkout routes more of the map through normalized server endpoints and uses `derivedSignals` plus cache metadata.
- Upstream `markets` and `scm-suppliers` still contain `http://127.0.0.1:3000` internal server fetches; this checkout already switched those to request-derived origin URLs.
- Upstream `stats` still fetches `/api/gdelt` during aggregation and reads the wrong shape for incident counts; this checkout now reads incident totals from local cache without triggering live collection.
- Upstream does not currently expose a source-health or source-diagnostics route comparable to this checkout’s `/api/source-health`.
- The clearest upstream feature advantage worth adopting here is flight-provider breadth: upstream combines OpenSky global traffic with `airplanes.live` military and LADD/private sources, while this checkout currently relies on ADS-B regional pulls plus cache/stale handling.
