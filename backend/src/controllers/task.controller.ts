// src/controllers/task.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { success } from '../utils/response.js';

export class TaskController {
  constructor(private taskService: TaskService) {}

  getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.getTask(req.params.id);
      return res.json(success(task));
    } catch (err) {
      next(err);
    }
  };

  listUserTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.listTasksForUser(req.params.userId);
      return res.json(success(tasks));
    } catch (err) {
      next(err);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTask = await this.taskService.createTask(req.body);
      return res.status(201).json(success(newTask));
    } catch (err) {
      next(err);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.taskService.updateTask(req.params.id, req.body);
      return res.json(success(updated));
    } catch (err) {
      next(err);
    }
  };

  completeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const completed = await this.taskService.completeTask(req.params.id);
      return res.json(success(completed));
    } catch (err) {
      next(err);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.taskService.deleteTask(req.params.id);
      return res.json(success('Task deleted'));
    } catch (err) {
      next(err);
    }
  };
}
