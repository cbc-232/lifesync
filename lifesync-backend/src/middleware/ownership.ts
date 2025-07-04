import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { prisma } from '../libs/prisma/client';

/**
 * Middleware to verify that the authenticated user is the owner of a resource.
 * It checks if the resource (e.g., an appointment) belongs to the user making the request.
 *
 * This should be used for routes where a PATIENT is accessing their own data.
 * It assumes the user ID is in `req.user.userId` and the resource ID is in `req.params.id`.
 */
export function checkOwnership(modelName: 'appointment' | 'patient') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    const resourceId = parseInt(req.params.id, 10);

    if (!user || !resourceId) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Admins and Medical staff can bypass ownership checks
    if (user.role === 'ADMIN' || user.role === 'MEDICAL') {
      return next();
    }

    // If the user is a patient, they must be the owner of the resource
    if (user.role === 'PATIENT') {
      try {
        let resource: any;
        if (modelName === 'appointment') {
          resource = await prisma.appointment.findUnique({
            where: { id: resourceId },
            select: { patientId: true },
          });
        } else if (modelName === 'patient') {
          // A patient's user ID is their own ID
          resource = await prisma.user.findUnique({
            where: { id: resourceId },
            select: { id: true },
          });
        }

        if (!resource) {
          return res.status(404).json({ error: 'Resource not found' });
        }

        // For appointments, check the patientId. For patients, check the user id.
        const ownerId = modelName === 'appointment' ? resource.patientId : resource.id;

        if (ownerId !== user.userId) {
          return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
        }

        return next();
      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // If user has no role or a different role, deny access
    return res.status(403).json({ error: 'Forbidden' });
  };
}
