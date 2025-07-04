import { Request, Response, NextFunction } from 'express';
import * as inquiryService from './inquiryService.js';

export async function createInquiryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json(inquiry);
  } catch (err) {
    next(err);
  }
}

export async function getInquiriesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const inquiries = await inquiryService.getAllInquiries();
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
}
