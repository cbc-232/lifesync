import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  email:    z.string().email('Invalid email address'),
  phone:    z.string().regex(/^\d{9}$/, 'Phone must be 9 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role:     z.nativeEnum(UserRole).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  phone: z.string().regex(/^\d{9}$/, 'Phone must be 9 digits').optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(
  data => data.email || data.phone,
  { message: 'Either email or phone is required', path: ['email'] }
);

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});
