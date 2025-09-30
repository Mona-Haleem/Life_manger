// src/repositories/habit.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';

export interface IHabitDTO {
  id: string;
  title: string;
  frequency: string; // e.g. "daily", "weekly"
  ownerId: string;
  created_at?: string;
}

export interface IHabitRepository {
  findById(id: string): Promise<IHabitDTO | null>;
  findByUser(userId: string): Promise<IHabitDTO[]>;
  create(habit: Partial<IHabitDTO>): Promise<IHabitDTO>;
  update(id: string, patch: Partial<IHabitDTO>): Promise<IHabitDTO>;
  delete(id: string): Promise<void>;
}

export class HabitRepository extends BaseRepository<IHabitDTO> implements IHabitRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'habits');
  }

  async findByUser(userId: string): Promise<IHabitDTO[]> {
    const { data, error } = await this.supabase.from<IHabitDTO>('habits').select('*').eq('ownerId', userId);
    if (error) throw error;
    return data ?? [];
  }
}
