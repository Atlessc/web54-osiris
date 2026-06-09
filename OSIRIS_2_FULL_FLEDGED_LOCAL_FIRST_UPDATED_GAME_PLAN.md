# OSIRIS 2.0 Full-Fledged Local-First Game Plan

## Revision Purpose

This revision updates the OSIRIS 2.0 plan around the newest confirmed direction:

- Local always
- Userless
- No Electron
- No hosted SaaS model
- No required accounts
- No required API keys
- No paid AI dependency
- Same existing app tech stack
- Web app interface stays
- Local JSON files become the editable configuration layer
- The app can update its own local JSON configuration files through local server-side code
- The current map-first home page gets migrated to `/map`
- A new quick home page becomes `/`
- The layout gets refactored so the app can support more pages without breaking the existing map behavior

This is not a simple MVP plan. This is the full product direction.

---

# Core Product Identity

OSIRIS should be a **local-first, userless, portable intelligence workspace**.

It should feel like:

- A local analyst console
- A portable open-source intelligence workspace
- A configurable event monitoring system
- A source-backed dossier builder
- A map, feed, and signal workspace powered by local settings

It should not feel like:

- A SaaS dashboard
- A marketing site
- A login-required app
- A hosted product with user accounts
- A cloud database app
- An AI wrapper
- A decorative globe with no deeper workflow

## One-Sentence Product Definition

OSIRIS is a local-first intelligence workspace that monitors user-configured open data streams, detects event patterns, builds source-attributed dossiers, and lets the user customize feeds, keywords, layout, and detection behavior through local JSON configuration files.

---

# Non-Negotiable Architecture Rules

## 1. Local Always

OSIRIS should run locally.

The app should not require:

- hosted user accounts
- hosted auth
- hosted database
- cloud profile
- paid API keys
- OpenAI/AI usage
- Electron shell
- external server owned by the developer

The preferred model is:

```text
Local Next-style web app
        ↓
Runs on localhost
        ↓
Server-side local file access
        ↓
Reads/writes local JSON config files
        ↓
React UI updates through app state
```

## 2. No Electron

Electron is intentionally excluded.

Reason:

- the goal is to continue using the current app stack
- no desktop shell dependency
- avoid Electron maintenance/package burden
- keep OSIRIS as a local web app that can still use server-side file access

## 3. Browser UI Never Writes Files Directly

The browser cannot and should not directly edit local project files.

Instead:

```text
React UI
  ↓
Local route handler / server action
  ↓
Node fs service
  ↓
Validate JSON
  ↓
Backup current config
  ↓
Write updated config file
  ↓
Reload state
```

The browser edits through controlled app endpoints, not raw filesystem access.

## 4. JSON Files Are User-Owned Configuration

The app should not mutate important source files like random `src` files.

Instead, it should use local config files that the app reads and writes.

Recommended:

```text
osiris-data/
  profile.json
  settings.json
  rss-feeds.json
  keyword-packs.json
  location-registry.json
  topic-registry.json
  entity-registry.json
  source-health.json
  cache/
  backups/
  exports/
```

The app code provides defaults. The `osiris-data` folder contains the user's live local configuration.

## 5. Defaults Are Separate From Live Config

The app should include starter defaults, but live settings should be copied into `osiris-data`.

Recommended:

```text
src/
  config-defaults/
    profile.default.json
    settings.default.json
    rss-feeds.default.json
    keyword-packs.default.json
    location-registry.default.json
    topic-registry.default.json
    entity-registry.default.json

osiris-data/
  profile.json
  settings.json
  rss-feeds.json
  keyword-packs.json
  location-registry.json
  topic-registry.json
  entity-registry.json
```

First launch behavior:

```text
If osiris-data/profile.json does not exist:
  copy profile.default.json to osiris-data/profile.json

If osiris-data/rss-feeds.json does not exist:
  copy rss-feeds.default.json to osiris-data/rss-feeds.json

Repeat for each config file.
```

---

# Confirmed Tech Direction

Continue using the existing app stack.

Based on the current project language around `page.tsx` and `layout`, this plan assumes a Next-style app router structure.

Use:

- Next-style app router structure
- React
- TypeScript
- existing styling approach
- existing map libraries
- existing app components
- existing API/route-handler pattern
- Node server-side file access through local route handlers or server actions
- local JSON files for configuration
- Zustand or current state management if already present

Do not introduce:

- Electron
- Tauri
- Supabase
- Firebase
- hosted auth
- required AI API
- remote database dependency
- cloud-only settings storage

---

# Important Technical Clarification

A hosted deployment cannot freely edit the user's computer files.

This plan is for a local app runtime.

Recommended usage:

```bash
npm install
npm run dev
```

or later:

```bash
npm run build
npm run start
```

Then the user opens:

```text
http://localhost:3000
```

The local server can safely read/write files in the project folder or configured local data folder.

This is the correct way to keep the UI web-based while still allowing local JSON config file updates.

---

# Revised Route Structure

## Final Route Plan

```text
/
  Home / Situation Overview

/map
  Current map experience migrated here

/feed
  Full event stream

/events/[eventId]
  Event dossier

/signals
  Derived pattern detection

/sources
  Source health and RSS/source manager

/settings
  Workspace settings

/settings/profile
  Local profile editor

/settings/sources
  RSS feed manager

/settings/keywords
  Keyword pack manager

/settings/locations
  Location registry manager

/settings/topics
  Topic registry manager

/settings/entities
  Entity registry manager

/settings/import-export
  Import/export local OSIRIS profile

/search
  Global investigation search

/topics
  Topic index

/topics/[topicSlug]
  Topic detail

/entities
  Entity index

/entities/[entitySlug]
  Entity detail

/regions
  Region index

/regions/[regionSlug]
  Region detail
```

---

# Major Revision: Create A Real Home Page

## Goal

The new `/` route should become a quick local command home page.

The current map home page should move to `/map`.

The home page should not be a marketing page.

It should be a fast local situation overview.

## Home Page Purpose

The home page answers:

- What is OSIRIS seeing right now?
- Are sources working?
- What events need attention?
- Is the data fresh?
- Where should the user go next?

## Home Page Sections

### 1. Command Header

Shows:

- OSIRIS name
- local workspace name
- user display name/callsign if configured
- current local runtime status
- last refresh timestamp

Example:

```text
OSIRIS
Local Intelligence Workspace

Workspace: OSIRIS Local
Operator: Tyler
Last Refresh: 2 min ago
Mode: Local
```

### 2. Primary Navigation Cards

Cards:

- Open Map
- View Feed
- Review Signals
- Check Sources
- Manage Settings
- Search

### 3. Situation Overview

Metric cards:

- Active Events
- High Watch Events
- Active Signals
- Sources Online
- Sources Warning
- Sources Offline
- Last Refresh

### 4. Priority Watch

Top 3 to 5 events based on:

- severity
- confidence
- source count
- recency
- signal involvement

### 5. Feed Preview

Newest 5 event cards.

Each should link to:

```text
/feed
/events/[eventId]
/map
```

### 6. Signal Snapshot

Shows active signals:

- New
- Watching
- Escalating
- Cooling

### 7. Source Health Snapshot

Shows source health:

- Online
- Warning
- Offline
- Last pull
- Failed source count

### 8. Local Config Status

Shows whether local JSON files are valid.

Example:

```text
Config Status:
profile.json valid
settings.json valid
rss-feeds.json valid
keyword-packs.json valid
location-registry.json valid
```

If something is invalid:

```text
Config Warning:
rss-feeds.json failed validation.
Open Settings → Sources to repair.
```

## Home Page Acceptance Criteria

- `/` no longer renders the map directly
- `/` renders the new HomePage
- HomePage links to `/map`
- HomePage can load even if map data fails
- HomePage shows local config health
- HomePage shows source health
- HomePage feels like a command start screen, not a landing page

---

# Major Revision: Move Current Map Home Page To `/map`

## Current Problem

The current root page appears to be the map experience.

That blocks the app from becoming a multi-page workspace.

## Target

Move the existing map experience from:

```text
/
```

to:

```text
/map
```

## Recommended File Movement

original structure:

```text
src/app/page.tsx
src/app/layout.tsx
```

Target structure:

```text
src/app/page.tsx // should be the home page

src/app/map/MapPage.tsx // make map code from the original page.tsx file 
src/app/map/page.tsx // where the code from the original layout will be. make sure to update it to make it work in this new structure
```

## Recommended Responsibility Split

### `src/app/page.tsx`

Should be tiny.

```typescript
import { HomePage } from "@/features/home/pages/HomePage";

export default function Page() {
  return <HomePage />;
}
```

### `src/app/map/page.tsx`

Should also be tiny.

```typescript
import { MapPage } from "@/features/map/pages/MapPage";

export default function Page() {
  return <MapPage />;
}
```

### `src/app/page.tsx`

Contains new home page UI.

### `src/app/map/MapPage.tsx`

Contains the old map page code after extraction.

### `src/app/map/page.tsx`

Contains any layout/runtime wrapper code that the map needs to function correctly.

This is important because the old layout may contain required providers, map shell sizing, client-only guards, viewport behavior, HUD containers, or app-level wrappers that currently make the map work.

Do not destroy that logic. Move it into a map-specific runtime layout if it is required by the map.

---

# Major Revision: Layout Refactor

## Current Problem

The current layout appears tightly coupled to the map page.

That made sense when the whole app was a map.

It will not scale when the app has:

- home
- map
- feed
- dossiers
- signals
- settings
- source manager
- keyword manager
- search

## Target Layout Model

Use a general app layout for the whole app and a map-specific runtime layout only where needed.

Recommended structure:

```text
src/app/layout.tsx
  Global root layout
  Includes html/body
  Includes global providers
  Includes global CSS
  Includes inclusive app shell if appropriate

src/components/layout/AppShell.tsx
  General app shell for normal pages
  Header/sidebar/nav/content wrapper

src/components/layout/AppHeader.tsx
src/components/layout/AppSidebar.tsx
src/components/layout/AppMain.tsx

src/features/map/layouts/MapRuntimeLayout.tsx
  Map-specific layout requirements only

src/features/map/pages/MapPage.tsx
  Old map page code wrapped in MapRuntimeLayout
```

## Root Layout Responsibility

`src/app/layout.tsx` should be inclusive and app-wide.

It should handle:

- global CSS
- metadata
- font setup if already used
- top-level providers
- shared app shell if appropriate
- app-wide error boundaries if present
- app-wide theme class

It should not be hardcoded only for the map.

## App Shell Responsibility

`AppShell` should support non-map pages.

It should include:

- sidebar or top navigation
- content area
- responsive layout
- route links
- active route state
- local status area
- source health quick indicator
- settings link

## Map Runtime Layout Responsibility

`MapRuntimeLayout` should preserve the old map-critical layout behavior.

It may include:

- full-screen map container
- hidden overflow
- map-specific HUD wrappers
- client-only map guards
- map providers
- z-index layers
- keyboard shortcut handlers
- map-specific panel positioning
- map viewport sizing

Example:

```typescript
"use client";

interface MapRuntimeLayoutProps {
  children: React.ReactNode;
}

export function MapRuntimeLayout({ children }: MapRuntimeLayoutProps) {
  return (
    <div className="map-runtime-layout">
      {children}
    </div>
  );
}
```

Then:

```typescript
"use client";

import { MapRuntimeLayout } from "@/features/map/layouts/MapRuntimeLayout";

export function MapPage() {
  return (
    <MapRuntimeLayout>
      {/* original map page code goes here */}
    </MapRuntimeLayout>
  );
}
```

## Layout Refactor Acceptance Criteria

- Root layout no longer assumes every route is the map
- `/` can render HomePage without map-only constraints
- `/map` still works exactly like the old map page
- Existing map keyboard shortcuts still work
- Existing map panels still work
- Existing map sizing still works
- Existing map layer logic still works
- New pages can use AppShell without inheriting map-specific layout problems

---

# Local JSON Configuration System

## Goal

Let the user update app behavior from the web UI and have JSON files update correctly.

The user should be able to edit:

- name
- workspace name
- callsign
- theme
- density
- default landing page
- RSS feeds
- source categories
- keywords
- keyword packs
- locations
- topics
- entities
- refresh interval
- severity thresholds
- confidence thresholds
- enabled/disabled layers
- enabled/disabled sources

## Required Local Files

```text
osiris-data/
  profile.json
  settings.json
  rss-feeds.json
  keyword-packs.json
  location-registry.json
  topic-registry.json
  entity-registry.json
  source-health.json
  cache/
    source-items.json
    events.json
    signals.json
  backups/
  exports/
```

## Profile JSON

```json
{
  "displayName": "Tyler",
  "workspaceName": "OSIRIS Local",
  "callsign": "Operator",
  "homePageMode": "situation-overview"
}
```

## Settings JSON

```json
{
  "theme": "dark",
  "accentColor": "cyan",
  "density": "compact",
  "defaultLandingPage": "/",
  "autoRefresh": true,
  "refreshIntervalMinutes": 15,
  "defaultSeverityThreshold": "watch",
  "defaultConfidenceThreshold": "low",
  "showDebugPanels": false,
  "enabledLayers": [
    "global-incidents",
    "signals",
    "source-health"
  ]
}
```

## RSS Feeds JSON

```json
[
  {
    "id": "bbc-world",
    "name": "BBC World",
    "url": "https://feeds.bbci.co.uk/news/world/rss.xml",
    "type": "rss",
    "category": "world-news",
    "enabled": true,
    "reliabilityWeight": 0.8,
    "refreshIntervalMinutes": 15,
    "tags": ["world", "general"]
  }
]
```

## Keyword Packs JSON

```json
{
  "conflict": [
    "attack",
    "strike",
    "missile",
    "drone",
    "uav",
    "shelling"
  ],
  "cyber": [
    "cyberattack",
    "ransomware",
    "breach",
    "outage",
    "ddos"
  ],
  "custom": []
}
```

---

# Config Update Flow

## Correct Save Flow

Every JSON update should follow this flow:

```text
1. User edits a form in the UI
2. UI performs light validation
3. UI sends data to local route handler/server action
4. Server validates data with schema
5. Server checks target config name is allowed
6. Server reads existing file
7. Server creates backup
8. Server writes formatted JSON
9. Server re-reads the file
10. Server returns saved config
11. Zustand/state updates
12. UI shows success
```

## Failure Flow

If validation fails:

```text
1. Do not write file
2. Return field-specific error
3. UI shows useful message
4. Existing config remains untouched
```

Example:

```text
Could not save rss-feeds.json.

Feed #3 has an invalid URL.
```

## Backup Rule

Before overwriting any local config file, create a backup.

Backup format:

```text
osiris-data/backups/rss-feeds.2026-05-31T22-14-00.json
osiris-data/backups/settings.2026-05-31T22-14-00.json
```

## Pretty JSON Rule

All saved JSON should be formatted with two-space indentation.

Example:

```typescript
const prettyJson = JSON.stringify(data, null, 2);
```

---

# Server-Side Config Service

## Recommended Files

```text
src/lib/local-config/configPaths.ts
src/lib/local-config/configSchemas.ts
src/lib/local-config/configService.ts
src/lib/local-config/configBootstrap.ts
src/lib/local-config/configBackups.ts
src/lib/local-config/configValidation.ts
```

## Config Names

Allowed config files should be explicit.

```typescript
export const CONFIG_FILES = {
  profile: "profile.json",
  settings: "settings.json",
  "rss-feeds": "rss-feeds.json",
  "keyword-packs": "keyword-packs.json",
  "location-registry": "location-registry.json",
  "topic-registry": "topic-registry.json",
  "entity-registry": "entity-registry.json"
} as const;

export type ConfigName = keyof typeof CONFIG_FILES;
```

Do not accept arbitrary file paths from the browser.

Bad:

```typescript
updateConfig("../../some-random-file", data)
```

Good:

```typescript
updateConfig("rss-feeds", data)
```

## Config Service Skeleton

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import { CONFIG_FILES, type ConfigName } from "./configPaths";
import { validateConfig } from "./configValidation";

const dataDir = path.join(process.cwd(), "osiris-data");
const backupDir = path.join(dataDir, "backups");

export function getConfigPath(configName: ConfigName) {
  return path.join(dataDir, CONFIG_FILES[configName]);
}

export async function ensureDataFolders() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(backupDir, { recursive: true });
}

export async function readConfig(configName: ConfigName) {
  await ensureDataFolders();

  const filePath = getConfigPath(configName);
  const raw = await fs.readFile(filePath, "utf-8");

  return JSON.parse(raw);
}

export async function writeConfig(configName: ConfigName, data: unknown) {
  await ensureDataFolders();

  validateConfig(configName, data);

  await createBackup(configName);

  const filePath = getConfigPath(configName);
  const prettyJson = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, `${prettyJson}\n`, "utf-8");

  return readConfig(configName);
}

async function createBackup(configName: ConfigName) {
  const filePath = getConfigPath(configName);

  try {
    const current = await fs.readFile(filePath, "utf-8");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `${configName}.${timestamp}.json`);

    await fs.writeFile(backupPath, current, "utf-8");
  } catch {
    // No current file exists yet.
  }
}
```

---

# Local Config API Routes

## Recommended Route Structure

```text
src/app/api/local-config/[configName]/route.ts
src/app/api/local-config/validate/route.ts
src/app/api/local-config/bootstrap/route.ts
src/app/api/local-config/backups/route.ts
src/app/api/local-config/import/route.ts
src/app/api/local-config/export/route.ts
```

## Config GET/PUT Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readConfig, writeConfig } from "@/lib/local-config/configService";
import { isConfigName } from "@/lib/local-config/configPaths";

interface RouteParams {
  params: Promise<{
    configName: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { configName } = await params;

  if (!isConfigName(configName)) {
    return NextResponse.json(
      { ok: false, error: "Invalid config name" },
      { status: 400 }
    );
  }

  const config = await readConfig(configName);

  return NextResponse.json({
    ok: true,
    config
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { configName } = await params;

  if (!isConfigName(configName)) {
    return NextResponse.json(
      { ok: false, error: "Invalid config name" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const savedConfig = await writeConfig(configName, body);

    return NextResponse.json({
      ok: true,
      config: savedConfig
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to save config"
      },
      { status: 400 }
    );
  }
}
```

## Client-Side Config API

```typescript
export async function getLocalConfig<T>(configName: string): Promise<T> {
  const response = await fetch(`/api/local-config/${configName}`);

  const payload = await response.json();

  if (!payload.ok) {
    throw new Error(payload.error ?? "Failed to load config");
  }

  return payload.config as T;
}

export async function updateLocalConfig<T>(
  configName: string,
  data: T
): Promise<T> {
  const response = await fetch(`/api/local-config/${configName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const payload = await response.json();

  if (!payload.ok) {
    throw new Error(payload.error ?? "Failed to update config");
  }

  return payload.config as T;
}
```

---

# Schema Validation

## Use Zod Or Existing Validation Library

If the app already uses a validation library, continue using it.

If not, use Zod.

Install only if needed:

```bash
npm install zod
```

## RSS Feed Schema

```typescript
import { z } from "zod";

export const rssFeedSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  type: z.literal("rss"),
  category: z.string().min(1),
  enabled: z.boolean(),
  reliabilityWeight: z.number().min(0).max(1),
  refreshIntervalMinutes: z.number().int().min(1),
  tags: z.array(z.string())
});

export const rssFeedsSchema = z.array(rssFeedSchema);
```

## Profile Schema

```typescript
export const profileSchema = z.object({
  displayName: z.string().min(1),
  workspaceName: z.string().min(1),
  callsign: z.string().min(1),
  homePageMode: z.string().min(1)
});
```

## Settings Schema

```typescript
export const settingsSchema = z.object({
  theme: z.enum(["dark", "light", "system"]).default("dark"),
  accentColor: z.string().min(1),
  density: z.enum(["compact", "comfortable"]),
  defaultLandingPage: z.string().min(1),
  autoRefresh: z.boolean(),
  refreshIntervalMinutes: z.number().int().min(1),
  defaultSeverityThreshold: z.string().min(1),
  defaultConfidenceThreshold: z.string().min(1),
  showDebugPanels: z.boolean(),
  enabledLayers: z.array(z.string())
});
```

## Config Validation Function

```typescript
import type { ConfigName } from "./configPaths";
import {
  profileSchema,
  settingsSchema,
  rssFeedsSchema,
  keywordPacksSchema
} from "./configSchemas";

export function validateConfig(configName: ConfigName, data: unknown) {
  switch (configName) {
    case "profile":
      profileSchema.parse(data);
      return;

    case "settings":
      settingsSchema.parse(data);
      return;

    case "rss-feeds":
      rssFeedsSchema.parse(data);
      return;

    case "keyword-packs":
      keywordPacksSchema.parse(data);
      return;

    default:
      return;
  }
}
```

---

# Settings Pages

## Settings Route Structure

```text
/settings
/settings/profile
/settings/sources
/settings/keywords
/settings/locations
/settings/topics
/settings/entities
/settings/import-export
/settings/developer
```

## Settings Home

Shows cards for:

- Profile
- Appearance
- Workspace
- Sources
- Keywords
- Locations
- Topics
- Entities
- Import / Export
- Developer Tools

## Profile Editor

User can edit:

- display name
- workspace name
- callsign
- home page mode

Writes to:

```text
osiris-data/profile.json
```

## Source Manager

User can:

- add RSS feed
- edit RSS feed
- delete RSS feed
- enable/disable RSS feed
- test RSS feed
- assign category
- assign tags
- set reliability weight
- set refresh interval

Writes to:

```text
osiris-data/rss-feeds.json
```

## Keyword Manager

User can:

- add keyword pack
- edit keyword pack
- delete keyword pack
- add keyword
- remove keyword
- import keyword pack
- export keyword pack

Writes to:

```text
osiris-data/keyword-packs.json
```

## Locations Manager

User can:

- add location
- edit location
- add aliases
- set coordinates
- set location type
- set region grouping

Writes to:

```text
osiris-data/location-registry.json
```

## Import / Export

User can:

- export full local profile
- import full local profile
- merge imported config
- replace current config
- export only RSS feeds
- export only keyword packs
- export only settings

Recommended export:

```text
osiris-export/
  profile.json
  settings.json
  rss-feeds.json
  keyword-packs.json
  location-registry.json
  topic-registry.json
  entity-registry.json
```

Zip support can come later. A folder export is fine first.

## Developer Tools

User can:

- validate all config files
- create manual backup
- restore backup
- reset config to defaults
- clear cache
- reload config
- open local data folder path display
- show app runtime info

---

# Page Architecture After Refactor

## Recommended Feature Folder Structure

```text
src/
  app/
    page.tsx
    layout.tsx
    map/
      page.tsx
    feed/
      page.tsx
    events/
      [eventId]/
        page.tsx
    signals/
      page.tsx
    sources/
      page.tsx
    settings/
      page.tsx
      profile/
        page.tsx
      sources/
        page.tsx
      keywords/
        page.tsx
      locations/
        page.tsx
      topics/
        page.tsx
      entities/
        page.tsx
      import-export/
        page.tsx
      developer/
        page.tsx
    api/
      local-config/
        [configName]/
          route.ts

  components/
    layout/
      AppShell.tsx
      AppHeader.tsx
      AppSidebar.tsx
      AppMain.tsx
      PageHeader.tsx

  features/
    home/
      pages/
        HomePage.tsx
      components/
        SituationOverview.tsx
        PriorityWatch.tsx
        FeedPreview.tsx
        SignalSnapshot.tsx
        SourceHealthSnapshot.tsx
        LocalConfigStatus.tsx

    map/
      pages/
        MapPage.tsx
      layouts/
        MapRuntimeLayout.tsx
      components/
      hooks/
      utils/

    settings/
      pages/
        SettingsPage.tsx
        ProfileSettingsPage.tsx
        SourceSettingsPage.tsx
        KeywordSettingsPage.tsx
        LocationSettingsPage.tsx
        ImportExportSettingsPage.tsx
      components/
        ProfileEditor.tsx
        RssFeedEditor.tsx
        KeywordPackEditor.tsx
        JsonEditorPanel.tsx
        ConfigValidationPanel.tsx

    osiris-core/
      types/
      ingestion/
      scoring/
      registries/
      utils/

  lib/
    local-config/
      configPaths.ts
      configSchemas.ts
      configService.ts
      configBootstrap.ts
      configBackups.ts
      configValidation.ts
```

---

# Revised Implementation Phases

## Phase 0: Safety Branch And Map Preservation

### Goal

Do not break the map while refactoring.

### Tasks

- [ ] Create a new branch before layout work
- [ ] Confirm current root map page works
- [ ] Identify what code in `layout.tsx` is required for the map
- [ ] Identify what code in `page.tsx` is actually map page code
- [ ] Identify global providers
- [ ] Identify map-only providers/wrappers
- [ ] Take notes before moving files

### Acceptance Criteria

- [ ] Current map behavior is understood
- [ ] Required map layout logic is identified
- [ ] Refactor can happen without guessing

---

## Phase 1: Create New Home Page At `/`

### Goal

Add a useful home page before deeper changes.

### Tasks

- [ ] Create `src/features/home/pages/HomePage.tsx`
- [ ] Create home page shell
- [ ] Add command header
- [ ] Add navigation cards
- [ ] Add situation overview placeholders
- [ ] Add priority watch placeholders
- [ ] Add feed preview placeholders
- [ ] Add signal snapshot placeholders
- [ ] Add source health snapshot placeholders
- [ ] Update `src/app/page.tsx` to render `HomePage`

### Acceptance Criteria

- [ ] `/` renders HomePage
- [ ] HomePage has a link to `/map`
- [ ] HomePage does not depend on the map rendering
- [ ] HomePage can load even if map components fail

---

## Phase 2: Move Existing Map Page To `/map`

### Goal

Preserve the existing map as its own route.

### Tasks

- [ ] Create `src/app/map/page.tsx`
- [ ] Create `src/features/map/pages/MapPage.tsx`
- [ ] Move old root map page code into `MapPage.tsx`
- [ ] Make `src/app/map/page.tsx` render `MapPage`
- [ ] Verify `/map` renders the same map experience as old `/`
- [ ] Update links/navigation to point to `/map`

### Acceptance Criteria

- [ ] `/map` renders the old map experience
- [ ] Existing map layers work
- [ ] Existing map panels work
- [ ] Existing map keyboard shortcuts work
- [ ] Existing map data fetching still works

---

## Phase 3: Refactor Layout Without Breaking Map

### Goal

Make the root layout support the whole app.

### Tasks

- [ ] Review old `src/app/layout.tsx`
- [ ] Move global layout logic into cleaner app-wide layout
- [ ] Create `src/components/layout/AppShell.tsx`
- [ ] Create `src/components/layout/AppHeader.tsx`
- [ ] Create `src/components/layout/AppSidebar.tsx`
- [ ] Create `src/components/layout/AppMain.tsx`
- [ ] Create `src/features/map/layouts/MapRuntimeLayout.tsx`
- [ ] Move map-only layout logic into `MapRuntimeLayout`
- [ ] Wrap `MapPage` with `MapRuntimeLayout`
- [ ] Ensure normal pages use `AppShell`
- [ ] Ensure map page can opt out of normal page padding if needed

### Acceptance Criteria

- [ ] Root layout is not map-only
- [ ] Home page has normal app layout
- [ ] Map page keeps original behavior
- [ ] New pages can be added without layout hacks

---

## Phase 4: Add Local Config Folder Bootstrap

### Goal

Create the local JSON config layer.

### Tasks

- [ ] Create `osiris-data` folder
- [ ] Create `src/config-defaults`
- [ ] Add default JSON files
- [ ] Create `configBootstrap.ts`
- [ ] On app/server startup or first config request, ensure files exist
- [ ] Copy defaults if live config files do not exist
- [ ] Never overwrite existing user config during bootstrap

### Acceptance Criteria

- [ ] Missing local config files are created from defaults
- [ ] Existing local config files are preserved
- [ ] App can read `profile.json`
- [ ] App can read `settings.json`
- [ ] App can read `rss-feeds.json`
- [ ] App can read `keyword-packs.json`

---

## Phase 5: Add Local Config Read/Write API

### Goal

Allow the web UI to update local JSON files correctly.

### Tasks

- [ ] Create `src/lib/local-config/configPaths.ts`
- [ ] Create `src/lib/local-config/configService.ts`
- [ ] Create `src/lib/local-config/configValidation.ts`
- [ ] Create `src/lib/local-config/configBackups.ts`
- [ ] Create `src/app/api/local-config/[configName]/route.ts`
- [ ] Add GET support
- [ ] Add PUT support
- [ ] Add allowlist for config names
- [ ] Add backup-before-write
- [ ] Add pretty JSON formatting
- [ ] Add useful error responses

### Acceptance Criteria

- [ ] UI can load config by name
- [ ] UI can update config by name
- [ ] Invalid config names are rejected
- [ ] Invalid JSON shape is rejected
- [ ] Backup is created before overwrite
- [ ] Saved JSON is formatted

---

## Phase 6: Add Schema Validation

### Goal

Prevent broken JSON from being saved.

### Tasks

- [ ] Add validation schemas
- [ ] Validate profile config
- [ ] Validate settings config
- [ ] Validate RSS feeds config
- [ ] Validate keyword packs config
- [ ] Validate location registry config
- [ ] Validate topic registry config
- [ ] Validate entity registry config
- [ ] Return field-specific error messages where possible

### Acceptance Criteria

- [ ] Bad RSS URL cannot be saved
- [ ] Missing required feed name cannot be saved
- [ ] Invalid settings cannot be saved
- [ ] Existing config remains untouched after validation failure

---

## Phase 7: Build Settings Editors

### Goal

Let the user customize OSIRIS from the UI.

### Tasks

- [ ] Build settings overview page
- [ ] Build profile editor
- [ ] Build RSS feed manager
- [ ] Build keyword pack manager
- [ ] Build location registry manager
- [ ] Build topic registry manager
- [ ] Build entity registry manager
- [ ] Build import/export page
- [ ] Build developer tools page
- [ ] Add advanced JSON editor panels
- [ ] Add config validation panel

### Acceptance Criteria

- [ ] User can update their name
- [ ] User can update workspace name
- [ ] User can add RSS feed
- [ ] User can remove RSS feed
- [ ] User can enable/disable RSS feed
- [ ] User can add keywords
- [ ] User can remove keywords
- [ ] JSON files update correctly
- [ ] UI reloads saved settings without full manual edits

---

## Phase 8: Update Source Ingestion To Use Local RSS Config

### Goal

Stop hardcoding RSS sources.

### Tasks

- [x] Make source ingestion read `osiris-data/rss-feeds.json`
- [x] Only pull enabled feeds
- [x] Respect refresh intervals
- [x] Use category/tags/reliability weight from feed config
- [x] Add source health output
- [x] Add rejection reasons
- [x] Add source manager test-pull action
- [x] Cache source pull results locally

### Acceptance Criteria

- [x] User-added RSS feeds are used by OSIRIS
- [x] Disabled feeds are ignored
- [x] Source health reflects local feed config
- [x] Feed errors are visible in UI

---

## Phase 9: Update Keyword Matching To Use Local Keyword Packs

### Goal

Let the user control detection vocabulary.

### Tasks

- [x] Make keyword extraction read `osiris-data/keyword-packs.json`
- [x] Support default keyword packs
- [x] Support custom keyword packs
- [x] Decide whether disabled keyword packs are needed; preserve the current JSON shape for now
- [x] Add keyword manager UI
- [x] Add keyword testing utility

### Acceptance Criteria

- [x] User-added keywords affect event detection
- [x] Removed keywords stop matching
- [x] Keyword packs can be edited without touching code

---

## Phase 9.5: Harden Deterministic Event Promotion

### Goal

Prevent context articles, technical reporting, structured observations, stale
records, and ambiguous text matches from becoming global map incidents or
signals.

### Tasks

- [x] Add deterministic source lanes
- [x] Add JSON-backed per-source promotion policy overrides
- [x] Route cyber feeds away from the global incident map and signals
- [x] Route weather and natural-hazard feeds to structured observation lanes
- [x] Route technology, business, finance, and good-news feeds to context
- [x] Keep analysis, opinion, and source spectrum as evidence context instead of promotion vetoes
- [x] Add source-specific freshness windows
- [x] Ignore unsafe short free-text location aliases
- [x] Require contextual matches for ambiguous keywords
- [x] Require event action and location to co-occur in the same sentence, clause, or headline-summary evidence window
- [x] Reject roundup, non-event, and historical-reference articles
- [x] Deduplicate accepted URLs
- [x] Replace universal conflict typing with deterministic event types
- [x] Reduce same-family keyword severity inflation
- [x] Require independent-source corroboration for derived signals
- [x] Add twelve-hour event-family buckets and event facts to signal clustering
- [x] Expose promotion lanes and rejection reasons in source diagnostics

### Acceptance Criteria

- [x] Technology tutorials and marketing articles do not become map incidents
- [x] Cyber and CVE reporting remains collected but does not clutter global signals
- [x] Weather RSS forecasts do not become generic conflict events
- [x] Unsafe aliases such as OR, US, CA, LA, SF, and UK do not free-text match
- [x] Event records expose the sentence and gates used for promotion
- [x] Source settings can override promotion behavior without code changes
- [x] No existing local JSON configuration file is removed or reshaped

---

## Phase 10: Add Local Cache

### Goal

Keep OSIRIS useful even if sources fail or network is unavailable.

### Tasks

- [x] Create cache folder
- [x] Cache source items
- [x] Cache normalized events
- [x] Cache generated signals
- [x] Cache source health
- [x] Add stale data warning
- [x] Add clear cache tool
- [x] Add cache metadata

### Acceptance Criteria

- [x] App can show last known data
- [x] App warns when data is stale
- [x] Source failures do not blank the UI
- [x] Cache can be cleared from developer settings

---

## Phase 11: Feed Page

### Goal

Create the full intelligence feed.

### Tasks

- [ ] Create `/feed`
- [ ] Add event cards
- [ ] Add expanded cards
- [ ] Add filters
- [ ] Add sort modes
- [ ] Link cards to dossiers
- [ ] Link cards to map
- [ ] Use local event cache/data

### Acceptance Criteria

- [ ] Feed is usable without map
- [ ] Feed uses locally configured sources and keywords
- [ ] Feed cards can open event dossiers

---

## Phase 12: Event Dossier Page

### Goal

Create source-attributed event detail pages.

### Tasks

- [ ] Create `/events/[eventId]`
- [ ] Add event header
- [ ] Add TLDR generated from templates
- [ ] Add source evidence list
- [ ] Add confidence panel
- [ ] Add severity panel
- [ ] Add timeline
- [ ] Add keyword cloud
- [ ] Add related events
- [ ] Add raw data panel

### Acceptance Criteria

- [ ] Dossiers show sources
- [ ] Dossiers show why event exists
- [ ] Dossiers do not require AI
- [ ] Dossiers link back to feed/map

---

## Phase 13: Signals Page

### Goal

Show derived patterns across events.

### Tasks

- [ ] Create `/signals`
- [ ] Add signal cards
- [ ] Generate signals from local events
- [ ] Add signal types
- [ ] Add signal confidence/severity
- [ ] Link signals to events
- [ ] Add watch-next templates

### Acceptance Criteria

- [ ] Signals are generated locally
- [ ] Signals explain why they triggered
- [ ] Signals link to supporting events

---

## Phase 14: Topics, Entities, Regions, Search

### Goal

Create deeper investigation surfaces.

### Tasks

- [ ] Create topic pages
- [ ] Create entity pages
- [ ] Create region pages
- [ ] Create search page
- [ ] Use local registries
- [ ] Link objects together
- [ ] Add filters

### Acceptance Criteria

- [ ] Topics connect related events
- [ ] Entities connect repeated actors/places/orgs
- [ ] Regions show local event context
- [ ] Search works across local data

---

## Phase 15: Import / Export Local Profile

### Goal

Make the app portable between computers.

### Tasks

- [ ] Export profile config files
- [ ] Export settings
- [ ] Export RSS feeds
- [ ] Export keyword packs
- [ ] Export registries
- [ ] Import profile files
- [ ] Validate imports before applying
- [ ] Support merge mode
- [ ] Support replace mode
- [ ] Create backup before import

### Acceptance Criteria

- [ ] User can transfer settings to another computer
- [ ] Bad import does not break current config
- [ ] Imported feeds/keywords are usable immediately

---

# Source Manager Details

## RSS Feed Editor Fields

Each feed should have:

- name
- URL
- category
- enabled state
- reliability weight
- refresh interval
- tags

Optional later:

- default region
- language
- parser mode
- CORS/proxy mode not needed if local server pulls feed
- notes
- terms-of-use note

## Test Feed Button

The user should be able to test a feed before saving or after saving.

Test should show:

- request success/failure
- item count
- first 3 titles
- detected date fields
- parse errors

## Rejection Diagnostics

When source items are rejected, show why:

- no keyword matched
- no location matched
- duplicate item
- disabled source
- invalid published date
- unsupported feed format
- source fetch failed

This is how the user understands why OSIRIS is missing something.

---

# Keyword Manager Details

## Visual Editor First

Do not make users edit JSON by default.

Use forms/chips:

- add keyword
- remove keyword
- rename pack
- add pack
- delete pack
- import pack
- export pack

## Advanced JSON Editor Second

Add advanced JSON editor for power users.

Features:

- validate JSON
- format JSON
- save
- reset to last backup
- reset to default

---

# Home Page Build Details

## HomePage Component Sketch

```typescript
export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="eyebrow">Local Intelligence Workspace</p>
        <h1>OSIRIS</h1>
        <p>
          Monitor local open-source feeds, review active signals, and open
          source-attributed dossiers from a portable userless workspace.
        </p>
      </section>

      <section className="home-actions">
        {/* Open Map, Feed, Signals, Sources, Settings */}
      </section>

      <section className="home-grid">
        {/* Situation Overview */}
        {/* Priority Watch */}
        {/* Feed Preview */}
        {/* Source Health */}
        {/* Config Status */}
      </section>
    </main>
  );
}
```

## Page Entrypoint

```typescript
import { HomePage } from "@/features/home/pages/HomePage";

export default function Page() {
  return <HomePage />;
}
```

---

# Map Migration Build Details

## Map Page Entrypoint

```typescript
import { MapPage } from "@/features/map/pages/MapPage";

export default function Page() {
  return <MapPage />;
}
```

## MapPage Wrapper

```typescript
"use client";

import { MapRuntimeLayout } from "@/features/map/layouts/MapRuntimeLayout";

export function MapPage() {
  return (
    <MapRuntimeLayout>
      {/* Move the original root map page code here */}
    </MapRuntimeLayout>
  );
}
```

## Important Warning

Do not flatten or rewrite the map logic during the route migration.

First move it.

Then confirm it works.

Then clean it up.

The safe order:

```text
Move first.
Verify.
Refactor later.
```

This avoids breaking the map while doing layout surgery. No need to perform open-heart surgery with a leaf blower.

---

# Updated Definition Of Done

OSIRIS 2.0 is on track when:

- [ ] `/` is a real home page
- [ ] `/map` contains the original map experience
- [ ] root layout supports all pages
- [ ] map-specific layout logic is isolated
- [ ] local JSON config files exist
- [ ] config files bootstrap from defaults
- [ ] UI can edit profile/settings/RSS/keywords
- [ ] updates write valid formatted JSON
- [ ] backups are created before writes
- [ ] invalid config cannot overwrite valid config
- [x] source ingestion reads RSS feeds from local JSON
- [ ] keyword matching reads keyword packs from local JSON
- [ ] no Electron is required
- [ ] no hosted auth is required
- [ ] no API keys are required
- [ ] no AI is required
- [ ] user can transfer config to another computer
- [ ] map, feed, dossiers, signals, and settings all operate from local data/config

---

# Updated Priority Order

Build in this order:

1. Create new HomePage at `/`
2. Move old map page to `/map`
3. Refactor layout into app-wide layout plus map runtime layout
4. Add local config defaults
5. Add `osiris-data` bootstrap
6. Add local config read API
7. Add local config write API
8. Add schema validation
9. Add backup-before-write
10. Add profile/settings editor
11. Add RSS feed manager
12. Add keyword manager
13. Update ingestion to read local RSS config
14. Update matching to read local keyword packs
15. Add source health page
16. Add feed page
17. Add event dossier page
18. Add signals page
19. Add import/export
20. Add topics/entities/regions/search

This order keeps the map safe while building the local-first foundation.

---

# Final Direction

The new OSIRIS direction is:

```text
Local web app.
No Electron.
No accounts.
No cloud.
No keys.
No AI dependency.
Configurable from the UI.
Backed by local JSON files.
Portable through import/export.
Map moved to /map.
Home page becomes the command start screen.
Layout becomes app-wide instead of map-only.
```

That is the move frfr.
