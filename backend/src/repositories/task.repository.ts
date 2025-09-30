// src/repositories/task.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { ITaskDTO } from '../services/interfaces.js';

export interface ITaskRepository {
  findById(id: string): Promise<ITaskDTO | null>;
  findByUser(userId: string): Promise<ITaskDTO[]>;
  findByGoal(goalId: string): Promise<ITaskDTO[]>;
  create(task: Partial<ITaskDTO>): Promise<ITaskDTO>;
  update(id: string, patch: Partial<ITaskDTO>): Promise<ITaskDTO>;
  delete(id: string): Promise<void>;
  markDone(id: string, at?: string): Promise<ITaskDTO>;
}

export class TaskRepository extends BaseRepository<ITaskDTO> implements ITaskRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'tasks');
  }

  async findByUser(userId: string): Promise<ITaskDTO[]> {
    const { data, error } = await this.supabase.from<ITaskDTO>('tasks').select('*').eq('ownerId', userId);
    if (error) throw error;
    return data ?? [];
  }

  async findByGoal(goalId: string): Promise<ITaskDTO[]> {
    const { data, error } = await this.supabase.from<ITaskDTO>('tasks').select('*').eq('goalId', goalId);
    if (error) throw error;
    return data ?? [];
  }

  async markDone(id: string, at?: string): Promise<ITaskDTO> {
    const { data, error } = await this.supabase.from<ITaskDTO>('tasks').update({ status: 'done', completedAt: at }).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  }
}
