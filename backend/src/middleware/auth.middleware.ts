// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/respons';
import { supabase } from '../config/supabase';


export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json(fail('Missing Authorization header'));

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json(fail('Invalid token'));

    (req as any).user = data.user;
    next();
  } catch (err) {
    return res.status(401).json(fail('Unauthorized'));
  }
};
