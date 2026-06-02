import Link from "next/link";
import { ArrowLeft, Construction, FileJson } from "lucide-react";

interface SettingsPlaceholderPageProps {
  title: string;
  description: string;
  configFile: string;
}

export function SettingsPlaceholderPage({
  title,
  description,
  configFile,
}: SettingsPlaceholderPageProps) {
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
            <Construction className="h-4 w-4" />
            Editor Placeholder
          </p>

          <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            {description}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-3">
              <FileJson className="h-5 w-5 text-[var(--cyan-primary)]" />

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Backing config
                </p>

                <p className="mt-1 font-mono text-sm text-[var(--text-heading)]">
                  {configFile}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.06)] p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
              Coming next
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              This page will become a controlled local editor that validates JSON,
              creates a backup, writes the updated config, and reloads app state.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}