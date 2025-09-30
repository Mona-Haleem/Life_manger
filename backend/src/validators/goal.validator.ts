// src/validators/goal.validator.ts
import { z } from 'zod';

export const createGoalSchema = z.object({
  ownerId: z.string().uuid(),
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  progress: z.number().min(0).max(100).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
