import { describe, expect, it, vi } from 'vitest';
import * as ssr from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from './server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

type CookieOptions = {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (
    cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
  ) => void;
};

describe('supabase server client', () => {
  it('creates client and forwards cookie handlers', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-anon-key';

    const mockCookieStore = {
      getAll: vi.fn().mockReturnValue([{ name: 'sb-session', value: 'token123' }]),
      set: vi.fn(),
    };
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>
    );

    let cookieConfig: CookieOptions | null = null;
    vi.mocked(ssr.createServerClient).mockImplementation((_url, _key, options) => {
      cookieConfig = options.cookies as unknown as CookieOptions;
      return { auth: {} } as unknown as ReturnType<typeof ssr.createServerClient>;
    });

    const client = await createClient();
    expect(client).toBeDefined();
    expect(cookieConfig).toBeDefined();

    if (cookieConfig) {
      const allCookies = (cookieConfig as CookieOptions).getAll();
      expect(allCookies).toEqual([{ name: 'sb-session', value: 'token123' }]);
      expect(mockCookieStore.getAll).toHaveBeenCalled();

      (cookieConfig as CookieOptions).setAll([
        { name: 'sb-auth', value: 'newval', options: { path: '/' } },
      ]);
      expect(mockCookieStore.set).toHaveBeenCalledWith('sb-auth', 'newval', { path: '/' });

      mockCookieStore.set.mockImplementationOnce(() => {
        throw new Error('Cookies cannot be modified in Server Components');
      });
      expect(() => {
        (cookieConfig as CookieOptions).setAll([
          { name: 'sb-auth', value: 'newval2', options: {} },
        ]);
      }).not.toThrow();
    }
  });
});
