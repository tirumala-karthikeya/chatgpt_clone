import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/.*\.vercel\.app\/api/,
    /^https:\/\/galaxy-ai.*\.vercel\.app/,
  ],
});

export { Sentry };
