import { Router } from 'express';
import {
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllPatients
} from './patientController';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { checkOwnership } from '../../middleware/ownership';
import { validateBody } from '../../middleware/validate';
import {
  createPatientSchema,
  updatePatientSchema
} from './patientSchema';
import { formatInputMiddleware } from '../../middleware/formatInput';
import { UserRole } from '@prisma/client';

const router = Router();

// ADMIN and MEDICAL can create new patient records
router.post(
  '/',
  requireAuth,
  requireRole([UserRole.ADMIN, UserRole.MEDICAL]),
  formatInputMiddleware,
  validateBody(createPatientSchema),
  createPatient
);

// ADMIN and MEDICAL can view all patients
router.get(
    '/', 
    requireAuth, 
    requireRole([UserRole.ADMIN, UserRole.MEDICAL]), 
    getAllPatients
);

// A PATIENT can view their own profile, or ADMIN/MEDICAL can view any
router.get(
    '/:id', 
    requireAuth, 
    requireRole([UserRole.ADMIN, UserRole.MEDICAL, UserRole.PATIENT]), 
    checkOwnership('patient'),
    getPatientById
);

// A PATIENT can update their own profile, or ADMIN/MEDICAL can update any
router.patch(
  '/:id',
  requireAuth,
  requireRole([UserRole.ADMIN, UserRole.MEDICAL, UserRole.PATIENT]),
  checkOwnership('patient'),
  formatInputMiddleware,
  validateBody(updatePatientSchema),
  updatePatient
);

// ADMIN can delete a patient
router.delete(
    '/:id', 
    requireAuth, 
    requireRole([UserRole.ADMIN]), 
    deletePatient
);

export default router;
