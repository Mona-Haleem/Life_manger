import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
//import dotenv from 'dotenv';
import { config } from "./config/environment.js";
// // Middlewares
import { requestLogger } from "./middleware/logger.middelware.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Routes

import { ChatController } from "./controllers/chat.controller.js";
import { ChatRepository } from "./repositories/chat.repository.js";
import { AIService } from "./services/ai.service.js";
import { supabase } from "./config/supabase.js";
import { routes } from "./routes/index.js";

// // Services
// import { AuthService } from './services/auth.service.js';
// import { UserService } from './services/user.service.js';
// import { GoalService } from './services/goal.service.js';
// import { TaskService } from './services/task.service.js';
// import { SchedulingService } from './services/scheduling.servise.js';
// import { AnalyticsService } from './services/analytics.servise.js';
// import { NotificationService } from './services/notification.service.js';

// // Repositories
// import { UserRepository } from './repositories/user.repository.js';
// import { GoalRepository } from './repositories/goal.repository.js';
// import { TaskRepository } from './repositories/task.repository.js';
// import { AnalyticsRepository } from './repositories/analytics.repository.js';

// // Controllers
// import { AuthController } from './controllers/auth.controller.js';
// import { UserController } from './controllers/user.controller.js';
// import { GoalController } from './controllers/goal.controller.js';
// import { TaskController } from './controllers/task.controller.js';
// import { AnalyticsController } from './controllers/analytics.controller.js';import { supabase } from './utils/supabaseClient.js';

// // Load environment variables
console.log("Environment Variables:", config ?? "No config loaded");
//dotenv.config();

// // Instantiate repositories
// const userRepo = new UserRepository(supabase);
// const goalRepo = new GoalRepository(supabase);
// const taskRepo = new TaskRepository(supabase);
const chatRepo = new ChatRepository(supabase);
// const analyticsRepo = new AnalyticsRepository(supabase);

// // Instantiate services
// const authService = new AuthService(supabase, userRepo);
// const userService = new UserService(userRepo);
// const goalService = new GoalService(goalRepo);
// const taskService = new TaskService(taskRepo);
const aiService = new AIService(config.ai.apiKey ?? "");
// const schedulingService = new SchedulingService(taskRepo);
// const analyticsService = new AnalyticsService(analyticsRepo);
// const notificationService = new NotificationService(
//   { sendEmail: async () => {} }, // TODO: plug in real email/push provider
//   userRepo
// );

// // Instantiate controllers
// export const authController = new AuthController(authService);
// export const userController = new UserController(userService);
// export const goalController = new GoalController(goalService);
// export const taskController = new TaskController(taskService);
export const chatController = new ChatController(aiService, chatRepo);
// export const analyticsController = new AnalyticsController(analyticsService);

const app = express();
const PORT = config.port || 3000;

// // Middleware
app.use(cors());

app.use(
  express.json({
    limit: "10mb",

    type: (req) =>
      req.headers["content-type"]?.includes("application/json") ?? false,
  })
);
// //app.use(express.urlencoded({ extended: true }))
app.use(requestLogger);

// Routes
app.use("/", routes());

// app.get('/', (req: Request, res: Response) => {
//   res.send('Welcome to the Learning Platform API');
// });

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
