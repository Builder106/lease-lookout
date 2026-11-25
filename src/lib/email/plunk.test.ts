import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sendEmail } from './plunk';

describe('plunk service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.PLUNK_SECRET_KEY;
    delete process.env.PLUNK_API_URL;
    delete process.env.PLUNK_FROM_ADDRESS;
    delete process.env.PLUNK_FROM_NAME;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('throws when Plunk is not configured', async () => {
    await expect(
      sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        text: 'Hello world',
      })
    ).rejects.toThrow('Plunk is not configured');
  });

  it('sends minimal content to the hosted Plunk API', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { emails: [{ email: 'msg-123' }] },
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Welcome',
      text: 'Hello there',
    });

    expect(result).toEqual({ ok: true, id: 'msg-123' });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://next-api.useplunk.com/v1/send');
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer sk_test');
    expect(options.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(options.body as string) as Record<string, unknown>;
    expect(body.to).toBe('user@example.com');
    expect(body.subject).toBe('Welcome');
    expect(body.from).toEqual({ name: 'LeaseLookout', email: 'hello@leaselookout.com' });
    expect(body.body).toContain('<p>Hello there</p>');
    expect(body.body).toContain('Privacy policy');
    expect(body.reply).toBeUndefined();
  });

  it('uses custom API, sender, reply-to, and HTML content', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    process.env.PLUNK_API_URL = 'https://plunk.example.test/';
    process.env.PLUNK_FROM_ADDRESS = 'env@leaselookout.com';
    process.env.PLUNK_FROM_NAME = 'LeaseLookout Beta';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { emails: [] } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await sendEmail({
      to: 'user@example.com',
      from: 'override@leaselookout.com',
      replyTo: 'reply@leaselookout.com',
      subject: 'HTML email',
      text: 'Text content',
      html: '<p>HTML content</p>',
    });

    expect(result).toEqual({ ok: true, id: '' });
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://plunk.example.test/v1/send');
    const body = JSON.parse(options.body as string) as Record<string, unknown>;
    expect(body.from).toEqual({ name: 'LeaseLookout Beta', email: 'override@leaselookout.com' });
    expect(body.reply).toBe('reply@leaselookout.com');
    expect(body.body).toContain('<p>HTML content</p>');
    expect(body.body).toContain('This is not legal advice.');
  });

  it('escapes text content before converting it to HTML', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { emails: [] } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await sendEmail({
      to: 'user@example.com',
      subject: 'Escaped',
      text: '<script>alert(1)</script>\n\nSecond paragraph',
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string) as Record<string, unknown>;
    expect(body.body).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(body.body).not.toContain('<script>');
  });

  it('returns the Plunk error from a failed response', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid sender' },
        }),
      })
    );

    const result = await sendEmail({
      to: 'bad@example.com',
      subject: 'Fail',
      text: 'Fail',
    });

    expect(result).toEqual({ ok: false, error: 'Plunk 422: Invalid sender' });
  });

  it('handles a malformed error response', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('cannot read body');
        },
      })
    );

    const result = await sendEmail({
      to: 'bad@example.com',
      subject: 'Fail',
      text: 'Fail',
    });

    expect(result).toEqual({ ok: false, error: 'Plunk 500: HTTP 500' });
  });

  it('rejects a successful HTTP response with a failed API payload', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: false,
          error: { code: 'PROJECT_DISABLED', message: 'Project disabled' },
        }),
      })
    );

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Fail',
      text: 'Fail',
    });

    expect(result).toEqual({ ok: false, error: 'Plunk 200: Project disabled' });
  });

  it('handles network errors', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection refused')));

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Network Fail',
      text: 'Test',
    });

    expect(result).toEqual({ ok: false, error: 'Connection refused' });
  });

  it('handles non-Error network failures', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('unknown string error'));

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Network Fail',
      text: 'Test',
    });

    expect(result).toEqual({ ok: false, error: 'network error' });
  });

  it('handles response without emails array or invalid email structure', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: {} }),
      })
    );

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Success without email array',
      text: 'Test',
    });

    expect(result).toEqual({ ok: true, id: '' });
  });

  it('handles response with emails containing non-string email field', async () => {
    process.env.PLUNK_SECRET_KEY = 'sk_test';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { emails: [{ email: 123 }] } }),
      })
    );

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Non-string email',
      text: 'Test',
    });

    expect(result).toEqual({ ok: true, id: '' });
  });
});
