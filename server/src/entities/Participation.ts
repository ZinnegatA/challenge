import {
  AfterLoad,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Solution } from './Solution';
import { Run } from './Run';
import { FASTEST_SOLUTION_BONUS } from '../utils/leaderboard.helper';

@Entity()
export class Participation {
  totalPoints: number;

  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.participations)
  user: User;

  @OneToMany(() => Solution, (solution) => solution.participation)
  solutions: Solution[];

  @ManyToOne(() => Run, () => (run) => run.participations)
  run: Run;

  @AfterLoad()
  setTotalPoints(): void {
    if (this.solutions) {
      this.totalPoints = this.solutions.reduce((points, sol) => {
        if (sol.fastestSolution) {
          return points + sol.points + FASTEST_SOLUTION_BONUS;
        }
        return points + sol.points;
      }, 0);
    }
  }
}
