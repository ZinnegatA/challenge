import { AppDataSource } from '../../orm.config';
import { Participation } from '../entities/Participation';
import { Solution } from '../entities/Solution';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import { CompletedChallenge } from '../interfaces/codewars.interfaces';

class SolutionsService {
  getSolution = async (
    codewarsId: string,
    user: User,
  ): Promise<Solution | null> => {
    return await AppDataSource.manager.findOne(Solution, {
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
        codewarsId,
      },
    });
  };

  createSolution = async (
    task: Task,
    user: User,
    participation: Participation,
    cwData: CompletedChallenge,
  ): Promise<Solution> => {
    return await AppDataSource.manager.save(Solution, {
      codewarsId: task.id,
      task,
      user,
      participation,
      completedAt: cwData.completedAt,
      fastestSolution: false,
      points: task.points,
    });
  };
}

export default SolutionsService;
