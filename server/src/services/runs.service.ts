import { Request, Response } from 'express';
import { validateRequest } from '../utils/validation.helper';
import { AppDataSource } from '../../orm.config';
import { Run } from '../entities/Run';
import { Task } from '../entities/Task';
import { CodewarsApi } from '../utils/codewars-api';
import { User } from '../entities/User';
import { Solution } from '../entities/Solution';
import { generateLeaderboardResponse } from '../utils/leaderboard.helper';

const cwApi = new CodewarsApi();
const LEADERBOARD_UPDATE_PERIOD = 60 * 60 * 1000; // 1 hour
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

  getSolutionsForTask = async (task: Task): Promise<Solution[]> => {
    return await AppDataSource.manager
      .createQueryBuilder()
      .relation(Task, 'solutions')
      .of(task)
      .loadMany();
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

  getSolution = async (
    codewarsId: string,
    userId: string,
  ): Promise<Solution | null> => {
    return await AppDataSource.manager.findOne(Solution, {
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
        codewarsId,
      },
    });
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

      const users = await AppDataSource.manager.find(User, {
        relations: ['solutions'],
        where: run.tasks.map((task) => ({
          solutions: {
            codewarsId: task.id,
          },
        })),
      });

      return res
        .status(200)
        .json({ leaderboard: generateLeaderboardResponse(run, users) });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };

  generateLeaderboard = async (run: Run): Promise<undefined> => {
    const runTasks = {};

    const lastUpdatedDate = run.leaderboardUpdatedDate;
    const now = new Date();

    const shouldUpdateLeaderboard =
      !lastUpdatedDate ||
      now.getTime() - lastUpdatedDate.getTime() > LEADERBOARD_UPDATE_PERIOD;

    console.log(now.getTime() - lastUpdatedDate.getTime());

    if (!shouldUpdateLeaderboard) {
      return;
    }

    // find tasks which belongs to run
    run.tasks = await this.getTasksForRun(run);
    run.tasks.forEach((task) => (runTasks[task.id] = task));

    // get all the users
    const users = await AppDataSource.manager.find(User);

    for (const user of users) {
      // get all users tasks from the codewars
      const userTasks = await cwApi.getCompletedChallenges(
        user.codewarsUsername,
      );

      // find users who participated in run
      const tasks = userTasks.filter((task) =>
        Object.keys(runTasks).includes(task.id),
      );

      await Promise.all(
        tasks.map(async (task) => {
          const solutionExists = await this.getSolution(
            runTasks[task.id].id,
            user.id,
          );

          if (!solutionExists) {
            return await AppDataSource.manager.save(Solution, {
              task: runTasks[task.id],
              user,
              codewarsId: task.id,
              completedAt: task.completedAt,
              fastestSolution: false,
            });
          }
        }),
      ).catch((error) => {
        console.log(error);
      });
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
        const solutions = await this.getSolutionsForTask(task);

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
