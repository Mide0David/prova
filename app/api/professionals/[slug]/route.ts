// GET /api/professionals/[slug]
// Public professional profile — no auth required.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { apiError } from '@/lib/auth/middleware';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const professional = await prisma.professional.findUnique({
      where: { slug: params.slug, status: 'APPROVED', deletedAt: null },
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
        createdAt: true,
        categories: { select: { category: true } },
        portfolio: {
          select: {
            id: true,
            imageUrl: true,
            thumbnailUrl: true,
            projectTitle: true,
            projectLocation: true,
            projectCategory: true,
            clientLocationCountry: true,
            completedAt: true,
            description: true,
          },
          orderBy: { completedAt: 'desc' },
        },
        reviews: {
          where: { isPublished: true },
          select: { id: true, rating: true, body: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!professional) {
      return apiError('Professional not found', 'NOT_FOUND', 404);
    }

    return NextResponse.json({
      ...professional,
      aggregateRating:
        typeof professional.aggregateRating === 'object'
          ? (professional.aggregateRating as { toNumber(): number }).toNumber()
          : Number(professional.aggregateRating),
      categories: professional.categories.map((c) => c.category),
      portfolio: professional.portfolio.map((p) => ({
        ...p,
        completedAt: p.completedAt.toISOString(),
      })),
      reviews: professional.reviews.map((r) => ({
        ...r,
        clientName: 'Verified Client',
        createdAt: r.createdAt.toISOString(),
      })),
      createdAt: professional.createdAt.toISOString(),
    });
  } catch (err) {
    console.error('[GET /api/professionals/[slug]]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
