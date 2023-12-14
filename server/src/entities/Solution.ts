import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './Task';
import { User } from './User';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  codewarsId: string;

  @Column()
  fastestSolution: boolean;

  @Column()
  completedAt: Date;

  @ManyToOne(() => Task, (task) => task.solutions)
  task: Task;

  @ManyToOne(() => User, (user) => user.solutions)
  user: User;
}
