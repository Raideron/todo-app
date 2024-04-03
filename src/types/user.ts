import { z } from 'zod';

export const PbUserSchema = z.object({
  id: z.string(),
  created: z.date({ coerce: true }),
  updated: z.date({ coerce: true }),
  name: z.string(),
  email: z.string(),
  username: z.string(),
  avatarUrl: z.string().optional(),
});

export interface PbUser extends z.infer<typeof PbUserSchema> {}
