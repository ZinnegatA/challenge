import express from 'express';
import { TasksService } from '../services/tasks.service';
import { createTaskValidation, getTaskValidation } from '../validations/tasks';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const tasksService = new TasksService();

router.post(
  '/tasks',
  authMiddleware,
  createTaskValidation,
  tasksService.createTask,
);

router.get('/tasks', tasksService.getAllTasks);
router.get('/tasks/:id', getTaskValidation, tasksService.getTask);

router.delete(
  '/tasks/:id',
  authMiddleware,
  getTaskValidation,
  tasksService.deleteTask,
);

export default router;
