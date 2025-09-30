// src/utils/validation.ts
import { ZodSchema } from 'zod';

export const validateSchema = <T>(schema: ZodSchema<T>, payload: unknown): T => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message);
    throw new Error(messages.join(', '));
  }
  return result.data;
};
