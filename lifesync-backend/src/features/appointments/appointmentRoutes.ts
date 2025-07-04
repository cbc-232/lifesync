import { Router } from 'express';
import {
  createAppointmentHandler,
  listAppointmentsHandler,
  getAppointmentByIdHandler,
  updateAppointmentStatusHandler,
  deleteAppointmentHandler
} from './appointmentController';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { checkOwnership } from '../../middleware/ownership';
import { validateBody } from '../../middleware/validate';
import {
  createAppointmentSchema,
  updateStatusSchema
} from './appointmentSchema';
import { UserRole } from '@prisma/client';

const router = Router();

// 1. Create (PATIENT or MEDICAL)
router.post(
  '/',
  requireAuth,
  requireRole([UserRole.PATIENT, UserRole.MEDICAL]),
  validateBody(createAppointmentSchema),
  createAppointmentHandler
);

// 2. List all (ADMIN or MEDICAL)
router.get(
    '/', 
    requireAuth, 
    requireRole([UserRole.ADMIN, UserRole.MEDICAL]), 
    listAppointmentsHandler
);

// 3. Get one by ID (A PATIENT can view their own appointment, or ADMIN/MEDICAL can view any)
router.get(
    '/:id', 
    requireAuth, 
    requireRole([UserRole.ADMIN, UserRole.MEDICAL, UserRole.PATIENT]),
    checkOwnership('appointment'),
    getAppointmentByIdHandler
);

// 4. Update status (MEDICAL only)
router.patch(
  '/:id/status',
  requireAuth,
  requireRole([UserRole.MEDICAL]),
  validateBody(updateStatusSchema),
  updateAppointmentStatusHandler
);

// 5. Delete (ADMIN only)
router.delete(
    '/:id', 
    requireAuth, 
    requireRole([UserRole.ADMIN]), 
    deleteAppointmentHandler
);

export default router;
