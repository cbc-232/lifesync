import { Router } from 'express';
import { handleIncomingCall, handleIvrInput, startAppointmentBookingFlow, processAppointmentDetails, confirmAppointmentRecording, processTranscription, handleHumanAgentEscalation } from './ivrController';

const router = Router();

// POST /api/ivr/incoming-call - Twilio webhook for incoming calls
router.post('/incoming-call', handleIncomingCall);

// POST /api/ivr/handle-input - Twilio webhook for handling DTMF input
router.post('/handle-input', handleIvrInput);

// POST /api/ivr/book-appointment-flow - Initiates the appointment booking flow
router.post('/book-appointment-flow', startAppointmentBookingFlow);

// POST /api/ivr/process-appointment-details - Processes the recorded appointment details
router.post('/process-appointment-details', processAppointmentDetails);

// POST /api/ivr/confirm-appointment-recording - Confirms or re-records the appointment details
router.post('/confirm-appointment-recording', confirmAppointmentRecording);

// POST /api/ivr/process-transcription - Receives and processes Twilio transcription callbacks
router.post('/process-transcription', processTranscription);

// POST /api/ivr/handle-human-agent-escalation - Handles input after human agent escalation
router.post('/handle-human-agent-escalation', handleHumanAgentEscalation);

export default router;