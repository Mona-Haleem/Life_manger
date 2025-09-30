// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/respons.js'

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  res.status(500).json(fail(err.message || 'Internal Server Error'));
};
