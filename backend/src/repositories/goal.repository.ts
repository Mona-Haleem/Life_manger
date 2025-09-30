// src/repositories/goal.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { IGoalDTO } from '../services/interfaces.js';

export interface IGoalRepository {
  findById(id: string): Promise<IGoalDTO | null>;
  findByUserId(userId: string): Promise<IGoalDTO[]>;
  create(goal: Partial<IGoalDTO>): Promise<IGoalDTO>;
  update(id: string, patch: Partial<IGoalDTO>): Promise<IGoalDTO>;
  delete(id: string): Promise<void>;
}

export class GoalRepository extends BaseRepository<IGoalDTO> implements IGoalRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'goals');
  }

  async findByUserId(userId: string): Promise<IGoalDTO[]> {
    const { data, error } = await this.supabase.from<IGoalDTO>('goals').select('*').eq('ownerId', userId);
    if (error) throw error;
    return data ?? [];
  }
}
