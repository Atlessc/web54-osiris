export type SourceBiasLabel =
  | "left"
  | "lean-left"
  | "center"
  | "lean-right"
  | "right"
  | "unrated";

export type SourceBiasConfidence = "low" | "medium" | "high" | "unrated";

export interface SourceBiasProfile {
  score: number | null;
  label: SourceBiasLabel;
  confidence: SourceBiasConfidence;
  asOf: string;
  basis: string;
  referenceUrl: string | null;
  logoUrl: string;
}
