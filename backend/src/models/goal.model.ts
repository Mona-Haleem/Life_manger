import { IGoal, GoalStatus, Priority, IMilestone } from '../types/goal.types.js';

export class Goal implements IGoal {
  constructor(
    public id: string,
    public user_id: string,
    public title: string,
    public status: GoalStatus,
    public priority: Priority,
    public milestones: IMilestone[],
    public created_at: Date,
    public updated_at: Date,
    public description?: string,
    public deadline?: Date
  ) {}

  static fromDatabase(data: any): Goal {
    return new Goal(
      data.id,
      data.user_id,
      data.title,
      data.status,
      data.priority,
      data.milestones || [],
      new Date(data.created_at),
      new Date(data.updated_at),
      data.description,
      data.deadline ? new Date(data.deadline) : undefined
    );
  }

  toDatabase(): any {
    return {
      id: this.id,
      user_id: this.user_id,
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      status: this.status,
      priority: this.priority,
      milestones: this.milestones,
      updated_at: new Date(),
    };
  }

  addMilestone(milestone: Omit<IMilestone, 'id' | 'goal_id'>): void {
    const newMilestone: IMilestone = {
      id: crypto.randomUUID(),
      goal_id: this.id,
      ...milestone,
    };
    this.milestones.push(newMilestone);
    this.updated_at = new Date();
  }

  updateStatus(status: GoalStatus): void {
    this.status = status;
    this.updated_at = new Date();
  }

  calculateProgress(): number {
    if (this.milestones.length === 0) return 0;
    const completed = this.milestones.filter(m => m.status === 'completed').length;
    return (completed / this.milestones.length) * 100;
  }
}

/*// src/models/goal.model.ts
export interface Goal {
  id: string;
  ownerId: string; // references users.id
  title: string;
  description?: string;
  dueDate?: string | null;
  progress?: number; // percentage 0–100
  created_at: string;
  updated_at?: string;
}
*/