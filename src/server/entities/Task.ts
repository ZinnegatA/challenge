import { Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm';
import { User } from './User';
import { Run } from './Run';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Run, (run) => run.tasks)
  run: Run;

  @ManyToMany(() => User, (user) => user.tasks)
  users: User[];
}
