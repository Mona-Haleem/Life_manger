// // src/controllers/chat.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';
import { ChatRepository } from '../repositories/chat.repository.js';
import { success } from '../utils/respons.js';

export class ChatController {
  constructor(private aiService: AIService, private chatRepo: ChatRepository) {}

//   getHistory = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.params.userId;
//       const history = await this.chatRepo.findByUser(userId);
//       return res.json(success(history));
//     } catch (err) {
//       next(err);
//     }
//   };

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const { history:messages } = req.body;
      const reply = await this.aiService.processUserMessage(messages)//, userId);
      //await this.chatRepo.create(reply);
      return res.json(success({ reply }));
    } catch (err) {
      next(err);
    }
  };
}
