import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import twilio from 'twilio';
import * as patientService from '../../services/patientService';
import * as appointmentService from '../../services/appointmentService';

const VoiceResponse = twilio.twiml.VoiceResponse;

// Temporary storage for transcription and recording URLs, keyed by CallSid
const callDataStore: { [key: string]: { recordingUrl?: string; transcriptionText?: string; reRecordCount?: number } } = {};

export async function handleIncomingCall(req: Request, res: Response) {
  const twiml = new VoiceResponse();

  twiml.say(
    { voice: 'woman', language: 'en-GB' },
    'Welcome to LifeSync. Please press 1 to book an appointment, 2 for emergencies, or 3 for general inquiries.'
  );

  twiml.gather({ numDigits: 1, timeout: 5, action: '/api/ivr/handle-input' });

  logger.info('Generated TwiML for incoming call', { twiml: twiml.toString() });
  res.type('text/xml').send(twiml.toString());
}

export async function handleIvrInput(req: Request, res: Response) {
  const twiml = new VoiceResponse();
  const digit = req.body.Digits;

  switch (digit) {
    case '1':
      twiml.redirect('/api/ivr/book-appointment-flow');
      break;
    case '2':
      twiml.say('You selected emergencies. Please hold while we connect you to an emergency line. Press 0 to return to the main menu.');
      // In a real scenario, you would connect to an emergency service here, e.g., twiml.dial('+1234567890');
      twiml.gather({ numDigits: 1, timeout: 5, action: '/api/ivr/handle-input' }); // Listen for 0
      break;
    case '3':
      twiml.say('You selected general inquiries. Please hold while we connect you. Press 0 to return to the main menu.');
      // In a real scenario, you would connect to a general inquiry line or provide more options here
      twiml.gather({ numDigits: 1, timeout: 5, action: '/api/ivr/handle-input' }); // Listen for 0
      break;
    case '0':
      twiml.redirect('/api/ivr/incoming-call'); // Go back to main menu
      break;
    default:
      twiml.say('Sorry, I didn\'t understand that. Please press 1, 2, or 3.');
      twiml.redirect('/api/ivr/incoming-call'); // Redirect back to the main menu
      break;
  }

  logger.info('Generated TwiML for IVR input', { digit, twiml: twiml.toString() });
  res.type('text/xml').send(twiml.toString());
}

export async function startAppointmentBookingFlow(req: Request, res: Response) {
  const twiml = new VoiceResponse();
  const callerPhone = req.body.From; // Twilio provides phone number in E.164 format
  const callSid = req.body.CallSid; // Unique ID for the call

  // Initialize call data store for this call
  callDataStore[callSid] = { recordingUrl: undefined, transcriptionText: undefined, reRecordCount: 0 };

  // Clean the phone number to match the 9-digit format in our database
  const cleanPhoneNumber = callerPhone ? callerPhone.replace(/[^0-9]/g, '').slice(-9) : '';

  if (!cleanPhoneNumber) {
    twiml.say('We could not identify your phone number. Please try again or contact support.');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  try {
    const patient = await patientService.findPatientByPhone(cleanPhoneNumber);

    if (!patient) {
      twiml.say('We could not find a patient registered with this phone number. Please register on our website or wait for a callback from our team.');
      res.type('text/xml').send(twiml.toString());
      return;
    }

    twiml.say('Please state your reason for the appointment after the beep. You will have 30 seconds.');
    twiml.record({ maxLength: 30, action: '/api/ivr/process-appointment-details', transcribe: true, transcribeCallback: '/api/ivr/process-transcription' });

    logger.info('Generated TwiML for appointment booking flow start', { twiml: twiml.toString() });
    res.type('text/xml').send(twiml.toString());

  } catch (error: any) {
    logger.error('Error starting appointment booking flow', { error: error.message, phone: cleanPhoneNumber });
    twiml.say('An error occurred. Please try again later.');
    res.type('text/xml').send(twiml.toString());
  }
}

export async function processAppointmentDetails(req: Request, res: Response) {
  const twiml = new VoiceResponse();
  const recordingUrl = req.body.RecordingUrl;
  const callSid = req.body.CallSid; // Unique ID for the call

  if (!recordingUrl) {
    twiml.say('We did not receive a recording. Please try again.');
    twiml.redirect('/api/ivr/book-appointment-flow');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Store recording URL for later use
  if (callSid) {
    callDataStore[callSid] = { ...callDataStore[callSid], recordingUrl };
  }

  twiml.say('Thank you for your recording.');
  twiml.play(recordingUrl); // Play back the recording
  twiml.say('Press 1 to confirm this recording, 2 to re-record, or 0 to return to the main menu.');
  twiml.gather({ numDigits: 1, timeout: 5, action: '/api/ivr/confirm-appointment-recording' });

  logger.info('Generated TwiML for processing appointment details and confirmation', { recordingUrl, twiml: twiml.toString() });
  res.type('text/xml').send(twiml.toString());
}

export async function processTranscription(req: Request, res: Response) {
  const twiml = new VoiceResponse(); // Respond with empty TwiML to Twilio
  const transcriptionText = req.body.TranscriptionText;
  const recordingUrl = req.body.RecordingUrl;
  const callSid = req.body.CallSid;

  logger.info('Received transcription', { callSid, transcriptionText, recordingUrl });

  // Store transcription text for later use
  if (callSid) {
    callDataStore[callSid] = { ...callDataStore[callSid], transcriptionText, recordingUrl };
  }

  res.type('text/xml').send(twiml.toString());
}

export async function confirmAppointmentRecording(req: Request, res: Response) {
  const twiml = new VoiceResponse();
  const digit = req.body.Digits;
  const callSid = req.body.CallSid; // Unique ID for the call
  const callerPhone = req.body.From;

  const cleanPhoneNumber = callerPhone ? callerPhone.replace(/[^0-9]/g, '').slice(-9) : '';

  if (!cleanPhoneNumber) {
    twiml.say('We could not identify your phone number. Please try again or contact support.');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Retrieve stored data for this call
  const storedData = callDataStore[callSid] || {};
  const recordingUrl = storedData.recordingUrl;
  const transcriptionText = storedData.transcriptionText || 'No transcription available.';
  let reRecordCount = storedData.reRecordCount || 0;

  switch (digit) {
    case '1':
      try {
        const patient = await patientService.findPatientByPhone(cleanPhoneNumber);

        if (patient) {
          const now = new Date();
          const appointmentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
          const appointmentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

          const defaultHospitalId = 1; // Assuming a hospital with ID 1 exists
          const defaultDistrict = 'Western Area Urban'; // Placeholder
          const defaultAddress = 'IVR Request'; // Placeholder

          await appointmentService.createAppointment({
            patientId: patient.id,
            hospitalId: defaultHospitalId,
            type: 'Booking',
            date: appointmentDate,
            time: appointmentTime,
            district: defaultDistrict,
            address: defaultAddress,
            reason: `IVR Recorded Reason: ${transcriptionText} (Recording: ${recordingUrl})`,
          });
          twiml.say('Thank you. Your appointment request has been received. A medical staff will contact you shortly.');
        } else {
          twiml.say('We could not find a patient registered with this phone number. Please register on our website or wait for a callback from our team.');
        }
      } catch (error: any) {
        logger.error('Error confirming IVR appointment request', { error: error.message, phone: cleanPhoneNumber, recordingUrl });
        twiml.say('An error occurred while processing your request. Please try again later.');
      } finally {
        // Clean up stored data after appointment is processed
        delete callDataStore[callSid];
      }
      break;
    case '2':      case '2':
      reRecordCount++;
      if (callSid) {
        callDataStore[callSid] = { ...callDataStore[callSid], reRecordCount };
      }
      if (reRecordCount >= 3) {
        twiml.say('You have attempted to re-record multiple times. We are now connecting you to a human agent. Press 0 to return to the main menu.');
        twiml.gather({ numDigits: 1, timeout: 5, action: '/api/ivr/handle-human-agent-escalation' });
        // If no digit is pressed, or any other digit, the call will proceed to connect to the human agent
        // In a real scenario, you would connect to a human agent here, e.g., twiml.dial('+1234567890');
      } else {
        twiml.say('Okay, let's re-record your reason.');
        twiml.redirect('/api/ivr/book-appointment-flow');
      }
      break;
    case '0':
      twiml.redirect('/api/ivr/incoming-call'); // Go back to main menu
      break;
    default:
      twiml.say('Sorry, I didn\'t understand that. Please press 1 to confirm or 2 to re-record, or 0 to return to the main menu.');
      twiml.redirect(`/api/ivr/confirm-appointment-recording?RecordingUrl=${recordingUrl}`); // Redirect back to re-prompt
      break;
  }

  logger.info('Generated TwiML for appointment recording confirmation', { digit, recordingUrl, twiml: twiml.toString() });
  res.type('text/xml').send(twiml.toString());
}

export async function handleHumanAgentEscalation(req: Request, res: Response) {
  const twiml = new VoiceResponse();
  const digit = req.body.Digits;

  if (digit === '1') {
    twiml.redirect('/api/ivr/incoming-call'); // Go back to main menu
  } else {
    twiml.say('Sorry, I didn\'t understand that. Please press 1 to return to the main menu.');
    twiml.gather({ numDigits: 1, timeout: 5, action: '/api/ivr/handle-human-agent-escalation' });
  }

  logger.info('Generated TwiML for human agent escalation input', { digit, twiml: twiml.toString() });
  res.type('text/xml').send(twiml.toString());
}
