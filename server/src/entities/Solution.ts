import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './Task';
import { User } from './User';
import { Participation } from './Participation';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  codewarsId: string;

  @Column()
  fastestSolution: boolean;

  @Column()
  points: number;

  @Column()
  completedAt: Date;

  @ManyToOne(() => Participation, (participation) => participation.solutions)
  participation: Participation;

  @ManyToOne(() => Task, (task) => task.solutions)
  task: Task;

  @ManyToOne(() => User, (user) => user.solutions)
  user: User;
}
