import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, User, UserPreference } from '@prisma/client';
import prisma from '../config/database';
import config from '../config/env';
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import { UserPayload } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RegisterInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  profilePhoto?: string;
  language?: string;
}

export type SafeUser = Omit<User, 'passwordHash'> & {
  preference: Omit<UserPreference, 'id' | 'userId'> | null;
};

// Helper to remove sensitive fields
export function toSafeUser(user: User & { preference?: UserPreference | null }): SafeUser {
  const { passwordHash, ...safe } = user;
  return {
    ...safe,
    preference: user.preference
      ? {
          language: user.preference.language,
          createdAt: user.preference.createdAt,
          updatedAt: user.preference.updatedAt,
        }
      : null,
  };
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export async function register(input: RegisterInput): Promise<SafeUser> {
  const emailLower = input.email.toLowerCase();
  const usernameLower = input.username.toLowerCase();

  // Check unique constraints
  const existingEmail = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existingEmail) {
    throw new ConflictError('A user with this email address already exists');
  }

  const existingUsername = await prisma.user.findUnique({ where: { username: usernameLower } });
  if (existingUsername) {
    throw new ConflictError('A user with this username already exists');
  }

  if (!input.password) {
    throw new Error('Password is required for registration');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, 10);

  // Default registration role is USER; ignore input.role or set explicitly
  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      username: usernameLower,
      email: emailLower,
      passwordHash,
      phone: input.phone,
      city: input.city,
      country: input.country,
      bio: input.bio,
      profilePhoto: input.profilePhoto || null,
      role: Role.USER, // Enforced USER role
      isActive: true,
      preference: {
        create: {
          language: input.language || 'en',
        },
      },
    },
    include: {
      preference: true,
    },
  });

  return toSafeUser(user);
}

export async function login(email: string, password: string): Promise<{ user: SafeUser; accessToken: string }> {
  const emailLower = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: emailLower },
    include: { preference: true },
  });

  // Keep message generic to avoid leaking account existence
  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Sign JWT
  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.jwt.secret as any, {
    expiresIn: config.jwt.expiresIn as any,
  });

  return {
    user: toSafeUser(user),
    accessToken,
  };
}

export async function getMeById(userId: number): Promise<SafeUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preference: true },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('User account not found or is inactive');
  }

  return toSafeUser(user);
}
