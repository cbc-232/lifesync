// src/features/hospitals/hospitalSchema.ts
import { z } from 'zod';

export const createHospitalSchema = z.object({
  name:     z.string()
               .min(1, 'Name is required'),       // ← message as second arg
  location: z.string()
               .min(1, 'Location is required'),   // ← message as second arg
});

export const updateHospitalSchema = createHospitalSchema.partial();
