// src/services/auth.service.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { IUserDTO, ID } from './interfaces';

// Interface for AuthService (abstraction)
export interface IAuthService {
  signUpWithEmail(email: string, password: string): Promise<{ user?: IUserDTO; error?: Error }>;
  signInWithEmail(email: string, password: string): Promise<{ session?: any; error?: Error }>;
  signInWithOAuth(provider: 'google' | 'github' | 'azure' | string, redirectTo?: string): Promise<void>;
  signOut(accessToken?: string): Promise<{ error?: Error }>;
  getUserById(id: ID): Promise<IUserDTO | null>;
}

// Concrete implementation using Supabase
export class AuthService implements IAuthService {
  private supabase: SupabaseClient;
  private userRepo: { findById: (id: ID) => Promise<IUserDTO | null> };

  constructor(supabase: SupabaseClient, userRepo: { findById: (id: ID) => Promise<IUserDTO | null> }) {
    this.supabase = supabase;
    this.userRepo = userRepo;
  }

  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) return { error };
    // supabase returns user in data.user
    return { user: data?.user as unknown as IUserDTO };
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { session: data?.session };
  }

  async signInWithOAuth(provider: string, redirectTo?: string) {
    // triggers redirect flow from backend (or returns url)
    // Supabase client will redirect when used in browser. On server you can return url if needed.
    await this.supabase.auth.signInWithOAuth({ provider, options: redirectTo ? { redirectTo } : undefined });
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getUserById(id: ID) {
    return this.userRepo.findById(id);
  }
}
