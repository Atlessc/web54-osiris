"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileJson,
  Loader2,
  Upload,
} from "lucide-react";

import {
  exportLocalConfigBundle,
  importLocalConfigBundle,
} from "@/lib/local-config/client";

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function getExportFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `osiris-local-config-${timestamp}.json`;
}

export function ImportExportSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setMessage(null);
    setError(null);

    try {
      const bundle = await exportLocalConfigBundle();
      downloadJson(getExportFilename(), bundle);
      setMessage("Export downloaded successfully.");
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Failed to export local config",
      );
    } finally {
      setExporting(false);
    }
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImporting(true);
    setMessage(null);
    setError(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = await importLocalConfigBundle(parsed);

      setMessage(
        `Import complete. Updated ${result.imported.length} config file${
          result.imported.length === 1 ? "" : "s"
        }. Backups were created automatically.`,
      );
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Failed to import local config",
      );
    } finally {
      setImporting(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
            <FileJson className="h-4 w-4" />
            Local Backup
          </p>

          <h1 className="text-3xl font-bold text-[var(--text-heading)] md:text-5xl">
            Import / Export
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            Export or restore your local OSIRIS configuration as a single JSON
            bundle. Imports validate every file and create backups before
            writing changes.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
              <Download className="h-5 w-5 text-[var(--gold-primary)]" />
            </div>

            <h2 className="text-xl font-semibold text-[var(--text-heading)]">
              Export Config Bundle
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Downloads profile, settings, sources, keywords, locations, topics,
              and entities as one portable JSON file.
            </p>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || importing}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)] px-4 py-3 text-sm font-semibold text-[var(--gold-primary)] transition hover:bg-[rgba(212,175,55,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export JSON
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
              <Upload className="h-5 w-5 text-[var(--cyan-primary)]" />
            </div>

            <h2 className="text-xl font-semibold text-[var(--text-heading)]">
              Import Config Bundle
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Restore a previously exported OSIRIS config bundle. Existing files
              are backed up before replacement.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={exporting || importing}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(0,229,255,0.28)] bg-[rgba(0,229,255,0.08)] px-4 py-3 text-sm font-semibold text-[var(--cyan-primary)] transition hover:bg-[rgba(0,229,255,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Import JSON
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.06)] p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold-primary)]" />

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                Import Safety
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Importing replaces any config files included in the bundle. The
                server validates each file and creates backups first, but you
                should still export your current config before importing another
                one. Future-you deserves fewer surprises.
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-[rgba(255,80,80,0.35)] bg-[rgba(255,80,80,0.08)] p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-red)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-red)]">
                  Action Failed
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {error}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {message ? (
          <section className="rounded-2xl border border-[rgba(0,255,170,0.18)] bg-[rgba(0,255,170,0.05)] p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--alert-green)]" />

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--alert-green)]">
                  Complete
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {message}
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}