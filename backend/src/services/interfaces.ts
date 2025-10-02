// src/services/interfaces.ts
export type ID = string;

export interface IUserDTO {
  id: ID;
  email: string;
  name?: string;
  timezone?: string;
  created_at?: string;
  // ...other profile fields
}

export interface IGoalDTO {
  id: ID;
  title: string;
  description?: string;
  dueDate?: string | null;
  ownerId: ID;
  progress?: number;
  created_at?: string;
}

export interface ITaskDTO {
  id: ID;
  title: string;
  description?: string;
  dueDate?: string | null;
  status: 'pending' | 'done' | 'skipped';
  priority?: 'low' | 'medium' | 'high';
  ownerId: ID;
  goalId?: ID | null;
  estimateMinutes?: number | null;
  created_at?: string;
}


export interface IChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
  type?: "typing" | "message";
  
  // Multi-modal properties
  imageUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface ChatMessage {
  from?: "user" | "ai";
  text?: string;
  role?: "user" | "assistant" | "system";
  content?: string;
  type?: "typing" | "message";
  timestamp?: Date;
  
  // Multi-modal properties
  imageUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}