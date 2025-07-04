import { z } from 'zod';

export const createAppointmentSchema = z.object({
  district:  z.string().min(1),
  address:   z.string().min(1),
  guestName:  z.string().optional(),
  guestPhone: z.string().regex(/^\d{9}$/, 'Phone must be 9 digits').optional(),
  guestEmail: z.string().email().optional(),
  patientId: z.number().int().positive().optional(),
  hospitalId: z.number().int().positive(),
  type:      z.enum(['Booking', 'Emergency', 'Inquiry']),
  date:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time:      z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  reason:    z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Pending','Confirmed','Cancelled','Completed'])
});
