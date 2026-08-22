import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { BadRequestError, ConflictError, NotFoundError } from '../errors/AppError';
import { SafeUser, toSafeUser } from './auth.service';

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  profilePhoto?: string;
  language?: string;
}

export async function updateProfile(userId: number, input: UpdateProfileInput): Promise<SafeUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preference: true },
  });

  if (!user || !user.isActive) {
    throw new NotFoundError('User profile not found');
  }

  // Check unique username if updated
  if (input.username && input.username.toLowerCase() !== user.username) {
    const usernameLower = input.username.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { username: usernameLower } });
    if (existing) {
      throw new ConflictError('Username is already taken');
    }
  }

  // Prepare database updates
  const { language, ...userData } = input;
  if (userData.username) userData.username = userData.username.toLowerCase();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      ...(language && {
        preference: {
          upsert: {
            create: { language },
            update: { language },
          },
        },
      }),
    },
    include: {
      preference: true,
    },
  });

  return toSafeUser(updatedUser);
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new NotFoundError('User profile not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new BadRequestError('Incorrect current password');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Save new hash
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function deleteUser(userId: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new NotFoundError('User profile not found');
  }

  // Soft deletion (set isActive = false)
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
}
