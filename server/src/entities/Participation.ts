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
        return points + sol.points;
      }, 0);
    }
  }
}
