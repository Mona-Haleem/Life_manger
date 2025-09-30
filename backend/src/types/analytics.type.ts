// export interface IHabitInsight {
//   user_id: string;
//   productive_periods: string[];
//   procrastination_patterns: ProcrastinationPattern[];
//   completion_rate: number;
//   average_task_duration: number;
//   skip_patterns: SkipPattern[];
//   weekly_summary: WeeklySummary;
// }

// export interface ProcrastinationPattern {
//   task_type: string;
//   time_of_day: string;
//   frequency: number;
//   reason?: string;
// }

// export interface SkipPattern {
//   day_of_week: string;
//   task_category: string;
//   frequency: number;
// }

// export interface WeeklySummary {
//   tasks_completed: number;
//   tasks_skipped: number;
//   goals_achieved: number;
//   total_productive_hours: number;
// }
// src/types/analytics.types.ts
export interface CompletionRateResult {
  rate: number;
  totalCompleted: number;
  totalAssigned: number;
}

export interface HabitInsight {
  habitId: string;
  streak: number;
  completionRate: number;
}
