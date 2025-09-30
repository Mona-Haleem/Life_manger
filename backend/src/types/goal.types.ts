// export interface IGoal {
//   id: string;
//   user_id: string;
//   title: string;
//   description?: string;
//   deadline?: Date;
//   status: GoalStatus;
//   priority: Priority;
//   milestones: IMilestone[];
//   created_at: Date;
//   updated_at: Date;
// }

// export interface IMilestone {
//   id: string;
//   goal_id: string;
//   title: string;
//   deadline?: Date;
//   status: 'pending' | 'in_progress' | 'completed';
//   order: number;
// }

// export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';
// export type Priority = 'low' | 'medium' | 'high' | 'urgent';
// src/types/goal.types.ts
import { Goal } from '../models/goal.model.js';

export interface CreateGoalDTO {
  ownerId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateGoalDTO extends Partial<Goal> {}
