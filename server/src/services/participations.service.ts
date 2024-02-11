import { AppDataSource } from '../../orm.config';
import { Participation } from '../entities/Participation';
import { Run } from '../entities/Run';
import { User } from '../entities/User';
import { CodewarsApi } from '../utils/codewars-api';
import { TasksService } from './tasks.service';
import { CompletedChallenge } from '../interfaces/codewars.interfaces';
import { Task } from '../entities/Task';
import SolutionsService from './solutions.service';
import { Solution } from '../entities/Solution';

class ParticipationsService {
  cwApi: CodewarsApi;
  tasksService: TasksService;
  solutionsService: SolutionsService;

  constructor() {
    this.cwApi = new CodewarsApi();
    this.tasksService = new TasksService();
    this.solutionsService = new SolutionsService();
  }

  getOrCreateParticipation = async (
    run: Run,
    user: User,
  ): Promise<Participation> => {
    const participation = await AppDataSource.manager.findOne(Participation, {
      relations: ['user', 'run'],
      where: {
        user: {
          id: user.id,
        },
        run: {
          id: run.id,
        },
      },
    });

    if (!participation) {
      return await AppDataSource.manager.save(Participation, {
        user,
        run,
      });
    }

    return participation;
  };

  createSolutionForTask = async (
    user: User,
    task: Task,
    participation: Participation,
    cwData: CompletedChallenge,
  ): Promise<Solution> => {
    const solution = await this.solutionsService.getSolution(task.id, user);
    if (!solution) {
      return await this.solutionsService.createSolution(
        task,
        user,
        participation,
        cwData,
      );
    }
    return solution;
  };

  updateUserParticipationData = async (
    run: Run,
    user: User,
  ): Promise<Participation> => {
    const participation = await this.getOrCreateParticipation(run, user);
    const tasks = await this.tasksService.getTasksByRun(run);
    const userTasks = await this.cwApi.getCompletedChallengesByIds(
      user.codewarsUsername,
      tasks.map((task) => task.id),
    );

    await Promise.all(
      userTasks.map(async (cwData) => {
        await this.createSolutionForTask(
          user,
          tasks.find((task) => task.id === cwData.id) as Task,
          participation,
          cwData,
        );
      }),
    );
    return participation;
  };
}

export default ParticipationsService;
