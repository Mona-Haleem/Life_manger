// src/routes/chat.routes.ts
import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
//import { requireAuth } from '../middleware/auth.middleware';

export const chatRoutes = (controller: ChatController) => {
  const router = Router();
  // router.get('/user/:userId', requireAuth, controller.getHistory);
  
  router.post('', controller.sendMessage);
  // router.post('/user/:userId', requireAuth, controller.sendMessage);
  return router;
};
