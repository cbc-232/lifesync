import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import twilio from 'twilio';

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function handleIncomingSms(req: Request, res: Response) {
  const twiml = new MessagingResponse();
  const incomingMessage = req.body.Body;

  logger.info('Incoming SMS received', { from: req.body.From, message: incomingMessage });

  twiml.message('Thank you for your message. Please call our IVR line for assistance.');

  res.type('text/xml').send(twiml.toString());
}
