// src/controllers/goal.controller.ts
import { Request, Response, NextFunction } from 'express';
import { GoalService } from '../services/goal.service.js';
import { success } from '../utils/response.js';

export class GoalController {
  constructor(private goalService: GoalService) {}

  getGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await this.goalService.getGoal(req.params.id);
      return res.json(success(goal));
    } catch (err) {
      next(err);
    }
  };

  listUserGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const goals = await this.goalService.listUserGoals(userId);
      return res.json(success(goals));
    } catch (err) {
      next(err);
    }
  };

  createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newGoal = await this.goalService.createGoal(req.body);
      return res.status(201).json(success(newGoal));
    } catch (err) {
      next(err);
    }
  };

  updateGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.goalService.updateGoal(req.params.id, req.body);
      return res.json(success(updated));
    } catch (err) {
      next(err);
    }
  };

  deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.goalService.removeGoal(req.params.id);
      return res.json(success('Goal deleted'));
    } catch (err) {
      next(err);
    }
  };
}
