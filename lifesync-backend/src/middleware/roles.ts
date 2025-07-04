import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from './auth';

/**
 * Middleware to authorize users based on their role.
 * It checks if the authenticated user's role is included in the list of allowed roles.
 *
 * @param {UserRole[]} allowedRoles - An array of roles that are permitted to access the route.
 * @returns Express middleware function.
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    // This middleware should run after requireAuth, so a user should always exist.
    // This is a safeguard.
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the user's role is in the list of allowed roles.
    if (!allowedRoles.includes(user.role as UserRole)) {
      return res.status(403).json({
        error: 'Forbidden: You do not have the required permissions.',
      });
    }

    next();
  };
}
