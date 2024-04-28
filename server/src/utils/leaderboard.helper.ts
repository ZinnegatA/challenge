import { Participation } from '../entities/Participation';
import { Run } from '../entities/Run';
import { Solution } from '../entities/Solution';
import { Task } from '../entities/Task';
import { User } from '../entities/User';

type SolutionWithPoints = Solution & { points: number };
type SolvedTasks = Record<string, SolutionWithPoints | undefined>;

export const FASTEST_SOLUTION_BONUS = 5;

interface Solutions {
  points: number;
  tasks: SolvedTasks;
}

interface UserWithMappedSolutions
  extends Omit<
    User,
    | 'solutions'
    | 'participations'
    | 'totalPoints'
    | 'id'
    | 'tasks'
    | 'setTotalPoints'
  > {
  solutions: Solutions;
}

export interface Leaderboard {
  leaderboardUpdatedDate: Date;
  users: UserWithMappedSolutions[];
}

const buildSolutionsObject = (
  tasks: Task[],
  solutions,
  totalPoints,
  currentRunPoints,
): Solutions & { points: number } => {
  const solutionsObject = {
    points: totalPoints,
    prevPoints: totalPoints - currentRunPoints,
    tasks: {},
  };
  tasks.map((task) => (solutionsObject.tasks[task.id] = null));
  solutions.forEach((solution) => {
    const task = tasks.find((task) => task.id === solution.codewarsId);
    if (task) {
      solutionsObject.tasks[solution.codewarsId] = {
        ...solution,
      };
    }
  });
  solutionsObject.points = totalPoints;

  return solutionsObject;
};

export const generateLeaderboardResponse = (
  participations: Participation[],
  run: Run,
): Leaderboard => {
  const users = participations.map((participation) => ({
    firstName: participation.user.firstName,
    lastName: participation.user.lastName,
    photo: participation.user.photo,
    telescopeLink: participation.user.telescopeLink,
    codewarsUsername: participation.user.codewarsUsername,
    solutions: buildSolutionsObject(
      run.tasks,
      participation.solutions,
      participation.user.totalPoints,
      participation.totalPoints,
    ),
  }));

  return {
    leaderboardUpdatedDate: run.leaderboardUpdatedDate,
    users: users.filter((user) => user.solutions.points > 0),
  };
};
