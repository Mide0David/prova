// ─────────────────────────────────────────────────────────────────────────────
// Prova — NextAuth Configuration
// Uses CredentialsProvider with Argon2 password verification.
// JWT strategy with httpOnly cookies — tokens NEVER in localStorage.
// Role and professionalId embedded in JWT for efficient authorization.
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verify } from '@node-rs/argon2';
import { prisma } from '@/lib/db/client';
import { LoginSchema } from '@/lib/validation/schemas';
import type { UserRole, SessionUser } from '@/types';

// TODO(security): Add OAuth providers (Google) as future enhancement.
// TODO(security): Add MFA/OTP verification step via Twilio as future enhancement.

export const authOptions: NextAuthOptions = {
  // Session stored as a JWT in a secure httpOnly cookie — never in localStorage
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours — non-infinite sessions
  },
  // Cookie name follows __Secure- prefix convention for production hardening
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate input shape with Zod before touching the DB
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Fetch user — select only what we need (principle of least data)
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
            professional: {
              select: { id: true, status: true },
            },
          },
        });

        // IMPORTANT: Always run verify even if user doesn't exist to prevent
        // timing-based user enumeration attacks
        const dummyHash =
          '$argon2id$v=19$m=65536,t=3,p=4$dummy$dummydummydummydummydummydummydummydum';
        const hashToVerify = user?.passwordHash ?? dummyHash;

        const isValid = await verify(hashToVerify, password, {
          memoryCost: 65536,
          timeCost: 3,
          parallelism: 4,
        });

        if (!isValid || !user) return null;

        // NEVER log the password or hash — security requirement
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          professionalId: user.professional?.id ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, embed role and professionalId into the JWT
      if (user) {
        token.role = (user as unknown as { role: UserRole }).role;
        token.professionalId = (user as unknown as { professionalId?: string })
          .professionalId;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose role in the session object (available to server components)
      if (session.user) {
        const sessionUser = session.user as unknown as SessionUser;
        sessionUser.id = token.sub as string;
        sessionUser.role = token.role as UserRole;
        sessionUser.professionalId = token.professionalId as
          | string
          | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // NEXTAUTH_SECRET must be set — lib/env.ts crashes on startup if missing
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
