import { Request, Response } from 'express';
import { validateRequest } from '../utils/validation.helper';
import { AppDataSource } from '../../orm.config';
import { Run } from '../entities/Run';
import { Task } from '../entities/Task';

export class RunsService {
  async createRun(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const { runStartDate, runEndDate } = req.body;

      await AppDataSource.manager.save(Run, {
        run_start_date: runStartDate,
        run_end_date: runEndDate,
      });

      return res.status(201).json({ message: 'New run successfully created' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error creating run' });
    }
  }

  async updateRun(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const runId = parseInt(req.params.id);
      const { newRunEndDate } = req.body;

      const runExists = await AppDataSource.manager.findOneBy(Run, {
        id: runId,
      });

      if (!runExists) {
        return res.status(404).json({ message: 'Run not found' });
      }

      runExists.run_end_date = newRunEndDate;

      await AppDataSource.manager.save(runExists);

      return res
        .status(200)
        .json({ message: 'Run end date successfully updated' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error updating run' });
    }
  }

  getTasksForRun = async (run: Run): Promise<Task[]> => {
    return await AppDataSource.manager
      .createQueryBuilder()
      .relation(Run, 'tasks')
      .of(run)
      .loadMany();
  };

  getAllRuns = async (req: Request, res: Response): Promise<Response> => {
    const runs = await AppDataSource.manager.find(Run);

    for (const run of runs) {
      run.tasks = await this.getTasksForRun(run);
    }

    return res.status(200).json({ runs });
  };

  getRun = async (req: Request, res: Response): Promise<Response> => {
    try {
      validateRequest(req, res);

      const runId = parseInt(req.params.id);

      const run = await AppDataSource.manager.findOneBy(Run, {
        id: runId,
      });

      if (!run) {
        return res.status(404).json({ message: 'Run not found' });
      }

      run.tasks = await this.getTasksForRun(run);

      return res.status(200).json({ run });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error finding run' });
    }
  };

  async deleteRun(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const runId = parseInt(req.params.id);

      const runExists = await AppDataSource.manager.findOneBy(Run, {
        id: runId,
      });

      if (!runExists) {
        return res.status(404).json({ message: 'Run not found' });
      }

      await AppDataSource.manager.remove(runExists);

      return res.status(204).json();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error deleting run' });
    }
  }
}
