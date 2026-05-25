// ─────────────────────────────────────────────────────────────────────────────
// Groundwork — Environment Validation
// Validates all required environment variables at startup using Zod.
// The app will CRASH with a clear error message if any required var is missing.
// This prevents silent runtime failures in production.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

const envSchema = z.object({
  // App
  APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Validate on module load — fail fast if config is broken
const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  const issues = _parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  console.error(`\n❌ Invalid environment variables:\n${issues}\n`);
  throw new Error('Invalid environment configuration. Fix .env.local and restart.');
}

export const env = _parsed.data;

// Feature flags derived from env config
export const features = {
  realtime: false,
  cloudStorage: false,
  payments: false,
  email: false,
} as const;
