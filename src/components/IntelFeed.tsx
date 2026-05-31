'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Zap,
  AlertTriangle,
  Radio,
  Eye,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   OSIRIS — Intelligence Feed
   SIGINT-style news aggregation + derived watch conditions
   ═══════════════════════════════════════════════════════════════ */

interface IntelFeedProps {
  data: any;
  onLocate?: (lat: number, lng: number) => void;
}

type SeverityLevel = 'low' | 'watch' | 'elevated' | 'high' | 'critical';
type ConfidenceLevel = 'low' | 'moderate' | 'high';

interface DerivedSignal {
  id?: string;
  title?: string;
  severity?: SeverityLevel;
  confidence?: ConfidenceLevel;
  location?: {
    key?: string;
    label?: string;
    lat?: number;
    lng?: number;
    precision?: string;
  };
  evidenceCount?: number;
  sources?: string[];
  matchedKeywords?: string[];
  keywordFamilies?: string[];
  averageSeverityScore?: number;
  averageConfidenceScore?: number;
  newestPublishedAt?: string | null;
  explanation?: string;
  knownFacts?: string[];
  inferredMeaning?: string[];
  uncertainty?: string[];
  watchNext?: string[];
  relatedEventIds?: string[];
}

function getRiskClass(score: number): string {
  if (score >= 8) return 'risk-critical';
  if (score >= 6) return 'risk-high';
  if (score >= 4) return 'risk-medium';
  return 'risk-low';
}

function getRiskLabel(score: number): string {
  if (score >= 8) return 'CRITICAL';
  if (score >= 6) return 'HIGH';
  if (score >= 4) return 'ELEVATED';
  return 'LOW';
}

function getSignalRiskClass(severity?: SeverityLevel): string {
  if (severity === 'critical') return 'risk-critical';
  if (severity === 'high') return 'risk-high';
  if (severity === 'elevated') return 'risk-medium';
  if (severity === 'watch') return 'risk-medium';
  return 'risk-low';
}

function getSignalBorderClass(severity?: SeverityLevel): string {
  if (severity === 'critical') return 'border-red-500/40 bg-red-950/20';
  if (severity === 'high') return 'border-red-900/30 bg-red-950/10';
  if (severity === 'elevated') return 'border-orange-500/30 bg-orange-950/10';
  if (severity === 'watch') return 'border-yellow-500/25 bg-yellow-950/10';
  return 'border-[var(--border-secondary)] bg-[var(--bg-secondary)]';
}

function getConfidenceClass(confidence?: ConfidenceLevel): string {
  if (confidence === 'high') return 'text-[var(--alert-green)]';
  if (confidence === 'moderate') return 'text-[var(--cyan-primary)]';
  return 'text-[var(--text-muted)]';
}

function normalizeRiskScore(score: unknown): number {
  if (typeof score !== 'number' || Number.isNaN(score)) return 0;

  /**
   * Existing news risk_score is 0-10.
   * Derived OSINT severity scores may be 0-100, so normalize if needed.
   */
  if (score > 10) return Math.round(score / 10);

  return score;
}

function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();

    if (Number.isNaN(diff)) return '';

    const mins = Math.max(0, Math.floor(diff / 60000));
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;

    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return '';
  }
}

function truncateList(items: string[] | undefined, max = 3): string {
  if (!items?.length) return '';

  const visible = items.slice(0, max);
  const hiddenCount = items.length - visible.length;

  return hiddenCount > 0
    ? `${visible.join(' • ')} +${hiddenCount} more`
    : visible.join(' • ');
}

export default function IntelFeed({ data, onLocate }: IntelFeedProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedNewsIdx, setSelectedNewsIdx] = useState<number | null>(null);
  const [selectedSignalIdx, setSelectedSignalIdx] = useState<number | null>(null);

  const news = data.news || [];
  const derivedSignals: DerivedSignal[] = data.gdeltDerivedSignals || [];

  const hasCriticalNews = news.some((n: any) => normalizeRiskScore(n.risk_score) >= 8);
  const hasCriticalSignals = derivedSignals.some(
    (s) => s.severity === 'critical' || s.severity === 'high'
  );
  const totalFeedItems = news.length + derivedSignals.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="glass-panel flex flex-col overflow-visible pointer-events-auto shrink-0"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-4 py-3 hover:bg-[var(--hover-accent)] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Newspaper className="w-3.5 h-3.5 text-[var(--gold-primary)] shrink-0" />

          <span className="hud-text text-[12px] text-[var(--text-primary)]">
            SIGINT FEED
          </span>

          <span
            className="gotham-tag gotham-tag--info"
            style={{ fontSize: '8px', padding: '1px 5px' }}
            title={`${news.length} news items, ${derivedSignals.length} derived watch conditions`}
          >
            {totalFeedItems}
          </span>

          {derivedSignals.length > 0 && (
            <span
              className="gotham-tag gotham-tag--info"
              style={{ fontSize: '7px', padding: '1px 4px' }}
              title="Derived watch conditions"
            >
              {derivedSignals.length} WATCH
            </span>
          )}

          {(hasCriticalNews || hasCriticalSignals) && (
            <span
              className="gotham-tag gotham-tag--critical"
              style={{ fontSize: '7px', padding: '1px 4px' }}
            >
              ALERTS
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--alert-green)] animate-osiris-pulse" />

          {expanded ? (
            <ChevronUp className="w-3 h-3 text-[var(--text-muted)]" />
          ) : (
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
          )}
        </div>
      </button>

      {/* Feed Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-visible"
          >
            <div className="overflow-visible divide-y divide-[var(--border-secondary)]">
              {news.length === 0 && derivedSignals.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] tracking-widest">
                    AWAITING INTELLIGENCE...
                  </span>
                </div>
              ) : (
                <>
                  {/* Derived Watch Conditions */}
                  {derivedSignals.length > 0 && (
                    <div className="border-b border-[var(--border-secondary)]">
                      <div className="px-4 py-2 bg-[var(--bg-tertiary)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="w-3 h-3 text-[var(--cyan-primary)]" />

                          <span className="text-[9px] font-mono tracking-widest text-[var(--cyan-primary)]">
                            DERIVED WATCH CONDITIONS
                          </span>
                        </div>

                        <span className="text-[8px] font-mono text-[var(--text-muted)]">
                          {derivedSignals.length}
                        </span>
                      </div>

                      {derivedSignals.slice(0, 8).map((signal, i) => {
                        const isSelected = selectedSignalIdx === i;
                        const severity = signal.severity || 'watch';
                        const confidence = signal.confidence || 'low';
                        const evidenceCount =
                          signal.evidenceCount || signal.relatedEventIds?.length || 0;
                        const locationLabel = signal.location?.label || 'Unknown location';
                        const canLocate =
                          typeof signal.location?.lat === 'number' &&
                          typeof signal.location?.lng === 'number';

                        return (
                          <div
                            key={signal.id || i}
                            role="button"
                            tabIndex={0}
                            className={`px-4 py-2.5 border-t hover:bg-[var(--hover-accent)] transition-colors cursor-pointer ${getSignalBorderClass(
                              severity
                            )}`}
                            onClick={() => setSelectedSignalIdx(isSelected ? null : i)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setSelectedSignalIdx(isSelected ? null : i);
                              }
                            }}
                          >
                            {/* Signal top row */}
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle
                                className={`w-3 h-3 ${getSignalRiskClass(severity)}`}
                              />

                              <span
                                className={`text-[9px] font-mono font-bold tracking-widest ${getSignalRiskClass(
                                  severity
                                )}`}
                              >
                                {severity.toUpperCase()}
                              </span>

                              <span
                                className={`text-[8px] font-mono bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded ${getConfidenceClass(
                                  confidence
                                )}`}
                              >
                                {confidence.toUpperCase()} CONF
                              </span>

                              {canLocate && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLocate?.(signal.location!.lat!, signal.location!.lng!);
                                  }}
                                  className="text-[var(--text-muted)] hover:text-[var(--cyan-primary)] transition-colors"
                                  title="Locate signal"
                                >
                                  <MapPin className="w-2.5 h-2.5" />
                                </button>
                              )}

                              <span className="text-[8px] font-mono text-[var(--text-muted)] ml-auto">
                                {evidenceCount} items
                              </span>
                            </div>

                            {/* Signal title */}
                            <h4 className="text-[11px] text-[var(--text-primary)] leading-tight">
                              {signal.title ||
                                `${severity.toUpperCase()} watch around ${locationLabel}`}
                            </h4>

                            {/* Location + newest */}
                            <div className="mt-1 flex items-center gap-2 text-[8px] font-mono text-[var(--text-muted)]">
                              <span>{locationLabel}</span>

                              {signal.location?.precision && (
                                <span>• {signal.location.precision}</span>
                              )}

                              {signal.newestPublishedAt && (
                                <span className="ml-auto">
                                  {timeAgo(signal.newestPublishedAt)}
                                </span>
                              )}
                            </div>

                            {/* Short explanation */}
                            {signal.explanation && (
                              <p className="mt-1.5 text-[9px] font-mono text-[var(--text-muted)] leading-relaxed">
                                {signal.explanation}
                              </p>
                            )}

                            {/* Watch next preview */}
                            {signal.watchNext?.length ? (
                              <div className="mt-1.5 text-[8px] font-mono text-[var(--cyan-primary)] leading-relaxed">
                                WATCH: {truncateList(signal.watchNext, 3)}
                              </div>
                            ) : null}

                            {/* Expanded signal details */}
                            <AnimatePresence initial={false}>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.14 }}
                                  className="mt-2 overflow-visible"
                                >
                                  <div className="rounded border border-[var(--border-secondary)] bg-black/20 p-2 space-y-2">
                                    <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
                                      <div>
                                        <span className="text-[var(--text-muted)]">
                                          AVG SEVERITY
                                        </span>
                                        <br />
                                        <span className={getSignalRiskClass(severity)}>
                                          {signal.averageSeverityScore ?? '—'}
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[var(--text-muted)]">
                                          AVG CONFIDENCE
                                        </span>
                                        <br />
                                        <span className={getConfidenceClass(confidence)}>
                                          {signal.averageConfidenceScore ?? '—'}
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[var(--text-muted)]">
                                          SOURCES
                                        </span>
                                        <br />
                                        <span className="text-[var(--text-primary)]">
                                          {signal.sources?.length || 0}
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[var(--text-muted)]">
                                          EVIDENCE
                                        </span>
                                        <br />
                                        <span className="text-[var(--text-primary)]">
                                          {evidenceCount}
                                        </span>
                                      </div>
                                    </div>

                                    {signal.sources?.length ? (
                                      <div className="text-[8px] font-mono leading-relaxed">
                                        <span className="text-[var(--text-muted)]">
                                          SOURCES
                                        </span>
                                        <br />
                                        <span className="text-[var(--text-primary)]">
                                          {truncateList(signal.sources, 4)}
                                        </span>
                                      </div>
                                    ) : null}

                                    {signal.matchedKeywords?.length ? (
                                      <div className="text-[8px] font-mono leading-relaxed">
                                        <span className="text-[var(--text-muted)]">
                                          MATCHED TERMS
                                        </span>
                                        <br />
                                        <span className="text-[var(--gold-primary)]">
                                          {truncateList(signal.matchedKeywords, 8)}
                                        </span>
                                      </div>
                                    ) : null}

                                    {signal.keywordFamilies?.length ? (
                                      <div className="text-[8px] font-mono leading-relaxed">
                                        <span className="text-[var(--text-muted)]">
                                          KEYWORD FAMILIES
                                        </span>
                                        <br />
                                        <span className="text-[var(--cyan-primary)]">
                                          {truncateList(signal.keywordFamilies, 6)}
                                        </span>
                                      </div>
                                    ) : null}

                                    {signal.knownFacts?.length ? (
                                      <div className="text-[8px] font-mono leading-relaxed whitespace-pre-line">
                                        <span className="text-[var(--text-muted)]">
                                          KNOWN FACTS
                                        </span>
                                        <br />
                                        <span className="text-[var(--text-primary)]">
                                          {signal.knownFacts
                                            .slice(0, 3)
                                            .map((fact) => `• ${fact}`)
                                            .join('\n')}
                                        </span>
                                      </div>
                                    ) : null}

                                    {signal.inferredMeaning?.length ? (
                                      <div className="text-[8px] font-mono leading-relaxed whitespace-pre-line">
                                        <span className="text-[var(--text-muted)]">
                                          INFERRED MEANING
                                        </span>
                                        <br />
                                        <span className="text-[var(--cyan-primary)]">
                                          {signal.inferredMeaning
                                            .slice(0, 2)
                                            .map((item) => `• ${item}`)
                                            .join('\n')}
                                        </span>
                                      </div>
                                    ) : null}

                                    {signal.uncertainty?.length ? (
                                      <div className="text-[8px] font-mono leading-relaxed whitespace-pre-line">
                                        <span className="text-[var(--text-muted)]">
                                          UNCERTAINTY
                                        </span>
                                        <br />
                                        <span className="text-yellow-400/80">
                                          {signal.uncertainty
                                            .slice(0, 3)
                                            .map((item) => `• ${item}`)
                                            .join('\n')}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* News Section Header */}
                  <div className="px-4 py-2 bg-[var(--bg-tertiary)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-[var(--gold-primary)]" />

                      <span className="text-[9px] font-mono tracking-widest text-[var(--gold-primary)]">
                        LIVE NEWS INTEL
                      </span>
                    </div>

                    <span className="text-[8px] font-mono text-[var(--text-muted)]">
                      {news.length}
                    </span>
                  </div>

                  {/* News Items */}
                  {news.length === 0 ? (
                    <div className="px-4 py-4 text-center">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest">
                        NO LIVE NEWS ITEMS
                      </span>
                    </div>
                  ) : (
                    news.slice(0, 25).map((item: any, i: number) => {
                      const riskScore = normalizeRiskScore(item.risk_score);
                      const isSelected = selectedNewsIdx === i;

                      return (
                        <div
                          key={item.id || item.link || i}
                          role="button"
                          tabIndex={0}
                          className="px-4 py-2.5 hover:bg-[var(--hover-accent)] transition-colors cursor-pointer"
                          onClick={() => {
                            if (item.link && !item.machine_assessment) {
                              window.open(item.link, '_blank', 'noopener,noreferrer');
                              return;
                            }

                            setSelectedNewsIdx(isSelected ? null : i);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (item.link && !item.machine_assessment) {
                                window.open(item.link, '_blank', 'noopener,noreferrer');
                                return;
                              }

                              setSelectedNewsIdx(isSelected ? null : i);
                            }
                          }}
                        >
                          {/* Top row: risk badge + source + time */}
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[9px] font-mono font-bold tracking-widest ${getRiskClass(
                                riskScore
                              )}`}
                            >
                              {getRiskLabel(riskScore)}
                            </span>

                            <span className="text-[8px] font-mono text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
                              {item.source || 'OSINT'}
                            </span>

                            {item.coords && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLocate?.(item.coords[0], item.coords[1]);
                                }}
                                className="text-[var(--text-muted)] hover:text-[var(--cyan-primary)] transition-colors"
                                title="Locate news item"
                              >
                                <MapPin className="w-2.5 h-2.5" />
                              </button>
                            )}

                            <span className="text-[8px] font-mono text-[var(--text-muted)] ml-auto">
                              {timeAgo(item.published)}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-[11px] text-[var(--text-primary)] leading-tight line-clamp-2">
                            {item.title}
                          </h4>

                          {/* Machine Assessment */}
                          {item.machine_assessment && (
                            <div className="mt-1.5 flex items-start gap-1.5 bg-red-950/20 border border-red-900/20 rounded px-2 py-1">
                              <Zap className="w-2.5 h-2.5 text-red-400 shrink-0 mt-0.5" />

                              <span className="text-[9px] font-mono text-red-400/80 leading-relaxed">
                                {item.machine_assessment}
                              </span>
                            </div>
                          )}

                          {/* Expanded news details */}
                          <AnimatePresence initial={false}>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.14 }}
                                className="mt-2 overflow-visible"
                              >
                                <div className="flex items-center gap-3">
                                  {item.link && (
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-[10px] font-mono text-[var(--cyan-primary)] hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="w-2.5 h-2.5" />
                                      OPEN SOURCE
                                    </a>
                                  )}

                                  {item.coords && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onLocate?.(item.coords[0], item.coords[1]);
                                      }}
                                      className="flex items-center gap-1 text-[10px] font-mono text-[var(--gold-primary)] hover:underline"
                                    >
                                      <MapPin className="w-2.5 h-2.5" />
                                      LOCATE
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}