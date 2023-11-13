import { Entity, PrimaryColumn, ManyToMany, ManyToOne, Column } from 'typeorm';
import { User } from './User';
import { Run } from './Run';

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
}
