/*export interface IUser {
  id: string;
  email: string;
  name: string;
  timezone: string;
  preferences: UserPreferences;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  workingHours: {
    start: string;
    end: string;
  };
  productivePeriods: string[];
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReport: boolean;
  weeklyReport: boolean;
  taskReminders: boolean;
  customFrequency?: string;
}
*/
// src/types/user.types.ts
import { User } from '../models/user.model.js';

export interface CreateUserDTO {
  email: string;
  name?: string;
  timezone?: string;
}

export interface UpdateUserDTO extends Partial<User> {}

