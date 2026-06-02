"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Save,
  User,
} from "lucide-react";

import {
  getLocalConfig,
  updateLocalConfig,
} from "@/lib/local-config/client";
import type { ProfileConfig } from "@/types/local-config";

const DEFAULT_FORM: ProfileConfig = {
  displayName: "",
  workspaceName: "",
  callsign: "",
  homePageMode: "situation-overview",
};

const homePageModeOptions = [
  {
    value: "situation-overview",
    label: "Situation Overview",
    description: "Default command home with source, event, signal, and config status.",
  },
  {
    value: "map-first",
    label: "Map First",
    description: "Prefer opening the map workflow quickly.",
  },
  {
    value: "feed-first",
    label: "Feed First",
    description: "Prefer reviewing incoming event summaries first.",
  },
];

export function ProfileSettingsPage() {
  const [initialProfile, setInitialProfile] = useState<ProfileConfig | null>(null);
  const [form, setForm] = useState<ProfileConfig>(DEFAULT_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    if (!initialProfile) return false;
    return JSON.stringify(initialProfile) !== JSON.stringify(form);
  }, [initialProfile, form]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!form.displayName.trim()) {
      errors.push("Display name is required.");
    }

    if (!form.workspaceName.trim()) {
      errors.push("Workspace name is required.");
    }

    if (!form.callsign.trim()) {
      errors.push("Callsign is required.");
    }

    if (!form.homePageMode.trim()) {
      errors.push("Home page mode is required.");
    }

    return errors;
  }, [form]);

  const canSave = isDirty && validationErrors.length === 0 && !saving;

  useEffect(() => {
    let cancelled = false;

    getLocalConfig("profile")
      .then((profile) => {
        if (cancelled) return;

        setInitialProfile(profile);
        setForm(profile);
        setLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error ? error.message : "Failed to load profile config",
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

  function updateField<TField extends keyof ProfileConfig>(
    field: TField,
    value: ProfileConfig[TField],
  ) {
    setSaveMessage(null);
    setSaveError(null);

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    if (!initialProfile) return;

    setForm(initialProfile);
    setSaveError(null);
    setSaveMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    const nextProfile: ProfileConfig = {
      displayName: form.displayName.trim(),
      workspaceName: form.workspaceName.trim(),
      callsign: form.callsign.trim(),
      homePageMode: form.homePageMode.trim(),
    };

    try {
      const savedProfile = await updateLocalConfig("profile", nextProfile);

      setInitialProfile(savedProfile);
      setForm(savedProfile);
      setSaveMessage("Profile saved. Backup created automatically.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save profile config",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-full bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/settings"
          className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-[var(--gold-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Link>

        <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/[0.035] p-5 md:p-7">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
            <User className="h-4 w-4" />
            Local Profile
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
                Profile Settings
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Edit your local workspace name, operator display name, callsign,
                and preferred home page mode. Changes write to{" "}
                <span className="font-mono text-[var(--gold-primary)]">
                  osiris-data/profile.json
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Status
              </p>

              <p
                className={[
                  "mt-1 font-mono text-sm font-bold",
                  isDirty ? "text-[var(--gold-primary)]" : "text-[var(--alert-green)]",
                ].join(" ")}
              >
                {isDirty ? "Unsaved Changes" : "Saved"}
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Loading profile config...
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Failed to load profile
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
              <div className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                  Identity
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                  Workspace identity
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  These values are used by the command home page and future app
                  shell displays.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Display Name
                  </span>

                  <input
                    value={form.displayName}
                    onChange={(event) => updateField("displayName", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                    placeholder="Tyler"
                  />
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Callsign
                  </span>

                  <input
                    value={form.callsign}
                    onChange={(event) => updateField("callsign", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                    placeholder="Operator"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Workspace Name
                  </span>

                  <input
                    value={form.workspaceName}
                    onChange={(event) => updateField("workspaceName", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(212,175,55,0.45)]"
                    placeholder="OSIRIS Local"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
              <div className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                  Startup
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
                  Home page mode
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  This is stored now and can control startup behavior when that
                  routing logic is added later.
                </p>
              </div>

              <div className="grid gap-3">
                {homePageModeOptions.map((option) => {
                  const selected = form.homePageMode === option.value;

                  return (
                    <label
                      key={option.value}
                      className={[
                        "cursor-pointer rounded-2xl border p-4 transition",
                        selected
                          ? "border-[rgba(212,175,55,0.45)] bg-[rgba(212,175,55,0.08)]"
                          : "border-white/10 bg-black/20 hover:border-white/20",
                      ].join(" ")}
                    >
                      <div className="flex gap-3">
                        <input
                          type="radio"
                          name="homePageMode"
                          value={option.value}
                          checked={selected}
                          onChange={(event) =>
                            updateField("homePageMode", event.target.value)
                          }
                          className="mt-1"
                        />

                        <div>
                          <p className="font-semibold text-[var(--text-heading)]">
                            {option.label}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
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
                    ? "You have unsaved profile changes."
                    : "Profile config is up to date."}
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
                    Save Profile
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