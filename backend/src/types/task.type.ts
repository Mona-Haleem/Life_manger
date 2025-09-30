// import { Priority } from "./goal.types";

// export interface ITask {
//   id: string;
//   user_id: string;
//   goal_id?: string;
//   milestone_id?: string;
//   title: string;
//   description?: string;
//   scheduled_date?: Date;
//   estimated_duration: number; // in minutes
//   actual_duration?: number;
//   status: TaskStatus;
//   priority: Priority;
//   is_recurring: boolean;
//   recurrence_pattern?: string;
//   tags: string[];
//   notes?: string;
//   created_at: Date;
//   updated_at: Date;
//   completed_at?: Date;
//   skipped_at?: Date;
//   skip_reason?: string;
// }

// export type TaskStatus = 'pending' | 'done' | 'missed' | 'cancelled';

// export interface IMicroTask {
//   id: string;
//   parent_task_id: string;
//   title: string;
//   order: number;
//   completed: boolean;
// }
// src/types/task.types.ts
import { Task } from '../models/task.model.js';

export interface CreateTaskDTO {
  ownerId: string;
  title: string;
  description?: string;
  dueDate?: string;
  goalId?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: TaskStatus;
}

export interface UpdateTaskDTO extends Partial<Task> {}
