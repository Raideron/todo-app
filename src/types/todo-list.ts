import { z } from 'zod';

export const TodoListSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  updated: z.date({ coerce: true }),
  name: z.string(),
});

export interface TodoList extends z.infer<typeof TodoListSchema> {}