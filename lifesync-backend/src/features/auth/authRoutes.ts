import { Router } from 'express';
import { registerHandler, loginHandler, updatePasswordHandler } from './authController';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema, updatePasswordSchema } from './authSchema';
import { formatInputMiddleware } from '../../middleware/formatInput';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  formatInputMiddleware,
  validateBody(registerSchema),
  registerHandler
);

// POST /api/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  loginHandler
);

// PATCH /api/auth/password
router.patch(
  '/password',
  requireAuth,
  formatInputMiddleware,
  validateBody(updatePasswordSchema),
  updatePasswordHandler
);

export default router;
