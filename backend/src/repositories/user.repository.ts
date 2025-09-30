// src/repositories/user.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { IUserDTO } from '../services/interfaces.js';

export interface IUserRepository {
  findById(id: string): Promise<IUserDTO | null>;
  findByEmail(email: string): Promise<IUserDTO | null>;
  create(user: Partial<IUserDTO>): Promise<IUserDTO>;
  update(id: string, patch: Partial<IUserDTO>): Promise<IUserDTO>;
}

export class UserRepository extends BaseRepository<IUserDTO> implements IUserRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'users');
  }

  async findByEmail(email: string): Promise<IUserDTO | null> {
    const { data, error } = await this.supabase.from<IUserDTO>('users').select('*').eq('email', email).single();
    if (error && error.code !== 'PGRST116') throw error; // "no rows found"
    return data ?? null;
  }
}
