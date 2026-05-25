// ─────────────────────────────────────────────────────────────────────────────
// Prova — Matching Service
// Scores and ranks APPROVED professionals against a diagnostic session.
// Scoring breakdown (max 100 pts):
//   Category overlap  — up to 40 pts
//   Location match    — 30 pts
//   Budget fit        — 20 pts
//   Rating bonus      — up to 10 pts
// Top 3 results are stored as MatchResult rows for audit.
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from '@/lib/db/client';
import type {
  ServiceCategory,
  ServiceLocation,
  BudgetRange,
  MatchedProfessional,
} from '@/types';

// ── Budget range → price band mapping (Naira) ────────────────────────────────

const BUDGET_BANDS: Record<BudgetRange, { min: number; max: number }> = {
  UNDER_100K:         { min: 0,         max: 100_000 },
  '100K_500K':        { min: 100_000,   max: 500_000 },
  '500K_2M':          { min: 500_000,   max: 2_000_000 },
  ABOVE_2M:           { min: 2_000_000, max: Infinity },
};

// ── Scoring ───────────────────────────────────────────────────────────────────

interface ScoringInput {
  categories: ServiceCategory[];
  location: ServiceLocation;
  budgetRange: BudgetRange;
}

function scoreProfessional(
  pro: {
    categories: { category: string }[];
    location: string;
    priceRangeMin: number;
    priceRangeMax: number;
    aggregateRating: number | { toNumber(): number };
  },
  input: ScoringInput
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // ── Category overlap (0–40 pts) ───────────────────────────────────────────
  const proCategories = pro.categories.map((c) => c.category);
  const inputCats = input.categories;
  const overlap = inputCats.filter((c) => proCategories.includes(c)).length;
  if (overlap > 0) {
    const catScore = Math.min(40, Math.round((overlap / inputCats.length) * 40));
    score += catScore;
    reasons.push(
      `Specialises in ${overlap} of your required service${overlap > 1 ? 's' : ''}`
    );
  }

  // ── Location match (30 pts) ───────────────────────────────────────────────
  if (pro.location === input.location) {
    score += 30;
    reasons.push('Based in your target location');
  }

  // ── Budget fit (20 pts) ───────────────────────────────────────────────────
  const band = BUDGET_BANDS[input.budgetRange];
  const proMin = pro.priceRangeMin;
  const proMax = pro.priceRangeMax;

  if (proMin <= band.max && proMax >= band.min) {
    score += 20;
    reasons.push('Price range fits your budget');
  } else if (proMin <= band.max * 1.2) {
    // Within 20% — partial credit
    score += 10;
    reasons.push('Price range is close to your budget');
  }

  // ── Rating bonus (0–10 pts) ───────────────────────────────────────────────
  const rating =
    typeof pro.aggregateRating === 'object'
      ? pro.aggregateRating.toNumber()
      : Number(pro.aggregateRating);

  if (rating >= 4.5) {
    score += 10;
    reasons.push('Top-rated professional (4.5+)');
  } else if (rating >= 4.0) {
    score += 7;
    reasons.push('Highly rated professional (4.0+)');
  } else if (rating >= 3.5) {
    score += 4;
    reasons.push('Well-rated professional');
  }

  return { score: Math.min(100, score), reasons };
}

// ── Public interface ──────────────────────────────────────────────────────────

export interface RunMatchingResult {
  sessionId: string;
  matches: MatchedProfessional[];
}

/**
 * Runs the matching algorithm for a diagnostic session.
 * Fetches all APPROVED professionals, scores them, stores the top-3 as
 * MatchResult rows, and returns the ranked list.
 */
export async function runMatching(
  sessionId: string,
  input: ScoringInput
): Promise<MatchedProfessional[]> {
  // Fetch all approved, non-deleted professionals with their categories
  const professionals = await prisma.professional.findMany({
    where: {
      status: 'APPROVED',
      deletedAt: null,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      specialty: true,
      location: true,
      bio: true,
      whatsappNumber: true,
      yearsExperience: true,
      priceRangeMin: true,
      priceRangeMax: true,
      profilePhotoUrl: true,
      isFoundingProfessional: true,
      status: true,
      aggregateRating: true,
      totalReviews: true,
      createdAt: true,
      categories: { select: { category: true } },
      portfolio: {
        select: {
          id: true,
          imageUrl: true,
          projectTitle: true,
          projectLocation: true,
          projectCategory: true,
          clientLocationCountry: true,
          completedAt: true,
          description: true,
        },
        take: 6,
        orderBy: { completedAt: 'desc' },
      },
      reviews: {
        where: { isPublished: true },
        select: { id: true, rating: true, body: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  // Score every professional
  const scored = professionals.map((pro) => {
    const { score, reasons } = scoreProfessional(pro, input);
    return { pro, score, reasons };
  });

  // Sort by score descending, take top 3
  const top3 = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (top3.length === 0) return [];

  // Persist match results (upsert to be idempotent on retry)
  await Promise.all(
    top3.map(({ pro, score, reasons }, idx) =>
      prisma.matchResult.upsert({
        where: { sessionId_professionalId: { sessionId, professionalId: pro.id } },
        create: {
          sessionId,
          professionalId: pro.id,
          matchScore: score,
          rank: idx + 1,
          matchReasons: reasons,
        },
        update: {
          matchScore: score,
          rank: idx + 1,
          matchReasons: reasons,
        },
      })
    )
  );

  // Return typed matched professionals
  return top3.map(({ pro, score, reasons }, idx) => ({
    id: pro.id,
    slug: pro.slug,
    name: pro.name,
    specialty: pro.specialty,
    location: pro.location as ServiceLocation,
    bio: pro.bio,
    whatsappNumber: pro.whatsappNumber,
    yearsExperience: pro.yearsExperience,
    priceRangeMin: pro.priceRangeMin,
    priceRangeMax: pro.priceRangeMax,
    profilePhotoUrl: pro.profilePhotoUrl,
    isFoundingProfessional: pro.isFoundingProfessional,
    status: pro.status as import('@/types').ProfessionalStatus,
    aggregateRating:
      typeof pro.aggregateRating === 'object'
        ? pro.aggregateRating.toNumber()
        : Number(pro.aggregateRating),
    totalReviews: pro.totalReviews,
    categories: pro.categories.map((c) => c.category as ServiceCategory),
    portfolio: pro.portfolio.map((p) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      projectTitle: p.projectTitle,
      projectLocation: p.projectLocation,
      projectCategory: p.projectCategory as ServiceCategory,
      clientLocationCountry: p.clientLocationCountry,
      completedAt: p.completedAt.toISOString(),
      description: p.description,
    })),
    reviews: pro.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      clientName: 'Verified Client', // masked for privacy — PII protection
      createdAt: r.createdAt.toISOString(),
    })),
    createdAt: pro.createdAt.toISOString(),
    matchScore: score,
    rank: (idx + 1) as 1 | 2 | 3,
    matchReasons: reasons,
  }));
}
