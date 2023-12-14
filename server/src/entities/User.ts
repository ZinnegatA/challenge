import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Task } from './Task';
import { Solution } from './Solution';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: string;

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

  @OneToMany(() => Solution, (solution) => solution.user)
  @JoinTable()
  solutions: Solution[];
}
