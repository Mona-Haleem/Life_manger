import { Priority } from '../types/goal.types.js.js';
import { ITask, TaskStatus, IMicroTask } from '../types/task.type.js.js';

export class Task implements ITask {
  public micro_tasks: IMicroTask[] = [];

  constructor(
    public id: string,
    public user_id: string,
    public title: string,
    public estimated_duration: number,
    public status: TaskStatus,
    public priority: Priority,
    public is_recurring: boolean,
    public tags: string[],
    public created_at: Date,
    public updated_at: Date,
    public goal_id?: string,
    public milestone_id?: string,
    public description?: string,
    public scheduled_date?: Date,
    public actual_duration?: number,
    public recurrence_pattern?: string,
    public notes?: string,
    public completed_at?: Date,
    public skipped_at?: Date,
    public skip_reason?: string
  ) {}

  static fromDatabase(data: any): Task {
    const task = new Task(
      data.id,
      data.user_id,
      data.title,
      data.estimated_duration,
      data.status,
      data.priority,
      data.is_recurring,
      data.tags || [],
      new Date(data.created_at),
      new Date(data.updated_at),
      data.goal_id,
      data.milestone_id,
      data.description,
      data.scheduled_date ? new Date(data.scheduled_date) : undefined,
      data.actual_duration,
      data.recurrence_pattern,
      data.notes,
      data.completed_at ? new Date(data.completed_at) : undefined,
      data.skipped_at ? new Date(data.skipped_at) : undefined,
      data.skip_reason
    );
    task.micro_tasks = data.micro_tasks || [];
    return task;
  }

  toDatabase(): any {
    return {
      id: this.id,
      user_id: this.user_id,
      goal_id: this.goal_id,
      milestone_id: this.milestone_id,
      title: this.title,
      description: this.description,
      scheduled_date: this.scheduled_date,
      estimated_duration: this.estimated_duration,
      actual_duration: this.actual_duration,
      status: this.status,
      priority: this.priority,
      is_recurring: this.is_recurring,
      recurrence_pattern: this.recurrence_pattern,
      tags: this.tags,
      notes: this.notes,
      micro_tasks: this.micro_tasks,
      updated_at: new Date(),
      completed_at: this.completed_at,
      skipped_at: this.skipped_at,
      skip_reason: this.skip_reason,
    };
  }

  addMicroTask(title: string, order: number): void {
    const microTask: IMicroTask = {
      id: crypto.randomUUID(),
      parent_task_id: this.id,
      title,
      order,
      completed: false,
    };
    this.micro_tasks.push(microTask);
    this.updated_at = new Date();
  }

  complete(actualDuration?: number, notes?: string): void {
    this.status = 'completed';
    this.completed_at = new Date();
    if (actualDuration) this.actual_duration = actualDuration;
    if (notes) this.notes = notes;
    this.updated_at = new Date();
  }

  skip(reason?: string, notes?: string): void {
    this.status = 'skipped';
    this.skipped_at = new Date();
    if (reason) this.skip_reason = reason;
    if (notes) this.notes = notes;
    this.updated_at = new Date();
  }

  reschedule(newDate: Date): void {
    this.scheduled_date = newDate;
    this.status = 'pending';
    this.updated_at = new Date();
  }
}
/*// src/models/task.model.ts
export type TaskStatus = 'pending' | 'done' | 'skipped';

export interface Task {
  id: string;
  ownerId: string; // references users.id
  goalId?: string | null; // references goals.id
  title: string;
  description?: string;
  dueDate?: string | null;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  estimateMinutes?: number | null;
  completedAt?: string | null;
  created_at: string;
  updated_at?: string;
}
*/