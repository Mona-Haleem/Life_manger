// src/services/goal.service.ts
import { IGoalDTO, ID } from './interfaces';

export interface IGoalRepository {
  findById(id: ID): Promise<IGoalDTO | null>;
  findByUserId(userId: ID): Promise<IGoalDTO[]>;
  create(goal: Partial<IGoalDTO>): Promise<IGoalDTO>;
  update(id: ID, patch: Partial<IGoalDTO>): Promise<IGoalDTO>;
  delete(id: ID): Promise<void>;
}

export interface IGoalService {
  getGoal(id: ID): Promise<IGoalDTO | null>;
  listUserGoals(userId: ID): Promise<IGoalDTO[]>;
  createGoal(payload: Partial<IGoalDTO>): Promise<IGoalDTO>;
  updateGoal(id: ID, patch: Partial<IGoalDTO>): Promise<IGoalDTO>;
  removeGoal(id: ID): Promise<void>;
}

export class GoalService implements IGoalService {
  constructor(private goalRepo: IGoalRepository) {}

  async getGoal(id: ID) {
    return this.goalRepo.findById(id);
  }

  async listUserGoals(userId: ID) {
    return this.goalRepo.findByUserId(userId);
  }

  async createGoal(payload: Partial<IGoalDTO>) {
    // single responsibility: create only; validation elsewhere (validator middleware)
    return this.goalRepo.create(payload);
  }

  async updateGoal(id: ID, patch: Partial<IGoalDTO>) {
    return this.goalRepo.update(id, patch);
  }

  async removeGoal(id: ID) {
    return this.goalRepo.delete(id);
  }
}
