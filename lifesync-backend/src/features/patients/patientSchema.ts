import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(1),
  phone: z.string().min(9),
  email: z.string().email().optional()
});

export const updatePatientSchema = createPatientSchema.partial();
