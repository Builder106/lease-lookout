import { describe, expect, it, vi } from 'vitest';
import * as ssr from '@supabase/ssr';
import { createClient } from './client';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}));

describe('supabase client (browser)', () => {
  it('creates client with environment variables', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-anon-key';

    const mockBrowserClient = { auth: {} };
    vi.mocked(ssr.createBrowserClient).mockReturnValue(
      mockBrowserClient as unknown as ReturnType<typeof ssr.createBrowserClient>
    );

    const client = createClient();
    expect(ssr.createBrowserClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'test-anon-key'
    );
    expect(client).toBe(mockBrowserClient);
  });
});
