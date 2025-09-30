// src/validators/user.validator.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  timezone: z.string().optional(),
  password: z.string().min(6).max(50),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  timezone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

// Export types inferred from Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
