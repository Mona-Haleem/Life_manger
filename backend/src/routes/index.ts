// src/routes/index.ts
import { Router } from "express";
// import { authRoutes } from './auth.routes';
// import { userRoutes } from './user.routes';
// import { goalRoutes } from './goal.routes';
// import { taskRoutes } from './task.routes';
import { chatRoutes } from "./chat.routes.js";
import { chatController } from "../index.js";
// import { analyticsRoutes } from './analytics.routes';
// import { AuthController } from '../controllers/auth.controller.js';
// import { UserController } from '../controllers/user.controller.js';
// import { GoalController } from '../controllers/goal.controller.js';
// import { TaskController } from '../controllers/task.controller.js';
// import { AnalyticsController } from '../controllers/analytics.controller.js';

// // Controllers (you’d import from app.ts if you instantiate there)

export const routes = () => {
  const router = Router();
  //   router.use('/auth', authRoutes(AuthController));
  //   router.use('/users', userRoutes(UserController));
  //   router.use('/goals', goalRoutes(GoalController));
  //   router.use('/tasks', taskRoutes(TaskController));
  router.use("/chat", chatRoutes(chatController));
  //   router.use('/analytics', analyticsRoutes(AnalyticsController));
     return router;
};
