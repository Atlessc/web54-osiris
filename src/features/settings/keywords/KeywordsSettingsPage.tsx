"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import {
  getLocalConfig,
  updateLocalConfig,
} from "@/lib/local-config/client";
import type { KeywordPacksConfig } from "@/types/local-config";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function sortKeywordPacks(keywordPacks: KeywordPacksConfig): KeywordPacksConfig {
  return Object.keys(keywordPacks)
    .sort((a, b) => a.localeCompare(b))
    .reduce<KeywordPacksConfig>((next, packName) => {
      next[packName] = [...keywordPacks[packName]].sort((a, b) =>
        a.localeCompare(b),
      );

      return next;
    }, {});
}

export function KeywordsSettingsPage() {
  const [initialKeywordPacks, setInitialKeywordPacks] =
    useState<KeywordPacksConfig | null>(null);
  const [keywordPacks, setKeywordPacks] = useState<KeywordPacksConfig>({});

  const [newPackName, setNewPackName] = useState("");
  const [newKeywordByPack, setNewKeywordByPack] = useState<Record<string, string>>(
    {},
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const sortedPackEntries = useMemo(
    () => Object.entries(keywordPacks).sort(([a], [b]) => a.localeCompare(b)),
    [keywordPacks],
  );

  const keywordCount = useMemo(() => {
    return Object.values(keywordPacks).reduce(
      (total, keywords) => total + keywords.length,
      0,
    );
  }, [keywordPacks]);

  const isDirty = useMemo(() => {
    if (!initialKeywordPacks) return false;
    return (
      JSON.stringify(sortKeywordPacks(initialKeywordPacks)) !==
      JSON.stringify(sortKeywordPacks(keywordPacks))
    );
  }, [initialKeywordPacks, keywordPacks]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const packNames = Object.keys(keywordPacks);

    for (const packName of packNames) {
      if (!packName.trim()) {
        errors.push("Pack names cannot be blank.");
      }

      if (packName !== slugify(packName)) {
        errors.push(`Pack "${packName}" should use lowercase slug format.`);
      }

      const keywords = keywordPacks[packName] || [];
      const seenKeywords = new Set<string>();

      for (const keyword of keywords) {
        const normalizedKeyword = normalizeKeyword(keyword);

        if (!normalizedKeyword) {
          errors.push(`Pack "${packName}" contains a blank keyword.`);
          continue;
        }

        if (seenKeywords.has(normalizedKeyword)) {
          errors.push(
            `Pack "${packName}" contains duplicate keyword "${normalizedKeyword}".`,
          );
        }

        seenKeywords.add(normalizedKeyword);
      }
    }

    return errors;
  }, [keywordPacks]);

  const canSave = isDirty && validationErrors.length === 0 && !saving;

  useEffect(() => {
    let cancelled = false;

    getLocalConfig("keyword-packs")
      .then((config) => {
        if (cancelled) return;

        const sortedConfig = sortKeywordPacks(config);

        setInitialKeywordPacks(sortedConfig);
        setKeywordPacks(sortedConfig);
        setLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load keyword-packs config",
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

  function addPack() {
    clearMessages();

    const packName = slugify(newPackName);

    if (!packName) return;

    setKeywordPacks((current) => {
      if (current[packName]) return current;

      return sortKeywordPacks({
        ...current,
        [packName]: [],
      });
    });

    setNewPackName("");
  }

  function removePack(packName: string) {
    clearMessages();

    setKeywordPacks((current) => {
      const next = { ...current };
      delete next[packName];
      return sortKeywordPacks(next);
    });
  }

  function addKeyword(packName: string) {
    clearMessages();

    const keyword = normalizeKeyword(newKeywordByPack[packName] || "");

    if (!keyword) return;

    setKeywordPacks((current) => {
      const currentKeywords = current[packName] || [];

      if (currentKeywords.includes(keyword)) {
        return current;
      }

      return sortKeywordPacks({
        ...current,
        [packName]: [...currentKeywords, keyword],
      });
    });

    setNewKeywordByPack((current) => ({
      ...current,
      [packName]: "",
    }));
  }

  function removeKeyword(packName: string, keyword: string) {
    clearMessages();

    setKeywordPacks((current) => ({
      ...current,
      [packName]: (current[packName] || []).filter(
        (currentKeyword) => currentKeyword !== keyword,
      ),
    }));
  }

  function resetForm() {
    if (!initialKeywordPacks) return;

    setKeywordPacks(initialKeywordPacks);
    setNewPackName("");
    setNewKeywordByPack({});
    setSaveError(null);
    setSaveMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    const nextKeywordPacks = sortKeywordPacks(
      Object.entries(keywordPacks).reduce<KeywordPacksConfig>(
        (next, [packName, keywords]) => {
          const normalizedPackName = slugify(packName);

          if (!normalizedPackName) return next;

          next[normalizedPackName] = Array.from(
            new Set(
              keywords
                .map((keyword) => normalizeKeyword(keyword))
                .filter(Boolean),
            ),
          );

          return next;
        },
        {},
      ),
    );

    try {
      const savedKeywordPacks = await updateLocalConfig(
        "keyword-packs",
        nextKeywordPacks,
      );

      const sortedSavedKeywordPacks = sortKeywordPacks(savedKeywordPacks);

      setInitialKeywordPacks(sortedSavedKeywordPacks);
      setKeywordPacks(sortedSavedKeywordPacks);
      setSaveMessage("Keyword packs saved. Backup created automatically.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save keyword-packs config",
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
            <Tags className="h-4 w-4" />
            Local Keywords
          </p>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Keyword Settings
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Manage keyword packs used by the lightweight incident mapper.
                Changes write to{" "}
                <span className="font-mono text-[var(--gold-primary)]">
                  osiris-data/keyword-packs.json
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Packs
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--text-heading)]">
                  {sortedPackEntries.length}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Keywords
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--gold-primary)]">
                  {keywordCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading keyword config...
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Failed to load keywords
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
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                    Packs
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                    Keyword pack registry
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Packs map to backend keyword families and weights. Keep pack
                    names slug-like.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={newPackName}
                    onChange={(event) => setNewPackName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addPack();
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)] sm:w-64"
                    placeholder="new-pack-name"
                  />

                  <button
                    type="button"
                    onClick={addPack}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Pack
                  </button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {sortedPackEntries.map(([packName, keywords]) => (
                  <div
                    key={packName}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Keyword Pack
                        </p>

                        <h3 className="mt-1 font-mono text-lg font-semibold text-[var(--text-heading)]">
                          {packName}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {keywords.length} keywords
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePack(packName)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,80,80,0.25)] px-3 py-2 text-xs text-[var(--alert-red)] transition hover:bg-[rgba(255,80,80,0.08)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Pack
                      </button>
                    </div>

                    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={newKeywordByPack[packName] || ""}
                        onChange={(event) =>
                          setNewKeywordByPack((current) => ({
                            ...current,
                            [packName]: event.target.value,
                          }))
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addKeyword(packName);
                          }
                        }}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                        placeholder="add keyword"
                      />

                      <button
                        type="button"
                        onClick={() => addKeyword(packName)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[rgba(212,175,55,0.35)] hover:text-[var(--gold-primary)]"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>

                    {keywords.length ? (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword) => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => removeKeyword(packName, keyword)}
                            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition hover:border-[rgba(255,80,80,0.3)] hover:text-[var(--alert-red)]"
                            title="Remove keyword"
                          >
                            <span>{keyword}</span>
                            <X className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                          Empty Pack
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          Add at least one keyword or remove this pack.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!sortedPackEntries.length ? (
                <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                    No keyword packs configured
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Add at least one pack so OSIRIS has detection vocabulary.
                  </p>
                </div>
              ) : null}
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
                    ? "You have unsaved keyword changes."
                    : "Keyword config is up to date."}
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
                    Save Keywords
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