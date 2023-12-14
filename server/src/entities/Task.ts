import {
  Entity,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Run } from './Run';
import { Solution } from './Solution';

@Entity()
export class Task {
  @PrimaryColumn({ generated: false })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  completedAt: string;

  @Column('text', { nullable: true, array: true })
  completedLanguages: string[];

  @Column({ nullable: true })
  points: number;

  @Column({ nullable: true })
  fastestSolution: boolean;

  @ManyToOne(() => Run, (run) => run.tasks)
  run: Run;

  @ManyToMany(() => User, (user) => user.tasks)
  users: User[];

  @OneToMany(() => Solution, (solution) => solution.task)
  solutions: Solution[];
}
