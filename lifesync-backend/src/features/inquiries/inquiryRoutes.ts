import { Router } from 'express';
import {
  createInquiryHandler,
  getInquiriesHandler
} from './inquiryController';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createInquirySchema } from './inquirySchema';
import { formatInputMiddleware } from '../../middleware/formatInput';

const router = Router();

router.post(
  '/',
  formatInputMiddleware,
  validateBody(createInquirySchema),
  createInquiryHandler
);

router.get('/', requireAuth, getInquiriesHandler);

export default router;
