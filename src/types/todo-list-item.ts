import { z } from 'zod';

export const TodoListItemSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  updated: z.date({ coerce: true }),
  name: z.string(),
  description: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  /** Estimated time in hours */
  estimate: z.number(),
  impact: z.number(),
  todo_list_id: z.string(),
  /** Date and time when the item was completed */
  completed: z.date({ coerce: true }).optional(),
  confidence: z.number(),
  intervalInDays: z.number(),
});

export interface TodoListItem extends z.infer<typeof TodoListItemSchema> {}
