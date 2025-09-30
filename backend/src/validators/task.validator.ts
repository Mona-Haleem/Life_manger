// src/validators/task.validator.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  ownerId: z.string().uuid(),
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  goalId: z.string().uuid().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'done', 'skipped']).optional(),
  estimateMinutes: z.number().min(1).max(1440).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'done', 'skipped']).optional(),
  estimateMinutes: z.number().min(1).max(1440).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
