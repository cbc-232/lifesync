import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const { secret: JWT_SECRET, expiresIn: JWT_EXPIRES_IN } = config.jwt;

// 1. Register a new user
export async function registerUser(
  email: string,
  phone: string,
  password: string,
  role: UserRole = UserRole.PATIENT
) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { email, phone, role, passwordHash, isActive: true }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };

  } catch (err: any) {
    logger.error('Error creating user', err);
    if (err.code === 'P2002') {
      throw new Error(`A user with that ${err.meta?.target} already exists`);
    }
    throw err;
  }
}

// 2. Authenticate user by email, phone, or both
export async function loginUser(
  email: string | undefined,
  phone: string | undefined,
  password: string
) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    }
  });

  if (!user || !user.passwordHash) {
    throw new Error('User not found or password not set');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  );

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

// 3. Update user's password
export async function updatePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.passwordHash) {
    throw new Error('User not found');
  }

  const valid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid old password');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  return { message: 'Password updated successfully' };
}
