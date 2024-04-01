import { z } from 'zod';

export const TodoListItemSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  updated: z.date({ coerce: true }),
  name: z.string(),
  description: z.string(),
  deadline: z.date({ coerce: true }),
  /** Estimated time in hours */
  estimatedTime: z.number(),
  impact: z.number(),
  todoListId: z.string(),
});

export interface TodoListItem extends z.infer<typeof TodoListItemSchema> {}
