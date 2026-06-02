"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Globe2,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import {
  getLocalConfig,
  updateLocalConfig,
} from "@/lib/local-config/client";
import type {
  KeywordPacksConfig,
  SeverityLevel,
  TopicRegistryConfig,
  TopicRegistryItem,
  TopicTone,
} from "@/types/local-config";

const EMPTY_TOPIC: TopicRegistryItem = {
  id: "",
  slug: "",
  name: "",
  description: "",
  enabled: true,
  keywordPacks: [],
  defaultSeverity: "notice",
  tone: "neutral",
  tags: [],
};

const severityOptions: SeverityLevel[] = [
  "notice",
  "watch",
  "warning",
  "critical",
];

const toneOptions: TopicTone[] = ["negative", "neutral", "positive", "mixed"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function csvToString(values: string[]) {
  return values.join(", ");
}

function sortTopics(topics: TopicRegistryConfig): TopicRegistryConfig {
  return [...topics].sort((a, b) => {
    const enabledDiff = Number(b.enabled) - Number(a.enabled);
    if (enabledDiff !== 0) return enabledDiff;

    return a.name.localeCompare(b.name);
  });
}

function getToneClassName(tone: TopicTone) {
  if (tone === "positive") {
    return "border-[rgba(0,255,170,0.22)] bg-[rgba(0,255,170,0.06)] text-[var(--alert-green)]";
  }

  if (tone === "negative") {
    return "border-[rgba(255,80,80,0.25)] bg-[rgba(255,80,80,0.08)] text-[var(--alert-red)]";
  }

  if (tone === "mixed") {
    return "border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]";
  }

  return "border-white/10 bg-white/[0.035] text-[var(--text-muted)]";
}

function getSeverityClassName(severity: SeverityLevel) {
  if (severity === "critical") {
    return "border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.1)] text-[var(--alert-red)]";
  }

  if (severity === "warning") {
    return "border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]";
  }

  if (severity === "watch") {
    return "border-[rgba(0,229,255,0.25)] bg-[rgba(0,229,255,0.06)] text-[var(--cyan-primary)]";
  }

  return "border-white/10 bg-white/[0.035] text-[var(--text-muted)]";
}

export function TopicsSettingsPage() {
  const [initialTopics, setInitialTopics] =
    useState<TopicRegistryConfig | null>(null);
  const [topics, setTopics] = useState<TopicRegistryConfig>([]);
  const [keywordPacks, setKeywordPacks] = useState<KeywordPacksConfig>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const keywordPackOptions = useMemo(
    () => Object.keys(keywordPacks).sort((a, b) => a.localeCompare(b)),
    [keywordPacks],
  );

  const isDirty = useMemo(() => {
    if (!initialTopics) return false;

    return JSON.stringify(initialTopics) !== JSON.stringify(topics);
  }, [initialTopics, topics]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const ids = new Set<string>();
    const slugs = new Set<string>();

    topics.forEach((topic, index) => {
      const label = topic.name || topic.id || `Topic ${index + 1}`;

      if (!topic.id.trim()) {
        errors.push(`${label}: id is required.`);
      }

      if (!topic.slug.trim()) {
        errors.push(`${label}: slug is required.`);
      }

      if (!topic.name.trim()) {
        errors.push(`${label}: name is required.`);
      }

      if (topic.slug !== slugify(topic.slug)) {
        errors.push(`${label}: slug should use lowercase slug format.`);
      }

      if (!topic.keywordPacks.length) {
        errors.push(`${label}: at least one keyword pack is recommended.`);
      }

      const normalizedId = topic.id.trim();
      const normalizedSlug = topic.slug.trim();

      if (normalizedId) {
        if (ids.has(normalizedId)) {
          errors.push(`${label}: duplicate topic id "${normalizedId}".`);
        }

        ids.add(normalizedId);
      }

      if (normalizedSlug) {
        if (slugs.has(normalizedSlug)) {
          errors.push(`${label}: duplicate topic slug "${normalizedSlug}".`);
        }

        slugs.add(normalizedSlug);
      }

      for (const pack of topic.keywordPacks) {
        if (!keywordPacks[pack]) {
          errors.push(`${label}: keyword pack "${pack}" does not exist.`);
        }
      }
    });

    return errors;
  }, [topics, keywordPacks]);

  const canSave = isDirty && validationErrors.length === 0 && !saving;

  const enabledCount = topics.filter((topic) => topic.enabled).length;
  const disabledCount = topics.length - enabledCount;
  const positiveCount = topics.filter((topic) => topic.tone === "positive").length;
  const negativeCount = topics.filter((topic) => topic.tone === "negative").length;

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getLocalConfig("topic-registry"),
      getLocalConfig("keyword-packs"),
    ])
      .then(([topicConfig, keywordPackConfig]) => {
        if (cancelled) return;

        const sortedTopics = sortTopics(topicConfig);

        setInitialTopics(sortedTopics);
        setTopics(sortedTopics);
        setKeywordPacks(keywordPackConfig);
        setLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load topic-registry config",
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

  function clearMessages() {
    setSaveMessage(null);
    setSaveError(null);
  }

  function updateTopic<TField extends keyof TopicRegistryItem>(
    index: number,
    field: TField,
    value: TopicRegistryItem[TField],
  ) {
    clearMessages();

    setTopics((current) =>
      current.map((topic, topicIndex) => {
        if (topicIndex !== index) return topic;

        const nextTopic = {
          ...topic,
          [field]: value,
        };

        if (field === "name") {
          const nextSlug = slugify(String(value));

          if (!topic.id.trim()) {
            nextTopic.id = nextSlug;
          }

          if (!topic.slug.trim()) {
            nextTopic.slug = nextSlug;
          }
        }

        return nextTopic;
      }),
    );
  }

  function toggleKeywordPack(index: number, keywordPack: string) {
    clearMessages();

    setTopics((current) =>
      current.map((topic, topicIndex) => {
        if (topicIndex !== index) return topic;

        const hasPack = topic.keywordPacks.includes(keywordPack);

        return {
          ...topic,
          keywordPacks: hasPack
            ? topic.keywordPacks.filter((pack) => pack !== keywordPack)
            : [...topic.keywordPacks, keywordPack].sort((a, b) =>
                a.localeCompare(b),
              ),
        };
      }),
    );
  }

  function addTopic() {
    clearMessages();

    setTopics((current) => [
      ...current,
      {
        ...EMPTY_TOPIC,
        id: `new-topic-${current.length + 1}`,
        slug: `new-topic-${current.length + 1}`,
        name: "New Topic",
      },
    ]);
  }

  function removeTopic(index: number) {
    clearMessages();

    setTopics((current) => current.filter((_, topicIndex) => topicIndex !== index));
  }

  function resetForm() {
    if (!initialTopics) return;

    setTopics(initialTopics);
    setSaveError(null);
    setSaveMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    const nextTopics: TopicRegistryConfig = sortTopics(
      topics.map((topic) => ({
        id: slugify(topic.id),
        slug: slugify(topic.slug),
        name: topic.name.trim(),
        description: topic.description.trim(),
        enabled: topic.enabled,
        keywordPacks: Array.from(new Set(topic.keywordPacks)).sort((a, b) =>
          a.localeCompare(b),
        ),
        defaultSeverity: topic.defaultSeverity,
        tone: topic.tone,
        tags: topic.tags.map((tag) => tag.trim()).filter(Boolean),
      })),
    );

    try {
      const savedTopics = await updateLocalConfig("topic-registry", nextTopics);
      const sortedSavedTopics = sortTopics(savedTopics);

      setInitialTopics(sortedSavedTopics);
      setTopics(sortedSavedTopics);
      setSaveMessage("Topics saved. Backup created automatically.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save topic-registry config",
      );
    } finally {
      setSaving(false);
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
            <Globe2 className="h-4 w-4" />
            Local Topics
          </p>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Topic Registry
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Manage topic definitions, keyword pack bindings, default severity,
                tags, and tone. Changes write to{" "}
                <span className="font-mono text-[var(--gold-primary)]">
                  osiris-data/topic-registry.json
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Total
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--text-heading)]">
                  {topics.length}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Enabled
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--alert-green)]">
                  {enabledCount}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Positive
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--cyan-primary)]">
                  {positiveCount}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Disabled
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
              Loading topic config...
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Failed to load topics
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
                    Registry
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                    Topic definitions
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Topics group keyword packs into higher-level categories for
                    feeds, signals, and future dossiers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addTopic}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Topic
                </button>
              </div>

              <div className="space-y-4">
                {topics.map((topic, index) => (
                  <div
                    key={`${topic.id}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Topic {index + 1}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-[var(--text-heading)]">
                          {topic.name || "Unnamed Topic"}
                        </h3>

                        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                          {topic.slug || "no-slug"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em]",
                            getToneClassName(topic.tone),
                          ].join(" ")}
                        >
                          {topic.tone}
                        </span>

                        <span
                          className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em]",
                            getSeverityClassName(topic.defaultSeverity),
                          ].join(" ")}
                        >
                          {topic.defaultSeverity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateTopic(index, "enabled", !topic.enabled)}
                          className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] transition",
                            topic.enabled
                              ? "border-[rgba(0,255,170,0.25)] bg-[rgba(0,255,170,0.08)] text-[var(--alert-green)]"
                              : "border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]",
                          ].join(" ")}
                        >
                          {topic.enabled ? "Enabled" : "Disabled"}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeTopic(index)}
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
                          value={topic.name}
                          onChange={(event) =>
                            updateTopic(index, "name", event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="Conflict Monitoring"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          ID
                        </span>

                        <input
                          value={topic.id}
                          onChange={(event) =>
                            updateTopic(index, "id", slugify(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="conflict-monitoring"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Slug
                        </span>

                        <input
                          value={topic.slug}
                          onChange={(event) =>
                            updateTopic(index, "slug", slugify(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="conflict-monitoring"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Tags
                        </span>

                        <input
                          value={csvToString(topic.tags)}
                          onChange={(event) =>
                            updateTopic(index, "tags", parseCsv(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="conflict, military, geopolitics"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Default Severity
                        </span>

                        <select
                          value={topic.defaultSeverity}
                          onChange={(event) =>
                            updateTopic(
                              index,
                              "defaultSeverity",
                              event.target.value as SeverityLevel,
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {severityOptions.map((severity) => (
                            <option key={severity} value={severity}>
                              {severity}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Tone
                        </span>

                        <select
                          value={topic.tone}
                          onChange={(event) =>
                            updateTopic(index, "tone", event.target.value as TopicTone)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {toneOptions.map((tone) => (
                            <option key={tone} value={tone}>
                              {tone}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Description
                        </span>

                        <textarea
                          value={topic.description}
                          onChange={(event) =>
                            updateTopic(index, "description", event.target.value)
                          }
                          className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="Describe what this topic tracks."
                        />
                      </label>
                    </div>

                    <div className="mt-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        Keyword Packs
                      </p>

                      {keywordPackOptions.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {keywordPackOptions.map((pack) => {
                            const selected = topic.keywordPacks.includes(pack);

                            return (
                              <button
                                key={pack}
                                type="button"
                                onClick={() => toggleKeywordPack(index, pack)}
                                className={[
                                  "rounded-full border px-3 py-1.5 font-mono text-xs transition",
                                  selected
                                    ? "border-[rgba(212,175,55,0.38)] bg-[rgba(212,175,55,0.1)] text-[var(--gold-primary)]"
                                    : "border-white/10 bg-white/[0.035] text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-heading)]",
                                ].join(" ")}
                              >
                                {pack}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                            No Keyword Packs
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                            Add keyword packs before binding topics.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {!topics.length ? (
                  <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                      No topics configured
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      Add at least one topic so OSIRIS can group matched stories.
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
                    ? "You have unsaved topic changes."
                    : "Topic config is up to date."}
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
                    Save Topics
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