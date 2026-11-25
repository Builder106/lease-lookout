import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MiddletownFlag } from './MiddletownFlag';

describe('MiddletownFlag', () => {
  it('renders the accessible flag image and forwards its className', () => {
    const html = renderToStaticMarkup(<MiddletownFlag className="extra-class" />);
    expect(html).toContain('extra-class');
    expect(html).toContain('src="/middletown-flag.webp"');
    expect(html).toContain('alt="The flag of Middletown, Connecticut, waving"');
    expect(html).toContain('width="720"');
  });

  it('supports the default wrapper class state', () => {
    const html = renderToStaticMarkup(<MiddletownFlag />);
    expect(html).toContain('<div>');
  });
});
