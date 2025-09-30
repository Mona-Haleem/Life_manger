// src/models/chat.model.ts
export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  userId: string; // references users.id
  role: ChatRole;
  content: string;
  created_at: string;
}
