// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const userRoutes = (controller: UserController) => {
  const router = Router();
  router.get('/:id', requireAuth, controller.getProfile);
  router.put('/:id', requireAuth, controller.updateProfile);
  return router;
};
