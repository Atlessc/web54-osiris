"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Settings,
  WifiOff,
} from "lucide-react";

import { getSourceHealth } from "@/lib/local-config/client";
import type {
  SourceHealthItem,
  SourceHealthResponse,
  SourceHealthStatus,
} from "@/types/source-health";

type SourceFilter = "all" | "problems" | SourceHealthStatus;

const statusRank: Record<SourceHealthStatus, number> = {
  offline: 3,
  warning: 2,
  online: 1,
};

function formatDateTime(value: string | null) {
  if (!value) return "Never";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

function getStatusClasses(status: SourceHealthStatus) {
  if (status === "online") {
    return "border-[rgba(0,255,170,0.24)] bg-[rgba(0,255,170,0.06)] text-[var(--alert-green)]";
  }

  if (status === "warning") {
    return "border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.07)] text-[var(--gold-primary)]";
  }

  return "border-[rgba(255,80,80,0.3)] bg-[rgba(255,80,80,0.08)] text-[var(--alert-red)]";
}

function getTopRejectionReasons(source: SourceHealthItem) {
  if (!source.ingestion) return [];

  return Object.entries(source.ingestion.rejectionReasons)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);
}

function getTopExcludedReasons(source: SourceHealthItem) {
  if (!source.ingestion) return [];

  return Object.entries(source.ingestion.excludedReasons)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);
}

function formatReasonLabel(reason: string) {
  return reason.replaceAll("_", " ");
}

function getVisibleRejectionSamples(source: SourceHealthItem) {
  if (!source.ingestion?.rejectedSamples?.length) return [];

  const reasonOrder = new Map(
    getTopRejectionReasons(source).map(([reason], index) => [reason, index]),
  );

  return [...source.ingestion.rejectedSamples]
    .sort(
      (sampleA, sampleB) =>
        (reasonOrder.get(sampleA.reason) ?? Number.MAX_SAFE_INTEGER) -
        (reasonOrder.get(sampleB.reason) ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, 4);
}

export function SourcesPage() {
  const [report, setReport] = useState<SourceHealthResponse | null>(null);
  const [filter, setFilter] = useState<SourceFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshSources() {
    setRefreshing(true);
    setError(null);

    try {
      setReport(await getSourceHealth({ refresh: true }));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load source health",
      );
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getSourceHealth()
      .then((nextReport) => {
        if (cancelled) return;
        setReport(nextReport);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load source health",
        );
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSources = useMemo(() => {
    const sources = [...(report?.sources ?? [])].sort((sourceA, sourceB) => {
      const statusDiff = statusRank[sourceB.status] - statusRank[sourceA.status];
      if (statusDiff !== 0) return statusDiff;
      return sourceA.name.localeCompare(sourceB.name);
    });

    if (filter === "all") return sources;
    if (filter === "problems") {
      return sources.filter((source) => source.status !== "online");
    }

    return sources.filter((source) => source.status === filter);
  }, [filter, report?.sources]);

  const summary = report?.summary;

  return (
    <main className="min-h-full bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/[0.035] p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
                <Database className="h-4 w-4" />
                Source Operations
              </p>

              <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                RSS source health
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Review configured sources, refresh-aware cache state, pull
                failures, and the reasons feed items were accepted, rejected,
                or excluded during ingestion.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/settings/sources"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-white/20 hover:text-[var(--text-heading)]"
              >
                <Settings className="h-4 w-4" />
                Manage Sources
              </Link>

              <button
                type="button"
                onClick={refreshSources}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)] disabled:cursor-wait disabled:opacity-50"
              >
                <RefreshCcw
                  className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
                {refreshing ? "Pulling Sources..." : "Refresh All Sources"}
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Source health failed
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {error}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Enabled Sources"
            value={summary?.enabled ?? 0}
            detail={`${summary?.disabled ?? 0} disabled`}
            tone="cyan"
          />
          <SummaryCard
            label="Online"
            value={summary?.online ?? 0}
            detail={`${summary?.cachedSourceCount ?? 0} served from cache`}
            tone="green"
          />
          <SummaryCard
            label="Needs Attention"
            value={(summary?.warning ?? 0) + (summary?.offline ?? 0)}
            detail={`${summary?.offline ?? 0} offline, ${summary?.staleSourceCount ?? 0} stale`}
            tone="red"
          />
          <SummaryCard
            label="Ingestion"
            value={summary?.acceptedItemCount ?? 0}
            detail={`${summary?.candidateRejectedItemCount ?? 0} QA rejected, ${summary?.excludedItemCount ?? 0} excluded`}
            tone="gold"
          />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                Registry Diagnostics
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Snapshot generated {formatDateTime(report?.checkedAt ?? null)}.
                Refresh All Sources forces a network pull; normal ingestion
                respects each source&apos;s refresh interval.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "problems", "online", "warning", "offline"] as const).map(
                (item) => (
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
                ),
              )}
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading source diagnostics...
            </div>
          ) : visibleSources.length ? (
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {visibleSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-[var(--text-secondary)]">
              No sources match this filter.
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
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className={`mt-2 font-mono text-3xl font-bold ${toneClass}`}>{value}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

function SourceCard({ source }: { source: SourceHealthItem }) {
  const rejectionReasons = getTopRejectionReasons(source);
  const excludedReasons = getTopExcludedReasons(source);
  const rejectionSamples = getVisibleRejectionSamples(source);

  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="break-words text-lg font-semibold text-[var(--text-heading)]">
              {source.name}
            </h2>
            <span
              className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${getStatusClasses(source.status)}`}
            >
              {source.status}
            </span>
          </div>

          <p className="mt-2 break-all font-mono text-[10px] leading-5 text-[var(--text-muted)]">
            {source.id} · {source.category}
          </p>
        </div>

        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-white/20 hover:text-[var(--text-heading)]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Feed
        </a>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Pull State" value={source.pullStatus} />
        <Metric label="HTTP" value={String(source.httpStatus ?? "—")} />
        <Metric label="Items" value={String(source.itemCount)} />
        <Metric
          label="Response"
          value={
            source.responseTimeMs === null ? "—" : `${source.responseTimeMs}ms`
          }
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Source Lane" value={source.sourceLane} />
        <Metric label="Map Eligible" value={source.mapEligible ? "yes" : "no"} />
        <Metric
          label="Signal Eligible"
          value={source.signalEligible ? "yes" : "no"}
        />
        <Metric
          label="Freshness Window"
          value={source.maxAgeHours === null ? "unlimited" : `${source.maxAgeHours}h`}
        />
      </div>

      <div className="mt-4 grid gap-3 text-xs leading-5 text-[var(--text-secondary)] sm:grid-cols-2">
        <p>
          <span className="text-[var(--text-muted)]">Last success:</span>{" "}
          {formatDateTime(source.lastSuccessAt)}
        </p>
        <p>
          <span className="text-[var(--text-muted)]">Next refresh:</span>{" "}
          {formatDateTime(source.nextRefreshAt)}
        </p>
        <p>
          <span className="text-[var(--text-muted)]">Refresh interval:</span>{" "}
          {source.refreshIntervalMinutes} minutes
        </p>
        <p>
          <span className="text-[var(--text-muted)]">Reliability:</span>{" "}
          {Math.round(source.reliabilityWeight * 100)}%
        </p>
      </div>

      {source.tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {source.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {source.error ? (
        <div className="mt-4 flex gap-3 rounded-xl border border-[rgba(255,80,80,0.25)] bg-[rgba(255,80,80,0.06)] p-3">
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-red)]" />
          <p className="break-words text-xs leading-5 text-[var(--alert-red)]">
            {source.error}
          </p>
        </div>
      ) : null}

      {source.ingestion ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--cyan-primary)]">
              Last ingestion
            </p>
            <p className="font-mono text-[9px] text-[var(--text-muted)]">
              {formatDateTime(source.ingestion.processedAt)}
            </p>
          </div>

          <div className="mt-3 grid gap-2 text-center sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Processed"
              value={String(source.ingestion.processedItems)}
            />
            <Metric label="Accepted" value={String(source.ingestion.acceptedItems)} />
            <Metric
              label="QA Rejected"
              value={String(source.ingestion.candidateRejectedItems)}
            />
            <Metric
              label="Excluded"
              value={String(source.ingestion.excludedItems)}
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[var(--text-muted)]">
            QA rejected items were evaluated as incident candidates. Excluded
            items belong to lanes intentionally kept out of the global incident
            mapper.
          </p>

          {rejectionReasons.length || excludedReasons.length ? (
            <div className="mt-3 space-y-1">
              {rejectionReasons.length ? (
                <>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Top QA rejections
                  </p>
                  {rejectionReasons.map(([reason, count]) => (
                    <p
                      key={reason}
                      className="flex items-center justify-between gap-3 font-mono text-[10px] text-[var(--text-muted)]"
                    >
                      <span>{formatReasonLabel(reason)}</span>
                      <span>{count}</span>
                    </p>
                  ))}
                </>
              ) : null}

              {excludedReasons.length ? (
                <>
                  <p className="pt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Top exclusions
                  </p>
                  {excludedReasons.map(([reason, count]) => (
                    <p
                      key={reason}
                      className="flex items-center justify-between gap-3 font-mono text-[10px] text-[var(--text-muted)]"
                    >
                      <span>{formatReasonLabel(reason)}</span>
                      <span>{count}</span>
                    </p>
                  ))}
                </>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-xs text-[var(--alert-green)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              No item QA rejection or exclusion reasons recorded.
            </p>
          )}

          {rejectionSamples.length ? (
            <div className="mt-4 space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Sample QA rejects
              </p>

              {rejectionSamples.map((sample) => (
                <div
                  key={`${sample.reason}-${sample.url}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[rgba(212,175,55,0.24)] bg-[rgba(212,175,55,0.08)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--gold-primary)]">
                      {formatReasonLabel(sample.reason)}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {sample.source}
                    </span>
                  </div>

                  <a
                    href={sample.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs font-medium leading-5 text-[var(--text-heading)] transition hover:text-[var(--cyan-primary)]"
                  >
                    {sample.title}
                  </a>

                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[var(--text-muted)]">
                    {sample.matchedLocation ? (
                      <span>Location: {sample.matchedLocation}</span>
                    ) : null}
                    {sample.matchedKeywords.length ? (
                      <span>Keywords: {sample.matchedKeywords.join(", ")}</span>
                    ) : null}
                  </div>

                  {sample.matchedSentence ? (
                    <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
                      {sample.matchedSentence}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Clock3 className="h-3.5 w-3.5" />
          Run the incident mapper to generate item-level ingestion diagnostics.
        </p>
      )}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 break-words font-mono text-xs font-semibold text-[var(--text-heading)]">
        {value}
      </p>
    </div>
  );
}
