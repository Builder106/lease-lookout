import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { proxy, config } from './proxy';
import * as supabaseProxy from './lib/supabase/proxy';

vi.mock('./lib/supabase/proxy', () => ({
  updateSession: vi.fn(),
}));

describe('proxy middleware', () => {
  it('calls updateSession and exports matcher config', async () => {
    const mockResponse = new NextResponse();
    vi.mocked(supabaseProxy.updateSession).mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost:3000/some-page');
    const result = await proxy(request);

    expect(supabaseProxy.updateSession).toHaveBeenCalledWith(request);
    expect(result).toBe(mockResponse);
    expect(config.matcher).toBeDefined();
    expect(config.matcher.length).toBeGreaterThan(0);
  });
});
