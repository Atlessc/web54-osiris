"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  FileJson,
  Globe2,
  Map,
  Radar,
  RefreshCcw,
  Search,
  Settings,
  ShieldAlert,
  Signal,
  Wifi,
  WifiOff,
} from "lucide-react";

import type { ConfigStatusItem, ProfileConfig } from "@/types/local-config";
import {
  getLocalConfig,
  getLocalConfigStatus,
  getSourceHealth,
  type SourceHealthResponse,
} from "@/lib/local-config/client";

const navCards = [
  {
    title: "Open Map",
    description: "Launch the live geographic intelligence workspace.",
    href: "/map",
    icon: Map,
    accent: "text-[var(--gold-primary)]",
  },
  {
    title: "View Feed",
    description: "Review incoming event items in a fast TLDR-style stream.",
    href: "/feed",
    icon: Activity,
    accent: "text-[var(--cyan-primary)]",
  },
  {
    title: "Review Signals",
    description: "Inspect derived watch patterns and escalation states.",
    href: "/signals",
    icon: Radar,
    accent: "text-[var(--alert-green)]",
  },
  {
    title: "Check Sources",
    description: "Review source status, feed coverage, and failures.",
    href: "/sources",
    icon: Database,
    accent: "text-[var(--gold-primary)]",
  },
  {
    title: "Manage Settings",
    description: "Edit local profile, feeds, keywords, and registries.",
    href: "/settings",
    icon: Settings,
    accent: "text-[var(--cyan-primary)]",
  },
  {
    title: "Search",
    description: "Search across events, topics, regions, and entities.",
    href: "/search",
    icon: Search,
    accent: "text-[var(--alert-green)]",
  },
];

type SeverityLevel = "low" | "watch" | "elevated" | "high" | "critical";
type ConfidenceLevel = "low" | "moderate" | "high";

interface GdeltEvent {
  id: string;
  title: string;
  name?: string;
  description?: string;
  url?: string;
  source?: string;
  publishedAt: string | null;
  fetchedAt?: string;
  articleAgeMinutes?: number | null;
  matchedKeywords?: string[];
  keywordFamilies?: string[];
  severityScore?: number;
  severityLevel?: SeverityLevel;
  confidenceScore?: number;
  confidenceLevel?: ConfidenceLevel;
  matchedLocation?: {
    label: string;
    key: string;
    precision: string;
  };
  whyFlagged?: string;
}

interface DerivedSignal {
  id: string;
  title: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  sources: string[];
  matchedKeywords: string[];
  keywordFamilies: string[];
  newestPublishedAt: string | null;
  explanation: string;
  location: {
    label: string;
    lat: number;
    lng: number;
    precision: string;
  };
}

interface GdeltResponse {
  events: GdeltEvent[];
  derivedSignals: DerivedSignal[];
  total: number;
  derivedTotal: number;
  timestamp: string;
  source: string;
  sourceNote?: string;
  metadata?: {
    feedCount?: number;
    keywordCount?: number;
    locationCount?: number;
  };
  error?: string;
}

interface HomeLoadState {
  profile: ProfileConfig | null;
  configStatusItems: ConfigStatusItem[];
  sourceHealth: SourceHealthResponse | null;
  gdelt: GdeltResponse | null;
}

const severityRank: Record<SeverityLevel, number> = {
  low: 1,
  watch: 2,
  elevated: 3,
  high: 4,
  critical: 5,
};

const confidenceRank: Record<ConfidenceLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3,
};

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function formatRelativeTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60_000));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays}d ago`;
}

function getEventPriorityScore(event: GdeltEvent) {
  const severityScore = event.severityScore ?? 0;
  const confidenceScore = event.confidenceScore ?? 0;
  const severityBoost = event.severityLevel ? severityRank[event.severityLevel] * 12 : 0;
  const confidenceBoost = event.confidenceLevel
    ? confidenceRank[event.confidenceLevel] * 8
    : 0;

  let recencyBoost = 0;

  if (typeof event.articleAgeMinutes === "number") {
    if (event.articleAgeMinutes <= 30) recencyBoost = 20;
    else if (event.articleAgeMinutes <= 120) recencyBoost = 12;
    else if (event.articleAgeMinutes <= 360) recencyBoost = 6;
  }

  return severityScore + confidenceScore + severityBoost + confidenceBoost + recencyBoost;
}

function getSignalState(signal: DerivedSignal) {
  if (signal.severity === "critical" || signal.severity === "high") {
    return "Escalating";
  }

  if (signal.evidenceCount >= 3) {
    return "Watching";
  }

  if (signal.newestPublishedAt) {
    const date = new Date(signal.newestPublishedAt);

    if (!Number.isNaN(date.getTime())) {
      const ageMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60_000));

      if (ageMinutes > 360) return "Cooling";
    }
  }

  return "New";
}

function getSeverityClassName(severity?: SeverityLevel) {
  if (severity === "critical" || severity === "high") {
    return "text-[var(--alert-red)]";
  }

  if (severity === "elevated" || severity === "watch") {
    return "text-[var(--gold-primary)]";
  }

  return "text-[var(--text-muted)]";
}

function getSourceStatusClassName(status: "online" | "warning" | "offline") {
  if (status === "online") return "text-[var(--alert-green)]";
  if (status === "warning") return "text-[var(--gold-primary)]";
  return "text-[var(--alert-red)]";
}

export function HomePage() {
  const [state, setState] = useState<HomeLoadState>({
    profile: null,
    configStatusItems: [],
    sourceHealth: null,
    gdelt: null,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [configStatusError, setConfigStatusError] = useState<string | null>(null);
  const [sourceHealthError, setSourceHealthError] = useState<string | null>(null);
  const [gdeltError, setGdeltError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  async function loadHomeData(mode: "initial" | "refresh" = "initial") {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setConfigStatusError(null);
    setSourceHealthError(null);
    setGdeltError(null);
    setProfileError(null);

    const [profileResult, configResult, sourceHealthResult, gdeltResult] =
      await Promise.allSettled([
        getLocalConfig("profile"),
        getLocalConfigStatus(),
        getSourceHealth(),
        fetch("/api/gdelt", { cache: "no-store" }).then(async (response) => {
          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload.error ?? "Failed to load global incidents");
          }

          return payload as GdeltResponse;
        }),
      ]);

    setState((current) => {
      const next = { ...current };

      if (profileResult.status === "fulfilled") {
        next.profile = profileResult.value;
      } else {
        setProfileError(
          profileResult.reason instanceof Error
            ? profileResult.reason.message
            : "Failed to load profile",
        );
      }

      if (configResult.status === "fulfilled") {
        next.configStatusItems = configResult.value.configs;
      } else {
        setConfigStatusError(
          configResult.reason instanceof Error
            ? configResult.reason.message
            : "Failed to load config status",
        );
      }

      if (sourceHealthResult.status === "fulfilled") {
        next.sourceHealth = sourceHealthResult.value;
      } else {
        setSourceHealthError(
          sourceHealthResult.reason instanceof Error
            ? sourceHealthResult.reason.message
            : "Failed to load source health",
        );
      }

      if (gdeltResult.status === "fulfilled") {
        next.gdelt = gdeltResult.value;
      } else {
        setGdeltError(
          gdeltResult.reason instanceof Error
            ? gdeltResult.reason.message
            : "Failed to load incident feed",
        );
      }

      return next;
    });

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (cancelled) return;
      await loadHomeData("initial");
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const configSummary = useMemo(() => {
    const validCount = state.configStatusItems.filter((item) => item.valid).length;
    const invalidCount = state.configStatusItems.filter(
      (item) => item.status === "invalid",
    ).length;
    const missingCount = state.configStatusItems.filter(
      (item) => item.status === "missing",
    ).length;

    return {
      validCount,
      invalidCount,
      missingCount,
      totalCount: state.configStatusItems.length,
    };
  }, [state.configStatusItems]);

  const events = state.gdelt?.events ?? [];
  const derivedSignals = state.gdelt?.derivedSignals ?? [];
  const sourceSummary = state.sourceHealth?.summary;

  const priorityWatch = useMemo(() => {
    return [...events]
      .sort((a, b) => getEventPriorityScore(b) - getEventPriorityScore(a))
      .slice(0, 5);
  }, [events]);

  const feedPreview = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

        return bTime - aTime;
      })
      .slice(0, 5);
  }, [events]);

  const signalCounts = useMemo(() => {
    const counts = {
      New: 0,
      Watching: 0,
      Escalating: 0,
      Cooling: 0,
    };

    for (const signal of derivedSignals) {
      counts[getSignalState(signal)] += 1;
    }

    return counts;
  }, [derivedSignals]);

  const highWatchEvents = events.filter(
    (event) =>
      event.severityLevel === "high" ||
      event.severityLevel === "critical" ||
      (event.severityScore ?? 0) >= 70,
  ).length;

  const overviewMetrics = [
    {
      label: "Active Events",
      value: String(events.length),
      note: state.gdelt?.source ?? "RSS mapper",
      icon: Activity,
    },
    {
      label: "High Watch Events",
      value: String(highWatchEvents),
      note: "High/critical or score ≥ 70",
      icon: ShieldAlert,
    },
    {
      label: "Active Signals",
      value: String(derivedSignals.length),
      note: "Derived reporting clusters",
      icon: Radar,
    },
    {
      label: "Sources Online",
      value: String(sourceSummary?.online ?? 0),
      note: `${sourceSummary?.total ?? 0} configured sources`,
      icon: Wifi,
    },
    {
      label: "Sources Warning",
      value: String(sourceSummary?.warning ?? 0),
      note: "Disabled, slow, or degraded",
      icon: AlertTriangle,
    },
    {
      label: "Sources Offline",
      value: String(sourceSummary?.offline ?? 0),
      note: "Failed source checks",
      icon: WifiOff,
    },
    {
      label: "Last Refresh",
      value: formatRelativeTime(state.gdelt?.timestamp ?? state.sourceHealth?.checkedAt),
      note: formatDateTime(state.gdelt?.timestamp ?? state.sourceHealth?.checkedAt),
      icon: Clock3,
    },
    {
      label: "Config Health",
      value: `${configSummary.validCount}/${configSummary.totalCount}`,
      note:
        configSummary.invalidCount || configSummary.missingCount
          ? "Config needs attention"
          : "All config valid",
      icon: FileJson,
    },
  ];

  const sourceHealthCards = [
    {
      label: "Online",
      value: String(sourceSummary?.online ?? 0),
      icon: Wifi,
    },
    {
      label: "Warning",
      value: String(sourceSummary?.warning ?? 0),
      icon: AlertTriangle,
    },
    {
      label: "Offline",
      value: String(sourceSummary?.offline ?? 0),
      icon: WifiOff,
    },
    {
      label: "Last Pull",
      value: formatRelativeTime(state.sourceHealth?.checkedAt),
      icon: Clock3,
    },
    {
      label: "Failed Sources",
      value: String(sourceSummary?.failedSourceCount ?? 0),
      icon: ShieldAlert,
    },
  ];

  return (
    <main className="min-h-[calc(100dvh-var(--app-navbar-height))] bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.18)] bg-[rgba(255,255,255,0.035)] p-5 shadow-[0_0_40px_rgba(0,0,0,0.28)] md:p-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(212,175,55,0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(0,229,255,0.12), transparent 35%)",
            }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
                <Globe2 className="h-4 w-4" />
                Local Intelligence Workspace
              </p>

              <h1 className="font-mono text-4xl font-bold tracking-[0.22em] text-[var(--text-heading)] md:text-6xl">
                OSIRIS
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Fast local command surface for checking source health, active
                events, signals, freshness, and where to investigate next.
              </p>

              <button
                type="button"
                onClick={() => loadHomeData("refresh")}
                disabled={loading || refreshing}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Home Data
              </button>
            </div>

            <div className="grid min-w-full gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-xs text-[var(--text-secondary)] sm:grid-cols-2 lg:min-w-[420px]">
              <StatusLine
                label="Workspace"
                value={state.profile?.workspaceName ?? "OSIRIS Local"}
              />
              <StatusLine
                label="Operator"
                value={state.profile?.displayName ?? state.profile?.callsign ?? "Operator"}
              />
              <StatusLine
                label="Last Refresh"
                value={formatRelativeTime(state.gdelt?.timestamp ?? state.sourceHealth?.checkedAt)}
              />
              <StatusLine label="Mode" value="Local" highlight />
            </div>
          </div>
        </section>

        {profileError || sourceHealthError || gdeltError || configStatusError ? (
          <section className="grid gap-3 md:grid-cols-2">
            {profileError ? <ErrorNotice title="Profile Load Warning" message={profileError} /> : null}
            {sourceHealthError ? (
              <ErrorNotice title="Source Health Warning" message={sourceHealthError} />
            ) : null}
            {gdeltError ? <ErrorNotice title="Incident Feed Warning" message={gdeltError} /> : null}
            {configStatusError ? (
              <ErrorNotice title="Config Status Warning" message={configStatusError} />
            ) : null}
          </section>
        ) : null}

        {/* <section aria-labelledby="primary-navigation">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                Command Routes
              </p>
              <h2 id="primary-navigation" className="mt-1 text-xl font-semibold">
                Where do you want to go next?
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {navCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.35)] hover:bg-white/[0.055] hover:shadow-[0_0_30px_rgba(212,175,55,0.06)]"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                      <Icon className={`h-5 w-5 ${card.accent}`} />
                    </div>

                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--gold-primary)]" />
                  </div>

                  <h3 className="text-base font-semibold text-[var(--text-heading)]">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section> */}

        <section aria-labelledby="situation-overview">
          <div className="mb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
              Situation Overview
            </p>
            <h2 id="situation-overview" className="mt-1 text-xl font-semibold">
              Current local status
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {overviewMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {metric.label}
                    </p>

                    <Icon className="h-4 w-4 text-[var(--gold-primary)]" />
                  </div>

                  <p className="font-mono text-2xl font-bold text-[var(--text-heading)]">
                    {loading ? "…" : metric.value}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
                    {metric.note}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel
            eyebrow="Priority Watch"
            title="Needs attention"
            description="Top items ranked by severity, confidence, source count, recency, and signal involvement."
          >
            {priorityWatch.length ? (
              <div className="space-y-3">
                {priorityWatch.map((event) => (
                  <EventCard key={event.id} event={event} mode="priority" />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No priority watch items"
                description="No events currently meet the priority watch display criteria."
              />
            )}
          </Panel>

          <Panel
            eyebrow="Signal Snapshot"
            title="Pattern state"
            description="Derived local signals generated from reporting clusters."
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                ["New", signalCounts.New],
                ["Watching", signalCounts.Watching],
                ["Escalating", signalCounts.Escalating],
                ["Cooling", signalCounts.Cooling],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {label}
                  </p>

                  <p className="mt-3 font-mono text-2xl font-bold text-[var(--cyan-primary)]">
                    {loading ? "…" : value}
                  </p>
                </div>
              ))}
            </div>

            {derivedSignals.length ? (
              <div className="mt-4 space-y-3">
                {derivedSignals.slice(0, 3).map((signal) => (
                  <div
                    key={signal.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cyan-primary)]">
                          {signal.location.label} · {signal.evidenceCount} evidence
                        </p>

                        <h3 className="mt-1 font-semibold text-[var(--text-heading)]">
                          {signal.title}
                        </h3>
                      </div>

                      <Signal className="h-4 w-4 shrink-0 text-[var(--gold-primary)]" />
                    </div>

                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      {signal.explanation}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Panel
            eyebrow="Feed Preview"
            title="Newest local events"
            description="Newest event cards from the configured RSS incident mapper."
          >
            {feedPreview.length ? (
              <div className="space-y-3">
                {feedPreview.map((event) => (
                  <EventCard key={event.id} event={event} mode="feed" />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No feed items yet"
                description="The mapper did not return matched events for the current source/keyword/location config."
              />
            )}
          </Panel>

          <Panel
            eyebrow="Source Health"
            title="Feed status"
            description="Online, warning, offline, last pull, and failed source counts."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {sourceHealthCards.map((source) => {
                const Icon = source.icon;

                return (
                  <div
                    key={source.label}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {source.label}
                      </p>

                      <Icon className="h-4 w-4 text-[var(--gold-primary)]" />
                    </div>

                    <p className="mt-3 font-mono text-xl font-bold text-[var(--text-heading)]">
                      {loading ? "…" : source.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {state.sourceHealth?.sources?.length ? (
              <div className="mt-4 space-y-2">
                {state.sourceHealth.sources.slice(0, 6).map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--text-heading)]">
                        {source.name}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">
                        {source.httpStatus ?? "—"} · {source.responseTimeMs ?? "—"}ms
                      </p>
                    </div>

                    <p
                      className={[
                        "font-mono text-[10px] uppercase tracking-[0.18em]",
                        getSourceStatusClassName(source.status),
                      ].join(" ")}
                    >
                      {source.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </Panel>
        </section>

        <section>
          <Panel
            eyebrow="Local Config Status"
            title="Configuration health"
            description="Live validation status for local JSON files in osiris-data."
          >
            {configStatusError ? (
              <ErrorNotice title="Config Status Error" message={configStatusError} />
            ) : (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <SummaryCard label="Valid" value={configSummary.validCount} tone="green" />
                  <SummaryCard label="Invalid" value={configSummary.invalidCount} tone="red" />
                  <SummaryCard label="Missing" value={configSummary.missingCount} tone="gold" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {state.configStatusItems.map((config) => (
                    <div
                      key={config.name}
                      className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <FileJson className="h-4 w-4 shrink-0 text-[var(--cyan-primary)]" />

                        {config.valid ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--alert-green)]" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--alert-red)]" />
                        )}
                      </div>

                      <p className="break-words font-mono text-sm font-bold leading-6 text-[var(--text-heading)]">
                        {config.filename}
                      </p>

                      <p
                        className={[
                          "mt-2 font-mono text-xs uppercase tracking-[0.18em]",
                          config.valid
                            ? "text-[var(--alert-green)]"
                            : config.status === "missing"
                              ? "text-[var(--gold-primary)]"
                              : "text-[var(--alert-red)]",
                        ].join(" ")}
                      >
                        {config.status}
                      </p>

                      {config.error ? (
                        <p className="mt-3 break-words text-xs leading-5 text-[var(--alert-red)]">
                          {config.error}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {configSummary.invalidCount > 0 || configSummary.missingCount > 0 ? (
                  <WarningNotice
                    title="Config Warning"
                    message="One or more local config files need attention. Open Settings to repair the affected JSON file."
                  />
                ) : (
                  <SuccessNotice
                    title="Config Healthy"
                    message="All local config files exist and passed validation."
                  />
                )}
              </div>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}

interface StatusLineProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatusLine({ label, value, highlight = false }: StatusLineProps) {
  return (
    <div>
      <p className="text-[var(--text-muted)]">{label}</p>
      <p
        className={
          highlight
            ? "mt-1 font-bold text-[var(--alert-green)]"
            : "mt-1 font-bold text-[var(--text-heading)]"
        }
      >
        {value}
      </p>
    </div>
  );
}

interface PanelProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

function Panel({ eyebrow, title, description, children }: PanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function EventCard({ event, mode }: { event: GdeltEvent; mode: "priority" | "feed" }) {
  const href = event.url || "/feed";

  return (
    <a
      href={href}
      target={event.url ? "_blank" : undefined}
      rel={event.url ? "noopener noreferrer" : undefined}
      className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[rgba(0,229,255,0.3)] hover:bg-white/[0.04]"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cyan-primary)]">
            {event.source || "RSS"} · {formatRelativeTime(event.publishedAt)}
          </p>

          <h3 className="mt-1 font-semibold text-[var(--text-heading)]">
            {event.title}
          </h3>
        </div>

        {event.url ? (
          <ExternalLink className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        ) : (
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        )}
      </div>

      <p className="text-sm leading-6 text-[var(--text-secondary)]">
        {mode === "priority"
          ? event.whyFlagged || event.description || "Matched monitored source/keyword/location criteria."
          : event.description || event.whyFlagged || "Matched monitored criteria."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {event.severityLevel ? (
          <span
            className={[
              "rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
              getSeverityClassName(event.severityLevel),
            ].join(" ")}
          >
            {event.severityLevel}
          </span>
        ) : null}

        {event.confidenceLevel ? (
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {event.confidenceLevel} confidence
          </span>
        ) : null}

        {event.matchedLocation?.label ? (
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--gold-primary)]">
            {event.matchedLocation.label}
          </span>
        ) : null}
      </div>
    </a>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}

function ErrorNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-red)]" />

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function WarningNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold-primary)]" />

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(0,255,170,0.18)] bg-[rgba(0,255,170,0.05)] p-4">
      <div className="flex gap-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-green)]" />

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-green)]">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "red" | "gold";
}) {
  const colorClass =
    tone === "green"
      ? "text-[var(--alert-green)]"
      : tone === "red"
        ? "text-[var(--alert-red)]"
        : "text-[var(--gold-primary)]";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className={`mt-2 font-mono text-3xl font-bold ${colorClass}`}>
        {value}
      </p>
    </div>
  );
}