import { z } from 'zod';

export const FindingSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  description: z.string(),
  picture: z.string().nullable(),
});

export interface Finding extends z.infer<typeof FindingSchema> {}