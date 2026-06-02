// src/features/settings/components/SettingsSectionPage.tsx

import Link from "next/link";
import {
  ArrowRight,
  Database,
  Download,
  FileJson,
  Globe2,
  MapPin,
  Radio,
  Settings,
  Tags,
  TerminalSquare,
  User,
} from "lucide-react";

const settingsSections = [
  {
    title: "Profile",
    description: "Edit local workspace name, operator display name, callsign, and homepage mode.",
    href: "/settings/profile",
    icon: User,
    configFile: "profile.json",
  },
  {
    title: "Sources",
    description: "Manage RSS feeds, enabled status, refresh cadence, source categories, and reliability weights.",
    href: "/settings/sources",
    icon: Radio,
    configFile: "rss-feeds.json",
  },
  {
    title: "Keywords",
    description: "Edit keyword packs used for lightweight event detection and matching.",
    href: "/settings/keywords",
    icon: Tags,
    configFile: "keyword-packs.json",
  },
  {
    title: "Locations",
    description: "Manage watched locations, aliases, coordinates, regions, and watch priority.",
    href: "/settings/locations",
    icon: MapPin,
    configFile: "location-registry.json",
  },
  {
    title: "Topics",
    description: "Manage topic definitions, keyword pack bindings, default severity, and tone.",
    href: "/settings/topics",
    icon: Globe2,
    configFile: "topic-registry.json",
  },
  {
    title: "Entities",
    description: "Manage watched organizations, agencies, companies, actors, aliases, and tags.",
    href: "/settings/entities",
    icon: Database,
    configFile: "entity-registry.json",
  },
  {
    title: "Import / Export",
    description: "Later this will export or restore your local OSIRIS profile and config files.",
    href: "/settings/import-export",
    icon: Download,
    configFile: "osiris-data/",
  },
  {
    title: "Developer",
    description: "Inspect local config health, API routes, diagnostics, and development utilities.",
    href: "/settings/developer",
    icon: TerminalSquare,
    configFile: "diagnostics",
  },
];

export function SettingsSectionPage() {
  return (
    <main className="min-h-full bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/[0.035] p-5 md:p-7">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
            <Settings className="h-4 w-4" />
            Local Configuration
          </p>

          <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
            Settings
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            Manage OSIRIS through local JSON-backed configuration. The browser UI talks to
            local server routes, and the server reads/writes files inside{" "}
            <span className="font-mono text-[var(--gold-primary)]">osiris-data/</span>.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.35)] hover:bg-white/[0.055]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                    <Icon className="h-5 w-5 text-[var(--gold-primary)]" />
                  </div>

                  <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--gold-primary)]" />
                </div>

                <h2 className="text-lg font-semibold text-[var(--text-heading)]">
                  {section.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {section.description}
                </p>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <FileJson className="h-4 w-4 text-[var(--cyan-primary)]" />
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {section.configFile}
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}