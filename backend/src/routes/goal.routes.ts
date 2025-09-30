// src/routes/goal.routes.ts
import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const goalRoutes = (controller: GoalController) => {
  const router = Router();
  router.get('/:id', requireAuth, controller.getGoal);
  router.get('/user/:userId', requireAuth, controller.listUserGoals);
  router.post('/', requireAuth, controller.createGoal);
  router.put('/:id', requireAuth, controller.updateGoal);
  router.delete('/:id', requireAuth, controller.deleteGoal);
  return router;
};
