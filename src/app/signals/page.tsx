"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock3,
  Loader2,
  MapPinned,
  Radar,
  RefreshCcw,
} from "lucide-react";

type SeverityLevel = "low" | "watch" | "elevated" | "high" | "critical";
type ConfidenceLevel = "low" | "moderate" | "high";
type SignalFilter = "all" | "escalating" | "watching" | SeverityLevel;

interface DerivedSignal {
  id: string;
  title: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  sources: string[];
  matchedKeywords: string[];
  keywordFamilies: string[];
  averageSeverityScore: number;
  averageConfidenceScore: number;
  newestPublishedAt: string | null;
  explanation: string;
  knownFacts: string[];
  inferredMeaning: string[];
  uncertainty: string[];
  watchNext: string[];
  relatedEventIds: string[];
  location: {
    key: string;
    label: string;
    lat: number;
    lng: number;
    precision: string;
  };
}

interface GdeltResponse {
  derivedSignals: DerivedSignal[];
  derivedTotal: number;
  total: number;
  timestamp: string;
  source: string;
  sourceNote?: string;
  metadata?: {
    feedCount?: number;
    cacheHitCount?: number;
    staleCacheCount?: number;
    failedFeedCount?: number;
  };
  error?: string;
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
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function getSignalState(signal: DerivedSignal) {
  if (signal.severity === "critical" || signal.severity === "high") return "Escalating";
  if (signal.evidenceCount >= 3 || signal.confidence === "high") return "Watching";

  if (signal.newestPublishedAt) {
    const date = new Date(signal.newestPublishedAt);
    if (!Number.isNaN(date.getTime())) {
      const ageMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60_000));
      if (ageMinutes > 360) return "Cooling";
    }
  }

  return "New";
}

function getSeverityClasses(severity: SeverityLevel) {
  if (severity === "critical" || severity === "high") {
    return "border-[rgba(255,80,80,0.34)] bg-[rgba(255,80,80,0.08)] text-[var(--alert-red)]";
  }

  if (severity === "elevated" || severity === "watch") {
    return "border-[rgba(212,175,55,0.32)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]";
  }

  return "border-white/10 bg-white/[0.035] text-[var(--text-muted)]";
}

function getPriorityScore(signal: DerivedSignal) {
  return (
    severityRank[signal.severity] * 35 +
    confidenceRank[signal.confidence] * 20 +
    signal.evidenceCount * 8 +
    signal.averageSeverityScore +
    signal.averageConfidenceScore
  );
}

export default function SignalsPage() {
  const [data, setData] = useState<GdeltResponse | null>(null);
  const [filter, setFilter] = useState<SignalFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSignals(mode: "initial" | "refresh" = "initial") {
    mode === "initial" ? setLoading(true) : setRefreshing(true);
    setError(null);

    try {
      const response = await fetch("/api/gdelt", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load signals");
      }

      setData(payload as GdeltResponse);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load signals");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadSignals("initial");
  }, []);

  const signals = data?.derivedSignals ?? [];

  const visibleSignals = useMemo(() => {
    const sortedSignals = [...signals].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

    if (filter === "all") return sortedSignals;
    if (filter === "escalating") return sortedSignals.filter((signal) => getSignalState(signal) === "Escalating");
    if (filter === "watching") return sortedSignals.filter((signal) => getSignalState(signal) === "Watching");

    return sortedSignals.filter((signal) => signal.severity === filter);
  }, [filter, signals]);

  const summary = useMemo(() => {
    return {
      total: signals.length,
      escalating: signals.filter((signal) => getSignalState(signal) === "Escalating").length,
      watching: signals.filter((signal) => getSignalState(signal) === "Watching").length,
      highConfidence: signals.filter((signal) => signal.confidence === "high").length,
    };
  }, [signals]);

  return (
    <main className="min-h-full bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/[0.035] p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
                <Radar className="h-4 w-4" />
                Derived Intelligence
              </p>

              <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Signals
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Review RSS-derived reporting clusters grouped by location and keyword family. These are watch signals, not confirmed causation.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-white/20 hover:text-[var(--text-heading)]"
              >
                <MapPinned className="h-4 w-4" />
                Open Map
              </Link>

              <button
                type="button"
                onClick={() => loadSignals("refresh")}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)] disabled:cursor-wait disabled:opacity-50"
              >
                <RefreshCcw className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                {refreshing ? "Refreshing..." : "Refresh Signals"}
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">Signals failed</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{error}</p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Active Signals" value={summary.total} detail={`${data?.total ?? 0} accepted events`} tone="cyan" />
          <SummaryCard label="Escalating" value={summary.escalating} detail="High or critical severity" tone="red" />
          <SummaryCard label="Watching" value={summary.watching} detail="Multi-evidence or high-confidence" tone="gold" />
          <SummaryCard label="High Confidence" value={summary.highConfidence} detail={`${data?.metadata?.feedCount ?? 0} configured feeds`} tone="green" />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">Signal Board</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Snapshot generated {formatDateTime(data?.timestamp)} · {data?.source ?? "RSS_OSINT_MAPPING"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "escalating", "watching", "critical", "high", "elevated", "watch", "low"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={[
                    "rounded-xl border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition",
                    filter === item
                      ? "border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.14)] text-[var(--gold-primary)]"
                      : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-heading)]",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading derived signals...
            </div>
          ) : visibleSignals.length ? (
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {visibleSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-[var(--text-secondary)]">
              No signals match this filter. Either there are no current reporting clusters, or the current keyword/location thresholds are filtering them out.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  detail: string;
  tone: "green" | "red" | "gold" | "cyan";
}

function SummaryCard({ label, value, detail, tone }: SummaryCardProps) {
  const toneClass = {
    green: "text-[var(--alert-green)]",
    red: "text-[var(--alert-red)]",
    gold: "text-[var(--gold-primary)]",
    cyan: "text-[var(--cyan-primary)]",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
      <p className={`mt-2 font-mono text-3xl font-bold ${toneClass}`}>{value}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[var(--text-heading)]">{value}</p>
    </div>
  );
}

function SignalCard({ signal }: { signal: DerivedSignal }) {
  const state = getSignalState(signal);
  const mapHref = `/map?lat=${signal.location.lat.toFixed(4)}&lon=${signal.location.lng.toFixed(4)}&zoom=5&layers=global_incidents,news_intel`;

  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${getSeverityClasses(signal.severity)}`}>{signal.severity}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{state}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{signal.confidence} confidence</span>
          </div>

          <h2 className="mt-3 text-xl font-semibold leading-7 text-[var(--text-heading)]">{signal.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{signal.explanation}</p>
        </div>

        <Link href={mapHref} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-white/20 hover:text-[var(--text-heading)]">
          <MapPinned className="h-3.5 w-3.5" />
          Map
        </Link>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Evidence" value={String(signal.evidenceCount)} />
        <Metric label="Sources" value={String(signal.sources.length)} />
        <Metric label="Severity Avg" value={String(Math.round(signal.averageSeverityScore))} />
        <Metric label="Confidence Avg" value={String(Math.round(signal.averageConfidenceScore))} />
      </div>

      <div className="mt-4 grid gap-3 text-xs leading-5 text-[var(--text-secondary)] sm:grid-cols-2">
        <p><span className="text-[var(--text-muted)]">Location:</span> {signal.location.label} ({signal.location.precision})</p>
        <p><span className="text-[var(--text-muted)]">Newest:</span> {formatDateTime(signal.newestPublishedAt)}</p>
        <p><span className="text-[var(--text-muted)]">Sources:</span> {signal.sources.join(", ") || "—"}</p>
        <p><span className="text-[var(--text-muted)]">Families:</span> {signal.keywordFamilies.join(", ") || "—"}</p>
      </div>

      {signal.matchedKeywords.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {signal.matchedKeywords.slice(0, 10).map((keyword) => (
            <span key={keyword} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{keyword}</span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SignalList title="Known Facts" items={signal.knownFacts} />
        <SignalList title="Inferred Meaning" items={signal.inferredMeaning} />
        <SignalList title="Watch Next" items={signal.watchNext} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <Clock3 className="h-3.5 w-3.5" />
          Uncertainty
        </div>
        <ul className="mt-2 space-y-1 text-xs leading-5 text-[var(--text-secondary)]">
          {signal.uncertainty.slice(0, 3).map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </div>
    </article>
  );
}

function SignalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--gold-primary)]">{title}</p>
      <ul className="mt-2 space-y-1 text-xs leading-5 text-[var(--text-secondary)]">
        {items.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
