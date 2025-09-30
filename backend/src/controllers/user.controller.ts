// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { success } from '../utils/response.js';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const profile = await this.userService.getProfile(userId);
      return res.json(success(profile));
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const patch = req.body;
      const updated = await this.userService.updateProfile(userId, patch);
      return res.json(success(updated));
    } catch (err) {
      next(err);
    }
  };
}
