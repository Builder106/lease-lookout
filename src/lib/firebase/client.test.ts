import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  getApps: vi.fn((): { name: string }[] => []),
  initializeApp: vi.fn(() => ({ name: 'app' })),
  initializeAppCheck: vi.fn(),
  ReCaptchaEnterpriseProvider: vi.fn(function (this: { key: string }, key: string) {
    this.key = key;
  }),
  getAI: vi.fn(() => ({ ai: true })),
  GoogleAIBackend: vi.fn(),
}));

vi.mock('firebase/app', () => ({ getApps: m.getApps, initializeApp: m.initializeApp }));
vi.mock('firebase/app-check', () => ({
  initializeAppCheck: m.initializeAppCheck,
  ReCaptchaEnterpriseProvider: m.ReCaptchaEnterpriseProvider,
}));
vi.mock('firebase/ai', () => ({ getAI: m.getAI, GoogleAIBackend: m.GoogleAIBackend }));

const globals = globalThis as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string };

function configure() {
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'key');
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'example.firebaseapp.com');
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'example');
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', '1:2:web:3');
}

async function load() {
  vi.resetModules();
  return import('./client');
}

describe('firebaseAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete globals.FIREBASE_APPCHECK_DEBUG_TOKEN;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('refuses to start without the Firebase config', async () => {
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_API_KEY', '');
    const { firebaseAI } = await load();
    expect(() => firebaseAI()).toThrow(/NEXT_PUBLIC_FIREBASE_/);
  });

  it('uses the debug token in development and caches the instance', async () => {
    configure();
    vi.stubEnv('NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN', 'debug-uuid');
    vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY', '');
    const { firebaseAI } = await load();

    const first = firebaseAI();
    const second = firebaseAI();

    expect(second).toBe(first);
    expect(m.initializeApp).toHaveBeenCalledTimes(1);
    expect(globals.FIREBASE_APPCHECK_DEBUG_TOKEN).toBe('debug-uuid');
    expect(m.ReCaptchaEnterpriseProvider).toHaveBeenCalledWith('debug');
    expect(m.initializeAppCheck).toHaveBeenCalledWith(
      { name: 'app' },
      expect.objectContaining({ isTokenAutoRefreshEnabled: true })
    );
    expect(m.getAI).toHaveBeenCalledWith({ name: 'app' }, expect.any(Object));
  });

  it('ignores the debug token in production and requires a site key', async () => {
    configure();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN', 'debug-uuid');
    vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY', '');
    const { firebaseAI } = await load();

    expect(() => firebaseAI()).toThrow(/RECAPTCHA_ENTERPRISE_SITE_KEY/);
    expect(globals.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
  });

  it('uses reCAPTCHA Enterprise when a site key is set', async () => {
    configure();
    vi.stubEnv('NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN', '');
    vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY', 'site-key');
    const { firebaseAI } = await load();

    firebaseAI();

    expect(m.ReCaptchaEnterpriseProvider).toHaveBeenCalledWith('site-key');
    expect(globals.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
  });

  it('reuses an app that is already initialized', async () => {
    m.getApps.mockReturnValueOnce([{ name: 'existing' }]);
    const { firebaseAI } = await load();

    firebaseAI();

    expect(m.initializeApp).not.toHaveBeenCalled();
    expect(m.getAI).toHaveBeenCalledWith({ name: 'existing' }, expect.any(Object));
  });
});
