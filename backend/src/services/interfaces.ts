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
  id: ID;
  userId?: ID;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}
