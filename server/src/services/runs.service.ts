import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../orm.config';
import { Run } from '../entities/Run';

export class RunsService {
  async createRun(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;

        return res.status(400).json({ message: errorMessage });
      }

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
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;

        return res.status(400).json({ message: errorMessage });
      }

      const { runStartDate, newRunEndDate } = req.body;

      const runExists = await AppDataSource.manager.findOneBy(Run, {
        run_start_date: runStartDate,
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

  async getAllRuns(req: Request, res: Response): Promise<Response> {
    const runs = await AppDataSource.manager.find(Run);

    return res.status(200).json(runs);
  }

  async getRun(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;

        return res.status(400).json({ message: errorMessage });
      }

      const { runStartDate } = req.body;

      const runExists = await AppDataSource.manager.findOneBy(Run, {
        run_start_date: runStartDate,
      });

      if (!runExists) {
        return res.status(404).json({ message: 'Run not found' });
      }

      return res.status(200).json(runExists);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Error finding run' });
    }
  }

  async deleteRun(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;

        return res.status(400).json({ message: errorMessage });
      }

      const { runStartDate } = req.body;

      const runExists = await AppDataSource.manager.findOneBy(Run, {
        run_start_date: runStartDate,
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
