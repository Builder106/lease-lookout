import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LookoutReport } from './LookoutReport';
import type { Report } from '@/lib/report-types';

describe('LookoutReport component', () => {
  it('renders needs_ocr fallback view when needs_ocr is true', () => {
    const report: Report = {
      ok: true,
      jurisdiction: 'ct',
      requested_jurisdiction: 'ct',
      meta: { pages: 1, chars: 10, method: 'none', needs_ocr: true },
      disclaimer: 'Disclaimer text',
      scope: null,
      flags: [],
    };
    const html = renderToStaticMarkup(<LookoutReport report={report} />);
    expect(html).toContain('We couldn&#x27;t read this PDF.');
  });

  it('renders clean report with 0 flags when in scope', () => {
    const report: Report = {
      ok: true,
      jurisdiction: 'ct',
      requested_jurisdiction: 'ct',
      meta: { pages: 2, chars: 1000, method: 'digital', needs_ocr: false },
      disclaimer: 'Disclaimer text',
      scope: {
        coverage: 'covered',
        analyzed_jurisdiction: 'ct',
        analyzed_label: 'Connecticut',
        detected_jurisdiction: 'CT',
        detected_label: 'Connecticut',
        jurisdiction_match: 'match',
        ruleset_available_for_detected: true,
        institutional_housing: false,
        institutional_signals: [],
        headline: '',
        body: '',
        citation: null,
      },
      flags: [],
    };
    const html = renderToStaticMarkup(<LookoutReport report={report} filename="my-lease.pdf" />);
    expect(html).toContain('Nothing jumped out.');
    expect(html).toContain('my-lease.pdf');
    expect(html).toContain('Connecticut');
  });

  it('renders out-of-scope warning banner with 0 flags', () => {
    const report: Report = {
      ok: true,
      jurisdiction: 'ct',
      requested_jurisdiction: 'ct',
      meta: { pages: 1, chars: 500, method: 'digital', needs_ocr: false },
      disclaimer: 'Disclaimer text',
      scope: {
        coverage: 'out_of_jurisdiction',
        analyzed_jurisdiction: 'ct',
        analyzed_label: 'Connecticut',
        detected_jurisdiction: 'NY',
        detected_label: 'New York',
        jurisdiction_match: 'mismatch',
        ruleset_available_for_detected: true,
        institutional_housing: false,
        institutional_signals: [],
        headline: 'This looks like a New York lease',
        body: 'LeaseLookout matched it against Connecticut law.',
        citation: {
          label: 'NY RPL § 235-b',
          url: 'https://example.com/ny-rpl',
        },
      },
      flags: [],
    };
    const html = renderToStaticMarkup(<LookoutReport report={report} />);
    expect(html).toContain('We can&#x27;t vouch for this one.');
    expect(html).toContain('This looks like a New York lease');
    expect(html).toContain('NY RPL § 235-b');
    expect(html).toContain('reads like a New York document');
  });

  it('renders flags with citations, quotes, attorney-reviewed status and OCR method', () => {
    const report: Report = {
      ok: true,
      jurisdiction: 'ct',
      requested_jurisdiction: 'ct',
      meta: { pages: 2, chars: 800, method: 'ocr', needs_ocr: false },
      disclaimer: 'Legal disclaimer message',
      scope: null,
      flags: [
        {
          rule_id: 'ct-1',
          title: 'Hold Harmless Clause',
          severity: 'illegal',
          description: 'Default description',
          tenant_explainer: 'You cannot waive landlord liability.',
          status: 'attorney-reviewed',
          matched_text: 'Tenant holds Landlord harmless.',
          page: 1,
          confidence: 1.0,
          matcher: 'deterministic',
          citations: [
            {
              label: 'Conn. Gen. Stat. § 47a-4(a)(3)',
              url: 'https://example.com/cga',
              quote: 'No lease may contain a provision waiving liability...',
            },
          ],
        },
        {
          rule_id: 'ct-2',
          title: 'Excessive Late Fee',
          severity: 'questionable',
          description: 'Late fee before 9-day grace.',
          tenant_explainer: '',
          status: 'draft-unverified',
          matched_text: '',
          page: null,
          confidence: 1.0,
          matcher: 'deterministic',
          citations: [],
        },
      ],
    };
    const html = renderToStaticMarkup(<LookoutReport report={report} />);
    expect(html).toContain('2');
    expect(html).toContain('clauses');
    expect(html).toContain('(via OCR)');
    expect(html).toContain('Hold Harmless Clause');
    expect(html).toContain('reviewed');
    expect(html).toContain('p.\u00a01');
    expect(html).toContain('Tenant holds Landlord harmless.');
    expect(html).toContain('Conn. Gen. Stat. § 47a-4(a)(3)');
    expect(html).toContain('No lease may contain a provision waiving liability');
    expect(html).toContain('Excessive Late Fee');
    expect(html).toContain('Late fee before 9-day grace.');
  });

  it('renders single flag case (1 clause) and scope without detected_label', () => {
    const report: Report = {
      ok: true,
      jurisdiction: 'ct',
      requested_jurisdiction: 'ct',
      meta: { pages: 1, chars: 300, method: 'digital', needs_ocr: false },
      disclaimer: 'Legal disclaimer',
      scope: {
        coverage: 'out_of_jurisdiction',
        analyzed_jurisdiction: 'ct',
        analyzed_label: 'Connecticut',
        detected_jurisdiction: null,
        detected_label: null,
        jurisdiction_match: 'unconfirmed',
        ruleset_available_for_detected: false,
        institutional_housing: false,
        institutional_signals: [],
        headline: 'Unconfirmed jurisdiction',
        body: 'Body text',
        citation: null,
      },
      flags: [
        {
          rule_id: 'ct-1',
          title: 'Single Flag',
          severity: 'illegal',
          description: 'Single description',
          tenant_explainer: 'Explainer',
          status: 'draft-unverified',
          matched_text: 'Matched text',
          page: 1,
          confidence: 1.0,
          matcher: 'deterministic',
          citations: [],
        },
      ],
    };
    const html = renderToStaticMarkup(<LookoutReport report={report} />);
    expect(html).toContain('1');
    expect(html).toContain('clause');
    expect(html).toContain('We read 1 page against Connecticut law');
    expect(html).toContain('Checked against Connecticut law');
    expect(html).not.toContain('reads like a');
  });
});
