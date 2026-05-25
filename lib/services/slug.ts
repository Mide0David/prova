// ─────────────────────────────────────────────────────────────────────────────
// Prova — Slug Generation Service
// Generates URL-safe, collision-resistant slugs for professional profiles.
// Used at signup and never changed after creation (SEO-safe).
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from '@/lib/db/client';

/**
 * Converts a name into a URL-safe slug.
 * e.g. "Adélaïde Okonkwo" → "adelaide-okonkwo"
 */
function toBaseSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric
    .trim()
    .replace(/[\s_]+/g, '-')         // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .slice(0, 60);                   // max 60 chars
}

/**
 * Generates a unique slug for a professional.
 * Appends a numeric suffix on collision (e.g. "john-doe-2").
 * Loops until a free slug is found — max 20 attempts.
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  const base = toBaseSlug(name);
  let candidate = base;
  let attempt = 1;

  while (attempt <= 20) {
    const existing = await prisma.professional.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) return candidate;

    attempt++;
    candidate = `${base}-${attempt}`;
  }

  // Fallback: append a short random suffix using crypto-safe randomness
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  return `${base}-${suffix}`;
}
