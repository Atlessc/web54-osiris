"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
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
  LocationRegistryConfig,
  LocationRegistryItem,
} from "@/types/local-config";

const EMPTY_LOCATION: LocationRegistryItem = {
  id: "",
  name: "",
  type: "country",
  region: "global",
  aliases: [],
  coordinates: {
    lat: 0,
    lng: 0,
  },
  watchPriority: "normal",
  tags: [],
};

const locationTypeOptions: LocationRegistryItem["type"][] = [
  "country",
  "region",
  "city",
  "maritime-region",
  "infrastructure",
  "custom",
];

const watchPriorityOptions: LocationRegistryItem["watchPriority"][] = [
  "low",
  "normal",
  "high",
];

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

function sortLocations(locations: LocationRegistryConfig): LocationRegistryConfig {
  return [...locations].sort((a, b) => {
    const priorityRank: Record<LocationRegistryItem["watchPriority"], number> = {
      high: 3,
      normal: 2,
      low: 1,
    };

    const priorityDiff =
      priorityRank[b.watchPriority] - priorityRank[a.watchPriority];

    if (priorityDiff !== 0) return priorityDiff;

    return a.name.localeCompare(b.name);
  });
}

function isValidLat(value: number) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLng(value: number) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function LocationsSettingsPage() {
  const [initialLocations, setInitialLocations] =
    useState<LocationRegistryConfig | null>(null);
  const [locations, setLocations] = useState<LocationRegistryConfig>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    if (!initialLocations) return false;

    return JSON.stringify(initialLocations) !== JSON.stringify(locations);
  }, [initialLocations, locations]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const ids = new Set<string>();

    locations.forEach((location, index) => {
      const label = location.name || location.id || `Location ${index + 1}`;

      if (!location.id.trim()) {
        errors.push(`${label}: id is required.`);
      }

      if (!location.name.trim()) {
        errors.push(`${label}: name is required.`);
      }

      if (!location.region.trim()) {
        errors.push(`${label}: region is required.`);
      }

      if (!isValidLat(location.coordinates.lat)) {
        errors.push(`${label}: latitude must be between -90 and 90.`);
      }

      if (!isValidLng(location.coordinates.lng)) {
        errors.push(`${label}: longitude must be between -180 and 180.`);
      }

      const normalizedId = location.id.trim();

      if (normalizedId) {
        if (ids.has(normalizedId)) {
          errors.push(`${label}: duplicate location id "${normalizedId}".`);
        }

        ids.add(normalizedId);
      }
    });

    return errors;
  }, [locations]);

  const canSave = isDirty && validationErrors.length === 0 && !saving;

  const highWatchCount = locations.filter(
    (location) => location.watchPriority === "high",
  ).length;

  const cityCount = locations.filter((location) => location.type === "city").length;

  const regionCount = locations.filter(
    (location) =>
      location.type === "region" || location.type === "maritime-region",
  ).length;

  useEffect(() => {
    let cancelled = false;

    getLocalConfig("location-registry")
      .then((config) => {
        if (cancelled) return;

        const sortedConfig = sortLocations(config);

        setInitialLocations(sortedConfig);
        setLocations(sortedConfig);
        setLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load location-registry config",
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

  function updateLocation<TField extends keyof LocationRegistryItem>(
    index: number,
    field: TField,
    value: LocationRegistryItem[TField],
  ) {
    clearMessages();

    setLocations((current) =>
      current.map((location, locationIndex) => {
        if (locationIndex !== index) return location;

        const nextLocation = {
          ...location,
          [field]: value,
        };

        if (field === "name" && !location.id.trim()) {
          nextLocation.id = slugify(String(value));
        }

        return nextLocation;
      }),
    );
  }

  function updateCoordinates(
    index: number,
    field: keyof LocationRegistryItem["coordinates"],
    value: number,
  ) {
    clearMessages();

    setLocations((current) =>
      current.map((location, locationIndex) => {
        if (locationIndex !== index) return location;

        return {
          ...location,
          coordinates: {
            ...location.coordinates,
            [field]: value,
          },
        };
      }),
    );
  }

  function addLocation() {
    clearMessages();

    setLocations((current) => [
      ...current,
      {
        ...EMPTY_LOCATION,
        id: `new-location-${current.length + 1}`,
        name: "New Location",
      },
    ]);
  }

  function removeLocation(index: number) {
    clearMessages();

    setLocations((current) =>
      current.filter((_, locationIndex) => locationIndex !== index),
    );
  }

  function resetForm() {
    if (!initialLocations) return;

    setLocations(initialLocations);
    setSaveError(null);
    setSaveMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    const nextLocations: LocationRegistryConfig = sortLocations(
      locations.map((location) => ({
        id: slugify(location.id),
        name: location.name.trim(),
        type: location.type,
        region: location.region.trim(),
        aliases: location.aliases.map((alias) => alias.trim()).filter(Boolean),
        coordinates: {
          lat: Number(location.coordinates.lat),
          lng: Number(location.coordinates.lng),
        },
        watchPriority: location.watchPriority,
        tags: location.tags.map((tag) => tag.trim()).filter(Boolean),
      })),
    );

    try {
      const savedLocations = await updateLocalConfig(
        "location-registry",
        nextLocations,
      );

      const sortedSavedLocations = sortLocations(savedLocations);

      setInitialLocations(sortedSavedLocations);
      setLocations(sortedSavedLocations);
      setSaveMessage("Locations saved. Backup created automatically.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save location-registry config",
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
            <MapPin className="h-4 w-4" />
            Local Locations
          </p>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Location Registry
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Manage watched locations, aliases, coordinates, regions, tags,
                and watch priority. Changes write to{" "}
                <span className="font-mono text-[var(--gold-primary)]">
                  osiris-data/location-registry.json
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
                  {locations.length}
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
                  Cities
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--cyan-primary)]">
                  {cityCount}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Regions
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-[var(--alert-green)]">
                  {regionCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading location config...
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Failed to load locations
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
                    Watched locations
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    These names and aliases are used to map RSS text into
                    coordinates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addLocation}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Location
                </button>
              </div>

              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div
                    key={`${location.id}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Location {index + 1}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-[var(--text-heading)]">
                          {location.name || "Unnamed Location"}
                        </h3>

                        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                          {location.coordinates.lat.toFixed(4)},{" "}
                          {location.coordinates.lng.toFixed(4)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em]",
                            location.watchPriority === "high"
                              ? "border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] text-[var(--gold-primary)]"
                              : location.watchPriority === "normal"
                                ? "border-[rgba(0,255,170,0.22)] bg-[rgba(0,255,170,0.06)] text-[var(--alert-green)]"
                                : "border-white/10 bg-white/[0.035] text-[var(--text-muted)]",
                          ].join(" ")}
                        >
                          {location.watchPriority}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeLocation(index)}
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
                          value={location.name}
                          onChange={(event) =>
                            updateLocation(index, "name", event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="Kyiv"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          ID
                        </span>

                        <input
                          value={location.id}
                          onChange={(event) =>
                            updateLocation(index, "id", slugify(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="kyiv"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Type
                        </span>

                        <select
                          value={location.type}
                          onChange={(event) =>
                            updateLocation(
                              index,
                              "type",
                              event.target.value as LocationRegistryItem["type"],
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                        >
                          {locationTypeOptions.map((type) => (
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
                          value={location.watchPriority}
                          onChange={(event) =>
                            updateLocation(
                              index,
                              "watchPriority",
                              event.target
                                .value as LocationRegistryItem["watchPriority"],
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
                          Region
                        </span>

                        <input
                          value={location.region}
                          onChange={(event) =>
                            updateLocation(index, "region", event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="europe"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Tags
                        </span>

                        <input
                          value={csvToString(location.tags)}
                          onChange={(event) =>
                            updateLocation(index, "tags", parseCsv(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="conflict, europe, capital"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Latitude
                        </span>

                        <input
                          type="number"
                          step={0.0001}
                          min={-90}
                          max={90}
                          value={location.coordinates.lat}
                          onChange={(event) =>
                            updateCoordinates(index, "lat", Number(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Longitude
                        </span>

                        <input
                          type="number"
                          step={0.0001}
                          min={-180}
                          max={180}
                          value={location.coordinates.lng}
                          onChange={(event) =>
                            updateCoordinates(index, "lng", Number(event.target.value))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                        />
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Aliases
                        </span>

                        <input
                          value={csvToString(location.aliases)}
                          onChange={(event) =>
                            updateLocation(
                              index,
                              "aliases",
                              parseCsv(event.target.value),
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                          placeholder="kiev, kyiv oblast"
                        />
                      </label>
                    </div>
                  </div>
                ))}

                {!locations.length ? (
                  <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.06)] p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                      No locations configured
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      Add at least one location so OSIRIS can map matched
                      stories.
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
                    ? "You have unsaved location changes."
                    : "Location config is up to date."}
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
                    Save Locations
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