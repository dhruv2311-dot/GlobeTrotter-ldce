import { z } from 'zod';

// Regex for alphanumeric, underscores, hyphens, and periods
const usernameRegex = /^[a-zA-Z0-9_.-]+$/;

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(1, 'First name cannot be empty')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(1, 'Last name cannot be empty')
      .max(50, 'Last name cannot exceed 50 characters'),
    username: z
      .string({ required_error: 'Username is required' })
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username cannot exceed 50 characters')
      .regex(usernameRegex, 'Username can only contain alphanumeric characters, underscores, hyphens, and dots'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .max(100, 'Email cannot exceed 100 characters'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    phone: z.string().max(20, 'Phone number cannot exceed 20 characters').optional(),
    city: z.string().max(100, 'City cannot exceed 100 characters').optional(),
    country: z.string().max(100, 'Country cannot exceed 100 characters').optional(),
    bio: z.string().optional(),
    profilePhoto: z.string().url('Profile photo must be a valid URL').optional().or(z.literal('')),
    language: z.string().max(10).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name cannot be empty').max(50).optional(),
    lastName: z.string().min(1, 'Last name cannot be empty').max(50).optional(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50)
      .regex(usernameRegex, 'Username can only contain letters, numbers, underscores, hyphens, and dots')
      .optional(),
    phone: z.string().max(20).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    bio: z.string().optional(),
    profilePhoto: z.string().url('Profile photo must be a valid URL').optional().or(z.literal('')),
    language: z.string().max(10).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters')
      .max(100),
  }),
});
