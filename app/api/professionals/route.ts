// ─────────────────────────────────────────────────────────────────────────────
// GET /api/professionals
// Public paginated + filtered list of APPROVED professionals.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { apiError } from '@/lib/auth/middleware';
import { ProfessionalSearchSchema } from '@/lib/validation/schemas';
import type { ServiceCategory, ServiceLocation } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = ProfessionalSearchSchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );
    if (!parsed.success) {
      return apiError('Invalid query parameters', 'VALIDATION_ERROR', 422, parsed.error.flatten());
    }

    const { category, location, minRating, sortBy, cursor, limit } = parsed.data;

    const where = {
      status: 'APPROVED' as const,
      deletedAt: null,
      ...(location ? { location: location as ServiceLocation } : {}),
      ...(minRating ? { aggregateRating: { gte: minRating } } : {}),
      ...(category
        ? { categories: { some: { category: category as ServiceCategory } } }
        : {}),
    };

    const orderBy =
      sortBy === 'reviews'
        ? { totalReviews: 'desc' as const }
        : sortBy === 'newest'
        ? { createdAt: 'desc' as const }
        : { aggregateRating: 'desc' as const };

    const professionals = await prisma.professional.findMany({
      where,
      orderBy,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        slug: true,
        name: true,
        specialty: true,
        location: true,
        bio: true,
        profilePhotoUrl: true,
        isFoundingProfessional: true,
        aggregateRating: true,
        totalReviews: true,
        yearsExperience: true,
        priceRangeMin: true,
        priceRangeMax: true,
        categories: { select: { category: true } },
        portfolio: {
          select: { id: true, imageUrl: true, projectTitle: true, projectCategory: true },
          take: 3,
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    const hasMore = professionals.length > limit;
    const data = hasMore ? professionals.slice(0, limit) : professionals;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return NextResponse.json({
      data: data.map((p) => ({
        ...p,
        aggregateRating:
          typeof p.aggregateRating === 'object'
            ? (p.aggregateRating as { toNumber(): number }).toNumber()
            : Number(p.aggregateRating),
        categories: p.categories.map((c) => c.category),
      })),
      nextCursor,
    });
  } catch (err) {
    console.error('[GET /api/professionals]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
