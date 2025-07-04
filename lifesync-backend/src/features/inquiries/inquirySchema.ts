import { z } from 'zod';

export const createInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5),
  location: z.string().min(1)
});
