// ─────────────────────────────────────────────────────────────────────────────
// Prova — Zod Validation Schemas
// All API inputs are validated at the route handler level before reaching
// the service layer. This ensures no malformed data ever reaches the DB.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ── Auth ──────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ClientSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  country: z.enum(['UK', 'US', 'CANADA', 'UAE', 'GERMANY', 'OTHER']),
});

export const ProfessionalSignupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().min(7).max(20),
  whatsappNumber: z.string().min(7).max(20),
  specialty: z.string().min(3).max(200),
  location: z.enum(['LAGOS_ISLAND', 'LAGOS_MAINLAND', 'LEKKI_AJAH', 'ABUJA']),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(2000),
  yearsExperience: z.number().int().min(0).max(60),
  priceRangeMin: z.number().int().min(0),
  priceRangeMax: z.number().int().min(0),
  categories: z
    .array(
      z.enum([
        'INTERIOR_DESIGN',
        'ARCHITECTURE',
        'RENOVATION_CONTRACTOR',
        'ELECTRICAL',
        'PLUMBING',
        'LANDSCAPING',
        'SMART_HOME',
      ])
    )
    .min(1, 'At least one category is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

// ── Diagnostic ────────────────────────────────────────────────────────────────

export const CreateDiagnosticSessionSchema = z.object({
  projectType: z.enum([
    'HOME_RENOVATION',
    'INTERIOR_DESIGN',
    'HOME_REPAIRS',
    'NEW_CONSTRUCTION',
    'SMART_HOME',
    'LANDSCAPING',
  ]),
  projectStage: z.enum(['EXPLORING', 'ROUGH_PLAN', 'READY_TO_START', 'URGENT']),
  budgetRange: z.enum([
    'UNDER_100K',
    'ONE_HUNDRED_K_500K',
    'FIVE_HUNDRED_K_2M',
    'ABOVE_2M',
  ]),
  location: z.enum(['LAGOS_ISLAND', 'LAGOS_MAINLAND', 'LEKKI_AJAH', 'ABUJA']),
});

export const SubmitConnectionRequestSchema = z.object({
  clientName: z.string().min(2).max(100),
  clientWhatsapp: z.string().min(7).max(25),
  clientCountry: z.enum(['UK', 'US', 'CANADA', 'UAE', 'GERMANY', 'OTHER']),
  professionalId: z.string().cuid('Invalid professional ID'),
});

// ── Professional Profile ──────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  specialty: z.string().min(3).max(200).optional(),
  location: z
    .enum(['LAGOS_ISLAND', 'LAGOS_MAINLAND', 'LEKKI_AJAH', 'ABUJA'])
    .optional(),
  bio: z.string().min(50).max(2000).optional(),
  whatsappNumber: z.string().min(7).max(25).optional(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  priceRangeMin: z.number().int().min(0).optional(),
  priceRangeMax: z.number().int().min(0).optional(),
  categories: z
    .array(
      z.enum([
        'INTERIOR_DESIGN',
        'ARCHITECTURE',
        'RENOVATION_CONTRACTOR',
        'ELECTRICAL',
        'PLUMBING',
        'LANDSCAPING',
        'SMART_HOME',
      ])
    )
    .min(1)
    .optional(),
});

export const AddPortfolioItemSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL'),
  thumbnailUrl: z.string().url().optional(),
  projectTitle: z.string().min(3).max(200),
  projectLocation: z.string().min(2).max(200),
  projectCategory: z.enum([
    'INTERIOR_DESIGN',
    'ARCHITECTURE',
    'RENOVATION_CONTRACTOR',
    'ELECTRICAL',
    'PLUMBING',
    'LANDSCAPING',
    'SMART_HOME',
  ]),
  clientLocationCountry: z.string().min(2).max(100),
  completedAt: z.string().datetime(),
  description: z.string().min(20).max(1000),
});

// ── Progress Updates ──────────────────────────────────────────────────────────

export const PostProgressUpdateSchema = z.object({
  body: z.string().min(10, 'Update must be at least 10 characters').max(2000),
  photoUrls: z.array(z.string().url()).max(10, 'Maximum 10 photos per update'),
});

// ── Review ────────────────────────────────────────────────────────────────────

export const SubmitReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review cannot exceed 500 characters'),
});

// ── Admin ─────────────────────────────────────────────────────────────────────

export const VerifyStepSchema = z.object({
  step: z.enum([
    'NIN_VERIFIED',
    'BVN_VERIFIED',
    'REFERENCE_CALLED',
    'PORTFOLIO_VERIFIED',
    'INTERVIEW_COMPLETED',
    'STANDARDS_AGREED',
  ]),
  notes: z.string().max(1000).optional(),
});

export const ApproveProfessionalSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export const SuspendProfessionalSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(1000),
});

export const RejectProfessionalSchema = z.object({
  reason: z.string().min(10).max(1000),
});

// ── Pagination ────────────────────────────────────────────────────────────────

export const CursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const ProfessionalSearchSchema = z.object({
  category: z
    .enum([
      'INTERIOR_DESIGN',
      'ARCHITECTURE',
      'RENOVATION_CONTRACTOR',
      'ELECTRICAL',
      'PLUMBING',
      'LANDSCAPING',
      'SMART_HOME',
    ])
    .optional(),
  location: z
    .enum(['LAGOS_ISLAND', 'LAGOS_MAINLAND', 'LEKKI_AJAH', 'ABUJA'])
    .optional(),
  budgetRange: z
    .enum(['UNDER_100K', 'ONE_HUNDRED_K_500K', 'FIVE_HUNDRED_K_2M', 'ABOVE_2M'])
    .optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  sortBy: z.enum(['rating', 'reviews', 'newest']).default('rating'),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

// ── File Upload ────────────────────────────────────────────────────────────────

export const GetUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]),
  fileSize: z.number().int().min(1).max(10 * 1024 * 1024), // 10MB max
  entityType: z.enum(['portfolio', 'progress_update', 'profile_photo']),
  entityId: z.string().optional(),
});
