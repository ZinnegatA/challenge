import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Task } from './Task';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  photo: string;

  @Column()
  epam_name: string;

  @ManyToMany(() => Task, (task) => task.users)
  @JoinTable()
  tasks: Task[];
}
