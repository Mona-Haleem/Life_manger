// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const authRoutes = (controller: AuthController) => {
  const router = Router();
  router.post('/signup', controller.signUp);
  router.post('/signin', controller.signIn);
  router.post('/signout', controller.signOut);
  return router;
};
