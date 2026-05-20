// ─────────────────────────────────────────────────────────────────────────────
// Prova — Environment Validation
// Validates all required environment variables at startup using Zod.
// The app will CRASH with a clear error message if any required var is missing.
// This prevents silent runtime failures in production.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth — MUST be a strong random secret, never hardcoded
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),

  // Pusher — optional but realtime is degraded without it
  PUSHER_APP_ID: z.string().optional(),
  PUSHER_KEY: z.string().optional(),
  PUSHER_SECRET: z.string().optional(),
  PUSHER_CLUSTER: z.string().default('eu'),
  NEXT_PUBLIC_PUSHER_KEY: z.string().optional(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string().default('eu'),

  // Supabase Storage — optional, falls back to local storage adapter
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default('prova-uploads'),

  // Paystack — optional, payment processing disabled without it
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),

  // App
  APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Rate limiting
  DIAGNOSTIC_RATE_LIMIT_RPM: z.coerce.number().default(20),

  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@prova.ng'),
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
  realtime: Boolean(env.PUSHER_APP_ID && env.PUSHER_KEY && env.PUSHER_SECRET),
  cloudStorage: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  payments: Boolean(env.PAYSTACK_SECRET_KEY),
  email: Boolean(env.SMTP_HOST && env.SMTP_USER),
} as const;
