import { describe, expect, it, vi } from 'vitest';
import * as ssr from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { updateSession } from './proxy';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

type CookieProxyOptions = {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (
    cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>,
    headers?: Record<string, string>
  ) => void;
};

describe('supabase proxy session updater', () => {
  it('allows public routes when not authenticated and handles cookie sync', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-anon-key';

    let cookieConfig: CookieProxyOptions | null = null;
    vi.mocked(ssr.createServerClient).mockImplementation((_url, _key, options) => {
      cookieConfig = options.cookies as unknown as CookieProxyOptions;
      return {
        auth: {
          getClaims: vi.fn().mockResolvedValue({ data: { claims: null } }),
        },
      } as unknown as ReturnType<typeof ssr.createServerClient>;
    });

    const request = new NextRequest('http://localhost:3000/');
    const response = await updateSession(request);

    expect(response.status).toBe(200);
    expect(cookieConfig).toBeDefined();

    if (cookieConfig) {
      // Exercise cookie getAll
      expect((cookieConfig as CookieProxyOptions).getAll()).toEqual([]);

      // Exercise cookie setAll with headers
      (cookieConfig as CookieProxyOptions).setAll(
        [{ name: 'my-cookie', value: 'my-val', options: { httpOnly: true } }],
        { 'x-supabase-cache': 'no-store' }
      );
      expect(request.cookies.get('my-cookie')?.value).toBe('my-val');

      // Exercise cookie setAll without headers
      (cookieConfig as CookieProxyOptions).setAll([
        { name: 'my-cookie-2', value: 'my-val-2', options: { httpOnly: true } },
      ]);
      expect(request.cookies.get('my-cookie-2')?.value).toBe('my-val-2');
    }
  });

  it('redirects unauthenticated user accessing /history to /login', async () => {
    vi.mocked(ssr.createServerClient).mockImplementation(() => {
      return {
        auth: {
          getClaims: vi.fn().mockResolvedValue({ data: { claims: null } }),
        },
      } as unknown as ReturnType<typeof ssr.createServerClient>;
    });

    const request = new NextRequest('http://localhost:3000/history/123');
    const response = await updateSession(request);

    expect(response.status).toBe(307); // NextResponse.redirect default is 307
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('allows authenticated user accessing /history', async () => {
    vi.mocked(ssr.createServerClient).mockImplementation(() => {
      return {
        auth: {
          getClaims: vi.fn().mockResolvedValue({
            data: { claims: { sub: 'user-uuid-123', email: 'user@example.com' } },
          }),
        },
      } as unknown as ReturnType<typeof ssr.createServerClient>;
    });

    const request = new NextRequest('http://localhost:3000/history/123');
    const response = await updateSession(request);

    expect(response.status).toBe(200);
  });
});
