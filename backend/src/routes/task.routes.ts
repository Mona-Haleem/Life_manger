// src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const taskRoutes = (controller: TaskController) => {
  const router = Router();
  router.get('/:id', requireAuth, controller.getTask);
  router.get('/user/:userId', requireAuth, controller.listUserTasks);
  router.post('/', requireAuth, controller.createTask);
  router.put('/:id', requireAuth, controller.updateTask);
  router.patch('/:id/complete', requireAuth, controller.completeTask);
  router.delete('/:id', requireAuth, controller.deleteTask);
  return router;
};
