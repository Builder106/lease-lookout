export type Citation = { label: string; url: string; quote?: string };

export type Severity = 'illegal' | 'questionable' | 'info';

export type Flag = {
  rule_id: string;
  title: string;
  severity: Severity;
  description: string;
  tenant_explainer: string;
  citations: Citation[];
  status: string;
  matched_text: string;
  page: number | null;
  confidence?: number;
  matcher?: string;
};

/** Whether we even ran the right law against this document. */
export type Coverage = 'covered' | 'out_of_jurisdiction' | 'possibly_exempt' | 'unconfirmed';

export type Scope = {
  coverage: Coverage;
  analyzed_jurisdiction: string;
  analyzed_label: string;
  detected_jurisdiction: string | null;
  detected_label: string | null;
  jurisdiction_match: 'match' | 'mismatch' | 'unconfirmed';
  ruleset_available_for_detected: boolean;
  institutional_housing: boolean;
  institutional_signals: string[];
  headline: string;
  body: string;
  citation: { label: string; url: string } | null;
};

export type Report = {
  ok: boolean;
  /** The ruleset actually run (after auto-detect routing). */
  jurisdiction: string;
  /** What the caller asked for ("auto", a state code, or absent on older reports). */
  requested_jurisdiction?: string;
  meta: { pages: number; chars: number; method: string; needs_ocr: boolean };
  disclaimer: string;
  /** Optional: absent on reports saved before scope detection shipped. */
  scope?: Scope | null;
  flags: Flag[];
  error?: string;
};
