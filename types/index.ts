// ─────────────────────────────────────────────────────────────────────────────
// Groundwork — Shared TypeScript Types
// These types mirror the Prisma schema but are decoupled from it, allowing
// safe use on both client and server without importing Prisma types directly.
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'PROFESSIONAL' | 'CLIENT';

export type ProfessionalStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'SUSPENDED'
  | 'REJECTED';

export type ServiceCategory =
  | 'INTERIOR_DESIGN'
  | 'ARCHITECTURE'
  | 'RENOVATION_CONTRACTOR'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'LANDSCAPING'
  | 'SMART_HOME';

export type ProjectType =
  | 'HOME_RENOVATION'
  | 'INTERIOR_DESIGN'
  | 'HOME_REPAIRS'
  | 'NEW_CONSTRUCTION'
  | 'SMART_HOME'
  | 'LANDSCAPING';

export type ProjectStage =
  | 'EXPLORING'
  | 'ROUGH_PLAN'
  | 'READY_TO_START'
  | 'URGENT';

export type BudgetRange =
  | 'UNDER_100K'
  | '100K_500K'
  | '500K_2M'
  | 'ABOVE_2M';

export type ServiceLocation =
  | 'LAGOS_ISLAND'
  | 'LAGOS_MAINLAND'
  | 'LEKKI_AJAH'
  | 'ABUJA';

export type ConnectionRequestStatus =
  | 'PENDING'
  | 'INTRODUCED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'COMPLETED'
  | 'CANCELLED';

export type JobStatus =
  | 'INTRODUCED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

export type NotificationType =
  | 'CONNECTION_REQUEST_ACCEPTED'
  | 'CONNECTION_REQUEST_DECLINED'
  | 'PROGRESS_UPDATE_POSTED'
  | 'JOB_COMPLETED'
  | 'REVIEW_REQUESTED'
  | 'PROFESSIONAL_APPROVED'
  | 'PROFESSIONAL_SUSPENDED'
  | 'NEW_LEAD_RECEIVED';

export type VerificationAction =
  | 'NIN_VERIFIED'
  | 'BVN_VERIFIED'
  | 'REFERENCE_CALLED'
  | 'PORTFOLIO_VERIFIED'
  | 'INTERVIEW_COMPLETED'
  | 'STANDARDS_AGREED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'NOTE_ADDED';

export type ActorType = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN' | 'SYSTEM';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export type ClientCountry =
  | 'UK'
  | 'US'
  | 'CANADA'
  | 'UAE'
  | 'GERMANY'
  | 'OTHER';

// ── API Response Shape ────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  total?: number;
}

// ── User / Auth ───────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  professionalId?: string; // set when role === PROFESSIONAL
}

// ── Professional ──────────────────────────────────────────────────────────────

export interface PublicProfessional {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  location: ServiceLocation;
  bio: string;
  whatsappNumber: string;
  yearsExperience: number;
  priceRangeMin: number;
  priceRangeMax: number;
  profilePhotoUrl: string | null;
  isFoundingProfessional: boolean;
  status: ProfessionalStatus;
  aggregateRating: number;
  totalReviews: number;
  categories: ServiceCategory[];
  portfolio: PublicPortfolioItem[];
  reviews: PublicReview[];
  createdAt: string;
}

export interface PublicPortfolioItem {
  id: string;
  imageUrl: string;
  projectTitle: string;
  projectLocation: string;
  projectCategory: ServiceCategory;
  clientLocationCountry: string;
  completedAt: string;
  description: string;
}

export interface PublicReview {
  id: string;
  rating: number;
  body: string;
  clientName: string; // masked for privacy
  createdAt: string;
}

// ── Diagnostic / Matching ─────────────────────────────────────────────────────

export interface DiagnosticSessionInput {
  projectType: ProjectType;
  projectStage: ProjectStage;
  budgetRange: BudgetRange;
  location: ServiceLocation;
  clientId?: string;
}

export interface MatchedProfessional extends PublicProfessional {
  matchScore: number;
  rank: 1 | 2 | 3;
  matchReasons: string[];
}

// ── Connection Request ────────────────────────────────────────────────────────

export interface ConnectionRequestInput {
  sessionId: string;
  clientName: string;
  clientWhatsapp: string;
  clientCountry: ClientCountry;
  professionalId: string;
  clientId?: string;
}

// ── Job ───────────────────────────────────────────────────────────────────────

export interface JobSummary {
  id: string;
  title: string;
  description: string;
  location: string;
  category: ServiceCategory;
  budgetNaira: number | null;
  status: JobStatus;
  startedAt: string | null;
  completedAt: string | null;
  clientConfirmedComplete: boolean;
  professionalConfirmedComplete: boolean;
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    name: string;
    slug: string;
    profilePhotoUrl: string | null;
  };
  client?: {
    id: string;
    name: string;
  };
}

export interface ProgressUpdate {
  id: string;
  jobId: string;
  body: string;
  photoUrls: string[];
  createdAt: string;
  professional: {
    name: string;
    profilePhotoUrl: string | null;
  };
}

// ── Notification ──────────────────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminProfessionalDetail extends PublicProfessional {
  email: string;
  phone: string;
  ninVerified: boolean;
  ninVerifiedAt: string | null;
  bvnVerified: boolean;
  bankAccountName: string | null;
  bankAccountVerified: boolean;
  referencesCalled: boolean;
  portfolioVerified: boolean;
  interviewCompleted: boolean;
  standardsAgreed: boolean;
  standardsAgreedAt: string | null;
  verificationNotes: string | null;
  verificationLogs: VerificationLogItem[];
  totalLeads: number;
  totalJobs: number;
}

export interface VerificationLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: VerificationAction;
  notes: string | null;
  createdAt: string;
}

export interface PlatformMetrics {
  professionals: {
    total: number;
    byStatus: Record<ProfessionalStatus, number>;
  };
  connectionRequests: {
    total: number;
    byStatus: Record<ConnectionRequestStatus, number>;
  };
  jobs: {
    total: number;
    byStatus: Record<JobStatus, number>;
  };
  conversionRate: number; // requests → completed jobs
  totalRevenue: number;
}

// ── Pusher Events ─────────────────────────────────────────────────────────────

export interface PusherProgressUpdateEvent {
  jobId: string;
  update: ProgressUpdate;
}

export interface PusherConnectionStatusEvent {
  requestId: string;
  status: ConnectionRequestStatus;
  professionalName: string;
}

export interface PusherNotificationEvent {
  notification: NotificationItem;
}
