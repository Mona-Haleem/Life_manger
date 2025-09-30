import { IUser, UserPreferences } from '../types/user.type.js.js';


export class User implements IUser {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public timezone: string,
    public preferences: UserPreferences,
    public created_at: Date,
    public updated_at: Date
  ) {}

  static fromDatabase(data: any): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.timezone,
      data.preferences,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  toDatabase(): any {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      timezone: this.timezone,
      preferences: this.preferences,
      updated_at: new Date(),
    };
  }

  updatePreferences(preferences: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.updated_at = new Date();
  }
}
/*export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  timezone?: string;
  created_at: string;
  updated_at?: string;
}
*/