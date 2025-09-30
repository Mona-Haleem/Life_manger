// src/services/notification.service.ts
import { ID } from './interfaces';

export interface INotificationProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendPush?(userId: ID, payload: any): Promise<void>;
}

export interface INotificationService {
  notifyUserByEmail(userId: ID, subject: string, body: string): Promise<void>;
  notifyUserPush?(userId: ID, payload: any): Promise<void>;
}

export class NotificationService implements INotificationService {
  private provider: INotificationProvider;
  private userRepo: { findById: (id: ID) => Promise<{ email?: string } | null> };

  constructor(provider: INotificationProvider, userRepo: any) {
    this.provider = provider;
    this.userRepo = userRepo;
  }

  async notifyUserByEmail(userId: ID, subject: string, body: string) {
    const user = await this.userRepo.findById(userId);
    if (!user?.email) throw new Error('User has no email');
    await this.provider.sendEmail(user.email, subject, body);
  }

  async notifyUserPush(userId: ID, payload: any) {
    if (!this.provider.sendPush) return;
    return this.provider.sendPush(userId, payload);
  }
}
