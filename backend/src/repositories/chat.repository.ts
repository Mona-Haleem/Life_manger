// src/repositories/chat.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import { IChatMessage } from '../services/interfaces.js';

export interface IChatRepository {
  findByUser(userId: string): Promise<IChatMessage[]>;
 // create(message: Partial<IChatMessage>): Promise<IChatMessage>;
}

export class ChatRepository extends BaseRepository<IChatMessage> implements IChatRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'chat_messages');
  }

  async findByUser(userId: string): Promise<IChatMessage[]> {
    // const { data, error } = await this.supabase.from<IChatMessage>('chat_messages').select('*').eq('userId', userId).order('created_at', { ascending: true });
    // if (error) throw error;
    // return data ?? [];
    return [];
  }

}
