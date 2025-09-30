// src/repositories/base.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository<T> {
  protected supabase: SupabaseClient;
  protected table: string;

  constructor(supabase: SupabaseClient, table: string) {
    this.supabase = supabase;
    this.table = table;
  }

  // async findById(id: string): Promise<T | null> {
  //   const { data, error } = await this.supabase.from<T>(this.table).select('*').eq('id', id).single();
  //   if (error) throw error;
  //   return data ?? null;
  // }

  // async create(payload: Partial<T>): Promise<T> {
  //   const { data, error } = await this.supabase.from<T>(this.table).insert(payload).select().single();
  //   if (error) throw error;
  //   return data!;
  // }

  // async update(id: string, patch: Partial<T>): Promise<T> {
  //   const { data, error } = await this.supabase.from<T>(this.table).update(patch).eq('id', id).select().single();
  //   if (error) throw error;
  //   return data!;
  // }

  // async delete(id: string): Promise<void> {
  //   const { error } = await this.supabase.from(this.table).delete().eq('id', id);
  //   if (error) throw error;
  // }
}
