import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  FileJson,
  Globe2,
  Map,
  Radar,
  Search,
  Settings,
  ShieldAlert,
  Signal,
  Wifi,
  WifiOff,
} from "lucide-react";

const navCards = [
  {
    title: "Open Map",
    description: "Launch the live geographic intelligence workspace.",
    href: "/map",
    icon: Map,
    accent: "text-[var(--gold-primary)]",
  },
  {
    title: "View Feed",
    description: "Review incoming event items in a fast TLDR-style stream.",
    href: "/feed",
    icon: Activity,
    accent: "text-[var(--cyan-primary)]",
  },
  {
    title: "Review Signals",
    description: "Inspect derived watch patterns and escalation states.",
    href: "/signals",
    icon: Radar,
    accent: "text-[var(--alert-green)]",
  },
  {
    title: "Check Sources",
    description: "Review source status, feed coverage, and failures.",
    href: "/sources",
    icon: Database,
    accent: "text-[var(--gold-primary)]",
  },
  {
    title: "Manage Settings",
    description: "Edit local profile, feeds, keywords, and registries.",
    href: "/settings",
    icon: Settings,
    accent: "text-[var(--cyan-primary)]",
  },
  {
    title: "Search",
    description: "Search across events, topics, regions, and entities.",
    href: "/search",
    icon: Search,
    accent: "text-[var(--alert-green)]",
  },
];

const overviewMetrics = [
  {
    label: "Active Events",
    value: "—",
    note: "Waiting for local event cache",
    icon: Activity,
  },
  {
    label: "High Watch Events",
    value: "—",
    note: "Severity scoring not wired yet",
    icon: ShieldAlert,
  },
  {
    label: "Active Signals",
    value: "—",
    note: "Signal engine pending",
    icon: Radar,
  },
  {
    label: "Sources Online",
    value: "—",
    note: "Source health pending",
    icon: Wifi,
  },
  {
    label: "Sources Warning",
    value: "—",
    note: "Diagnostics pending",
    icon: AlertTriangle,
  },
  {
    label: "Sources Offline",
    value: "—",
    note: "Diagnostics pending",
    icon: WifiOff,
  },
  {
    label: "Last Refresh",
    value: "Pending",
    note: "No local refresh timestamp yet",
    icon: Clock3,
  },
];

const priorityWatch = [
  {
    title: "No priority watch items yet",
    meta: "Awaiting local event scoring",
    description:
      "Once events, source counts, confidence, and severity are wired in, this panel will show the top 3–5 items needing attention.",
  },
  {
    title: "Scoring model pending",
    meta: "Severity · Confidence · Recency",
    description:
      "Priority ranking will use severity, confidence, source count, recency, and signal involvement.",
  },
];

const feedPreview = [
  {
    title: "Feed preview waiting for local event cache",
    meta: "Newest 5 items will appear here",
    description:
      "After ingestion and cache are connected, this section will show fresh TLDR-style event cards.",
    href: "/feed",
  },
  {
    title: "Event dossiers not generated yet",
    meta: "Source attribution pending",
    description:
      "Event cards will eventually link into source-backed dossier pages with raw evidence and related signals.",
    href: "/events/example-event",
  },
];

const signalSnapshot = [
  {
    label: "New",
    value: "—",
  },
  {
    label: "Watching",
    value: "—",
  },
  {
    label: "Escalating",
    value: "—",
  },
  {
    label: "Cooling",
    value: "—",
  },
];

const sourceHealth = [
  {
    label: "Online",
    value: "—",
    icon: Wifi,
  },
  {
    label: "Warning",
    value: "—",
    icon: AlertTriangle,
  },
  {
    label: "Offline",
    value: "—",
    icon: WifiOff,
  },
  {
    label: "Last Pull",
    value: "Pending",
    icon: Clock3,
  },
  {
    label: "Failed Sources",
    value: "—",
    icon: ShieldAlert,
  },
];

const configStatus = [
  {
    file: "profile.json",
    status: "Pending bootstrap",
  },
  {
    file: "settings.json",
    status: "Pending bootstrap",
  },
  {
    file: "rss-feeds.json",
    status: "Pending bootstrap",
  },
  {
    file: "keyword-packs.json",
    status: "Pending bootstrap",
  },
  {
    file: "location-registry.json",
    status: "Pending bootstrap",
  },
];

export function HomePage() {
  return (
    <main className="min-h-[calc(100dvh-var(--app-navbar-height))] bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.18)] bg-[rgba(255,255,255,0.035)] p-5 shadow-[0_0_40px_rgba(0,0,0,0.28)] md:p-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(212,175,55,0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(0,229,255,0.12), transparent 35%)",
            }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--gold-primary)]">
                <Globe2 className="h-4 w-4" />
                Local Intelligence Workspace
              </p>

              <h1 className="font-mono text-4xl font-bold tracking-[0.22em] text-[var(--text-heading)] md:text-6xl">
                OSIRIS
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Fast local command surface for checking source health, active
                events, signals, freshness, and where to investigate next.
              </p>
            </div>

            <div className="grid min-w-full gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-xs text-[var(--text-secondary)] sm:grid-cols-2 lg:min-w-[360px]">
              <StatusLine label="Workspace" value="OSIRIS Local" />
              <StatusLine label="Operator" value="Tyler" />
              <StatusLine label="Last Refresh" value="Pending" />
              <StatusLine label="Mode" value="Local" highlight />
            </div>
          </div>
        </section>

        <section aria-labelledby="primary-navigation">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
                Command Routes
              </p>
              <h2 id="primary-navigation" className="mt-1 text-xl font-semibold">
                Where do you want to go next?
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {navCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.35)] hover:bg-white/[0.055] hover:shadow-[0_0_30px_rgba(212,175,55,0.06)]"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                      <Icon className={`h-5 w-5 ${card.accent}`} />
                    </div>

                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--gold-primary)]" />
                  </div>

                  <h3 className="text-base font-semibold text-[var(--text-heading)]">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="situation-overview">
          <div className="mb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
              Situation Overview
            </p>
            <h2 id="situation-overview" className="mt-1 text-xl font-semibold">
              Current local status
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {overviewMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {metric.label}
                    </p>

                    <Icon className="h-4 w-4 text-[var(--gold-primary)]" />
                  </div>

                  <p className="font-mono text-2xl font-bold text-[var(--text-heading)]">
                    {metric.value}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
                    {metric.note}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel
            eyebrow="Priority Watch"
            title="Needs attention"
            description="Top items will be ranked by severity, confidence, source count, recency, and signal involvement."
          >
            <div className="space-y-3">
              {priorityWatch.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Signal Snapshot"
            title="Pattern state"
            description="Derived local signals will appear here once the signal engine exists."
          >
            <div className="grid grid-cols-2 gap-3">
              {signalSnapshot.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {signal.label}
                  </p>

                  <p className="mt-3 font-mono text-2xl font-bold text-[var(--cyan-primary)]">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Panel
            eyebrow="Feed Preview"
            title="Newest local events"
            description="The newest five event cards will appear here after local ingestion and caching are connected."
          >
            <div className="space-y-3">
              {feedPreview.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[rgba(0,229,255,0.3)] hover:bg-white/[0.04]"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cyan-primary)]">
                        {item.meta}
                      </p>

                      <h3 className="mt-1 font-semibold text-[var(--text-heading)]">
                        {item.title}
                      </h3>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  </div>

                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Source Health"
            title="Feed status"
            description="Source health will show online, warning, offline, last pull, and failed source counts."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {sourceHealth.map((source) => {
                const Icon = source.icon;

                return (
                  <div
                    key={source.label}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {source.label}
                      </p>

                      <Icon className="h-4 w-4 text-[var(--gold-primary)]" />
                    </div>

                    <p className="mt-3 font-mono text-xl font-bold text-[var(--text-heading)]">
                      {source.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>

        <section>
          <Panel
            eyebrow="Local Config Status"
            title="Configuration health"
            description="Validation will become live after the local JSON bootstrap and config API are added."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {configStatus.map((config) => (
                <div
                  key={config.file}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <FileJson className="h-4 w-4 text-[var(--cyan-primary)]" />
                    <CheckCircle2 className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>

                  <p className="font-mono text-xs font-bold text-[var(--text-heading)]">
                    {config.file}
                  </p>

                  <p className="mt-2 text-xs text-[var(--text-secondary)]">
                    {config.status}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.06)] p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold-primary)]" />

                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                    Config validation pending
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    This page is ready for config health, but the local JSON
                    bootstrap and validation API are not wired yet. No fake
                    green checks. We are classy like that.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

interface StatusLineProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatusLine({ label, value, highlight = false }: StatusLineProps) {
  return (
    <div>
      <p className="text-[var(--text-muted)]">{label}</p>
      <p
        className={
          highlight
            ? "mt-1 font-bold text-[var(--alert-green)]"
            : "mt-1 font-bold text-[var(--text-heading)]"
        }
      >
        {value}
      </p>
    </div>
  );
}

interface PanelProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Panel({ eyebrow, title, description, children }: PanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-primary)]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

interface InfoCardProps {
  title: string;
  meta: string;
  description: string;
}

function InfoCard({ title, meta, description }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Signal className="h-4 w-4 text-[var(--gold-primary)]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {meta}
        </p>
      </div>

      <h3 className="font-semibold text-[var(--text-heading)]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}