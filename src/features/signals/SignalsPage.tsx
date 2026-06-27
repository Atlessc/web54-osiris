"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Binoculars,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Database,
  Eye,
  ExternalLink,
  FileWarning,
  Filter,
  Loader2,
  MapPin,
  Radio,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  DerivedSignal,
  SignalEvidenceArticle,
  SignalConfidence,
  SignalLifecycle,
  SignalSeverity,
  SignalsApiResponse,
} from "@/types/signals";
import type { SourceBiasLabel, SourceBiasProfile } from "@/types/source-bias";

const STORAGE_KEY = "osiris.signal-lifecycle.v1";

const severityRank: Record<SignalSeverity, number> = {
  low: 1,
  watch: 2,
  elevated: 3,
  high: 4,
  critical: 5,
};

const lifecycleRank: Record<SignalLifecycle, number> = {
  escalating: 1,
  new: 2,
  acknowledged: 3,
  monitoring: 4,
  cooling: 5,
  resolved: 6,
  rejected: 7,
};

const severityStyle: Record<SignalSeverity, string> = {
  critical: "border-red-400/35 bg-red-400/10 text-red-300",
  high: "border-orange-400/35 bg-orange-400/10 text-orange-300",
  elevated: "border-amber-300/35 bg-amber-300/10 text-amber-200",
  watch: "border-[var(--gold-primary)]/35 bg-[var(--gold-primary)]/10 text-[var(--gold-light)]",
  low: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
};

const lifecycleStyle: Record<SignalLifecycle, string> = {
  new: "text-[var(--gold-light)]",
  acknowledged: "text-violet-300",
  monitoring: "text-cyan-300",
  escalating: "text-orange-300",
  cooling: "text-blue-300",
  resolved: "text-emerald-300",
  rejected: "text-red-300",
};

const lifecycleIcons: Record<SignalLifecycle, LucideIcon> = {
  new: CircleDot,
  acknowledged: CheckCircle2,
  monitoring: Binoculars,
  escalating: ArrowUpRight,
  cooling: ArrowDownRight,
  resolved: Check,
  rejected: X,
};

const lifecycleActions: Array<{
  lifecycle: SignalLifecycle;
  icon: LucideIcon;
  label: string;
  style: string;
}> = [
  {
    lifecycle: "monitoring",
    icon: Binoculars,
    label: "Monitor",
    style: "text-cyan-300 border-cyan-400/25 hover:bg-cyan-400/10",
  },
  {
    lifecycle: "acknowledged",
    icon: CheckCircle2,
    label: "Acknowledge",
    style:
      "text-[var(--gold-light)] border-[var(--gold-primary)]/25 hover:bg-[var(--gold-primary)]/10",
  },
  {
    lifecycle: "resolved",
    icon: Check,
    label: "Resolve",
    style: "text-emerald-300 border-emerald-400/25 hover:bg-emerald-400/10",
  },
  {
    lifecycle: "rejected",
    icon: XCircle,
    label: "Reject",
    style: "text-red-300 border-red-400/25 hover:bg-red-400/10",
  },
];

const biasColors: Record<SourceBiasLabel, string> = {
  left: "#3B82F6",
  "lean-left": "#67E8F9",
  center: "#E5E7EB",
  "lean-right": "#F59E0B",
  right: "#EF4444",
  unrated: "#6B7280",
};

interface ArticleReaderResponse {
  title?: string;
  description?: string;
  content?: string;
  resolvedUrl?: string;
  truncated?: boolean;
  extractedAt?: string;
  error?: string;
}

function timeAgo(value: string | null) {
  if (!value) return "Unknown";

  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed)) return "Unknown";

  const minutes = Math.max(0, Math.floor(elapsed / 60_000));
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function inferLifecycle(signal: DerivedSignal): SignalLifecycle {
  if (signal.severity === "critical" || signal.severity === "high") {
    return "escalating";
  }

  if (
    signal.newestPublishedAt &&
    Date.now() - new Date(signal.newestPublishedAt).getTime() > 12 * 60 * 60 * 1000
  ) {
    return "cooling";
  }

  if (signal.evidenceCount >= 3 && signal.sources.length >= 2) {
    return "monitoring";
  }

  return "new";
}

function ruleFor(signal: DerivedSignal) {
  const family = signal.keywordFamilies[0] || "general";
  return {
    id: `RSS.CONVERGENCE.${family.toUpperCase()}`,
    version: "preview-0.1",
    category:
      signal.sources.length >= 2
        ? "multi-source corroboration"
        : "reporting threshold",
  };
}

function confidencePercent(signal: DerivedSignal) {
  const sourceBoost = signal.sources.length >= 2 ? 10 : 0;
  return Math.min(100, signal.averageConfidenceScore + sourceBoost);
}

function formatTimestamp(value?: string) {
  if (!value) return "Not yet refreshed";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatBias(profile: SourceBiasProfile) {
  if (profile.score === null) return "Unrated";
  const score = profile.score > 0 ? `+${profile.score}` : String(profile.score);
  return `${profile.label.replace("-", " ")} ${score}`;
}

function SourceAvatar({
  article,
  size = "md",
}: {
  article: SignalEvidenceArticle;
  size?: "sm" | "md" | "lg";
}) {
  const dimensions =
    size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const initial = article.source.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`${dimensions} relative shrink-0 rounded-full border-2 bg-[var(--bg-tertiary)] p-0.5`}
      style={{
        borderColor: biasColors[article.sourceBias.label],
        borderStyle: article.sourceBias.label === "unrated" ? "dashed" : "solid",
      }}
      title={`${article.source}: ${formatBias(article.sourceBias)}`}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[var(--bg-secondary)] font-mono text-[10px] text-[var(--text-secondary)]">
        {initial}
      </span>
      {/* Dynamic publisher favicons are intentionally loaded directly. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={article.sourceBias.logoUrl}
        alt=""
        className="absolute inset-0 h-full w-full rounded-full bg-white object-contain p-1"
      />
    </div>
  );
}

function SpectrumStrip({ evidence }: { evidence: SignalEvidenceArticle[] }) {
  const rated = evidence.filter(
    (article) => typeof article.sourceBias.score === "number",
  );

  return (
    <div className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2.5">
      <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>
      <div className="relative mt-2 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-slate-200 to-red-500">
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-white/70" />
        {rated.slice(0, 24).map((article, index) => {
          const score = article.sourceBias.score as number;

          return (
            <span
              key={`${article.id}-${index}`}
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/70"
              style={{
                left: `${Math.max(0, Math.min(100, (score + 100) / 2))}%`,
                backgroundColor: biasColors[article.sourceBias.label],
              }}
              title={`${article.source}: ${formatBias(article.sourceBias)}`}
            />
          );
        })}
      </div>
      <p className="mt-2 font-mono text-[8px] text-[var(--text-muted)]">
        {rated.length} rated article sources · {evidence.length - rated.length} unrated
      </p>
    </div>
  );
}

function ArticleEvidenceList({
  evidence,
  primaryEventId,
  onOpenArticle,
}: {
  evidence: SignalEvidenceArticle[];
  primaryEventId: string;
  onOpenArticle: (article: SignalEvidenceArticle) => void;
}) {
  return (
    <div className="space-y-2">
      {evidence.map((article) => (
        <button
          key={article.id}
          type="button"
          onClick={() => onOpenArticle(article)}
          className={[
            "flex w-full gap-3 rounded-lg border p-3 text-left transition",
            article.id === primaryEventId
              ? "border-[var(--gold-primary)]/30 bg-[var(--gold-primary)]/[0.05]"
              : "border-white/[0.07] bg-black/20 hover:border-white/15 hover:bg-white/[0.025]",
          ].join(" ")}
        >
          <SourceAvatar article={article} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                {article.source}
              </span>
              <span
                className="rounded border px-1.5 py-0.5 font-mono text-[8px] uppercase"
                style={{
                  color: biasColors[article.sourceBias.label],
                  borderColor: `${biasColors[article.sourceBias.label]}55`,
                }}
              >
                {formatBias(article.sourceBias)}
              </span>
              {article.id === primaryEventId ? (
                <span className="font-mono text-[8px] uppercase text-[var(--gold-primary)]">
                  headline source
                </span>
              ) : null}
              <span className="ml-auto font-mono text-[8px] text-[var(--text-muted)]">
                {timeAgo(article.publishedAt)}
              </span>
            </div>
            <p className="mt-1 text-[11px] font-medium leading-5 text-[var(--text-heading)]">
              {article.title}
            </p>
            {article.description ? (
              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[var(--text-secondary)]">
                {article.description}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {article.sourceTags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] text-[var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1 font-mono text-[8px] uppercase text-cyan-300">
                <BookOpen className="h-3 w-3" />
                Read article
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5">
      <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${tone}`} />
      <div className="min-w-0">
        <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {label}
        </p>
        <p className="font-mono text-xl font-semibold text-[var(--text-heading)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-2.5 py-2">
      <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 bg-transparent font-mono text-[10px] uppercase text-[var(--text-primary)] outline-none"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[var(--bg-secondary)]">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SignalRow({
  signal,
  lifecycle,
  selected,
  expanded,
  evidence,
  onSelect,
  onToggleEvidence,
  onOpenArticle,
}: {
  signal: DerivedSignal;
  lifecycle: SignalLifecycle;
  selected: boolean;
  expanded: boolean;
  evidence: SignalEvidenceArticle[];
  onSelect: () => void;
  onToggleEvidence: () => void;
  onOpenArticle: (article: SignalEvidenceArticle) => void;
}) {
  const LifecycleIcon = lifecycleIcons[lifecycle];
  const rule = ruleFor(signal);
  const primaryArticle =
    evidence.find((article) => article.id === signal.primaryEventId) || evidence[0];

  return (
    <article
      className={[
        "w-full border-b border-white/[0.06] transition",
        selected
          ? "bg-[rgba(212,175,55,0.08)] shadow-[inset_3px_0_0_var(--gold-primary)]"
          : "hover:bg-white/[0.035]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        className="group w-full px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--gold-primary)] sm:px-5"
      >
        <div className="flex items-start gap-3">
          {primaryArticle ? (
            <SourceAvatar article={primaryArticle} />
          ) : (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
              <LifecycleIcon className={`h-4 w-4 ${lifecycleStyle[lifecycle]}`} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${lifecycleStyle[lifecycle]}`}>
                {lifecycle}
              </span>
              <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${severityStyle[signal.severity]}`}>
                {signal.severity}
              </span>
              <span className="font-mono text-[9px] text-cyan-300">
                {confidencePercent(signal)}% CONF
              </span>
              <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">
                {timeAgo(signal.newestPublishedAt)}
              </span>
            </div>

            <div className="mt-2 flex items-start gap-3">
              <h2 className="text-sm font-medium leading-5 text-[var(--text-heading)]">
                {signal.title}
              </h2>
              <ChevronRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--gold-primary)]" />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                <MapPin className="h-3 w-3 text-[var(--gold-primary)]" />
                {signal.location.label}
              </span>
              <span>{signal.evidenceCount} evidence</span>
              <span>{signal.sources.length} sources</span>
              <span className="text-cyan-300/80">{rule.id}</span>
              {primaryArticle ? (
                <span style={{ color: biasColors[primaryArticle.sourceBias.label] }}>
                  headline: {primaryArticle.source} · {formatBias(primaryArticle.sourceBias)}
                </span>
              ) : null}
            </div>

            <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-[var(--text-secondary)]">
              {signal.explanation}
            </p>
          </div>
        </div>
      </button>

      <div className="border-t border-white/[0.05] px-4 py-2 sm:px-5">
        <button
          type="button"
          onClick={onToggleEvidence}
          className="flex w-full items-center justify-between gap-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)] transition hover:text-[var(--gold-light)]"
        >
          <span className="inline-flex items-center gap-2">
            <Scale className="h-3.5 w-3.5" />
            Supporting articles and source spectrum
          </span>
          <ChevronDown className={`h-3.5 w-3.5 transition ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded ? (
          <div className="space-y-3 pb-3 pt-2">
            <SpectrumStrip evidence={evidence} />
            <ArticleEvidenceList
              evidence={evidence}
              primaryEventId={signal.primaryEventId}
              onOpenArticle={onOpenArticle}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/[0.07] px-5 py-4">
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ArticleReaderDialog({
  article,
  reader,
  loading,
  error,
  onClose,
}: {
  article: SignalEvidenceArticle;
  reader: ArticleReaderResponse | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  const originalUrl = reader?.resolvedUrl || article.url;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Article Reader"
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border-active)] bg-[var(--bg-panel-solid)] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
        <div className="flex items-start gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-6">
          <SourceAvatar article={article} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em]">
              <span className="text-[var(--gold-primary)]">Article Reader</span>
              <span className="text-[var(--text-secondary)]">{article.source}</span>
              <span style={{ color: biasColors[article.sourceBias.label] }}>
                {formatBias(article.sourceBias)}
              </span>
            </div>
            <h2 className="mt-2 text-base font-semibold leading-6 text-[var(--text-heading)] sm:text-lg">
              {reader?.title || article.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {article.sourceTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] text-[var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-[var(--text-muted)] transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Close article reader"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 styled-scrollbar sm:px-6">
          <div className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Source position
            </p>
            <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
              {article.sourceBias.basis}
            </p>
            <p className="mt-1 font-mono text-[8px] text-[var(--text-muted)]">
              As of {article.sourceBias.asOf} · Position is not a credibility rating.
            </p>
            {article.sourceBias.referenceUrl ? (
              <a
                href={article.sourceBias.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cyan-300 transition hover:text-cyan-200"
              >
                <ExternalLink className="h-3 w-3" />
                Rating reference
              </a>
            ) : null}
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
              Extracting readable article text
            </div>
          ) : (
            <div className="mt-5">
              {error ? (
                <div className="mb-4 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] p-3 text-[11px] leading-5 text-amber-100/75">
                  Article extraction was incomplete: {error}. The RSS excerpt is shown below.
                </div>
              ) : null}
              {reader?.description ? (
                <p className="mb-5 border-l-2 border-[var(--gold-primary)]/50 pl-4 text-sm leading-7 text-[var(--text-secondary)]">
                  {reader.description}
                </p>
              ) : null}
              <div className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-primary)]">
                {reader?.content || article.description || "No readable excerpt was available."}
              </div>
              {reader?.truncated ? (
                <p className="mt-5 font-mono text-[9px] text-[var(--text-muted)]">
                  Reader preview truncated. Open the original for the complete article.
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-3 sm:px-6">
          <p className="max-w-xl font-mono text-[8px] leading-4 text-[var(--text-muted)]">
            Local extraction may be incomplete because of paywalls, scripts, robots policies, or publisher markup.
          </p>
          <div className="flex gap-2">
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-300 transition hover:bg-cyan-400/10"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open original
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--gold-primary)]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--gold-light)] transition hover:bg-[var(--gold-primary)]/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalDossier({
  signal,
  lifecycle,
  evidence,
  onLifecycleChange,
  onOpenArticle,
}: {
  signal: DerivedSignal;
  lifecycle: SignalLifecycle;
  evidence: SignalEvidenceArticle[];
  onLifecycleChange: (lifecycle: SignalLifecycle) => void;
  onOpenArticle: (article: SignalEvidenceArticle) => void;
}) {
  const rule = ruleFor(signal);
  const confidence = confidencePercent(signal);
  const sourceStrength = Math.min(100, signal.sources.length * 22);

  return (
    <aside className="min-h-0 overflow-y-auto border-t border-white/[0.08] bg-[rgba(7,8,16,0.82)] styled-scrollbar xl:h-full xl:border-l xl:border-t-0">
      <div className="sticky top-0 z-10 border-b border-white/[0.08] bg-[rgba(7,8,16,0.94)] px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-primary)]">
            Signal Dossier
          </p>
          <span className="font-mono text-[9px] text-[var(--text-muted)]">
            {rule.version}
          </span>
        </div>
        <h2 className="mt-3 text-base font-semibold leading-6 text-[var(--text-heading)]">
          {signal.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${lifecycleStyle[lifecycle]}`}>
            {lifecycle}
          </span>
          <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${severityStyle[signal.severity]}`}>
            {signal.severity}
          </span>
          <span className="font-mono text-[10px] text-cyan-300">
            {confidence}% confidence
          </span>
        </div>
      </div>

      <DetailSection title="Rule & Explanation">
        <div className="rounded-lg border border-[var(--border-cyan)] bg-cyan-400/[0.035] p-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em]">
            <span className="text-cyan-300">{rule.id}</span>
            <span className="text-[var(--text-muted)]">{rule.category}</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
            {signal.explanation}
          </p>
          <p className="mt-2 font-mono text-[9px] leading-4 text-amber-200/70">
            Preview rule: formal backend rule IDs, versions, cooldowns, and expiration are not yet emitted.
          </p>
        </div>
      </DetailSection>

      <DetailSection title="Score Breakdown">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Severity", signal.averageSeverityScore],
            ["Confidence", confidence],
            ["Source strength", sourceStrength],
          ].map(([label, score]) => (
            <div key={label} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
              <p className="text-[8px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {label}
              </p>
              <p className="mt-1 font-mono text-lg text-[var(--text-heading)]">{score}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${Math.min(100, Number(score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DetailSection>

      <DetailSection title={`Supporting Evidence (${signal.knownFacts.length})`}>
        <ul className="space-y-2">
          {signal.knownFacts.map((fact) => (
            <li key={fact} className="flex gap-2 text-[11px] leading-5 text-[var(--text-secondary)]">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Uncertainty & Limitations">
        <ul className="space-y-2">
          {signal.uncertainty.map((item) => (
            <li key={item} className="flex gap-2 text-[11px] leading-5 text-[var(--text-secondary)]">
              <FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title={`Source Articles (${evidence.length})`}>
        <SpectrumStrip evidence={evidence} />
        <div className="mt-3">
          <ArticleEvidenceList
            evidence={evidence}
            primaryEventId={signal.primaryEventId}
            onOpenArticle={onOpenArticle}
          />
        </div>
      </DetailSection>

      <DetailSection title="Watch Next">
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {signal.watchNext.map((item) => (
            <li key={item} className="flex items-center gap-2 rounded-lg border border-[var(--border-cyan)] bg-cyan-400/[0.025] px-3 py-2 text-[10px] text-cyan-100/75">
              <Eye className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
              {item}
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Analyst Actions">
        <div className="grid grid-cols-2 gap-2">
          {lifecycleActions.map(({ lifecycle: nextLifecycle, icon: Icon, label, style }) => (
            <button
              key={nextLifecycle}
              type="button"
              onClick={() => onLifecycleChange(nextLifecycle)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${style}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 font-mono text-[8px] leading-4 text-[var(--text-muted)]">
          Analyst lifecycle choices are stored only in this browser.
        </p>
      </DetailSection>
    </aside>
  );
}

export function SignalsPage() {
  const [data, setData] = useState<SignalsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [ruleFilter, setRuleFilter] = useState("all");
  const [independentOnly, setIndependentOnly] = useState(false);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);
  const [readerArticle, setReaderArticle] = useState<SignalEvidenceArticle | null>(null);
  const [readerData, setReaderData] = useState<ArticleReaderResponse | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [lifecycleOverrides, setLifecycleOverrides] = useState<Record<string, SignalLifecycle>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setLifecycleOverrides(JSON.parse(saved) as Record<string, SignalLifecycle>);
        }
      } catch {
        // Local review state is optional; malformed browser data should not block signals.
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const fetchSignals = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/gdelt${refresh ? "?refresh=true" : ""}`,
        { cache: "no-store" },
      );
      const nextData = (await response.json()) as SignalsApiResponse;

      if (!response.ok) {
        throw new Error(nextData.error || "Signal collection failed");
      }

      setData(nextData);
      setSelectedId((current) => current || nextData.derivedSignals?.[0]?.id || null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Signal collection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchSignals(false), 0);
    return () => window.clearTimeout(timer);
  }, [fetchSignals]);

  const lifecycleFor = useCallback(
    (signal: DerivedSignal) => lifecycleOverrides[signal.id] || inferLifecycle(signal),
    [lifecycleOverrides],
  );

  const setLifecycle = (id: string, lifecycle: SignalLifecycle) => {
    setLifecycleOverrides((current) => {
      const next = { ...current, [id]: lifecycle };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const signals = useMemo(
    () =>
      [...(data?.derivedSignals || [])].sort((a, b) => {
        const lifecycleDifference =
          lifecycleRank[lifecycleFor(a)] - lifecycleRank[lifecycleFor(b)];
        if (lifecycleDifference !== 0) return lifecycleDifference;

        const severityDifference = severityRank[b.severity] - severityRank[a.severity];
        if (severityDifference !== 0) return severityDifference;

        return b.evidenceCount - a.evidenceCount;
      }),
    [data?.derivedSignals, lifecycleFor],
  );

  const ruleOptions = useMemo(
    () => Array.from(new Set(signals.map((signal) => ruleFor(signal).id))).sort(),
    [signals],
  );

  const evidenceBySignalId = useMemo(() => {
    const eventsById = new Map(
      (data?.events || []).map((event) => [event.id, event]),
    );
    const next = new Map<string, SignalEvidenceArticle[]>();

    for (const signal of signals) {
      const evidence = signal.relatedEventIds
        .map((id) => eventsById.get(id))
        .filter((event): event is SignalEvidenceArticle => Boolean(event))
        .sort((a, b) => {
          if (a.id === signal.primaryEventId) return -1;
          if (b.id === signal.primaryEventId) return 1;

          const aScore =
            typeof a.sourceBias.score === "number"
              ? Math.abs(a.sourceBias.score)
              : Number.POSITIVE_INFINITY;
          const bScore =
            typeof b.sourceBias.score === "number"
              ? Math.abs(b.sourceBias.score)
              : Number.POSITIVE_INFINITY;
          if (aScore !== bScore) return aScore - bScore;

          const reliabilityDifference =
            b.sourceReliability - a.sourceReliability;
          if (reliabilityDifference !== 0) return reliabilityDifference;

          return (b.publishedAt || "").localeCompare(a.publishedAt || "");
        });

      next.set(signal.id, evidence);
    }

    return next;
  }, [data?.events, signals]);

  const filteredSignals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return signals.filter((signal) => {
      const lifecycle = lifecycleFor(signal);
      const rule = ruleFor(signal);
      const searchable = [
        signal.title,
        signal.location.label,
        signal.explanation,
        ...signal.sources,
        ...signal.matchedKeywords,
        ...signal.keywordFamilies,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (statusFilter === "all" || lifecycle === statusFilter) &&
        (severityFilter === "all" || signal.severity === severityFilter) &&
        (confidenceFilter === "all" || signal.confidence === confidenceFilter) &&
        (ruleFilter === "all" || rule.id === ruleFilter) &&
        (!independentOnly || signal.sources.length >= 2)
      );
    });
  }, [
    confidenceFilter,
    independentOnly,
    lifecycleFor,
    query,
    ruleFilter,
    severityFilter,
    signals,
    statusFilter,
  ]);

  const selectedSignal =
    filteredSignals.find((signal) => signal.id === selectedId) ||
    filteredSignals[0] ||
    null;
  const selectedEvidence = selectedSignal
    ? evidenceBySignalId.get(selectedSignal.id) || []
    : [];

  const openArticle = useCallback(async (article: SignalEvidenceArticle) => {
    setReaderArticle(article);
    setReaderData(null);
    setReaderError(null);
    setReaderLoading(true);

    try {
      const response = await fetch(
        `/api/article-reader?url=${encodeURIComponent(article.url)}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as ArticleReaderResponse;

      if (!response.ok) {
        throw new Error(body.error || "Article reader could not load this URL");
      }

      setReaderData(body);
    } catch (readerFailure) {
      setReaderError(
        readerFailure instanceof Error
          ? readerFailure.message
          : "Article reader could not load this URL",
      );
    } finally {
      setReaderLoading(false);
    }
  }, []);

  const summary = useMemo(() => {
    const active = signals.filter((signal) => {
      const lifecycle = lifecycleFor(signal);
      return lifecycle !== "resolved" && lifecycle !== "rejected";
    });

    return {
      active: active.length,
      escalating: signals.filter((signal) => lifecycleFor(signal) === "escalating").length,
      monitoring: signals.filter((signal) => lifecycleFor(signal) === "monitoring").length,
      cooling: signals.filter((signal) => lifecycleFor(signal) === "cooling").length,
      independentSources: new Set(signals.flatMap((signal) => signal.sources)).size,
    };
  }, [lifecycleFor, signals]);

  return (
    <div className="min-h-full bg-[var(--bg-void)]">
      <header className="border-b border-white/[0.07] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-[var(--gold-primary)]" />
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-heading)]">
                Signals
              </h1>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              Deterministic watch conditions from source-backed reporting.
              Signals are leads, not conclusions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              <p>Data fresh as of</p>
              <p className="mt-1 text-[var(--text-secondary)]">
                {formatTimestamp(data?.timestamp)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void fetchSignals(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--gold-primary)]/35 bg-[var(--gold-primary)]/[0.07] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gold-light)] transition hover:bg-[var(--gold-primary)]/[0.13] disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {data?.stale || data?.metadata?.cache?.mode === "stale-cache" ? (
          <section className="mb-5 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
                  Stale derived data
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  {data.warning ||
                    data.metadata?.cache?.warning ||
                    "Live collection is unavailable. Showing the last known cached signals."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid overflow-hidden rounded-xl border border-[var(--border-primary)] bg-white/[0.018] sm:grid-cols-2 lg:grid-cols-5">
          <SummaryMetric icon={Activity} label="Active" value={summary.active} tone="text-red-300" />
          <SummaryMetric icon={ArrowUpRight} label="Escalating" value={summary.escalating} tone="text-orange-300" />
          <SummaryMetric icon={Binoculars} label="Monitoring" value={summary.monitoring} tone="text-cyan-300" />
          <SummaryMetric icon={ArrowDownRight} label="Cooling" value={summary.cooling} tone="text-blue-300" />
          <SummaryMetric icon={Database} label="Independent Sources" value={summary.independentSources} tone="text-[var(--gold-primary)]" />
        </section>

        <section className="mt-5 overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[rgba(8,10,20,0.72)] shadow-[0_20px_70px_rgba(0,0,0,0.32)]">
          <div className="grid min-h-[680px] xl:h-[clamp(680px,calc(100dvh-20rem),900px)] xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)] xl:overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-col xl:h-full">
              <div className="shrink-0 border-b border-white/[0.08] px-4 py-4 sm:px-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-[var(--text-heading)]">
                      Analyst Review Queue
                    </h2>
                    <span className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
                      {filteredSignals.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--text-muted)]">
                    <Filter className="h-3.5 w-3.5" />
                    Evidence-first review
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search signals, locations, sources..."
                      className="min-w-0 flex-1 bg-transparent text-[11px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                    />
                  </label>
                  <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={Object.keys(lifecycleRank)} />
                  <FilterSelect label="Severity" value={severityFilter} onChange={setSeverityFilter} options={Object.keys(severityRank)} />
                  <FilterSelect label="Confidence" value={confidenceFilter} onChange={setConfidenceFilter} options={["low", "moderate", "high"] satisfies SignalConfidence[]} />
                  <FilterSelect label="Rule" value={ruleFilter} onChange={setRuleFilter} options={ruleOptions} />
                  <button
                    type="button"
                    onClick={() => setIndependentOnly((current) => !current)}
                    className={[
                      "rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition",
                      independentOnly
                        ? "border-cyan-400/35 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-black/20 text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    2+ sources
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto styled-scrollbar">
                {loading && !data ? (
                  <div className="flex min-h-72 items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    <RefreshCw className="h-4 w-4 animate-spin text-[var(--gold-primary)]" />
                    Collecting watch conditions
                  </div>
                ) : error ? (
                  <div className="m-5 rounded-lg border border-red-400/20 bg-red-400/[0.05] p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-300">
                      <AlertTriangle className="h-4 w-4" />
                      Signal collection failed
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-secondary)]">{error}</p>
                  </div>
                ) : filteredSignals.length ? (
                  filteredSignals.map((signal) => (
                    <SignalRow
                      key={signal.id}
                      signal={signal}
                      lifecycle={lifecycleFor(signal)}
                      selected={selectedSignal?.id === signal.id}
                      expanded={expandedEvidenceId === signal.id}
                      evidence={evidenceBySignalId.get(signal.id) || []}
                      onSelect={() => setSelectedId(signal.id)}
                      onToggleEvidence={() =>
                        setExpandedEvidenceId((current) =>
                          current === signal.id ? null : signal.id,
                        )
                      }
                      onOpenArticle={openArticle}
                    />
                  ))
                ) : (
                  <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                    <ShieldCheck className="h-7 w-7 text-[var(--gold-primary)]" />
                    <p className="mt-3 text-sm font-medium text-[var(--text-heading)]">
                      No signals match this review view
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Adjust the filters or refresh the current collection.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedSignal ? (
              <SignalDossier
                signal={selectedSignal}
                lifecycle={lifecycleFor(selectedSignal)}
                evidence={selectedEvidence}
                onLifecycleChange={(lifecycle) => setLifecycle(selectedSignal.id, lifecycle)}
                onOpenArticle={openArticle}
              />
            ) : (
              <aside className="flex min-h-72 items-center justify-center border-t border-white/[0.08] px-6 text-center xl:border-l xl:border-t-0">
                <div>
                  <Radio className="mx-auto h-7 w-7 text-[var(--text-muted)]" />
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Select a signal to open its evidence dossier.
                  </p>
                </div>
              </aside>
            )}
          </div>
        </section>

        <div className="mt-4 flex flex-col gap-2 font-mono text-[9px] leading-4 text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>{data?.sourceNote || "Signals are derived from the configured local collection."}</p>
          <p>
            {data?.metadata?.failedFeedCount || 0} failed feeds · {data?.metadata?.staleCacheCount || 0} stale caches
          </p>
        </div>
      </main>
      {readerArticle ? (
        <ArticleReaderDialog
          article={readerArticle}
          reader={readerData}
          loading={readerLoading}
          error={readerError}
          onClose={() => setReaderArticle(null)}
        />
      ) : null}
    </div>
  );
}
