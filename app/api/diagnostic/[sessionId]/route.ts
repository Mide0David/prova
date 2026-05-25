// GET /api/diagnostic/[sessionId]
// Returns the stored match results for a diagnostic session.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { apiError } from '@/lib/auth/middleware';

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const session = await prisma.diagnosticSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        projectType: true,
        projectStage: true,
        budgetRange: true,
        location: true,
        completedAt: true,
        matchResults: {
          orderBy: { rank: 'asc' },
          select: {
            rank: true,
            matchScore: true,
            matchReasons: true,
            professional: {
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
                  select: {
                    id: true,
                    imageUrl: true,
                    projectTitle: true,
                    projectLocation: true,
                    projectCategory: true,
                    completedAt: true,
                    description: true,
                  },
                  take: 4,
                  orderBy: { completedAt: 'desc' },
                },
                reviews: {
                  where: { isPublished: true },
                  select: { id: true, rating: true, body: true, createdAt: true },
                  take: 2,
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return apiError('Session not found', 'NOT_FOUND', 404);
    }

    const matches = session.matchResults.map((r) => ({
      rank: r.rank,
      matchScore: r.matchScore,
      matchReasons: r.matchReasons as string[],
      professional: {
        ...r.professional,
        aggregateRating:
          typeof r.professional.aggregateRating === 'object'
            ? (r.professional.aggregateRating as { toNumber(): number }).toNumber()
            : Number(r.professional.aggregateRating),
        categories: r.professional.categories.map((c) => c.category),
        portfolio: r.professional.portfolio.map((p) => ({
          ...p,
          completedAt: p.completedAt.toISOString(),
        })),
        reviews: r.professional.reviews.map((rv) => ({
          ...rv,
          clientName: 'Verified Client',
          createdAt: rv.createdAt.toISOString(),
        })),
      },
    }));

    return NextResponse.json({
      sessionId: session.id,
      projectType: session.projectType,
      projectStage: session.projectStage,
      budgetRange: session.budgetRange,
      location: session.location,
      matches,
    });
  } catch (err) {
    console.error('[GET /api/diagnostic/[sessionId]]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
