import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeverityPill, META } from './SeverityPill';
import type { Severity } from '@/lib/report-types';

describe('SeverityPill component', () => {
  it('renders illegal severity pill with expected class and label', () => {
    const html = renderToStaticMarkup(<SeverityPill severity="illegal" className="custom-class" />);
    expect(html).toContain('Won&#x27;t hold up');
    expect(html).toContain('is-illegal');
    expect(html).toContain('custom-class');
  });

  it('renders questionable severity pill', () => {
    const html = renderToStaticMarkup(<SeverityPill severity="questionable" />);
    expect(html).toContain(META.questionable.label);
    expect(html).toContain('is-check');
  });

  it('renders info severity pill', () => {
    const html = renderToStaticMarkup(<SeverityPill severity="info" />);
    expect(html).toContain(META.info.label);
    expect(html).toContain('is-info');
  });

  it('falls back to info metadata for unknown severity', () => {
    const html = renderToStaticMarkup(
      <SeverityPill severity={'unknown' as unknown as Severity} style={{ color: 'red' }} />
    );
    expect(html).toContain(META.info.label);
    expect(html).toContain('is-info');
  });
});
