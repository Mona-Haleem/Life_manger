// src/controllers/analytics.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { success } from '../utils/response.js';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  completionRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const result = await this.analyticsService.completionRate(userId);
      return res.json(success(result));
    } catch (err) {
      next(err);
    }
  };

  habitInsights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const insights = await this.analyticsService.habitInsights(userId);
      return res.json(success(insights));
    } catch (err) {
      next(err);
    }
  };
}
