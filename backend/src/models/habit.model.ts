// src/models/habit.model.ts
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  ownerId: string; // references users.id
  title: string;
  frequency: HabitFrequency;
  created_at: string;
  updated_at?: string;
}
// src/models/habitLog.model.ts
export interface HabitLog {
  id: string;
  userId: string; // references users.id
  habitId: string; // references habits.id
  completedAt: string; // timestamp when completed
}
