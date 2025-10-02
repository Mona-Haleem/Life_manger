// // // src/controllers/chat.controller.ts
// import { Request, Response, NextFunction } from 'express';
// import { AIService } from '../services/ai.service.js';
// import { ChatRepository } from '../repositories/chat.repository.js';
// import { success } from '../utils/respons.js';

// export class ChatController {
//   constructor(private aiService: AIService, private chatRepo: ChatRepository) {}

// //   getHistory = async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       const userId = req.params.userId;
// //       const history = await this.chatRepo.findByUser(userId);
// //       return res.json(success(history));
// //     } catch (err) {
// //       next(err);
// //     }
// //   };

//   sendMessage = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.params.userId;
//       const { history:messages } = req.body;
//       const reply = await this.aiService.processUserMessage(messages)//, userId);
//       //await this.chatRepo.create(reply);
//       return res.json(success({ reply }));
//     } catch (err) {
//       next(err);
//     }
//   };
// }
// src/controllers/chat.controller.ts
import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/ai.service.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import { success } from "../utils/respons.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

interface AttachedFile {
  id: string;
  name: string;
  type: "image" | "file";
  data: string;
  mimeType: string;
}

export class ChatController {
  constructor(private aiService: AIService, private chatRepo: ChatRepository) {}

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const { history: messages, newMessage, attachments } = req.body;
      console.log(newMessage , req.headers);
      console.log("[ChatController] Received request:", {
        userId,
        messagesCount: messages?.length,
        hasNewMessage: !!newMessage,
        attachmentsCount: attachments?.length || 0,
      });

      // Process attachments if present
      const processedAttachments: AttachedFile[] = attachments || [];

      // Log attachment types
      if (processedAttachments.length > 0) {
        console.log("[ChatController] Processing attachments:");
        processedAttachments.forEach((att) => {
          console.log(`  - ${att.name} (${att.type}, ${att.mimeType})`);
        });
      }

      // Call AI service with multimodal support
      const reply = await this.aiService.processUserMessage(
        messages,
        newMessage,
        processedAttachments
      );

      console.log("[ChatController] AI service response:", {
        hasMessage: !!reply.message,
        tasksCount: reply.tasks?.length || 0,
        hasUpdatedContext: !!reply.updatedContext,
      });

      // Save to chat repository (optional)
      // await this.chatRepo.create(reply);

      return res.json(success({ reply }));
    } catch (err) {
      console.error("[ChatController] Error processing message:", err);
      next(err);
    }
  };

  // Optional: Endpoint to handle file uploads separately
    uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[uploadFile] Request received:", {
      filesCount: (req.files as Express.Multer.File[])?.length || 0,
    });
    
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      console.log("[uploadFile] Processing files:");
      files.forEach((file) => {
        console.log(`  - ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
      });

      // Upload all files to Cloudinary in parallel
      const uploadedFiles = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      console.log("[uploadFile] Successfully uploaded:", uploadedFiles.length);

      return res.json(success({ files: uploadedFiles }));
    } catch (err) {
      console.error("[ChatController] Error uploading files:", err);
      next(err);
    }
  };
}

