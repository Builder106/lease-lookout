import { describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import * as supabaseServer from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('POST /auth/signout', () => {
  it('signs out with supabase and redirects to /login with 303', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabaseServer.createClient).mockResolvedValue({
      auth: { signOut: mockSignOut },
    } as unknown as Awaited<ReturnType<typeof supabaseServer.createClient>>);

    const request = new Request('http://localhost:3000/auth/signout', { method: 'POST' });
    const response = await POST(request);

    expect(mockSignOut).toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });
});
