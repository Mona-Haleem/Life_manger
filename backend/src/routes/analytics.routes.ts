// src/routes/analytics.routes.ts
import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const analyticsRoutes = (controller: AnalyticsController) => {
  const router = Router();
  router.get('/user/:userId/completion-rate', requireAuth, controller.completionRate);
  router.get('/user/:userId/habits', requireAuth, controller.habitInsights);
  return router;
};
