// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const JWT_SECRET = config.jwt.secret;

// Extended request to include our user payload
export interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    // Attach full payload so downstream can read userId & role
    (req as AuthenticatedRequest).user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
