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
  /** Estimated time in hours */
  estimate: z.number().optional(),
  impact: z.number().optional(),
  todo_list_id: z.string(),
  isCompleted: z.boolean(),
});

export interface TodoListItem extends z.infer<typeof TodoListItemSchema> {}
