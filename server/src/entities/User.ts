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

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  photo: string;

  @Column({
    name: 'telescope_link',
  })
  telescopeLink: string;

  @Column({
    name: 'codewars_username',
  })
  codewarsUsername: string;

  @ManyToMany(() => Task, (task) => task.users)
  @JoinTable()
  tasks: Task[];
}
