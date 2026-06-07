"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  PlugZap,
  Plus,
  Radio,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import {
  getLocalConfig,
  testRssSource,
  updateLocalConfig,
} from "@/lib/local-config/client";
import type { RssFeedConfig, RssFeedsConfig } from "@/types/local-config";
import type { SourceHealthItem } from "@/types/source-health";

const EMPTY_FEED: RssFeedConfig = {
  id: "",
  name: "",
  url: "",
  logoUrl: "https://www.google.com/s2/favicons?domain=example.com&sz=64",
  type: "rss",
  category: "world-news",
  enabled: true,
  reliabilityWeight: 0.75,
  refreshIntervalMinutes: 15,
  spectrumScore: null,
  spectrumConfidence: "unrated",
  spectrumAsOf: new Date().toISOString().slice(0, 10),
  spectrumReferenceUrl: null,
  tags: [],
};

const categoryOptions = [
  "world-news",
  "regional-intel",
  "us-news",
  "local-news",
  "portland-local",
  "technology",
  "business",
  "finance",
  "supply-chain",
  "defense",
  "defense-analysis",
  "cybersecurity",
  "natural-hazards",
  "weather",
  "humanitarian",
  "health-security",
  "good-news",
  "custom",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function tagsToString(tags: string[]) {
  return tags.join(", ");
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function SourcesSettingsPage() {
  const [initialFeeds, setInitialFeeds] = useState<RssFeedsConfig | null>(null);
  const [feeds, setFeeds] = useState<RssFeedsConfig>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [testingIndex, setTestingIndex] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<
    Record<number, SourceHealthItem>
  >({});
  const [testErrors, setTestErrors] = useState<Record<number, string>>({});

  const isDirty = useMemo(() => {
    if (!initialFeeds) return false;
    return JSON.stringify(initialFeeds) !== JSON.stringify(feeds);
  }, [initialFeeds, feeds]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const ids = new Set<string>();

    feeds.forEach((feed, index) => {
      const label = feed.name || feed.id || `Feed ${index + 1}`;

      if (!feed.id.trim()) {
        errors.push(`${label}: id is required.`);
      }

      if (!feed.name.trim()) {
        errors.push(`${label}: name is required.`);
      }

      if (!feed.url.trim()) {
        errors.push(`${label}: URL is required.`);
      } else if (!isValidUrl(feed.url)) {
        errors.push(`${label}: URL must be a valid http/https URL.`);
      }

      if (!isValidUrl(feed.logoUrl)) {
        errors.push(`${label}: logo URL must be a valid http/https URL.`);
      }

      if (!feed.category.trim()) {
        errors.push(`${label}: category is required.`);
      }

      if (feed.type !== "rss") {
        errors.push(`${label}: type must be rss.`);
      }

      if (feed.reliabilityWeight < 0 || feed.reliabilityWeight > 1) {
        errors.push(`${label}: reliability must be between 0 and 1.`);
      }

      if (!Number.isInteger(feed.refreshIntervalMinutes) || feed.refreshIntervalMinutes < 1) {
        errors.push(`${label}: refresh interval must be at least 1 minute.`);
      }

      if (
        feed.spectrumScore !== null &&
        (!Number.isFinite(feed.spectrumScore) ||
          feed.spectrumScore < -100 ||
          feed.spectrumScore > 100)
      ) {
        errors.push(`${label}: spectrum score must be null or between -100 and 100.`);
      }

      if (
        feed.spectrumReferenceUrl !== null &&
        !isValidUrl(feed.spectrumReferenceUrl)
      ) {
        errors.push(`${label}: spectrum reference URL must be a valid http/https URL.`);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(feed.spectrumAsOf)) {
        errors.push(`${label}: spectrum as-of date must use YYYY-MM-DD.`);
      }

      if (feed.spectrumScore === null && feed.spectrumConfidence !== "unrated") {
        errors.push(`${label}: null spectrum scores must use unrated confidence.`);
      }

      if (feed.spectrumScore !== null && feed.spectrumConfidence === "unrated") {
        errors.push(`${label}: numeric spectrum scores need low, medium, or high confidence.`);
      }

      const normalizedId = feed.id.trim();

      if (normalizedId) {
        if (ids.has(normalizedId)) {
          errors.push(`${label}: duplicate feed id "${normalizedId}".`);
        }

        ids.add(normalizedId);
      }
    });

    return errors;
  }, [feeds]);

  const canSave = isDirty && validationErrors.length === 0 && !saving;

  const enabledCount = feeds.filter((feed) => feed.enabled).length;
  const disabledCount = feeds.length - enabledCount;

  useEffect(() => {
    let cancelled = false;

    getLocalConfig("rss-feeds")
      .then((config) => {
        if (cancelled) return;

        setInitialFeeds(config);
        setFeeds(config);
        setLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error ? error.message : "Failed to load rss-feeds config",
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

  function updateFeed<TField extends keyof RssFeedConfig>(
    index: number,
    field: TField,
    value: RssFeedConfig[TField],
  ) {
    setSaveMessage(null);
    setSaveError(null);
    setTestResults((current) => {
      const next = { ...current };
      delete next[index];
      return next;
    });
    setTestErrors((current) => {
      const next = { ...current };
      delete next[index];
      return next;
    });

    setFeeds((current) =>
      current.map((feed, feedIndex) => {
        if (feedIndex !== index) return feed;

        const nextFeed = {
          ...feed,
          [field]: value,
        };

        if (field === "name" && !feed.id.trim()) {
          nextFeed.id = slugify(String(value));
        }

        return nextFeed;
      }),
    );
  }

  function addFeed() {
    setSaveMessage(null);
    setSaveError(null);

    setFeeds((current) => [
      ...current,
      {
        ...EMPTY_FEED,
        id: `new-feed-${current.length + 1}`,
        name: "New Feed",
      },
    ]);
  }

  function removeFeed(index: number) {
    setSaveMessage(null);
    setSaveError(null);

    setFeeds((current) => current.filter((_, feedIndex) => feedIndex !== index));
    setTestResults({});
    setTestErrors({});
  }

  function resetForm() {
    if (!initialFeeds) return;

    setFeeds(initialFeeds);
    setSaveError(null);
    setSaveMessage(null);
    setTestResults({});
    setTestErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    const nextFeeds: RssFeedsConfig = feeds.map((feed) => ({
      id: feed.id.trim(),
      name: feed.name.trim(),
      url: feed.url.trim(),
      logoUrl: feed.logoUrl.trim(),
      type: "rss",
      category: feed.category.trim(),
      enabled: feed.enabled,
      reliabilityWeight: Number(feed.reliabilityWeight),
      refreshIntervalMinutes: Number(feed.refreshIntervalMinutes),
      spectrumScore:
        feed.spectrumScore === null ? null : Number(feed.spectrumScore),
      spectrumConfidence: feed.spectrumConfidence,
      spectrumAsOf: feed.spectrumAsOf,
      spectrumReferenceUrl: feed.spectrumReferenceUrl?.trim() || null,
      tags: feed.tags.map((tag) => tag.trim()).filter(Boolean),
    }));

    try {
      const savedFeeds = await updateLocalConfig("rss-feeds", nextFeeds);

      setInitialFeeds(savedFeeds);
      setFeeds(savedFeeds);
      setSaveMessage("Sources saved. Backup created automatically.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save rss-feeds config",
      );
    } finally {
      setSaving(false);
    }
  }

  async function testFeed(index: number) {
    const feed = feeds[index];

    if (!feed) return;

    setTestingIndex(index);
    setTestErrors((current) => {
      const next = { ...current };
      delete next[index];
      return next;
    });

    try {
      const response = await testRssSource({
        ...feed,
        id: feed.id.trim(),
        name: feed.name.trim(),
        url: feed.url.trim(),
        category: feed.category.trim(),
        reliabilityWeight: Number(feed.reliabilityWeight),
        refreshIntervalMinutes: Number(feed.refreshIntervalMinutes),
        tags: feed.tags.map((tag) => tag.trim()).filter(Boolean),
      });

      if (!response.source) {
        throw new Error(response.error ?? "Source test returned no result");
      }

      setTestResults((current) => ({
        ...current,
        [index]: response.source as SourceHealthItem,
      }));
    } catch (error) {
      setTestErrors((current) => ({
        ...current,
        [index]:
          error instanceof Error ? error.message : "Failed to test RSS source",
      }));
    } finally {
      setTestingIndex(null);
    }
  }

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
            <Radio className="h-4 w-4" />
            Local Sources
          </p>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Source Settings
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Manage RSS feeds used by the OSIRIS lightweight incident mapper.
                Changes write to{" "}
                <span className="font-mono text-[var(--gold-primary)]">
                  osiris-data/rss-feeds.json
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Total
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--text-heading)]">
                  {feeds.length}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  On
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--alert-green)]">
                  {enabledCount}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Off
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--gold-primary)]">
                  {disabledCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading source config...
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Failed to load sources
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {loadError}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                    Feeds
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                    RSS source registry
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Enabled feeds are used by the global incidents mapper.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFeed}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Feed
                </button>
              </div>

              <div className="space-y-4">
                {feeds.map((feed, index) => (
                  <div
                    key={`${feed.id}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Source {index + 1}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-[var(--text-heading)]">
                          {feed.name || "Unnamed Feed"}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => testFeed(index)}
                          disabled={testingIndex === index}
                          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(0,229,255,0.25)] bg-[rgba(0,229,255,0.06)] px-3 py-2 text-xs text-[var(--cyan-primary)] transition hover:bg-[rgba(0,229,255,0.12)] disabled:cursor-wait disabled:opacity-50"
                        >
                          {testingIndex === index ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <PlugZap className="h-3.5 w-3.5" />
                          )}
                          Test Pull
                        </button>

                        {feed.url ? (
                          <a
                            href={feed.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-white/20 hover:text-[var(--text-heading)]"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open
                          </a>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => updateFeed(index, "enabled", !feed.enabled)}
                          className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] transition",
                            feed.enabled
                              ? "border-[rgba(0,255,170,0.25)] bg-[rgba(0,255,170,0.08)] text-[var(--alert-green)]"
                              : "border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]",
                          ].join(" ")}
                        >
                          {feed.enabled ? "Enabled" : "Disabled"}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFeed(index)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,80,80,0.25)] px-3 py-2 text-xs text-[var(--alert-red)] transition hover:bg-[rgba(255,80,80,0.08)]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Name
                        </span>

                        <input
                          value={feed.name}
                          onChange={(event) => updateFeed(index, "name", event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="BBC World"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          ID
                        </span>

                        <input
                          value={feed.id}
                          onChange={(event) => updateFeed(index, "id", slugify(event.target.value))}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="bbc-world"
                        />
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Feed URL
                        </span>

                        <input
                          value={feed.url}
                          onChange={(event) => updateFeed(index, "url", event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="https://example.com/feed.xml"
                        />
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Source Logo URL
                        </span>

                        <input
                          value={feed.logoUrl}
                          onChange={(event) => updateFeed(index, "logoUrl", event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="https://example.com/logo.png"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Category
                        </span>

                        <select
                          value={feed.category}
                          onChange={(event) => updateFeed(index, "category", event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Refresh Interval Minutes
                        </span>

                        <input
                          type="number"
                          min={1}
                          value={feed.refreshIntervalMinutes}
                          onChange={(event) =>
                            updateFeed(
                              index,
                              "refreshIntervalMinutes",
                              Number(event.target.value),
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Reliability Weight
                        </span>

                        <input
                          type="number"
                          min={0}
                          max={1}
                          step={0.01}
                          value={feed.reliabilityWeight}
                          onChange={(event) =>
                            updateFeed(index, "reliabilityWeight", Number(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Spectrum Score
                        </span>

                        <input
                          type="number"
                          min={-100}
                          max={100}
                          value={feed.spectrumScore ?? ""}
                          onChange={(event) => {
                            const score =
                              event.target.value === ""
                                ? null
                                : Number(event.target.value);
                            updateFeed(index, "spectrumScore", score);

                            if (score === null) {
                              updateFeed(index, "spectrumConfidence", "unrated");
                            } else if (feed.spectrumConfidence === "unrated") {
                              updateFeed(index, "spectrumConfidence", "low");
                            }
                          }}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="Blank means unrated"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Spectrum Confidence
                        </span>

                        <select
                          value={feed.spectrumConfidence}
                          onChange={(event) =>
                            updateFeed(
                              index,
                              "spectrumConfidence",
                              event.target.value as RssFeedConfig["spectrumConfidence"],
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {["unrated", "low", "medium", "high"].map((confidence) => (
                            <option key={confidence} value={confidence}>
                              {confidence}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Spectrum As Of
                        </span>

                        <input
                          type="date"
                          value={feed.spectrumAsOf}
                          onChange={(event) =>
                            updateFeed(index, "spectrumAsOf", event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                        />
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Spectrum Reference URL
                        </span>

                        <input
                          value={feed.spectrumReferenceUrl ?? ""}
                          onChange={(event) =>
                            updateFeed(
                              index,
                              "spectrumReferenceUrl",
                              event.target.value || null,
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="Optional public rating reference"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Tags
                        </span>

                        <input
                          value={tagsToString(feed.tags)}
                          onChange={(event) =>
                            updateFeed(index, "tags", parseTags(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="world, breaking, general"
                        />
                      </label>
                    </div>

                    {testResults[index] ? (
                      <div
                        className={[
                          "mt-4 rounded-2xl border p-4",
                          testResults[index].status === "online"
                            ? "border-[rgba(0,255,170,0.22)] bg-[rgba(0,255,170,0.05)]"
                            : testResults[index].status === "warning"
                              ? "border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.06)]"
                              : "border-[rgba(255,80,80,0.3)] bg-[rgba(255,80,80,0.07)]",
                        ].join(" ")}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-heading)]">
                            Test result: {testResults[index].status}
                          </p>

                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            {testResults[index].pullStatus}
                          </p>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-[var(--text-secondary)] sm:grid-cols-3">
                          <p>HTTP: {testResults[index].httpStatus ?? "—"}</p>
                          <p>
                            Response: {testResults[index].responseTimeMs ?? "—"}ms
                          </p>
                          <p>Items: {testResults[index].itemCount}</p>
                        </div>

                        {testResults[index].error ? (
                          <p className="mt-3 break-words text-xs leading-5 text-[var(--alert-red)]">
                            {testResults[index].error}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {testErrors[index] ? (
                      <p className="mt-4 rounded-2xl border border-[rgba(255,80,80,0.3)] bg-[rgba(255,80,80,0.07)] p-4 text-xs leading-5 text-[var(--alert-red)]">
                        {testErrors[index]}
                      </p>
                    ) : null}
                  </div>
                ))}

                {!feeds.length ? (
                  <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                      No sources configured
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      Add at least one RSS feed so OSIRIS has something to watch.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            {validationErrors.length > 0 ? (
              <section className="rounded-2xl border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.06)] p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold-primary)]" />

                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                      Validation
                    </p>

                    <ul className="mt-2 space-y-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ) : null}

            {saveError ? (
              <section className="rounded-2xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-red)]" />

                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                      Save Failed
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {saveError}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {saveMessage ? (
              <section className="rounded-2xl border border-[rgba(0,255,170,0.18)] bg-[rgba(0,255,170,0.05)] p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-green)]" />

                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-green)]">
                      Saved
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {saveMessage}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="sticky bottom-4 z-10 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  {isDirty
                    ? "You have unsaved source changes."
                    : "Source config is up to date."}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={!isDirty || saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-white/20 hover:text-[var(--text-heading)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={!canSave}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Sources
                  </button>
                </div>
              </div>
            </section>
          </form>
        )}
      </div>
    </main>
  );
}
