// src/services/user.service.ts
import { IUserDTO, ID } from './interfaces';

export interface IUserRepository {
  findById(id: ID): Promise<IUserDTO | null>;
  findByEmail(email: string): Promise<IUserDTO | null>;
  create(user: Partial<IUserDTO>): Promise<IUserDTO>;
  update(id: ID, patch: Partial<IUserDTO>): Promise<IUserDTO>;
}

export interface IUserService {
  getProfile(id: ID): Promise<IUserDTO | null>;
  updateProfile(id: ID, patch: Partial<IUserDTO>): Promise<IUserDTO>;
  ensureUserExistsFromOAuth(profile: Partial<IUserDTO>): Promise<IUserDTO>;
}

export class UserService implements IUserService {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  async getProfile(id: ID) {
    return this.repo.findById(id);
  }

  async updateProfile(id: ID, patch: Partial<IUserDTO>) {
    // small validation could be done here
    return this.repo.update(id, patch);
  }

  async ensureUserExistsFromOAuth(profile: Partial<IUserDTO>) {
    if (!profile.email) throw new Error('OAuth profile must include email');
    const existing = await this.repo.findByEmail(profile.email);
    if (existing) {
      // merge updates if needed
      return this.repo.update(existing.id, { ...profile });
    }
    return this.repo.create(profile);
  }
}
