// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new CLIENT or PROFESSIONAL user.
// Passwords are hashed with Argon2id before storage.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { hash } from '@node-rs/argon2';
import { prisma } from '@/lib/db/client';
import { apiError } from '@/lib/auth/middleware';
import { ClientSignupSchema, ProfessionalSignupSchema } from '@/lib/validation/schemas';
import { generateUniqueSlug } from '@/lib/services/slug';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role = body.role as string | undefined;

    if (role === 'PROFESSIONAL') {
      // ── Professional signup ────────────────────────────────────────────────
      const parsed = ProfessionalSignupSchema.safeParse(body);
      if (!parsed.success) {
        return apiError('Validation failed', 'VALIDATION_ERROR', 422, parsed.error.flatten());
      }

      const d = parsed.data;

      const existing = await prisma.user.findUnique({
        where: { email: d.email.toLowerCase().trim() },
        select: { id: true },
      });
      if (existing) {
        return apiError('Email already registered', 'EMAIL_TAKEN', 409);
      }

      const passwordHash = await hash(d.password, {
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      const slug = await generateUniqueSlug(d.name);

      const user = await prisma.user.create({
        data: {
          email: d.email.toLowerCase().trim(),
          passwordHash,
          role: 'PROFESSIONAL',
          name: d.name,
          phone: d.phone,
          whatsappNumber: d.whatsappNumber,
          professional: {
            create: {
              slug,
              name: d.name,
              specialty: d.specialty,
              location: d.location,
              bio: d.bio,
              whatsappNumber: d.whatsappNumber,
              yearsExperience: d.yearsExperience,
              priceRangeMin: d.priceRangeMin,
              priceRangeMax: d.priceRangeMax,
              categories: {
                create: d.categories.map((cat) => ({ category: cat })),
              },
            },
          },
        },
        select: { id: true, email: true, name: true, role: true },
      });

      return NextResponse.json({ user }, { status: 201 });
    } else {
      // ── Client signup ──────────────────────────────────────────────────────
      const parsed = ClientSignupSchema.safeParse(body);
      if (!parsed.success) {
        return apiError('Validation failed', 'VALIDATION_ERROR', 422, parsed.error.flatten());
      }

      const d = parsed.data;

      const existing = await prisma.user.findUnique({
        where: { email: d.email.toLowerCase().trim() },
        select: { id: true },
      });
      if (existing) {
        return apiError('Email already registered', 'EMAIL_TAKEN', 409);
      }

      const passwordHash = await hash(d.password, {
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      const user = await prisma.user.create({
        data: {
          email: d.email.toLowerCase().trim(),
          passwordHash,
          role: 'CLIENT',
          name: d.name,
          phone: d.phone,
          whatsappNumber: d.whatsappNumber,
          country: d.country,
        },
        select: { id: true, email: true, name: true, role: true },
      });

      return NextResponse.json({ user }, { status: 201 });
    }
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
