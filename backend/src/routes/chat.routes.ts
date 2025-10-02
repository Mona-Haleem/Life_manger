// src/routes/chat.routes.ts
import { Router } from "express";
import multer from "multer";
import { ChatController } from "../controllers/chat.controller";
//import { requireAuth } from '../middleware/auth.middleware';

export const chatRoutes = (controller: ChatController) => {
  const upload = multer({ storage: multer.memoryStorage() });
  const router = Router();
  // router.get('/user/:userId', requireAuth, controller.getHistory);

  router.post("", controller.sendMessage);

  router.post("/upload", upload.array("files"), controller.uploadFile);

  // router.post('/user/:userId', requireAuth, controller.sendMessage);
  return router;
};
