// src/services/analytics.service.ts
import { ID } from './interfaces';

export interface IAnalyticsRepository {
  getTaskCompletionHistory(userId: ID, since?: string): Promise<Array<{ date: string; completed: number }>>;
  getHabitsSummary(userId: ID, since?: string): Promise<any>;
}

export interface IAnalyticsService {
  completionRate(userId: ID, since?: string): Promise<{ rate: number; totalCompleted: number; totalAssigned: number }>;
  habitInsights(userId: ID, since?: string): Promise<any>;
}

export class AnalyticsService implements IAnalyticsService {
  private repo: IAnalyticsRepository;

  constructor(repo: IAnalyticsRepository) {
    this.repo = repo;
  }

  async completionRate(userId: ID, since?: string) {
    const history = await this.repo.getTaskCompletionHistory(userId, since);
    const totals = history.reduce((acc, h) => {
      acc.totalAssigned += (h as any).assigned ?? 0;
      acc.totalCompleted += (h as any).completed ?? 0;
      return acc;
    }, { totalAssigned: 0, totalCompleted: 0 });
    const rate = totals.totalAssigned === 0 ? 0 : totals.totalCompleted / totals.totalAssigned;
    return { rate, totalCompleted: totals.totalCompleted, totalAssigned: totals.totalAssigned };
  }

  async habitInsights(userId: ID, since?: string) {
    return this.repo.getHabitsSummary(userId, since);
  }
}
