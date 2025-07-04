import { Router } from 'express';
import { handleIncomingSms } from './smsController';

const router = Router();

// POST /api/sms/incoming - Twilio webhook for incoming SMS
router.post('/incoming', handleIncomingSms);

export default router;
