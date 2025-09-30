// src/types/express.d.ts
import { User } from '../models/user.model.js';

declare global {
  namespace Express {
    export interface Request {
      user?: User; // injected by auth.middleware
    }
  }
}
