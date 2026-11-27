import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAI, GoogleAIBackend, type AI } from 'firebase/ai';

// Browser-only. Firebase web config values are public identifiers, not secrets;
// App Check is what stops other sites from spending this project's AI quota.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let ai: AI | undefined;

function appCheckDebugToken(): string | undefined {
  // A debug token bypasses attestation, so it is honoured only in `next dev`.
  if (process.env.NODE_ENV === 'production') return undefined;
  return process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || undefined;
}

function startApp(): FirebaseApp {
  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error('Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables.');
  }
  const app = initializeApp(config);

  const debugToken = appCheckDebugToken();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
  if (debugToken) {
    // App Check reads this from `self`, which is globalThis in a browser.
    (globalThis as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      debugToken;
  } else if (!siteKey) {
    throw new Error('App Check is not configured. Set NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY.');
  }
  initializeAppCheck(app, {
    // In debug mode the SDK uses the debug token and never loads reCAPTCHA.
    provider: new ReCaptchaEnterpriseProvider(siteKey || 'debug'),
    isTokenAutoRefreshEnabled: true,
  });
  return app;
}

/** The shared Firebase AI Logic instance (Gemini Developer API backend). */
export function firebaseAI(): AI {
  if (!ai) {
    const app = getApps()[0] ?? startApp();
    ai = getAI(app, { backend: new GoogleAIBackend() });
  }
  return ai;
}
