// src/services/scheduling.service.ts
import { ITaskDTO, ID } from './interfaces';

export interface ISchedulingService {
  scheduleTasksForUser(userId: ID, tasks: Partial<ITaskDTO>[]): Promise<ITaskDTO[]>;
  rescheduleTask(taskId: ID, newDate: string): Promise<ITaskDTO>;
  getUpcomingTasks(userId: ID, from?: string, to?: string): Promise<ITaskDTO[]>;
}

export class SchedulingService implements ISchedulingService {
  private taskRepo: { create: (t: Partial<ITaskDTO>) => Promise<ITaskDTO>; update: (id: ID, p: Partial<ITaskDTO>) => Promise<ITaskDTO>; findByUser: (u: ID) => Promise<ITaskDTO[]> };

  constructor(taskRepo: any) {
    this.taskRepo = taskRepo;
  }

  async scheduleTasksForUser(userId: ID, tasks: Partial<ITaskDTO>[]) {
    // Naive schedule algorithm: if task has dueDate use it, else set for next available day.
    const created: ITaskDTO[] = [];
    for (const t of tasks) {
      const taskPayload: Partial<ITaskDTO> = { ...t, ownerId: userId, status: t.status ?? 'pending' };
      const createdTask = await this.taskRepo.create(taskPayload);
      created.push(createdTask);
    }
    return created;
  }

  async rescheduleTask(taskId: ID, newDate: string) {
    return this.taskRepo.update(taskId, { dueDate: newDate });
  }

  async getUpcomingTasks(userId: ID, from?: string, to?: string) {
    const all = await this.taskRepo.findByUser(userId);
    if (!from && !to) return all;
    const fromTs = from ? new Date(from).getTime() : -Infinity;
    const toTs = to ? new Date(to).getTime() : Infinity;
    return all.filter(t => {
      if (!t.dueDate) return false;
      const ts = new Date(t.dueDate).getTime();
      return ts >= fromTs && ts <= toTs;
    });
  }
}
