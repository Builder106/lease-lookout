import type { Flag, Report } from '@/lib/report-types';

export function makeFlag(overrides: Partial<Flag> = {}): Flag {
  return {
    rule_id: 'rule-1',
    title: 'Sample rule',
    severity: 'questionable',
    description: 'Sample description',
    tenant_explainer: 'Sample explanation',
    citations: [],
    status: 'draft-unverified',
    matched_text: 'sample text',
    page: 1,
    ...overrides,
  };
}

export function makeReport(overrides: Partial<Report> = {}): Report {
  return {
    ok: true,
    jurisdiction: 'ct',
    requested_jurisdiction: 'auto',
    meta: { pages: 1, chars: 100, method: 'digital', needs_ocr: false },
    disclaimer: 'Disclaimer',
    scope: null,
    flags: [],
    ...overrides,
  };
}

export type SubmitEvent = { preventDefault: () => void };

export function makeSubmitEvent(preventDefault = () => {}): SubmitEvent {
  return { preventDefault };
}
