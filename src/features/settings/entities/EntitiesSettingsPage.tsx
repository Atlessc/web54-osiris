"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
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
  EntityRegistryConfig,
  EntityRegistryItem,
  RegistryEntityType,
  WatchPriority,
} from "@/types/local-config";

const EMPTY_ENTITY: EntityRegistryItem = {
  id: "",
  name: "",
  type: "organization",
  aliases: [],
  country: null,
  tags: [],
  watchPriority: "normal",
};

const entityTypeOptions: RegistryEntityType[] = [
  "person",
  "organization",
  "government-agency",
  "international-organization",
  "company",
  "military",
  "infrastructure",
  "custom",
];

const watchPriorityOptions: WatchPriority[] = ["low", "normal", "high"];

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

function nullableString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function sortEntities(entities: EntityRegistryConfig): EntityRegistryConfig {
  return [...entities].sort((a, b) => {
    const priorityRank: Record<WatchPriority, number> = {
      high: 3,
      normal: 2,
      low: 1,
    };

    const priorityDiff =
      priorityRank[b.watchPriority] - priorityRank[a.watchPriority];

    if (priorityDiff !== 0) return priorityDiff;

    const typeDiff = a.type.localeCompare(b.type);
    if (typeDiff !== 0) return typeDiff;

    return a.name.localeCompare(b.name);
  });
}

function getPriorityClassName(priority: WatchPriority) {
  if (priority === "high") {
    return "border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]";
  }

  if (priority === "normal") {
    return "border-[rgba(0,255,170,0.22)] bg-[rgba(0,255,170,0.06)] text-[var(--alert-green)]";
  }

  return "border-white/10 bg-white/[0.035] text-[var(--text-muted)]";
}

export function EntitiesSettingsPage() {
  const [initialEntities, setInitialEntities] =
    useState<EntityRegistryConfig | null>(null);
  const [entities, setEntities] = useState<EntityRegistryConfig>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    if (!initialEntities) return false;

    return JSON.stringify(initialEntities) !== JSON.stringify(entities);
  }, [initialEntities, entities]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const ids = new Set<string>();

    entities.forEach((entity, index) => {
      const label = entity.name || entity.id || `Entity ${index + 1}`;

      if (!entity.id.trim()) {
        errors.push(`${label}: id is required.`);
      }

      if (!entity.name.trim()) {
        errors.push(`${label}: name is required.`);
      }

      const normalizedId = entity.id.trim();

      if (normalizedId) {
        if (ids.has(normalizedId)) {
          errors.push(`${label}: duplicate entity id "${normalizedId}".`);
        }

        ids.add(normalizedId);
      }
    });

    return errors;
  }, [entities]);

  const canSave = isDirty && validationErrors.length === 0 && !saving;

  const highWatchCount = entities.filter(
    (entity) => entity.watchPriority === "high",
  ).length;

  const organizationCount = entities.filter(
    (entity) =>
      entity.type === "organization" ||
      entity.type === "government-agency" ||
      entity.type === "international-organization",
  ).length;

  const companyCount = entities.filter(
    (entity) => entity.type === "company",
  ).length;

  const militaryCount = entities.filter(
    (entity) => entity.type === "military",
  ).length;

  useEffect(() => {
    let cancelled = false;

    getLocalConfig("entity-registry")
      .then((config) => {
        if (cancelled) return;

        const sortedConfig = sortEntities(config);

        setInitialEntities(sortedConfig);
        setEntities(sortedConfig);
        setLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load entity-registry config",
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

  function updateEntity<TField extends keyof EntityRegistryItem>(
    index: number,
    field: TField,
    value: EntityRegistryItem[TField],
  ) {
    clearMessages();

    setEntities((current) =>
      current.map((entity, entityIndex) => {
        if (entityIndex !== index) return entity;

        const nextEntity = {
          ...entity,
          [field]: value,
        };

        if (field === "name" && !entity.id.trim()) {
          nextEntity.id = slugify(String(value));
        }

        return nextEntity;
      }),
    );
  }

  function addEntity() {
    clearMessages();

    setEntities((current) => [
      ...current,
      {
        ...EMPTY_ENTITY,
        id: `new-entity-${current.length + 1}`,
        name: "New Entity",
      },
    ]);
  }

  function removeEntity(index: number) {
    clearMessages();

    setEntities((current) =>
      current.filter((_, entityIndex) => entityIndex !== index),
    );
  }

  function resetForm() {
    if (!initialEntities) return;

    setEntities(initialEntities);
    setSaveError(null);
    setSaveMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    const nextEntities: EntityRegistryConfig = sortEntities(
      entities.map((entity) => ({
        id: slugify(entity.id),
        name: entity.name.trim(),
        type: entity.type,
        aliases: entity.aliases.map((alias) => alias.trim()).filter(Boolean),
        country: entity.country ? nullableString(entity.country) : null,
        tags: entity.tags.map((tag) => tag.trim()).filter(Boolean),
        watchPriority: entity.watchPriority,
      })),
    );

    try {
      const savedEntities = await updateLocalConfig(
        "entity-registry",
        nextEntities,
      );

      const sortedSavedEntities = sortEntities(savedEntities);

      setInitialEntities(sortedSavedEntities);
      setEntities(sortedSavedEntities);
      setSaveMessage("Entities saved. Backup created automatically.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save entity-registry config",
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
            <Database className="h-4 w-4" />
            Local Entities
          </p>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Entity Registry
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Manage watched people, organizations, agencies, companies,
                military actors, infrastructure, aliases, tags, and watch
                priority. Changes write to{" "}
                <span className="font-mono text-[var(--gold-primary)]">
                  osiris-data/entity-registry.json
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
                  {entities.length}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  High
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--gold-primary)]">
                  {highWatchCount}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Orgs
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--cyan-primary)]">
                  {organizationCount}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Military
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--alert-green)]">
                  {militaryCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading entity config...
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Failed to load entities
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
                    Watched entities
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    This registry gives OSIRIS a local list of entities to
                    recognize, group, and connect later.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addEntity}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Entity
                </button>
              </div>

              <div className="space-y-4">
                {entities.map((entity, index) => (
                  <div
                    key={`${entity.id}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Entity {index + 1}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-[var(--text-heading)]">
                          {entity.name || "Unnamed Entity"}
                        </h3>

                        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                          {entity.type}
                          {entity.country ? ` · ${entity.country}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em]",
                            getPriorityClassName(entity.watchPriority),
                          ].join(" ")}
                        >
                          {entity.watchPriority}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeEntity(index)}
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
                          value={entity.name}
                          onChange={(event) =>
                            updateEntity(index, "name", event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="United Nations"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          ID
                        </span>

                        <input
                          value={entity.id}
                          onChange={(event) =>
                            updateEntity(index, "id", slugify(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="united-nations"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Type
                        </span>

                        <select
                          value={entity.type}
                          onChange={(event) =>
                            updateEntity(
                              index,
                              "type",
                              event.target.value as RegistryEntityType,
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {entityTypeOptions.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Watch Priority
                        </span>

                        <select
                          value={entity.watchPriority}
                          onChange={(event) =>
                            updateEntity(
                              index,
                              "watchPriority",
                              event.target.value as WatchPriority,
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {watchPriorityOptions.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Country
                        </span>

                        <input
                          value={entity.country ?? ""}
                          onChange={(event) =>
                            updateEntity(
                              index,
                              "country",
                              nullableString(event.target.value),
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="United States, France, Global..."
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Tags
                        </span>

                        <input
                          value={csvToString(entity.tags)}
                          onChange={(event) =>
                            updateEntity(index, "tags", parseCsv(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="diplomacy, international, security"
                        />
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Aliases
                        </span>

                        <input
                          value={csvToString(entity.aliases)}
                          onChange={(event) =>
                            updateEntity(
                              index,
                              "aliases",
                              parseCsv(event.target.value),
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="UN, U.N., United Nations Security Council"
                        />
                      </label>
                    </div>
                  </div>
                ))}

                {!entities.length ? (
                  <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                      No entities configured
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      Add at least one entity so OSIRIS can start building
                      entity-aware context later.
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
                    ? "You have unsaved entity changes."
                    : "Entity config is up to date."}
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
                    Save Entities
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