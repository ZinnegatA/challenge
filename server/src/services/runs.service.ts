import { Request, Response } from 'express';
import { validateRequest } from '../utils/validation.helper';
import { AppDataSource } from '../../orm.config';
import { Run } from '../entities/Run';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import { Solution } from '../entities/Solution';
import { generateLeaderboardResponse } from '../utils/leaderboard.helper';
import { And, LessThan, MoreThan } from 'typeorm';
import ParticipationsService from './participations.service';
import { Participation } from '../entities/Participation';

const LEADERBOARD_UPDATE_PERIOD = 60 * 60 * 1000; // 1 hour
export class RunsService {
  participationsService: ParticipationsService;

  constructor() {
    this.participationsService = new ParticipationsService();
  }

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

  getSolutionsForTask = async (task: Task, run: Run): Promise<Solution[]> => {
    return await AppDataSource.manager.find(Solution, {
      relations: ['task'],
      where: {
        task: {
          id: task.id,
        },
        completedAt: And(
          MoreThan(run.run_start_date),
          LessThan(run.run_end_date),
        ),
      },
    });
  };

  getUserForSolution = async (
    solution: Solution,
  ): Promise<User | undefined> => {
    return await AppDataSource.manager
      .createQueryBuilder()
      .relation(Solution, 'user')
      .of(solution)
      .loadOne();
  };

  getAllRuns = async (
    req: Request,
    res: Response,
    futureRunsIncluded?: boolean,
  ): Promise<Response> => {
    const runs = await AppDataSource.manager.find(
      Run,
      !futureRunsIncluded
        ? {
            where: {
              run_start_date: LessThan(new Date()),
            },
          }
        : undefined,
    );

    if (!futureRunsIncluded && !runs.length) {
      const closestRun = await AppDataSource.manager.find(Run, {
        select: {
          run_start_date: true,
        },
        order: {
          run_start_date: 'ASC',
        },
      });
      return res
        .status(404)
        .json({ closestRunStartDate: closestRun[0]?.run_start_date });
    }

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

  getLeaderboard = async (req: Request, res: Response): Promise<Response> => {
    try {
      const runId = parseInt(req.params.id);

      const run = await AppDataSource.manager.findOneBy(Run, {
        id: runId,
      });

      if (!run) {
        return res.status(404).json({ message: 'Run not found' });
      }

      await this.generateLeaderboard(run);
      run.tasks = await this.getTasksForRun(run);

      const participations = await AppDataSource.manager.find(Participation, {
        relations: [
          'run',
          'solutions',
          'solutions.task',
          'user',
          'user.participations',
          'user.participations.solutions',
        ],
        where: {
          run: {
            id: run.id,
          },
        },
      });

      return res.status(200).json({
        leaderboard: generateLeaderboardResponse(participations, run),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };

  generateLeaderboard = async (run: Run): Promise<undefined> => {
    const runTasks = {};

    const lastUpdatedDate = run.leaderboardUpdatedDate;
    const now = new Date();

    const isCurrentRun = run.run_end_date.getTime() - now.getTime() > 0;
    const isNotRelevant =
      !lastUpdatedDate ||
      now.getTime() - lastUpdatedDate.getTime() > LEADERBOARD_UPDATE_PERIOD;

    const shouldUpdateLeaderboard = isNotRelevant && isCurrentRun;

    if (!shouldUpdateLeaderboard) {
      return;
    }

    // find tasks which belongs to run
    run.tasks = await this.getTasksForRun(run);
    run.tasks.forEach((task) => (runTasks[task.id] = task));

    // get all the users
    const users = await AppDataSource.manager.find(User);

    for (const user of users) {
      await this.participationsService.updateUserParticipationData(run, user);
    }

    // mark fastest solutions
    await this.markFastestSolutions(run);

    // update leaderboardUpdatedDate
    run.leaderboardUpdatedDate = new Date();
    await AppDataSource.manager.save(Run, run);
  };

  markFastestSolutions = async (run: Run): Promise<undefined> => {
    await Promise.all(
      run.tasks.map(async (task) => {
        const solutions = await this.getSolutionsForTask(task, run);

        if (!solutions.length) return;

        const fastestSolution = solutions.find(
          (solution) => solution.fastestSolution,
        );

        if (fastestSolution) return;

        solutions.sort(
          (solutionA, solutionB) =>
            solutionA.completedAt.getTime() - solutionB.completedAt.getTime(),
        );

        solutions[0].fastestSolution = true;
        await AppDataSource.manager.save(Solution, solutions[0]);
      }),
    );
  };
}
