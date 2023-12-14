import { Run } from '../entities/Run';
import { Solution } from '../entities/Solution';
import { Task } from '../entities/Task';
import { User } from '../entities/User';

type SolutionWithPoints = Solution & { points: number };
type SolvedTasks = Record<string, SolutionWithPoints | undefined>;

const FASTEST_SOLUTION_BONUS = 5;

interface Solutions {
  points: number;
  tasks: SolvedTasks;
}

interface UserWithMappedSolutions extends Omit<User, 'solutions'> {
  solutions: Solutions;
}

export interface Leaderboard {
  leaderboardUpdatedDate: Date;
  fastestSolutionBonus: number;
  users: UserWithMappedSolutions[];
}

const buildSolutionsObject = (
  tasks: Task[],
  user,
): Solutions & { points: number } => {
  const solutions = {
    points: 0,
    prevPoints: 0,
    tasks: {},
  };
  tasks.map((task) => (solutions.tasks[task.id] = null));
  user.solutions.forEach((solution) => {
    const task = tasks.find((task) => task.id === solution.codewarsId);
    if (task) {
      solutions.tasks[solution.codewarsId] = {
        ...solution,
        points: task.points,
      };
      solutions.points += task.points;
      if (solution.fastestSolution) {
        solutions.points += FASTEST_SOLUTION_BONUS;
      }
    }
  });

  return solutions;
};

export const generateLeaderboardResponse = (
  run: Run,
  users: User[],
): Leaderboard => {
  return {
    leaderboardUpdatedDate: run.leaderboardUpdatedDate,
    fastestSolutionBonus: FASTEST_SOLUTION_BONUS,
    users: users.map((user) => ({
      ...user,
      solutions: buildSolutionsObject(run.tasks, user),
    })),
  };
};
