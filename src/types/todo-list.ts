import { z } from 'zod';

export const TodoListSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  updated: z.date({ coerce: true }),
  name: z.string(),
  user_id: z.string(),
  last_opened: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export interface TodoList extends z.infer<typeof TodoListSchema> {}
