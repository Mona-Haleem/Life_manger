// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { fail } from '../utils/respons.js.js';

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // throws if invalid
      next();
    } catch (err: any) {
      return res.status(400).json(fail(err.errors.map((e: any) => e.message)));
    }
  };
