import { Request, Response } from 'express';
import { validateRequest } from '../utils/validation.helper';
import { AppDataSource } from '../../orm.config';
import { CodewarsApi } from '../utils/codewars-api';
import { Task } from '../entities/Task';
import { Run } from '../entities/Run';

const cwApi = new CodewarsApi();

export class TasksService {
  async createTask(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const { id, runId, points } = req.body;

      const newTask = await cwApi.getCodeChallenge(id);

      if (newTask) {
        const taskExists = await AppDataSource.manager.findOneBy(Task, { id });

        if (taskExists)
          return res
            .status(400)
            .json({ message: `Task with ID ${id} already exists` });

        const run = await AppDataSource.manager.findOneBy(Run, {
          id: runId,
        });

        if (run) {
          newTask.run = run;
        } else {
          return res
            .status(404)
            .json({ message: `Run with ID ${runId} not found` });
        }

        await AppDataSource.manager.save(Task, {
          ...newTask,
          points,
        });
      }

      return res.status(201).json({
        message: `New task with id ${newTask?.id} successfully created`,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error creating task' });
    }
  }

  async getAllTasks(req: Request, res: Response): Promise<Response> {
    const tasks = await AppDataSource.manager.find(Task);

    return res.status(200).json({ tasks });
  }

  async getTask(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const taskId = req.params.id;

      const taskExists = await AppDataSource.manager.findOneBy(Task, {
        id: taskId,
      });

      if (!taskExists) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json({ task: taskExists });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error finding task' });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const taskId = req.params.id;

      const taskExists = await AppDataSource.manager.findOneBy(Task, {
        id: taskId,
      });

      if (!taskExists) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await AppDataSource.manager.remove(taskExists);

      return res.status(204).json();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error deleting task' });
    }
  }
}
