// src/repositories/analytics.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { IAnalyticsRepository } from '../services/analytics.service.js';

export class AnalyticsRepository implements IAnalyticsRepository {
  private supabase: SupabaseClient;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getTaskCompletionHistory(userId: string, since?: string) {
    let query = this.supabase.from('tasks').select('dueDate,status');
    if (since) {
      query = query.gte('dueDate', since);
    }
    const { data, error } = await query.eq('ownerId', userId);
    if (error) throw error;

    // Aggregate manually (could also use Postgres views)
    const history: Record<string, { completed: number; assigned: number }> = {};
    data?.forEach((task: any) => {
      const date = task.dueDate?.split('T')[0];
      if (!date) return;
      if (!history[date]) history[date] = { completed: 0, assigned: 0 };
      history[date].assigned++;
      if (task.status === 'done') history[date].completed++;
    });
    return Object.entries(history).map(([date, stats]) => ({ date, ...stats }));
  }

  async getHabitsSummary(userId: string, since?: string) {
    let query = this.supabase.from('habit_logs').select('habitId,completedAt');
    if (since) query = query.gte('completedAt', since);
    const { data, error } = await query.eq('userId', userId);
    if (error) throw error;
    return data ?? [];
  }
}
