// src/services/task.service.ts
import { ITaskDTO, ID } from './interfaces';

export interface ITaskRepository {
  findById(id: ID): Promise<ITaskDTO | null>;
  findByUser(userId: ID): Promise<ITaskDTO[]>;
  findByGoal(goalId: ID): Promise<ITaskDTO[]>;
  create(task: Partial<ITaskDTO>): Promise<ITaskDTO>;
  update(id: ID, patch: Partial<ITaskDTO>): Promise<ITaskDTO>;
  delete(id: ID): Promise<void>;
  markDone(id: ID, at?: string): Promise<ITaskDTO>;
}

export interface ITaskService {
  getTask(id: ID): Promise<ITaskDTO | null>;
  listTasksForUser(userId: ID): Promise<ITaskDTO[]>;
  createTask(payload: Partial<ITaskDTO>): Promise<ITaskDTO>;
  updateTask(id: ID, patch: Partial<ITaskDTO>): Promise<ITaskDTO>;
  completeTask(id: ID): Promise<ITaskDTO>;
  deleteTask(id: ID): Promise<void>;
}

export class TaskService implements ITaskService {
  constructor(private repo: ITaskRepository) {}

  async getTask(id: ID) {
    return this.repo.findById(id);
  }

  async listTasksForUser(userId: ID) {
    return this.repo.findByUser(userId);
  }

  async createTask(payload: Partial<ITaskDTO>) {
    // compute defaults, e.g., status
    const task: Partial<ITaskDTO> = {
      status: payload.status ?? 'pending',
      ...payload,
    };
    return this.repo.create(task);
  }

  async updateTask(id: ID, patch: Partial<ITaskDTO>) {
    return this.repo.update(id, patch);
  }

  async completeTask(id: ID) {
    return this.repo.markDone(id, new Date().toISOString());
  }

  async deleteTask(id: ID) {
    return this.repo.delete(id);
  }
}
