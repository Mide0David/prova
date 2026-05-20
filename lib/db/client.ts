// ─────────────────────────────────────────────────────────────────────────────
// Prova — Prisma Client Singleton
// In development, Next.js hot-reload would create a new PrismaClient on every
// module reload, exhausting the DB connection pool. We store the instance on
// the global object to persist it across hot-reloads.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
