import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BrandMark, Wordmark } from './BrandMark';
import { MiddletownFlag } from './MiddletownFlag';
import { UserBar } from './UserBar';

describe('presentational components', () => {
  it('renders BrandMark and Wordmark', () => {
    const markHtml = renderToStaticMarkup(<BrandMark className="h-6 w-6" />);
    expect(markHtml).toContain('<svg');
    expect(markHtml).toContain('h-6 w-6');

    const wordmarkHtml = renderToStaticMarkup(<Wordmark className="my-brand" />);
    expect(wordmarkHtml).toContain('Lease');
    expect(wordmarkHtml).toContain('Lookout');
    expect(wordmarkHtml).toContain('my-brand');
  });

  it('renders MiddletownFlag', () => {
    const flagHtml = renderToStaticMarkup(<MiddletownFlag className="flag-wrap" />);
    expect(flagHtml).toContain('/middletown-flag.webp');
    expect(flagHtml).toContain('flag-wrap');
    expect(flagHtml).toContain('The flag of Middletown');
  });

  it('renders UserBar with email and links', () => {
    const userBarHtml = renderToStaticMarkup(<UserBar email="test@example.com" />);
    expect(userBarHtml).toContain('test@example.com');
    expect(userBarHtml).toContain('My analyses');
    expect(userBarHtml).toContain('Sign out');
    expect(userBarHtml).toContain('/auth/signout');

    const emptyEmailHtml = renderToStaticMarkup(<UserBar email="" />);
    expect(emptyEmailHtml).toContain('My analyses');
    expect(emptyEmailHtml).not.toContain('test@example.com');
  });
});
