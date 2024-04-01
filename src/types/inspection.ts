import { z } from 'zod';
import { FindingSchema } from './finding';

export const InspectionSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  name: z.string(),
  findingIds: z.array(z.string()),
});

export interface Inspection extends z.infer<typeof InspectionSchema> {}