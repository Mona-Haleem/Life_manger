// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { success, fail } from '../utils/response.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signUpWithEmail(email, password);
      if (result.error) return res.status(400).json(fail(result.error.message));
      return res.json(success(result.user));
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signInWithEmail(email, password);
      if (result.error) return res.status(401).json(fail(result.error.message));
      return res.json(success(result.session));
    } catch (err) {
      next(err);
    }
  };

  signOut = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.signOut();
      if (result.error) return res.status(400).json(fail(result.error.message));
      return res.json(success('Signed out'));
    } catch (err) {
      next(err);
    }
  };
}
