"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  FileJson,
  Loader2,
  RefreshCcw,
  Server,
  TerminalSquare,
  Trash2,
} from "lucide-react";

import {
  clearDerivedLocalCaches,
  getLocalCacheStatus,
  getLocalConfigStatus,
} from "@/lib/local-config/client";
import type { LocalCacheStatusResponse } from "@/types/local-cache";
import type { ConfigStatusItem } from "@/types/local-config";

const apiChecks = [
  {
    label: "Config Status",
    href: "/api/local-config/status",
    description: "Shows validation status for all local JSON config files.",
  },
  {
    label: "Profile Config",
    href: "/api/local-config/profile",
    description: "Reads local operator/workspace profile config.",
  },
  {
    label: "Settings Config",
    href: "/api/local-config/settings",
    description: "Reads app-level settings and enabled layer defaults.",
  },
  {
    label: "RSS Feeds",
    href: "/api/local-config/rss-feeds",
    description: "Reads configured RSS source list.",
  },
  {
    label: "Keyword Packs",
    href: "/api/local-config/keyword-packs",
    description: "Reads keyword packs used by the mapper.",
  },
  {
    label: "Location Registry",
    href: "/api/local-config/location-registry",
    description: "Reads map/geocoding location registry.",
  },
  {
    label: "Topic Registry",
    href: "/api/local-config/topic-registry",
    description: "Reads topic definitions and tone metadata.",
  },
  {
    label: "Entity Registry",
    href: "/api/local-config/entity-registry",
    description: "Reads watched entities and aliases.",
  },
  {
    label: "Local Cache Status",
    href: "/api/local-cache",
    description: "Shows derived cache freshness and preserved raw source caches.",
  },
  {
    label: "GDELT / RSS Mapper",
    href: "/api/gdelt",
    description: "Runs the configured RSS incident mapper.",
  },
];

function getStatusClassName(item: ConfigStatusItem) {
  if (item.valid) {
    return "border-[rgba(0,255,170,0.18)] bg-[rgba(0,255,170,0.05)] text-[var(--alert-green)]";
  }

  if (item.status === "missing") {
    return "border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.07)] text-[var(--gold-primary)]";
  }

  return "border-[rgba(255,80,80,0.25)] bg-[rgba(255,80,80,0.08)] text-[var(--alert-red)]";
}

export function DeveloperSettingsPage() {
  const [configs, setConfigs] = useState<ConfigStatusItem[]>([]);
  const [cacheStatus, setCacheStatus] = useState<LocalCacheStatusResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const summary = useMemo(() => {
    const valid = configs.filter((config) => config.valid).length;
    const invalid = configs.filter((config) => config.status === "invalid").length;
    const missing = configs.filter((config) => config.status === "missing").length;

    return {
      total: configs.length,
      valid,
      invalid,
      missing,
      healthy: configs.length > 0 && configs.every((config) => config.valid),
    };
  }, [configs]);

  async function loadStatus(mode: "initial" | "refresh" = "initial") {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const [status, nextCacheStatus] = await Promise.all([
        getLocalConfigStatus(),
        getLocalCacheStatus(),
      ]);

      setConfigs(status.configs);
      setCacheStatus(nextCacheStatus);
      setLastCheckedAt(new Date().toISOString());
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to load local config diagnostics",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function clearDerivedCache() {
    const confirmed = window.confirm(
      "Clear derived event, signal, and source-health cache contents? All JSON files and raw RSS source caches will be preserved.",
    );

    if (!confirmed) return;

    setClearingCache(true);
    setError(null);
    setCacheMessage(null);

    try {
      const result = await clearDerivedLocalCaches();
      setCacheMessage(
        `Cleared ${result.cleared.length} derived caches. Every JSON file was preserved.`,
      );
      setCacheStatus(await getLocalCacheStatus());
    } catch (cacheError) {
      setError(
        cacheError instanceof Error
          ? cacheError.message
          : "Failed to clear derived caches",
      );
    } finally {
      setClearingCache(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadStatus("initial"), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-full bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/settings"
          className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-[var(--gold-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Link>

        <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/[0.035] p-5 md:p-7">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
            <TerminalSquare className="h-4 w-4" />
            Local Diagnostics
          </p>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Developer Tools
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Inspect OSIRIS local config health, API endpoints, and dev-only
                diagnostics. This page is read-only for now, which is exactly how
                we keep the gremlins in their cage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadStatus("refresh")}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-3 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh Diagnostics
            </button>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Diagnostics Failed
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {error}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Total Configs
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-[var(--text-heading)]">
              {summary.total}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Valid
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-[var(--alert-green)]">
              {summary.valid}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Invalid
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-[var(--alert-red)]">
              {summary.invalid}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Missing
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-[var(--gold-primary)]">
              {summary.missing}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                Config Health
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                Local JSON validation
              </h2>
            </div>

            <p className="font-mono text-xs text-[var(--text-muted)]">
              Last checked: {lastCheckedAt ? new Date(lastCheckedAt).toLocaleString() : "—"}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading diagnostics...
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {configs.map((config) => (
                <div
                  key={config.name}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
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
                      "mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                      getStatusClassName(config),
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
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                Local Cache
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                Derived data resilience
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                OSIRIS preserves raw RSS source caches and local JSON files.
                Clearing resets only derived event, signal, and source-health
                cache contents.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void clearDerivedCache()}
              disabled={loading || clearingCache}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {clearingCache ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Clear Derived Cache
            </button>
          </div>

          {cacheMessage ? (
            <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4 text-sm text-emerald-200">
              {cacheMessage}
            </div>
          ) : null}

          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-cyan-300" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                  Raw RSS source cache
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {cacheStatus?.rawSourceCacheFiles ?? 0} preserved JSON source
                  cache files
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {(cacheStatus?.derivedCaches ?? []).map((cache) => (
              <div
                key={cache.key}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <FileJson className="h-4 w-4 text-[var(--cyan-primary)]" />
                  <span
                    className={[
                      "rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em]",
                      cache.state === "ready" && !cache.isStale
                        ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300"
                        : "border-amber-400/25 bg-amber-400/[0.07] text-amber-300",
                    ].join(" ")}
                  >
                    {cache.state === "ready" && cache.isStale
                      ? "stale"
                      : cache.state}
                  </span>
                </div>

                <p className="mt-3 break-words font-mono text-xs font-bold text-[var(--text-heading)]">
                  {cache.filename}
                </p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {cache.recordCount} records
                  {cache.ageMinutes !== null
                    ? ` · updated ${cache.ageMinutes}m ago`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
              API Routes
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
              Quick route checks
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Open these in a new tab to verify route output directly.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {apiChecks.map((check) => (
              <a
                key={check.href}
                href={check.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.35)] hover:bg-white/[0.055]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Server className="h-4 w-4 text-[var(--cyan-primary)]" />
                  <ExternalLink className="h-4 w-4 text-[var(--text-muted)] transition group-hover:text-[var(--gold-primary)]" />
                </div>

                <p className="font-semibold text-[var(--text-heading)]">
                  {check.label}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {check.description}
                </p>

                <p className="mt-3 break-words font-mono text-xs text-[var(--text-muted)]">
                  {check.href}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
