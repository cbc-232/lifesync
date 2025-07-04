import { Router } from 'express';
import {
  listHospitalsHandler,
  getHospitalByIdHandler,
  createHospitalHandler,
  updateHospitalHandler,
  deleteHospitalHandler
} from './hospitalController';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateBody } from '../../middleware/validate';
import {
  createHospitalSchema,
  updateHospitalSchema
} from './hospitalSchema';
import { formatInputMiddleware } from '../../middleware/formatInput';
import { UserRole } from '@prisma/client';

const router = Router();

// Routes for getting hospitals are open to all authenticated users
router.get('/', requireAuth, listHospitalsHandler);
router.get('/:id', requireAuth, getHospitalByIdHandler);

// Routes for creating, updating, and deleting hospitals are restricted to Admins
router.post(
  '/',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  formatInputMiddleware,
  validateBody(createHospitalSchema),
  createHospitalHandler
);

router.patch(
  '/:id',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  formatInputMiddleware,
  validateBody(updateHospitalSchema),
  updateHospitalHandler
);

router.delete('/:id', requireAuth, requireRole([UserRole.ADMIN]), deleteHospitalHandler);

export default router;
